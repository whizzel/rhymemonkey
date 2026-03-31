'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameDashboard } from '@/components/GameDashboard';
import { GameMenu } from '@/components/GameMenu';
import { GameOver } from '@/components/GameOver';
import { Leaderboard } from '@/components/Leaderboard';
import { Room as RoomView } from '@/components/Room';
import type { Player, Room } from '@/lib/types';

type GameView = 'menu' | 'room' | 'playing' | 'gameOver' | 'leaderboard';
type GameMode = 'solo' | 'private' | null;

export default function Home() {
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [playerName, setPlayerName] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedTime, setSelectedTime] = useState(60);
  const [error, setError] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>(null);

  const { gameState, showError, showSuccess, isNextLoading, startGame, pauseGame, handleInputChange, handleSubmitWord, handleSkip, handleHint, resetGame } = useGameState();

  const handleStartGame = async (mode: 'solo' | 'private') => {
    setError('');

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      // 1. Get or create player
      const pResp = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName.trim() })
      });

      if (!pResp.ok) {
        const data = await pResp.json();
        setError(data.error || 'Failed to create player');
        return;
      }

      const { player: createdPlayer } = await pResp.json();
      setPlayer(createdPlayer);
      setGameMode(mode);

      // 2. Handle Room
      if (mode === 'private') {
        const rResp = await fetch('/api/rooms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action: 'create', 
            hostId: createdPlayer.id,
            difficulty: selectedDifficulty,
            timeLimit: selectedTime
          })
        });

        if (rResp.ok) {
          const { room } = await rResp.json();
          setActiveRoom(room);
          setCurrentView('room');
        } else {
          setError('Failed to create room');
        }
      } else {
        setActiveRoom(null);
        setCurrentView('room');
      }
    } catch {
      setError('Network error. Please try again.');
    }
  };

  const handleJoinRoom = async (code: string) => {
    setError('');
    if (!playerName.trim()) {
      setError('Please enter your name first');
      return;
    }

    try {
      // 1. Get or create player
      const pResp = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName.trim() })
      });

      if (!pResp.ok) {
        const data = await pResp.json();
        setError(data.error || 'Failed to identify player');
        return;
      }

      const { player: createdPlayer } = await pResp.json();
      setPlayer(createdPlayer);

      // 2. Join Room
      const rResp = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', code, playerId: createdPlayer.id })
      });

      if (rResp.ok) {
        const { room } = await rResp.json();
        setActiveRoom(room);
        setGameMode('private');
        setSelectedDifficulty(room.difficulty);
        setSelectedTime(room.timeLimit);
        setCurrentView('room');
      } else {
        const data = await rResp.json();
        setError(data.error || 'Room not found');
      }
    } catch {
      setError('Network error');
    }
  };

  const handleGameEnd = useCallback(() => {
    setCurrentView('gameOver');
  }, []);

  const handlePlayAgain = () => {
    if (player) {
      startGame(player, selectedDifficulty, selectedTime, 'solo');
      setCurrentView('playing');
    }
  };

  const handleBackToMenu = () => {
    resetGame();
    setCurrentView('menu');
  };

  const handleShowLeaderboard = () => {
    setCurrentView('leaderboard');
  };

  // Listen for game end
  useEffect(() => {
    if (!gameState.isPlaying && currentView === 'playing' && gameState.timeRemaining === 0) {
      setTimeout(handleGameEnd, 100);
    }
  }, [gameState.isPlaying, gameState.timeRemaining, currentView, handleGameEnd]);

  // Render different views based on current state
  if (currentView === 'room') {
    if (!player || !gameMode) {
      return (
        <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-linear-to-br from-red-900 via-red-800 to-orange-900 p-4">
          <div className="text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Loading...</h2>
            <p>Please wait while we set up your game.</p>
          </div>
        </div>
      );
    }

    return (
      <RoomView
        player={player}
        room={activeRoom}
        gameMode={gameMode}
        difficulty={selectedDifficulty}
        timeLimit={selectedTime}
        onStartGame={() => {
          if (player && gameMode) {
            startGame(player, selectedDifficulty, selectedTime, gameMode);
          }
        }}
        onGameStart={() => setCurrentView('playing')}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  if (currentView === 'playing') {
    return (
      <GameDashboard
        gameState={gameState}
        showError={showError}
        showSuccess={showSuccess}
        isNextLoading={isNextLoading}
        player={player}
        onInput={handleInputChange}
        onSubmit={handleSubmitWord}
        onSkip={handleSkip}
        onHint={handleHint}
        onPause={pauseGame}
        onBackToMenu={handleBackToMenu}
        onShowLeaderboard={handleShowLeaderboard}
      />
    );
  }

  if (currentView === 'gameOver') {
    return (
      <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-linear-to-br from-red-900 via-red-800 to-orange-900 p-4">
        <div className="w-full max-w-2xl">
          <GameOver
            gameState={gameState}
            player={player}
            onPlayAgain={handlePlayAgain}
            onBackToMenu={handleBackToMenu}
            onShowLeaderboard={handleShowLeaderboard}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'leaderboard') {
    return (
      <>
        <style>{`
          .ld-bg {
            min-height:100vh;
            background:
              radial-gradient(ellipse at 10% 15%,rgba(204,26,26,0.1) 0%,transparent 45%),
              radial-gradient(ellipse at 90% 85%,rgba(26,85,204,0.13) 0%,transparent 45%),
              linear-gradient(160deg,#050d1a 0%,#080f1e 100%);
            position:relative;overflow:hidden;
            display:flex;align-items:flex-start;justify-content:center;
            padding:20px 16px 24px;font-family:'Exo 2',sans-serif;user-select:none;
          }
          .ld-particles { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
          .ld-part { position:absolute;bottom:-4px;border-radius:50%;animation:ldPartFloat linear infinite; }
          @keyframes ldPartFloat{0%{transform:translateY(0);opacity:0}10%{opacity:.7}90%{opacity:.5}100%{transform:translateY(-105vh);opacity:0}}
          
          .ld-hud {
            position:fixed;top:0;left:0;right:0;height:32px;z-index:100;
            background:linear-gradient(90deg,rgba(204,26,26,0.9),rgba(5,13,26,0.95) 40%,rgba(5,13,26,0.95) 60%,rgba(26,85,204,0.9));
            border-bottom:1px solid #1a3a6a;
            display:flex;align-items:center;justify-content:center;gap:8px;
            font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:.15em;color:#6a9ac0;
          }
          .ld-hud-dot { width:6px;height:6px;border-radius:50%; background:#00ff88; box-shadow:0 0 6px #00ff88; }
          .ld-inner { position:relative;z-index:1;width:100%;max-width:800px;padding-top:60px; }

          .ld-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
          .ld-title { font-family:'Orbitron',monospace; font-size:24px; font-weight:900; color:#c8e0ff; letter-spacing:.1em; text-shadow:0 0 15px rgba(200,224,255,0.3); }
          
          .btn-back {
            font-family:'Orbitron',monospace; font-size:12px; font-weight:700; letter-spacing:.08em;
            background:linear-gradient(180deg,#1a3a5a,#0d1f35); color:#6a9ac0; padding:10px 20px;
            border:1px solid #1a3a6a; border-radius:8px; cursor:pointer; overflow:hidden; position:relative;
            transition:all .2s; outline:none; clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
          }
          .btn-back:hover { border-color:#00d4ff; color:#00d4ff; transform:translateY(-2px); box-shadow:0 5px 15px rgba(0,212,255,0.2); }
        `}</style>

        <div className="ld-hud">
          <div className="ld-hud-dot" />
          RANKINGS — LIVE FEED
          <div className="ld-hud-dot" />
        </div>

        <div className="ld-particles">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={`part-${i}`} className="ld-part" style={{ left: `${(i * 7 + 3) % 100}%`, width: 2, height: 2, background: i % 2 ? '#cc1a1a' : '#1a55cc', animationDuration: `${6 + (i % 4)}s`, animationDelay: `${i * 0.4}s`, boxShadow: `0 0 6px ${i % 2 ? '#cc1a1a' : '#1a55cc'}` }} />
          ))}
        </div>

        <div className="ld-bg">
          <div className="ld-inner">
            <div className="ld-header">
              <h2 className="ld-title">LEADERBOARD</h2>
              <button type="button" onClick={handleBackToMenu} className="btn-back">
                ✕ BACK TO MENU
              </button>
            </div>
            <Leaderboard />
          </div>
        </div>
      </>
    );
  }

  // Default: Menu view
  return (
    <GameMenu
      playerName={playerName}
      selectedDifficulty={selectedDifficulty}
      selectedTime={selectedTime}
      error={error}
      onPlayerNameChange={(name) => {
        setPlayerName(name);
        setError('');
      }}
      onDifficultyChange={setSelectedDifficulty}
      onTimeChange={setSelectedTime}
      onStartGame={handleStartGame}
      onJoinRoom={handleJoinRoom}
    />
  );
}
