'use client';

import { useState, useEffect } from 'react';
import { MarioButton } from '@/components/ui/mario-button';
import type { Player } from '@/lib/types';

interface RoomProps {
  player: Player;
  gameMode: 'solo' | 'private';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  onStartGame: () => void;
  onBackToMenu: () => void;
  onGameStart?: () => void; // Callback to change view to playing
}

export function Room({ 
  player, 
  gameMode, 
  difficulty, 
  timeLimit, 
  onStartGame, 
  onBackToMenu,
  onGameStart
}: RoomProps) {
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState<Player[]>([player]);
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Generate room code for private games
  useEffect(() => {
    if (gameMode === 'private') {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomCode(code);
    }
  }, [gameMode]);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      onStartGame();
      onGameStart?.(); // Change view to playing
      setCountdown(null);
    }
  }, [countdown, onStartGame, onGameStart]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    setCountdown(3);
  };

  // Show countdown instead of room interface
  if (countdown !== null) {
    return (
      <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-6xl font-bold text-white animate-pulse">
            {countdown}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
      <div className="z-10 flex w-[min(95vw,1180px)] flex-col gap-6 items-center">
        
        {/* Stats Bar */}
        <div className="grid w-full gap-3 max-w-[760px] grid-cols-2 sm:grid-cols-4">
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Time</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              {timeLimit}
            </span>
          </div>
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Attempted</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              0
            </span>
          </div>
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Correct</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              0
            </span>
          </div>
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Skipped</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              0
            </span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid w-full gap-5 max-w-[760px] grid-cols-1">
          <section className="mario-panel flex w-full flex-col items-center gap-8 p-6 md:p-8">
            
            {/* Room Code and Players */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="text-center">
                <span className="text-mario-gold text-[10px] uppercase tracking-widest">
                  {gameMode === 'solo' ? 'SOLO ROOM' : 'ROOM CODE'}
                </span>
                {gameMode === 'private' && (
                  <div className="text-2xl font-bold text-white" style={{textShadow: '2px 2px 0 #000'}}>
                    {roomCode}
                  </div>
                )}
              </div>
              
              {/* Players List */}
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {players.map((p) => (
                  <div key={`player-${p.id}`} className="mario-panel px-3 py-2 flex items-center gap-2">
                    <span className="text-white text-sm" style={{textShadow: '1px 1px 0 #000'}}>
                      {p.name}
                    </span>
                    <span className="text-[8px] text-mario-green">
                      ✓
                    </span>
                    {p.id === player.id && (
                      <span className="text-mario-gold text-[10px] ml-1">
                        YOU
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Preview */}
            <div className="flex h-11 w-11 items-center justify-center border-3 border-yellow-700 bg-mario-gold text-xl font-bold text-mario-brown shadow-[3px_3px_0_#000]">
              ?
            </div>
       
            
            {/* Ready Status */}
            <div className="text-center">
              <p className="text-mario-gold text-sm mb-4">
                {gameMode === 'solo' ? 'Click START GAME to begin!' : 'Waiting for players to join...'}
              </p>
              
              {/* Room Code Copy for Private Games */}
              {gameMode === 'private' && (
                <div className="mb-4">
                  <button 
                    type="button"
                    className="mario-btn mario-btn-dark text-[10px] mb-2"
                    onClick={handleCopyCode}
                  >
                    {copied ? 'COPIED!' : 'COPY ROOM CODE'}
                  </button>
                  <p className="text-[9px] text-white/70">
                    Share this code with friends to join
                  </p>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button 
                type="button"
                className="mario-btn mario-btn-dark text-[10px]"
                onClick={onBackToMenu}
              >
                EXIT GAME
              </button>
              <button 
                type="button"
                className="mario-btn mario-btn-green text-[10px]"
                onClick={handleStartGame}
              >
                START GAME
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
