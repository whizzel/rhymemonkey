'use client';

import { useState, useEffect } from 'react';

interface GameActionsProps {
  onStartGame: (gameMode: 'solo' | 'private') => void;
}

export function GameActions({ onStartGame }: GameActionsProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pendingGameMode, setPendingGameMode] = useState<'solo' | 'private' | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && pendingGameMode) {
      onStartGame(pendingGameMode);
      setCountdown(null);
      setPendingGameMode(null);
    }
  }, [countdown, pendingGameMode, onStartGame]);

  const handleStartGame = (gameMode: 'solo' | 'private') => {
    setPendingGameMode(gameMode);
    setCountdown(3);
  };

  if (countdown !== null) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-6xl font-bold text-white animate-pulse">
          {countdown}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <button 
        type="button"
        className="mario-btn mario-btn-green text-sm" 
        onClick={() => handleStartGame('solo')}
      >
        PLAY SOLO
      </button>
      <button 
        type="button"
        className="mario-btn mario-btn-gold text-sm" 
        onClick={() => handleStartGame('private')}
      >
        PRIVATE GAME
      </button>
    </div>
  );
}
