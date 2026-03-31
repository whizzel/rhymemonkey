'use client';

import { useAudio } from '@/context/AudioContext';
import { GameBoard } from './GameBoard';
import { Leaderboard } from './Leaderboard';
import type { GameState, Player } from '@/lib/types';

interface GameDashboardProps {
  gameState: GameState;
  showError: boolean;
  showSuccess: boolean;
  isNextLoading: boolean;
  player: Player | null;
  onInput: (input: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onPause: () => void;
  onBackToMenu: () => void;
  onShowLeaderboard: () => void;
}

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 5.1 + 1) % 100}%`,
  delay: `${(i * 0.38) % 7}s`,
  dur: `${5 + (i % 5)}s`,
  size: [2, 1.5, 2.5][i % 3],
  color: i % 2 === 0 ? '#cc1a1a' : '#1a55cc',
}));

export function GameDashboard({ gameState, showError, showSuccess, isNextLoading, player, onInput, onSubmit, onSkip, onPause, onBackToMenu, onShowLeaderboard }: GameDashboardProps) {
  const { playClick } = useAudio();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@600;700;800&display=swap');

        .gd-bg {
          min-height:100vh;
          background:
            radial-gradient(ellipse at 10% 15%,rgba(204,26,26,0.1) 0%,transparent 45%),
            radial-gradient(ellipse at 90% 85%,rgba(26,85,204,0.13) 0%,transparent 45%),
            linear-gradient(160deg,#050d1a 0%,#080f1e 100%);
          position:relative;overflow:hidden;
          display:flex;align-items:flex-start;justify-content:center;
          padding:20px 16px 24px;font-family:'Exo 2',sans-serif;user-select:none;
        }
        .gd-bg::before {
          content:'';position:fixed;inset:0;pointer-events:none;
          background-image:linear-gradient(rgba(26,85,204,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,85,204,0.05) 1px,transparent 1px);
          background-size:40px 40px;z-index:0;
        }

        .gd-particles { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
        .gd-part { position:absolute;bottom:-4px;border-radius:50%;animation:gdPartFloat linear infinite; }
        @keyframes gdPartFloat{0%{transform:translateY(0);opacity:0}10%{opacity:.7}90%{opacity:.5}100%{transform:translateY(-105vh);opacity:0}}

        /* Top HUD bar */
        .gd-hud {
          position:fixed;top:0;left:0;right:0;height:32px;z-index:10;
          background:linear-gradient(90deg,rgba(204,26,26,0.9),rgba(5,13,26,0.95) 40%,rgba(5,13,26,0.95) 60%,rgba(26,85,204,0.9));
          border-bottom:1px solid #1a3a6a;
          display:flex;align-items:center;justify-content:center;gap:8px;
          font-family:'Orbitron',monospace;font-size:10px;font-weight:700;letter-spacing:.15em;color:#6a9ac0;
        }
        .gd-hud-dot { width:6px;height:6px;border-radius:50%; }

        .gd-inner { position:relative;z-index:1;width:100%;max-width:1180px;padding-top:60px; }
        .gd-grid { display:grid;grid-template-columns:1fr 310px;gap:18px;align-items:start; }
        @media(max-width:880px){.gd-grid{grid-template-columns:1fr;}}

        /* Panel */
        .dp {
          background:linear-gradient(160deg,#0d1f35,#080f1e);
          border:2px solid #1a3a6a;border-radius:14px;overflow:hidden;position:relative;
          box-shadow:0 0 0 1px #0d1f35,0 10px 32px rgba(0,0,0,0.6),inset 0 0 20px rgba(0,30,80,0.08);
        }
        .dp::before { content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#1a55cc 30%,#cc1a1a 70%,transparent); }
        .dp::after { content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);border-radius:14px; }

        /* Stats strip */
        .gd-stats { display:grid;grid-template-columns:repeat(4,1fr); }
        .gd-stat { text-align:center;padding:12px 6px;position:relative; }
        .gd-stat+.gd-stat::before { content:'';position:absolute;left:0;top:15%;height:70%;width:1px;background:#1a3a6a; }
        .gd-slbl { font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#3a6a9a;margin-bottom:2px; }
        .gd-sval { font-family:'Orbitron',monospace;font-size:22px;color:#c8e0ff;line-height:1;position:relative;z-index:1; }
        .gd-sval.green  { color:#00ff88;text-shadow:0 0 8px rgba(0,255,136,0.5); }
        .gd-sval.amber { color:#ffaa00; }
        .gd-sval.red   { color:#ff4444;text-shadow:0 0 8px rgba(255,30,30,0.5);animation:timerPulse .55s ease-in-out infinite; }
        @keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}

        .gd-board-wrap { padding:12px 14px 14px;position:relative;z-index:1; }

        /* Side */
        .gd-side { display:flex;flex-direction:column;gap:14px; }

        /* Panel head */
        .dp-head { font-family:'Orbitron',monospace; font-size:11px; font-weight:700; letter-spacing:.18em; color:#00ff88; text-transform:uppercase; padding:10px 14px 9px; border-bottom:1px solid #1a3a6a; display:flex; align-items:center; gap:7px; text-shadow:0 0 10px rgba(0,255,136,0.4); position:relative; z-index:1; }
        .dp-head::after { content:'';flex:1;height:1px;background:linear-gradient(90deg,#1a3a6a,transparent); }
        .dp-body { padding:11px 14px;position:relative;z-index:1; }

        /* Player rows */
        .gd-prow { display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #0d1f35; }
        .gd-prow:last-child{border-bottom:none;}
        .gd-plbl { font-family:'Exo 2',sans-serif;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#3a6a9a; }
        .gd-pval { font-family:'Orbitron',monospace;font-size:14px;color:#c8e0ff; }
        .gd-pval.green { color:#00ff88; }

        /* Rank head */
        .gd-rhead { display:flex;justify-content:space-between;align-items:center;padding:10px 14px 9px;border-bottom:1px solid #1a3a6a;position:relative;z-index:1; }
        .gd-view { background:none;border:1px solid #1a3a6a;border-radius:5px;color:#3a6a9a;font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;cursor:pointer;transition:color .2s,border-color .2s;outline:none; }
        .gd-view:hover{color:#00ff88;border-color:#00ff88;}

        /* Ctrl buttons */
        .gd-ctrl { font-family:'Orbitron',monospace;font-size:13px;font-weight:700;letter-spacing:.08em;border:none;border-radius:8px;padding:13px;cursor:pointer;width:100%;position:relative;overflow:hidden;transition:transform .1s,filter .15s;outline:none;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%); }
        .gd-ctrl:hover{filter:brightness(1.12);transform:translateY(-2px);}
        .gd-ctrl:active{transform:translateY(3px)!important;}
        .gd-ctrl::after{content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:skewX(-20deg);transition:left .4s;pointer-events:none;}
        .gd-ctrl:hover::after{left:130%;}
        .ctrl-pause{background:linear-gradient(180deg,#1a55cc,#0a2a8a);color:#c8e0ff;box-shadow:0 5px 0 #050f40,0 7px 16px rgba(10,50,200,0.4);}
        .ctrl-exit {background:linear-gradient(180deg,#cc1a1a,#8a0a0a);color:#fff;box-shadow:0 5px 0 #4a0505,0 7px 16px rgba(200,10,10,0.4);}

        .gd-footer{text-align:center;margin-top:14px;font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#1a3a5a;}
      `}</style>

      <div className="gd-hud">
        <div className="gd-hud-dot" style={{ background: '#cc1a1a', boxShadow: '0 0 6px #ff2a2a' }} />
        {isNextLoading ? 'SYNCING RHYMES...' : 'RHYMEMONKEY — LIVE'}
        <div className="gd-hud-dot" style={{ background: isNextLoading ? '#ffaa00' : '#00ff88', boxShadow: isNextLoading ? '0 0 6px #ffaa00' : '0 0 6px #00ff88', animation: isNextLoading ? 'pulse 1s infinite' : 'none' }} />
      </div>

      <div className="gd-particles">
        {particles.map(p => (
          <div key={p.id} className="gd-part" style={{ left: p.left, width: p.size, height: p.size, background: p.color, animationDuration: p.dur, animationDelay: p.delay, boxShadow: `0 0 ${p.size * 3}px ${p.color}` }} />
        ))}
      </div>

      <div className="gd-bg">
        <div className="gd-inner">
          <div className="gd-grid">

            <div className="dp">
              <div className="gd-board-wrap">
                <GameBoard gameState={gameState} showError={showError} showSuccess={showSuccess} onInput={onInput} onSubmit={onSubmit} onSkip={onSkip} onPause={onPause} />
              </div>
            </div>

            <div className="gd-side">
              {player && (
                <div className="dp">
                  <div className="dp-head">🤖 Player</div>
                  <div className="dp-body">
                    {[
                      { l: 'Callsign', v: player.name, c: '' },
                      { l: 'Best Score', v: player.highScore, c: 'green' },
                      { l: 'Games', v: player.totalGames, c: '' },
                      { l: 'Average', v: Math.round(player.averageScore || 0), c: '' },
                    ].map(r => (
                      <div key={r.l} className="gd-prow">
                        <span className="gd-plbl">{r.l}</span>
                        <span className={`gd-pval ${r.c}`}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="dp">
                <div className="gd-rhead">
                  <div className="dp-head" style={{ padding: 0, border: 'none', flex: 1 }}>🏆 Rankings</div>
                  <button type="button" className="gd-view" onClick={onShowLeaderboard}>View all</button>
                </div>
                <div className="dp-body"><Leaderboard limit={5} /></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button type="button" className="gd-ctrl ctrl-pause" onClick={() => { playClick(); onPause(); }}>{gameState.isPaused ? '▶ RESUME' : '⏸ PAUSE'}</button>
                <button type="button" className="gd-ctrl ctrl-exit" onClick={() => { playClick(); onBackToMenu(); }}>✕ EXIT</button>
              </div>
            </div>
          </div>
          <div className="gd-footer">RHYMEMONKEY — by @dhani shende</div>
        </div>
      </div>
    </>
  );
}