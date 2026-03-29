'use client';

import { useState } from 'react';
import { MonkeyCharacter } from './MonkeyCharacter';

interface RoomDashboardProps {
  roomCode: string;
  players: Array<{ name: string; score?: number; }>;
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

export function RoomDashboard({ roomCode, players, currentWord, timeLeft, attempted, correct, skipped, isGameActive, onStartGame, onSkip, onExit, onSubmitRhyme }: RoomDashboardProps) {
  const [input, setInput] = useState('');
  const [shake, setShake] = useState(false);
  const isLow = timeLeft <= 10;
  const isMid = timeLeft <= 30;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) { onSubmitRhyme?.(input.trim()); setInput(''); }
    else { setShake(true); setTimeout(() => setShake(false), 450); onSkip?.(); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@600;700;800&display=swap');
        .rd-bg{min-height:100vh;background:radial-gradient(ellipse at 12% 18%,rgba(204,26,26,0.1) 0%,transparent 45%),radial-gradient(ellipse at 88% 82%,rgba(26,85,204,0.12) 0%,transparent 45%),linear-gradient(160deg,#050d1a,#080f1e);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;padding:36px 16px 28px;font-family:'Exo 2',sans-serif;user-select:none;}
        .rd-bg::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(26,85,204,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,85,204,0.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;}

        .rd-hud{position:fixed;top:0;left:0;right:0;height:32px;z-index:10;background:linear-gradient(90deg,rgba(204,26,26,0.9),rgba(5,13,26,0.95) 40%,rgba(5,13,26,0.95) 60%,rgba(26,85,204,0.9));border-bottom:1px solid #1a3a6a;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Orbitron',monospace;font-size:9px;font-weight:700;letter-spacing:.15em;color:#6a9ac0;}
        .rd-hud-dot{width:6px;height:6px;border-radius:50%;}

        .rd-inner{position:relative;z-index:1;width:100%;max-width:780px;display:flex;flex-direction:column;gap:14px;}

        .dp2{background:linear-gradient(160deg,#0d1f35,#080f1e);border:2px solid #1a3a6a;border-radius:14px;overflow:hidden;position:relative;box-shadow:0 0 0 1px #0d1f35,0 8px 28px rgba(0,0,0,0.55),inset 0 0 16px rgba(0,30,80,0.07);}
        .dp2::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#1a55cc 30%,#cc1a1a 70%,transparent);}
        .dp2::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);border-radius:14px;}

        /* Stats */
        .rd-stats{display:grid;grid-template-columns:repeat(4,1fr);}
        .rd-stat{text-align:center;padding:11px 6px;position:relative;}
        .rd-stat+.rd-stat::before{content:'';position:absolute;left:0;top:15%;height:70%;width:1px;background:#1a3a6a;}
        .rd-slbl{font-size:8px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#3a6a9a;margin-bottom:2px;}
        .rd-sval{font-family:'Orbitron',monospace;font-size:22px;color:#c8e0ff;line-height:1;position:relative;z-index:1;}
        .rd-sval.cyan {color:#00d4ff;text-shadow:0 0 8px rgba(0,180,255,0.5);}
        .rd-sval.amber{color:#ffaa00;}
        .rd-sval.red  {color:#ff4444;text-shadow:0 0 8px rgba(255,30,30,0.5);animation:tp .55s ease-in-out infinite;}
        @keyframes tp{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}

        /* Main body */
        .rd-body{padding:22px 18px 20px;display:flex;flex-direction:column;align-items:center;gap:16px;position:relative;z-index:1;}

        /* Room code */
        .rd-code-wrap{text-align:center;}
        .rd-code-lbl{font-size:8px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#3a6a9a;margin-bottom:4px;}
        .rd-code{font-family:'Orbitron',monospace;font-weight:900;font-size:32px;color:#ff2a2a;text-shadow:0 0 16px rgba(255,30,30,0.5);letter-spacing:.15em;}

        /* Players */
        .rd-players{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;width:100%;}
        .rd-chip{display:flex;align-items:center;gap:6px;background:#060f1e;border:1px solid #1a3a6a;border-radius:7px;padding:7px 12px;font-family:'Orbitron',monospace;font-size:13px;color:#c8e0ff;box-shadow:0 3px 0 #030710;animation:chipIn .3s cubic-bezier(0.34,1.56,0.64,1) both;}
        @keyframes chipIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        .rd-score-badge{font-size:11px;color:#00d4ff;background:rgba(0,180,255,0.1);border-radius:4px;padding:1px 5px;}

        .rd-div{width:100%;height:1px;background:linear-gradient(90deg,transparent,#1a3a6a 30%,#cc1a1a 50%,#1a3a6a 70%,transparent);}

        /* Word panel */
        .rd-word-panel{width:100%;background:#060f1e;border:2px solid #1a3a6a;border-radius:12px;padding:20px 18px;text-align:center;position:relative;overflow:hidden;box-shadow:0 0 20px rgba(0,80,200,0.1);}
        .rd-word-panel::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,#00d4ff,transparent);}
        .rd-wlbl{font-size:9px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#3a6a9a;margin-bottom:8px;}
        .rd-word{font-family:'Orbitron',monospace;font-weight:900;font-size:44px;color:#c8e0ff;text-shadow:0 0 18px rgba(0,180,255,0.4);letter-spacing:.06em;line-height:1;animation:wordPop .35s cubic-bezier(0.34,1.56,0.64,1);}
        @keyframes wordPop{from{transform:scale(0.7);opacity:0}to{transform:scale(1);opacity:1}}
        .rd-game-row{display:flex;align-items:center;gap:12px;width:100%;}

        /* Input */
        .rd-input{width:100%;font-family:'Orbitron',monospace;font-size:20px;text-align:center;background:#060f1e;border:2px solid #1a3a6a;border-radius:10px;padding:12px 16px;color:#c8e0ff;outline:none;box-shadow:inset 0 0 12px rgba(0,30,80,0.3);transition:border-color .2s,box-shadow .2s;letter-spacing:.05em;caret-color:#00d4ff;}
        .rd-input::placeholder{color:#1a3a5a;font-size:14px;font-family:'Exo 2',sans-serif;}
        .rd-input:focus{border-color:#00d4ff;box-shadow:0 0 0 3px rgba(0,180,255,0.15),inset 0 0 12px rgba(0,30,80,0.3);}
        .rd-input.shake{animation:rdShake .45s ease-in-out;}
        @keyframes rdShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}

        /* Buttons */
        .rd-btns{display:flex;gap:10px;align-items:center;width:100%;}
        .rd-btn{font-family:'Orbitron',monospace;font-size:13px;font-weight:700;letter-spacing:.08em;border:none;border-radius:8px;padding:12px 18px;cursor:pointer;position:relative;overflow:hidden;transition:transform .1s,filter .15s;outline:none;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);}
        .rd-btn:hover{filter:brightness(1.12);transform:translateY(-2px);}
        .rd-btn:active{transform:translateY(3px)!important;}
        .rd-btn::after{content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:skewX(-20deg);transition:left .4s;pointer-events:none;}
        .rd-btn:hover::after{left:130%;}
        .rdb-skip  {background:linear-gradient(180deg,#1a2a40,#0d1525);color:#6a9ac0;box-shadow:0 4px 0 #060c18;border:1px solid #1a3a6a;}
        .rdb-submit{flex:1;background:linear-gradient(180deg,#cc1a1a,#8a0a0a);color:#fff;box-shadow:0 4px 0 #4a0505,0 5px 14px rgba(200,10,10,0.4);font-size:15px;}
        .rdb-exit  {background:none;border:none;cursor:pointer;outline:none;font-family:'Exo 2',sans-serif;font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;text-decoration:underline;text-underline-offset:3px;transition:color .2s;}
        .rdb-exit:hover{color:#ff8888;}

        /* Waiting */
        .rd-waiting{display:flex;flex-direction:column;align-items:center;gap:14px;padding:8px 0 4px;}
        .rd-wtitle{font-family:'Orbitron',monospace;font-size:22px;font-weight:700;color:#00d4ff;text-shadow:0 0 16px rgba(0,180,255,0.5);}
        .rd-wsub{font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;}
        .rd-wsub span{display:inline-block;animation:dotB .8s ease-in-out infinite;}
        .rd-wsub span:nth-child(2){animation-delay:.15s;}.rd-wsub span:nth-child(3){animation-delay:.3s;}
        @keyframes dotB{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .rd-start{font-family:'Orbitron',monospace;font-size:16px;font-weight:700;letter-spacing:.08em;border:none;border-radius:8px;padding:15px 36px;cursor:pointer;background:linear-gradient(180deg,#cc1a1a,#8a0a0a);color:#fff;box-shadow:0 6px 0 #4a0505,0 8px 20px rgba(200,10,10,0.4);transition:transform .1s,filter .15s;clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);}
        .rd-start:hover{filter:brightness(1.12);transform:translateY(-2px);}
        .rd-start:active{transform:translateY(3px)!important;}

        .rd-footer{text-align:center;font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#1a3a5a;}
      `}</style>

      <div className="rd-hud">
        <div className="rd-hud-dot" style={{ background: '#cc1a1a', boxShadow: '0 0 6px #ff2a2a' }} />
        RHYMEMONKEY — ROOM {roomCode}
        <div className="rd-hud-dot" style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }} />
      </div>

      <div className="rd-bg">
        <div className="rd-inner">

          {/* Stats */}
          <div className="dp2 rd-stats">
            <div className="rd-stat"><div className="rd-slbl">⏱ Time</div><div className={`rd-sval ${isLow ? 'red' : isMid ? 'amber' : 'cyan'}`}>{timeLeft}s</div></div>
            <div className="rd-stat"><div className="rd-slbl">📝 Tried</div><div className="rd-sval">{attempted}</div></div>
            <div className="rd-stat"><div className="rd-slbl">✅ Correct</div><div className="rd-sval cyan">{correct}</div></div>
            <div className="rd-stat"><div className="rd-slbl">⏭ Skipped</div><div className="rd-sval amber">{skipped}</div></div>
          </div>

          {/* Main card */}
          <div className="dp2">
            <div className="rd-body">

              <div className="rd-code-wrap">
                <div className="rd-code-lbl">// Room</div>
                <div className="rd-code">{roomCode}</div>
              </div>

              <div className="rd-players">
                {players.map((p, i) => (
                  <div key={p.name} className="rd-chip" style={{ animationDelay: `${i * .07}s` }}>
                    🤖 {p.name}
                    {p.score !== undefined && <span className="rd-score-badge">⚡{p.score}</span>}
                  </div>
                ))}
              </div>

              <div className="rd-div" />

              {isGameActive ? (
                <>
                  <div className="rd-game-row">
                    <div className="rd-word-panel" style={{ flex: 1 }}>
                      <div className="rd-wlbl">// Rhyme this word</div>
                      <div className="rd-word">{currentWord.toUpperCase()}</div>
                    </div>
                    <MonkeyCharacter mood="excited" size={96} />
                  </div>

                  <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <input
                      autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
                      className={`rd-input ${shake ? 'shake' : ''}`}
                      placeholder="enter rhyme + press enter..."
                      value={input} onChange={e => setInput(e.target.value)}
                    />
                  </form>

                  <div className="rd-btns">
                    <button type="button" className="rd-btn rdb-skip" onClick={onSkip}>⏭ SKIP</button>
                    <button type="button" className="rd-btn rdb-submit"
                      onClick={() => { if (input.trim()) { onSubmitRhyme?.(input.trim()); setInput(''); } else onSkip?.(); }}>
                      ⚡ SUBMIT
                    </button>
                    <button type="button" className="rdb-exit" onClick={onExit}>EXIT</button>
                  </div>
                </>
              ) : (
                <div className="rd-waiting">
                  <MonkeyCharacter mood="idle" size={100} />
                  <div className="rd-wtitle">// STANDBY</div>
                  <div className="rd-wsub">Waiting for players<span><span>.</span><span>.</span><span>.</span></span></div>
                  {players.length >= 1 && (
                    <button type="button" className="rd-start" onClick={onStartGame}>⚡ INITIALIZE GAME</button>
                  )}
                </div>
              )}

            </div>
          </div>

          <div className="rd-footer">// RHYMEMONKEY — by @aarushe_reddy</div>
        </div>
      </div>
    </>
  );
}