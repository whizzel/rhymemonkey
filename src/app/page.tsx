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
      <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-linear-to-br from-red-900 via-red-800 to-orange-900 p-4">
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-mario-gold" style={{ textShadow: '3px 3px 0 #000' }}>
              LEADERBOARD
            </h2>
            <button
              type="button"
              onClick={handleBackToMenu}
              className="mario-btn text-sm px-6 py-2"
            >
              BACK TO MENU
            </button>
          </div>
          <Leaderboard />
        </div>
      </div>
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
