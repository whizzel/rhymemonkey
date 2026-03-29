'use client';
// ─────────────────────────────────────────────────────────────────────────────
// GameOver.tsx
// ─────────────────────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import { MonkeyCharacter } from './MonkeyCharacter';
import type { GameState, Player } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';

interface GameOverProps {
  gameState: GameState;
  player: Player | null;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onShowLeaderboard: () => void;
}

function getPerf(acc: number): { msg: string; mood: 'happy' | 'excited' | 'sad' | 'idle'; stars: number } {
  if (acc >= 95) return { msg: 'PERFECT RUN', mood: 'excited', stars: 3 };
  if (acc >= 85) return { msg: 'EXCELLENT', mood: 'excited', stars: 3 };
  if (acc >= 75) return { msg: 'GREAT JOB', mood: 'happy', stars: 2 };
  if (acc >= 60) return { msg: 'GOOD EFFORT', mood: 'happy', stars: 2 };
  if (acc >= 40) return { msg: 'KEEP GOING', mood: 'idle', stars: 1 };
  return { msg: 'TRY AGAIN', mood: 'sad', stars: 1 };
}
function scoreColor(s: number) {
  if (s >= 500) return '#ff2a2a';
  if (s >= 300) return '#00d4ff';
  if (s >= 150) return '#1a99ff';
  return '#c8e0ff';
}

export function GameOver({ gameState, player, onPlayAgain, onBackToMenu, onShowLeaderboard }: GameOverProps) {
  const { playClick } = useAudio();
  const [vis, setVis] = useState(false);
  const [stars, setStars] = useState(0);
  const perf = getPerf(gameState.accuracy);
  const isHigh = player && gameState.score >= player.highScore;

  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);
  useEffect(() => {
    if (!vis) return;
    let i = 0; const iv = setInterval(() => { i++; setStars(i); if (i >= perf.stars) clearInterval(iv); }, 350);
    return () => clearInterval(iv);
  }, [vis, perf.stars]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@700;800&display=swap');
        .go-wrap{font-family:'Exo 2',sans-serif;background:linear-gradient(160deg,#0d1f35,#080f1e);border:2px solid #1a3a6a;border-radius:14px;box-shadow:0 0 0 1px #0d1f35,0 0 40px rgba(0,50,150,0.15),0 14px 44px rgba(0,0,0,0.7),inset 0 0 30px rgba(0,30,80,0.08);overflow:hidden;position:relative;opacity:0;transform:translateY(-20px) scale(0.96);transition:opacity .4s,transform .4s cubic-bezier(0.34,1.56,0.64,1);}
        .go-wrap::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#1a55cc 30%,#cc1a1a 70%,transparent);}
        .go-wrap::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);border-radius:14px;}
        .go-wrap.vis{opacity:1;transform:translateY(0) scale(1);}
        .go-body{padding:18px 20px 20px;display:flex;flex-direction:column;align-items:center;gap:12px;position:relative;z-index:1;}
        .go-title{font-family:'Orbitron',monospace;font-weight:900;font-size:32px;background:linear-gradient(135deg,#ff2a2a,#c8e0ff 60%,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:titleGlow 2s ease-in-out infinite alternate;letter-spacing:.06em;}
        @keyframes titleGlow{from{filter:drop-shadow(0 0 8px rgba(255,30,30,0.6))}to{filter:drop-shadow(0 0 8px rgba(0,180,255,0.6))}}
        .go-perf{font-family:'Orbitron',monospace;font-size:14px;color:#6a9ac0;letter-spacing:.1em;}
        .go-stars{display:flex;gap:6px;}
        .go-star{font-size:24px;filter:grayscale(1) brightness(.3);transition:filter .3s,transform .3s;}
        .go-star.lit{filter:none;animation:starPop .35s cubic-bezier(0.34,1.56,0.64,1) both;}
        @keyframes starPop{from{transform:scale(0) rotate(-30deg)}to{transform:scale(1) rotate(0)}}
        .go-best{display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#cc1a1a,#ff4444);color:#fff;border-radius:20px;padding:5px 14px;font-family:'Orbitron',monospace;font-size:12px;font-weight:700;box-shadow:0 3px 0 #4a0505,0 0 20px rgba(255,30,30,0.4);animation:starPop .4s cubic-bezier(0.34,1.56,0.64,1) .6s both;}
        .go-div{width:100%;height:1px;background:linear-gradient(90deg,transparent,#1a3a6a 30%,#cc1a1a 50%,#1a3a6a 70%,transparent);}
        .go-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;width:100%;}
        .go-sc{background:#060f1e;border:1px solid #1a3a6a;border-radius:8px;padding:8px 12px;display:flex;flex-direction:column;gap:1px;}
        .go-sl{font-size:7px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;}
        .go-sv{font-family:'Orbitron',monospace;font-size:20px;color:#c8e0ff;line-height:1;}
        .go-ps{width:100%;background:#060f1e;border:1px solid #1a3a6a;border-radius:8px;padding:8px 12px;}
        .go-pl{font-size:7px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#3a6a9a;margin-bottom:6px;}
        .go-pr{display:flex;justify-content:space-around;}
        .go-pc{text-align:center;}
        .go-pc-l{font-size:8px;font-weight:800;color:#3a6a9a;margin-bottom:1px;}
        .go-pc-v{font-family:'Orbitron',monospace;font-size:16px;color:#c8e0ff;}
        .go-pc-v.cyan{color:#00d4ff;text-shadow:0 0 8px rgba(0,180,255,0.5);}
        .g-btn2{font-family:'Orbitron',monospace;font-weight:700;font-size:13px;letter-spacing:.08em;border:none;border-radius:8px;padding:13px;cursor:pointer;width:100%;position:relative;overflow:hidden;transition:transform .1s,filter .15s;outline:none;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);}
        .g-btn2:hover{filter:brightness(1.15);transform:translateY(-2px);}
        .g-btn2:active{transform:translateY(3px)!important;}
        .g-btn2::after{content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:skewX(-20deg);transition:left .4s;pointer-events:none;}
        .g-btn2:hover::after{left:130%;}
        .b-red{background:linear-gradient(180deg,#cc1a1a,#8a0a0a);color:#fff;box-shadow:0 5px 0 #4a0505,0 7px 16px rgba(200,10,10,0.4);}
        .b-blue{background:linear-gradient(180deg,#1a55cc,#0a2a8a);color:#c8e0ff;box-shadow:0 5px 0 #050f40,0 7px 16px rgba(10,50,200,0.4);}
        .b-dark{background:linear-gradient(180deg,#1a2a40,#0d1525);color:#6a9ac0;box-shadow:0 5px 0 #060c18,0 7px 14px rgba(0,0,0,0.5);border:1px solid #1a3a6a;}
        .go-grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;width:100%;}
      `}</style>
      <div className={`go-wrap ${vis ? 'vis' : ''}`}>
        <div className="go-body">
          <div className="go-title">GAME OVER</div>
          <MonkeyCharacter mood={perf.mood} size={80} />
          <div className="go-perf">// {perf.msg}</div>
          <div className="go-stars">
            {[1, 2, 3].map(n => (
              <span key={n} className={`go-star ${stars >= n ? 'lit' : ''}`} style={{ animationDelay: `${(n - 1) * .15}s` }}>⭐</span>
            ))}
          </div>
          {isHigh && <div className="go-best">⚡ NEW HIGH SCORE!</div>}
          <div className="go-div" />
          <div className="go-stats">
            <div className="go-sc"><div className="go-sl">Final Score</div><div className="go-sv" style={{ color: scoreColor(gameState.score) }}>{gameState.score}</div></div>
            <div className="go-sc"><div className="go-sl">Words Done</div><div className="go-sv">{gameState.wordsCompleted}</div></div>
            <div className="go-sc"><div className="go-sl">Accuracy</div><div className="go-sv">{gameState.accuracy}%</div></div>
            <div className="go-sc"><div className="go-sl">Time Used</div><div className="go-sv">{gameState.timeLimit - gameState.timeRemaining}s</div></div>
          </div>
          {player && (
            <div className="go-ps">
              <div className="go-pl">// Your stats</div>
              <div className="go-pr">
                <div className="go-pc"><div className="go-pc-l">Best</div><div className="go-pc-v cyan">{player.highScore}</div></div>
                <div className="go-pc"><div className="go-pc-l">Games</div><div className="go-pc-v">{player.totalGames}</div></div>
                <div className="go-pc"><div className="go-pc-l">Avg</div><div className="go-pc-v">{Math.round(player.averageScore)}</div></div>
              </div>
            </div>
          )}
          <div className="go-div" />
          <button type="button" className="g-btn2 b-red" style={{ fontSize: 16, padding: '12px' }} onClick={() => { playClick(); onPlayAgain(); }}>⚡ PLAY AGAIN</button>
          <div className="go-grid2">
            <button type="button" className="g-btn2 b-dark" onClick={() => { playClick(); onBackToMenu(); }}>⌂ MENU</button>
            <button type="button" className="g-btn2 b-blue" onClick={() => { playClick(); onShowLeaderboard(); }}>🏆 RANKINGS</button>
          </div>
        </div>
      </div>
    </>
  );
}