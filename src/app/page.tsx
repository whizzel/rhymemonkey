'use client';

import { useState, useEffect, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameDashboard } from '@/components/GameDashboard';
import { GameMenu } from '@/components/GameMenu';
import { GameOver } from '@/components/GameOver';
import { Leaderboard } from '@/components/Leaderboard';
import { Room } from '@/components/Room';
import type { Player } from '@/lib/types';

type GameView = 'menu' | 'room' | 'playing' | 'gameOver' | 'leaderboard';
type GameMode = 'solo' | 'private' | null;

export default function Home() {
  const [currentView, setCurrentView] = useState<GameView>('menu');
  const [playerName, setPlayerName] = useState('');
  const [player, setPlayer] = useState<Player | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedTime, setSelectedTime] = useState(60);
  const [error, setError] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>(null);

  const { gameState, currentRhymeGroup, showError, showSuccess, gameHistory, startGame, pauseGame, handleInputChange, handleSubmitWord, handleSkip, resetGame } = useGameState();

  const handleStartGame = async (mode: 'solo' | 'private') => {
    setError('');

    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const response = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName.trim() })
      });

      if (response.ok) {
        const { player: createdPlayer } = await response.json();
        setPlayer(createdPlayer);
        setGameMode(mode);
        setCurrentView('room');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create player');
      }
    } catch {
      setError('Network error. Please try again.');
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
    setShowLeaderboard(false);
  };

  const handleShowLeaderboard = () => {
    setShowLeaderboard(true);
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
    return (
      <Room
        player={player!}
        gameMode={gameMode!}
        difficulty={selectedDifficulty}
        timeLimit={selectedTime}
        onStartGame={() => {
          startGame(player!, selectedDifficulty, selectedTime, gameMode!);
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
        currentRhymeGroup={currentRhymeGroup}
        showError={showError}
        showSuccess={showSuccess}
        player={player}
        onInput={handleInputChange}
        onSubmit={handleSubmitWord}
        onSkip={handleSkip}
        onPause={pauseGame}
        onBackToMenu={handleBackToMenu}
        onShowLeaderboard={handleShowLeaderboard}
      />
    );
  }

  if (currentView === 'gameOver') {
    return (
      <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-4">
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
      <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-4">
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
    />
  );
}
