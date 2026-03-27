'use client';

import { useState } from 'react';

interface RoomDashboardProps {
  roomCode: string;
  players: Array<{
    name: string;
    score?: number;
  }>;
  currentWord: string;
  timeLeft: number;
  attempted: number;
  correct: number;
  skipped: number;
  isGameActive: boolean;
  onStartGame?: () => void;
  onSkip?: () => void;
  onExit?: () => void;
  onSubmitRhyme?: (rhyme: string) => void;
}

export function RoomDashboard({
  roomCode,
  players,
  currentWord,
  timeLeft,
  attempted,
  correct,
  skipped,
  isGameActive,
  onStartGame,
  onSkip,
  onExit,
  onSubmitRhyme
}: RoomDashboardProps) {
  const [rhymeInput, setRhymeInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rhymeInput.trim()) {
      onSubmitRhyme?.(rhymeInput.trim());
      setRhymeInput('');
    } else {
      onSkip?.();
    }
  };

  return (
    <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
      <div className="z-10 flex w-[min(95vw,1180px)] flex-col gap-6 items-center">
        
        {/* Stats Bar */}
        <div className="grid w-full gap-3 max-w-[760px] grid-cols-2 sm:grid-cols-4">
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Time</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              {timeLeft}
            </span>
          </div>
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Attempted</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              {attempted}
            </span>
          </div>
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Correct</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              {correct}
            </span>
          </div>
          <div className="mario-panel flex w-full min-w-0 flex-col items-center gap-1 px-3 py-2">
            <span className="uppercase tracking-widest text-mario-gold text-[8px]">Skipped</span>
            <span className="text-lg text-white" style={{textShadow: '2px 2px 0 #000'}}>
              {skipped}
            </span>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="grid w-full gap-5 max-w-[760px] grid-cols-1">
          <section className="mario-panel flex w-full flex-col items-center gap-8 p-6 md:p-8">
            
            {/* Room Code and Players */}
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="text-center">
                <span className="text-mario-gold text-[10px] uppercase tracking-widest">Room Code</span>
                <div className="text-2xl font-bold text-white" style={{textShadow: '2px 2px 0 #000'}}>
                  {roomCode}
                </div>
              </div>
              
              {/* Players List */}
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {players.map((player) => (
                  <div key={`player-${player.name}`} className="mario-panel px-3 py-2 flex items-center gap-2">
                    <span className="text-white text-sm" style={{textShadow: '1px 1px 0 #000'}}>
                      {player.name}
                    </span>
                    <span className="text-[8px] text-mario-green">
                      ✓
                    </span>
                    {player.score !== undefined && (
                      <span className="text-mario-gold text-[10px] ml-1">
                        {player.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Game Content */}
            {isGameActive ? (
              <>
                {/* Current Word */}
                <div className="flex h-11 w-11 items-center justify-center border-3 border-yellow-700 bg-mario-gold text-xl font-bold text-mario-brown shadow-[3px_3px_0_#000]">
                  ?
                </div>
                <p className="text-center text-4xl font-bold transition-colors duration-150 md:text-5xl text-white" 
                   style={{textShadow: '3px 3px 0 #000'}}>
                  {currentWord}
                </p>
                
                {/* Input Field */}
                <form onSubmit={handleSubmit} className="w-full max-w-xl">
                  <div className="mario-panel w-full px-4 py-3">
                    <input
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck="false"
                      className="w-full text-center text-xl text-white md:text-2xl bg-transparent outline-none placeholder-white/50"
                      placeholder="Type a rhyme and press Enter"
                      value={rhymeInput}
                      onChange={(e) => setRhymeInput(e.target.value)}
                    />
                  </div>
                </form>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button 
                    type="button"
                    className="mario-btn mario-btn-dark text-[10px]"
                    onClick={onSkip}
                  >
                    SKIP [ENTER EMPTY]
                  </button>
                  <button 
                    type="button"
                    className="ml-3 text-[9px] uppercase tracking-widest text-mario-red underline decoration-mario-red/60 underline-offset-2 transition hover:text-red-300"
                    onClick={onExit}
                  >
                    EXIT GAME
                  </button>
                </div>
              </>
            ) : (
              /* Waiting Room */
              <div className="flex flex-col items-center gap-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2" style={{textShadow: '2px 2px 0 #000'}}>
                    Waiting Room
                  </h2>
                  <p className="text-mario-gold text-sm">
                    Waiting for players to join...
                  </p>
                </div>
                
                {players.length >= 1 && (
                  <button 
                    type="button"
                    className="mario-btn mario-btn-green"
                    onClick={onStartGame}
                  >
                    START GAME
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
