'use client';

import { GamePresets } from './GamePresets';
import { PlayerRegistration } from './PlayerRegistration';
import { GameActions } from './GameActions';

interface GameMenuProps {
  playerName: string;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  selectedTime: number;
  error: string;
  onPlayerNameChange: (name: string) => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onTimeChange: (time: number) => void;
  onStartGame: (gameMode: 'solo' | 'private') => void;
}

export function GameMenu({
  playerName,
  selectedDifficulty,
  selectedTime,
  error,
  onPlayerNameChange,
  onDifficultyChange,
  onTimeChange,
  onStartGame
}: GameMenuProps) {
  return (
    <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
      <div className="mario-panel z-10 flex w-[min(94vw,760px)] flex-col gap-7 p-6 md:p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl" style={{textShadow: '4px 4px 0 #000'}}>
            DONKEYTYPE
          </h1>
          <p className="text-[10px] tracking-widest text-mario-gold" style={{textShadow: '2px 2px 0 #000'}}>
            RHYME BEFORE THE TIME RUNS OUT
          </p>
        </div>
        
        <PlayerRegistration 
          playerName={playerName}
          onPlayerNameChange={onPlayerNameChange}
          error={error}
        />
        
        <GamePresets 
          selectedDifficulty={selectedDifficulty}
          selectedTime={selectedTime}
          onDifficultyChange={onDifficultyChange}
          onTimeChange={onTimeChange}
        />
        
        <GameActions onStartGame={onStartGame} />
        
      </div>
    </div>
  );
}
