'use client';

interface GamePresetsProps {
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  selectedTime: number;
  onDifficultyChange: (d: 'easy' | 'medium' | 'hard') => void;
  onTimeChange: (t: number) => void;
}

const DIFF = [
  { value: 'easy', label: 'EASY', icon: '▶', activeBg: 'linear-gradient(180deg,#0a7a0a,#064806)', activeShadow: '#032802', activeGlow: 'rgba(0,200,0,0.3)' },
  { value: 'medium', label: 'MEDIUM', icon: '▶▶', activeBg: 'linear-gradient(180deg,#cc8800,#885500)', activeShadow: '#442800', activeGlow: 'rgba(255,160,0,0.3)' },
  { value: 'hard', label: 'HARD', icon: '▶▶▶', activeBg: 'linear-gradient(180deg,#cc1a1a,#8a0a0a)', activeShadow: '#4a0505', activeGlow: 'rgba(255,30,30,0.4)' },
] as const;

const TIMES = [
  { value: 30, label: '0:30', icon: '⚡' },
  { value: 60, label: '1:00', icon: '⏱' },
  { value: 120, label: '2:00', icon: '🔋' },
] as const;

export function GamePresets({ selectedDifficulty, selectedTime, onDifficultyChange, onTimeChange }: GamePresetsProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@700;800&display=swap');

        .gpr-panel {
          background:linear-gradient(160deg,#0d1f35,#080f1e);
          border:2px solid #1a3a6a;border-radius:14px;overflow:hidden;position:relative;
          box-shadow:0 8px 32px rgba(0,0,0,0.5),inset 0 0 20px rgba(0,30,80,0.1);
        }
        .gpr-panel::before {
          content:'';position:absolute;top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,#1a55cc 30%,#cc1a1a 70%,transparent);
        }
        .gpr-panel::after {
          content:'';position:absolute;inset:0;pointer-events:none;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);
        }

        .gpr-head {
          font-family:'Orbitron',monospace;font-size:11px;font-weight:700;letter-spacing:.2em;
          color:#00d4ff;text-transform:uppercase;padding:12px 16px 10px;
          border-bottom:1px solid #1a3a6a;display:flex;align-items:center;gap:8px;
          text-shadow:0 0 10px rgba(0,180,255,0.4);position:relative;z-index:1;
        }
        .gpr-head::after { content:'';flex:1;height:1px;background:linear-gradient(90deg,#1a3a6a,transparent); }

        .gpr-body { padding:12px 16px;display:flex;flex-direction:column;gap:10px;position:relative;z-index:1; }

        .gpr-lbl { font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#3a6a9a;margin-bottom:6px; }

        .gpr-chips { display:flex;gap:8px; }

        .gpr-chip {
          font-family:'Orbitron',monospace;font-size:11px;font-weight:700;letter-spacing:.06em;
          border:none;border-radius:7px;padding:8px 0 6px;
          cursor:pointer;flex:1;position:relative;overflow:hidden;
          display:flex;flex-direction:column;align-items:center;gap:2px;
          transition:transform .1s,filter .15s;user-select:none;outline:none;
          background:#060f1e;color:#3a6a9a;
          border:1px solid #1a3a6a;
          box-shadow:0 3px 0 #030710;
          clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);
        }
        .gpr-chip:hover:not(.gpr-on) { filter:brightness(1.4);transform:translateY(-2px);color:#6a9ac0; }
        .gpr-chip:active { transform:translateY(2px)!important;box-shadow:0 1px 0 #030710!important; }
        .gpr-chip::before {
          content:'';position:absolute;inset:0;
          background:repeating-linear-gradient(45deg,transparent,transparent 4px,rgba(255,255,255,0.015) 4px,rgba(255,255,255,0.015) 5px);
          pointer-events:none;
        }
        .gpr-chip::after {
          content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent);
          transform:skewX(-20deg);pointer-events:none;
        }
        .gpr-chip.gpr-on::after { animation:chipShimmer .5s ease-out .05s forwards;opacity:0; }
        @keyframes chipShimmer{0%{left:-80%;opacity:1}100%{left:130%;opacity:0}}

        .gpr-on { color:#fff!important;border-color:transparent!important; }

        /* Active checkmark */
        .gpr-check {
          display:none;position:absolute;top:-7px;right:-7px;
          width:18px;height:18px;border-radius:50%;
          background:#fff;color:#050d1a;
          font-size:9px;font-weight:900;
          align-items:center;justify-content:center;
          box-shadow:0 2px 4px rgba(0,0,0,0.5);
          animation:checkPop .22s cubic-bezier(0.36,0.07,0.19,0.97);
        }
        .gpr-on .gpr-check { display:flex; }
        @keyframes checkPop{0%{transform:scale(0)}65%{transform:scale(1.3)}100%{transform:scale(1)}}

        .gpr-chip-icon  { font-size:14px;line-height:1;position:relative;z-index:1; }
        .gpr-chip-label { font-size:10px;position:relative;z-index:1; }

        .gpr-divider { height:1px;background:linear-gradient(90deg,transparent,#1a3a6a,transparent); }
      `}</style>

      <div className="gpr-panel">
        <div className="gpr-head">⚙ Game Config</div>
        <div className="gpr-body">

          <div>
            <div className="gpr-lbl">// Difficulty</div>
            <div className="gpr-chips">
              {DIFF.map(({ value, label, icon, activeBg, activeShadow, activeGlow }) => {
                const on = selectedDifficulty === value;
                return (
                  <button key={value} type="button"
                    className={`gpr-chip ${on ? 'gpr-on' : ''}`}
                    style={on ? { background: activeBg, boxShadow: `0 3px 0 ${activeShadow},0 0 20px ${activeGlow}` } : {}}
                    onClick={() => onDifficultyChange(value)}
                  >
                    <span className="gpr-check">✓</span>
                    <span className="gpr-chip-icon">{icon}</span>
                    <span className="gpr-chip-label">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="gpr-divider" />

          <div>
            <div className="gpr-lbl">// Time Limit</div>
            <div className="gpr-chips">
              {TIMES.map(({ value, label, icon }) => {
                const on = selectedTime === value;
                return (
                  <button key={value} type="button"
                    className={`gpr-chip ${on ? 'gpr-on' : ''}`}
                    style={on ? {
                      background: 'linear-gradient(180deg,#1a55cc,#0a2a8a)',
                      boxShadow: '0 3px 0 #050f40,0 0 20px rgba(10,80,200,0.35)',
                    } : {}}
                    onClick={() => onTimeChange(value)}
                  >
                    <span className="gpr-check">✓</span>
                    <span className="gpr-chip-icon">{icon}</span>
                    <span className="gpr-chip-label">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}