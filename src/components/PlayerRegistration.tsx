'use client';

import { MonkeyCharacter } from './MonkeyCharacter';

interface PlayerRegistrationProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  error: string;
}

export function PlayerRegistration({ playerName, onPlayerNameChange, error }: PlayerRegistrationProps) {
  const mood = error ? 'sad' : playerName.length > 0 ? 'happy' : 'idle';
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Exo+2:wght@700;800&display=swap');

        .pr-wrap { display:flex;flex-direction:column;gap:8px;position:relative; }

        .pr-monkey { position:absolute;top:-78px;right:-6px;pointer-events:none;z-index:3;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.5)); }

        .pr-label { font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#3a6a9a; }

        .pr-box {
          position:relative;
          background:#060f1e;border:2px solid #1a3a6a;border-radius:10px;
          box-shadow:inset 0 0 16px rgba(0,40,120,0.3),0 4px 0 #030710;
          transition:border-color .2s,box-shadow .2s;overflow:hidden;
        }
        .pr-box::before {
          content:'';position:absolute;inset:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);
          pointer-events:none;
        }
        .pr-box:focus-within { border-color:#00d4ff;box-shadow:0 0 0 3px rgba(0,180,255,0.15),inset 0 0 16px rgba(0,40,120,0.3),0 4px 0 #030710; }
        .pr-box.has-error    { border-color:#ff2a2a;box-shadow:0 0 0 3px rgba(255,30,30,0.2),inset 0 0 16px rgba(100,0,0,0.2),0 4px 0 #030710;animation:prShake .4s ease-in-out; }
        @keyframes prShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}

        /* Shimmer on focus */
        .pr-box::after {
          content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(0,180,255,0.07),transparent);
          transform:skewX(-15deg);transition:left .5s;pointer-events:none;
        }
        .pr-box:focus-within::after { left:130%; }

        .pr-input {
          width:100%;font-family:'Orbitron',monospace;font-size:20px;
          color:#c8e0ff;background:transparent;border:none;outline:none;
          padding:13px 52px 13px 16px;letter-spacing:.06em;
          caret-color:#00ff88;position:relative;z-index:1;
          animation:prCaretPulse 1.5s infinite;
        }
        @keyframes prCaretPulse {
          0%, 100% { caret-color: #00ff88; }
          50% { caret-color: transparent; }
        }
        .pr-input::placeholder { color:#1a3a5a;font-size:16px;font-family:'Exo 2',sans-serif; }
        
        /* overriding browser autofill styling */
        .pr-input:-webkit-autofill,
        .pr-input:-webkit-autofill:hover, 
        .pr-input:-webkit-autofill:focus, 
        .pr-input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 30px #060f1e inset !important;
            -webkit-text-fill-color: #c8e0ff !important;
            transition: background-color 5000s ease-in-out 0s;
        }

        .pr-counter {
          position:absolute;right:12px;top:50%;transform:translateY(-50%);
          font-family:'Exo 2',sans-serif;font-size:10px;font-weight:800;
          color:#1a3a5a;pointer-events:none;transition:color .2s;z-index:2;
        }
        .pr-counter.warn  { color:#ffaa00; }
        .pr-counter.limit { color:#ff2a2a; }

        .pr-error {
          display:flex;align-items:center;gap:6px;
          font-family:'Exo 2',sans-serif;font-size:11px;font-weight:800;
          color:#ff8888;background:rgba(255,30,30,0.08);
          border:1px solid rgba(255,30,30,0.25);border-radius:6px;padding:6px 12px;
          animation:errIn .22s ease-out;
        }
        @keyframes errIn{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="pr-wrap">
        <div className="pr-monkey"><MonkeyCharacter mood={mood} size={76} /></div>
        <label htmlFor="playerName" className="pr-label">// Player ID</label>
        <div className={`pr-box ${error ? 'has-error' : ''}`}>
          <input
            id="playerName" type="text" maxLength={20}
            className="pr-input" placeholder="enter callsign..."
            value={playerName} onChange={e => onPlayerNameChange(e.target.value)}
          />
          <span className={`pr-counter ${playerName.length >= 20 ? 'limit' : playerName.length >= 15 ? 'warn' : ''}`}>
            {playerName.length}/20
          </span>
        </div>
        {error && <div className="pr-error">⚠ {error}</div>}
      </div>
    </>
  );
}