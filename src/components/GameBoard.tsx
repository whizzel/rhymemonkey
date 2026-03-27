'use client';

import { useEffect, useRef } from 'react';
import type { GameState } from '@/lib/types';

interface GameBoardProps {
  gameState: GameState;
  showError: boolean;
  onInput: (value: string) => void;
  onSkip: () => void;
  onPause: () => void;
}

export function GameBoard({ gameState, showError, onInput, onSkip, onPause }: GameBoardProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState.isPlaying, gameState.isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (gameState.timeRemaining <= 10) return 'text-red-500';
    if (gameState.timeRemaining <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="mario-panel flex flex-col gap-6 p-6">
      {/* Game Header */}
      <div className="flex justify-between items-center">
        <div className="flex gap-6">
          <div className="text-white">
            <span className="text-[10px] uppercase tracking-widest text-white/70">Score</span>
            <div className="text-2xl font-bold">{gameState.score}</div>
          </div>
          <div className="text-white">
            <span className="text-[10px] uppercase tracking-widest text-white/70">Words</span>
            <div className="text-2xl font-bold">{gameState.wordsCompleted}</div>
          </div>
          <div className="text-white">
            <span className="text-[10px] uppercase tracking-widest text-white/70">Accuracy</span>
            <div className="text-2xl font-bold">{gameState.accuracy}%</div>
          </div>
        </div>
        
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-widest text-white/70 block">Time</span>
          <div className={`text-3xl font-bold ${getTimeColor()}`}>
            {formatTime(gameState.timeRemaining)}
          </div>
        </div>
      </div>

      {/* Current Word Display */}
      <div className="text-center py-8">
        <div className="text-[10px] uppercase tracking-widest text-white/70 mb-4">
          Type a rhyme for this word:
        </div>
        <div className="text-4xl font-bold text-white mb-8" style={{ textShadow: '3px 3px 0 #000' }}>
          {gameState.currentWord.toUpperCase()}
        </div>
        
        {/* User Input Display */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={gameState.userInput}
            onChange={(e) => onInput(e.target.value)}
            className={`w-full text-2xl text-center bg-transparent border-2 rounded-lg px-4 py-3 text-white placeholder-white/50 outline-none transition-colors ${
              showError ? 'border-red-500 animate-pulse' : 'border-white/30 focus:border-mario-gold'
            }`}
            placeholder="Type a rhyme..."
            disabled={!gameState.isPlaying || gameState.isPaused}
          />
          {gameState.userInput && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className={`text-2xl font-bold ${
                showError ? 'text-red-400' : 'text-white'
              }`}>
                {gameState.userInput}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Effect Overlay */}
      {showError && (
        <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-lg pointer-events-none" />
      )}

      {/* Game Controls */}
      <div className="flex justify-center gap-4">
        <button
          type="button"
          onClick={onSkip}
          className="mario-btn mario-btn-dark text-sm px-6 py-2"
          disabled={!gameState.isPlaying}
        >
          SKIP
        </button>
        <button
          type="button"
          onClick={onPause}
          className="mario-btn mario-btn-gold text-sm px-6 py-2"
          disabled={!gameState.isPlaying}
        >
          {gameState.isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>

      {/* Pause Overlay */}
      {gameState.isPaused && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-mario-gold mb-4" style={{ textShadow: '3px 3px 0 #000' }}>
              PAUSED
            </div>
            <button
              type="button"
              onClick={onPause}
              className="mario-btn mario-btn-green text-lg px-8 py-3"
            >
              RESUME GAME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
