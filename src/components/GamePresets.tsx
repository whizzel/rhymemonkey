'use client';

interface GamePresetsProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  selectedTime: number;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onTimeChange: (time: number) => void;
}

export function GamePresets({ 
  selectedDifficulty, 
  selectedTime, 
  onDifficultyChange, 
  onTimeChange 
}: GamePresetsProps) {
  return (
    <div className="mario-panel flex flex-col gap-4 p-4">
      <h3 className="text-[10px] uppercase tracking-widest text-mario-gold">Game Presets</h3>
      
      <div className="flex flex-col gap-2">
        <span className="text-[9px] uppercase tracking-widest text-white/70">Difficulty</span>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            className={`mario-chip text-[10px] ${selectedDifficulty === 'easy' ? 'mario-chip-active' : ''}`}
            onClick={() => onDifficultyChange('easy')}
          >
            <span className="mr-1 inline-block align-middle">
              {selectedDifficulty === 'easy' ? (
                <span className="inline-block h-4 w-4 border-2 align-middle border-green-300 bg-mario-green" style={{boxShadow: 'inset 0 0 0 1px #000'}}>
                  <span className="block h-full w-full text-center text-[10px] font-bold leading-3 text-black">x</span>
                </span>
              ) : (
                <span className="inline-block h-4 w-4 border-2 align-middle border-white/30 bg-transparent" style={{boxShadow: 'none'}}></span>
              )}
            </span>
            easy
          </button>
          <button 
            type="button"
            className={`mario-chip text-[10px] ${selectedDifficulty === 'medium' ? 'mario-chip-active' : ''}`}
            onClick={() => onDifficultyChange('medium')}
          >
            <span className="mr-1 inline-block align-middle">
              {selectedDifficulty === 'medium' ? (
                <span className="inline-block h-4 w-4 border-2 align-middle border-green-300 bg-mario-green" style={{boxShadow: 'inset 0 0 0 1px #000'}}>
                  <span className="block h-full w-full text-center text-[10px] font-bold leading-3 text-black">x</span>
                </span>
              ) : (
                <span className="inline-block h-4 w-4 border-2 align-middle border-white/30 bg-transparent" style={{boxShadow: 'none'}}></span>
              )}
            </span>
            medium
          </button>
          <button 
            type="button"
            className={`mario-chip text-[10px] ${selectedDifficulty === 'hard' ? 'mario-chip-active' : ''}`}
            onClick={() => onDifficultyChange('hard')}
          >
            <span className="mr-1 inline-block align-middle">
              {selectedDifficulty === 'hard' ? (
                <span className="inline-block h-4 w-4 border-2 align-middle border-green-300 bg-mario-green" style={{boxShadow: 'inset 0 0 0 1px #000'}}>
                  <span className="block h-full w-full text-center text-[10px] font-bold leading-3 text-black">x</span>
                </span>
              ) : (
                <span className="inline-block h-4 w-4 border-2 align-middle border-white/30 bg-transparent" style={{boxShadow: 'none'}}></span>
              )}
            </span>
            hard
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <span className="text-[9px] uppercase tracking-widest text-white/70">Time</span>
        <div className="flex flex-wrap gap-2">
          <button 
            type="button"
            className={`mario-chip text-[10px] ${selectedTime === 30 ? 'mario-chip-active' : ''}`}
            onClick={() => onTimeChange(30)}
          >
            <span className="mr-1 inline-block align-middle">
              {selectedTime === 30 ? (
                <span className="inline-block h-4 w-4 border-2 align-middle border-green-300 bg-mario-green" style={{boxShadow: 'inset 0 0 0 1px #000'}}>
                  <span className="block h-full w-full text-center text-[10px] font-bold leading-3 text-black">x</span>
                </span>
              ) : (
                <span className="inline-block h-4 w-4 border-2 align-middle border-white/30 bg-transparent" style={{boxShadow: 'none'}}></span>
              )}
            </span>
            30s
          </button>
          <button 
            type="button"
            className={`mario-chip text-[10px] ${selectedTime === 60 ? 'mario-chip-active' : ''}`}
            onClick={() => onTimeChange(60)}
          >
            <span className="mr-1 inline-block align-middle">
              {selectedTime === 60 ? (
                <span className="inline-block h-4 w-4 border-2 align-middle border-green-300 bg-mario-green" style={{boxShadow: 'inset 0 0 0 1px #000'}}>
                  <span className="block h-full w-full text-center text-[10px] font-bold leading-3 text-black">x</span>
                </span>
              ) : (
                <span className="inline-block h-4 w-4 border-2 align-middle border-white/30 bg-transparent" style={{boxShadow: 'none'}}></span>
              )}
            </span>
            1m
          </button>
          <button 
            type="button"
            className={`mario-chip text-[10px] ${selectedTime === 120 ? 'mario-chip-active' : ''}`}
            onClick={() => onTimeChange(120)}
          >
            <span className="mr-1 inline-block align-middle">
              {selectedTime === 120 ? (
                <span className="inline-block h-4 w-4 border-2 align-middle border-green-300 bg-mario-green" style={{boxShadow: 'inset 0 0 0 1px #000'}}>
                  <span className="block h-full w-full text-center text-[10px] font-bold leading-3 text-black">x</span>
                </span>
              ) : (
                <span className="inline-block h-4 w-4 border-2 align-middle border-white/30 bg-transparent" style={{boxShadow: 'none'}}></span>
              )}
            </span>
            120s
          </button>
        </div>
      </div>
    </div>
  );
}
