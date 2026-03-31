'use client';

import { useState } from 'react';
import { useAudio } from '@/context/AudioContext';

interface GameActionsProps {
  onStartGame: (gameMode: 'solo' | 'private') => void;
  onJoinRoom: (code: string) => void;
}

export function GameActions({ onStartGame, onJoinRoom }: GameActionsProps) {
  const { playClick } = useAudio();
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const handleJoin = () => {
    if (joinCode.trim().length === 6) {
      onJoinRoom(joinCode.trim().toUpperCase());
      setJoinCode('');
      setShowJoinInput(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <button 
          type="button"
          className="mario-btn mario-btn-green text-sm" 
          onClick={() => { playClick(); onStartGame('solo'); }}
        >
          PLAY SOLO
        </button>
        {!showJoinInput ? (
          <button 
            type="button"
            className="mario-btn mario-btn-gold text-sm" 
            onClick={() => { playClick(); setShowJoinInput(true); }}
          >
            JOIN ROOM
          </button>
        ) : (
          <button 
            type="button"
            className="mario-btn mario-btn-gold text-sm" 
            onClick={() => { playClick(); onStartGame('private'); }}
          >
            CREATE RM
          </button>
        )}
      </div>

      {showJoinInput && (
        <div className="flex gap-2 p-3 rounded-lg bg-black/40 border-2 border-[#ffb300]/50 mt-2">
          <input 
            className="flex-1 bg-transparent border-b-2 border-[#ffb300] text-[#ffb300] font-retro px-2 text-center outline-none uppercase placeholder:text-[#ffb300]/30" 
            placeholder="CODE" 
            value={joinCode} 
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
          />
          <button 
            className="mario-btn text-sm" 
            style={{ padding: '8px 16px' }}
            onClick={() => { playClick(); handleJoin(); }} 
            disabled={joinCode.length < 6}
          >
            GO
          </button>
          <button 
            className="mario-btn text-sm" 
            style={{ padding: '8px 16px', background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' }}
            onClick={() => { playClick(); setShowJoinInput(false); }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}