'use client';

interface PlayerRegistrationProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  error: string;
}

export function PlayerRegistration({ playerName, onPlayerNameChange, error }: PlayerRegistrationProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="playerName" className="text-[10px] uppercase tracking-widest text-white/70">Name</label>
      <div className="mario-panel px-3 py-2">
        <input 
          id="playerName"
          type="text"
          maxLength={20} 
          className="w-full text-lg text-white bg-transparent border-none outline-none placeholder-white/50" 
          placeholder="Player name" 
          value={playerName}
          onChange={(e) => {
            onPlayerNameChange(e.target.value);
          }}
        />
      </div>
      {error && (
        <div className="text-red-400 text-[10px] text-center">
          {error}
        </div>
      )}
    </div>
  );
}
