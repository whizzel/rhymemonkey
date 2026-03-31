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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@700;800&display=swap');

        .ga-grid { display:grid;grid-template-columns:1fr 1fr;gap:12px; }
        @media(max-width:460px){.ga-grid{grid-template-columns:1fr;}}

        .ga-btn {
          font-family:'Orbitron',monospace;font-size:14px;font-weight:700;letter-spacing:.08em;
          border:none;border-radius:8px;padding:12px 14px 10px;
          cursor:pointer;position:relative;overflow:hidden;
          display:flex;flex-direction:column;align-items:center;gap:3px;
          transition:transform .1s,filter .15s;user-select:none;outline:none;
          clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
          width: 100%;
        }
        .ga-btn:hover  { filter:brightness(1.15);transform:translateY(-3px); }
        .ga-btn:active { transform:translateY(4px)!important; }
        .ga-btn::before {
          content:'';position:absolute;inset:0;
          background:repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(255,255,255,0.02) 4px,rgba(255,255,255,0.02) 5px);
          pointer-events:none;
        }
        .ga-btn::after {
          content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);
          transform:skewX(-20deg);transition:left .45s;pointer-events:none;
        }
        .ga-btn:hover::after{left:130%;}

        .ga-icon { font-size:22px;line-height:1;position:relative;z-index:1; margin-bottom: 2px; }
        .ga-label { font-size:13px;position:relative;z-index:1; }
        .ga-sub { font-family:'Exo 2',sans-serif;font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;opacity:.65;position:relative;z-index:1; }

        .btn-solo    { background:linear-gradient(180deg,#cc1a1a,#8a0a0a);color:#fff;box-shadow:0 6px 0 #4a0505,0 8px 20px rgba(200,10,10,0.4); }
        .btn-private { background:linear-gradient(180deg,#1a55cc,#0a2a8a);color:#c8e0ff;box-shadow:0 6px 0 #050f40,0 8px 20px rgba(10,50,200,0.4); }
        .btn-join    { background:linear-gradient(180deg,#1a2a40,#0d1525);color:#6a9ac0;box-shadow:0 6px 0 #060c18; border:1px solid #1a3a6a; }

        .ga-join-box { margin-top: 10px; display: flex; gap: 8px; animation: slideDown .3s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .ga-input { flex: 1; background: #060f1e; border: 1px solid #1a3a6a; border-radius: 6px; padding: 10px; color: #fff; font-family: 'Orbitron', monospace; text-align: center; font-size: 16px; outline: none; }
        .ga-go { background: #cc1a1a; border: none; border-radius: 6px; color: #fff; padding: 0 20px; font-family: 'Orbitron', monospace; cursor: pointer; font-weight: 700; height: 100%; min-height: 48px; }
        .ga-go:disabled { opacity: .5; cursor: not-allowed; }
      `}</style>

      <div>
        <div className="ga-grid">
          <button type="button" className="ga-btn btn-solo" onClick={() => { playClick(); onStartGame('solo'); }}>
            <span className="ga-icon">🤖</span>
            <span className="ga-label">PLAY SOLO</span>
            <span className="ga-sub">single player</span>
          </button>
          {!showJoinInput ? (
            <button type="button" className="ga-btn btn-private" onClick={() => { playClick(); setShowJoinInput(true); }}>
              <span className="ga-icon">🎮</span>
              <span className="ga-label">JOIN ROOM</span>
              <span className="ga-sub">enter code</span>
            </button>
          ) : (
            <button type="button" className="ga-btn btn-private" onClick={() => { playClick(); onStartGame('private'); }}>
              <span className="ga-icon">📡</span>
              <span className="ga-label">CREATE RM</span>
              <span className="ga-sub">host lobby</span>
            </button>
          )}
        </div>

        {showJoinInput && (
          <div className="ga-join-box">
            <input 
              className="ga-input" 
              placeholder="CODE" 
              value={joinCode} 
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button className="ga-go" onClick={handleJoin} disabled={joinCode.length < 6}>GO</button>
            <button className="ga-go" style={{ background: '#1a3a6a', padding: '0 15px' }} onClick={() => setShowJoinInput(false)}>✕</button>
          </div>
        )}
      </div>
    </>
  );
}