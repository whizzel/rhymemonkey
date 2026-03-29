'use client';

interface GameActionsProps {
  onStartGame: (gameMode: 'solo' | 'private') => void;
}

export function GameActions({ onStartGame }: GameActionsProps) {
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
      `}</style>

      <div className="ga-grid">
        <button type="button" className="ga-btn btn-solo" onClick={() => onStartGame('solo')}>
          <span className="ga-icon">🤖</span>
          <span className="ga-label">PLAY SOLO</span>
          <span className="ga-sub">single player</span>
        </button>
        <button type="button" className="ga-btn btn-private" onClick={() => onStartGame('private')}>
          <span className="ga-icon">🎮</span>
          <span className="ga-label">PRIVATE</span>
          <span className="ga-sub">invite friends</span>
        </button>
      </div>
    </>
  );
}