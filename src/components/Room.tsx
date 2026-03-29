'use client';
// ─── Room.tsx ────────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { MonkeyCharacter } from './MonkeyCharacter';
import type { Player, Room as RoomType } from '@/lib/types';

interface RoomProps {
  player: Player;
  room: RoomType | null;
  gameMode: 'solo' | 'private';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  onStartGame: () => void;
  onBackToMenu: () => void;
  onGameStart?: () => void;
}

const DIFF_META = {
  easy: { label: 'EASY', color: '#0a7a0a' },
  medium: { label: 'MEDIUM', color: '#cc8800' },
  hard: { label: 'HARD', color: '#cc1a1a' },
};

export function Room({ player, room: initialRoom, gameMode, difficulty, timeLimit, onStartGame, onBackToMenu, onGameStart }: RoomProps) {
  const [room, setRoom] = useState<RoomType | null>(initialRoom);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  // Poll for room updates if in private mode
  useEffect(() => {
    if (gameMode !== 'private' || !room) return;

    const poll = async () => {
      try {
        const resp = await fetch(`/api/rooms/${room.code}`);
        if (resp.ok) {
          const { room: updatedRoom } = await resp.json();
          setRoom(updatedRoom);
          
          // If status changed to playing, start the countdown
          if (updatedRoom.status === 'playing' && countdown === null) {
            setCountdown(3);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    const interval = setInterval(poll, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [gameMode, room, countdown]);

  // Handle countdown and game start
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) { const t = setTimeout(() => setCountdown(c => (c ?? 1) - 1), 1000); return () => clearTimeout(t); }
    else { onStartGame(); onGameStart?.(); setCountdown(null); }
  }, [countdown, onStartGame, onGameStart]);

  const handleStart = async () => {
    if (gameMode === 'solo') {
      setCountdown(3);
    } else if (room) {
      // Update room status on server
      await fetch(`/api/rooms/${room.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'playing' })
      });
      // Polling will pick this up for other players
    }
  };

  const handleExit = async () => {
    if (gameMode === 'private' && room) {
      await fetch(`/api/rooms/${room.code}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: player.id })
      });
    }
    onBackToMenu();
  };

  const displayPlayers = room ? room.players : [player];
  const displayCode = room ? room.code : '';
  const isHost = room ? room.hostId === player.id : true;

  const diff = DIFF_META[difficulty];

  if (countdown !== null) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@700&display=swap');
        .room-cd-bg{min-height:100vh;background:linear-gradient(160deg,#050d1a,#080f1e);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;font-family:'Exo 2',sans-serif;}
        .room-cd-bg::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(26,85,204,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,85,204,0.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;}
        .room-cd-lbl{font-size:9px;font-weight:800;letter-spacing:.25em;text-transform:uppercase;color:#3a6a9a;}
        .room-cd-num{font-family:'Orbitron',monospace;font-weight:900;font-size:110px;line-height:1;color:#ff2a2a;text-shadow:0 0 30px rgba(255,30,30,0.7),0 0 60px rgba(255,30,30,0.3);animation:cdSlam .85s cubic-bezier(0.34,1.56,0.64,1) forwards;}
        @keyframes cdSlam{from{transform:scale(1.8) rotate(-5deg);opacity:0}50%{transform:scale(0.9) rotate(2deg);opacity:1}to{transform:scale(1) rotate(0);opacity:1}}
      `}</style>
      <div className="room-cd-bg">
        <MonkeyCharacter mood="excited" size={110} />
        <div className="room-cd-lbl">// Initializing...</div>
        <div key={countdown} className="room-cd-num">{countdown}</div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@600;700;800&display=swap');
        .room-bg{min-height:100vh;background:radial-gradient(ellipse at 15% 20%,rgba(204,26,26,0.1) 0%,transparent 45%),radial-gradient(ellipse at 85% 80%,rgba(26,85,204,0.12) 0%,transparent 45%),linear-gradient(160deg,#050d1a,#080f1e);display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative;padding:32px 16px;font-family:'Exo 2',sans-serif;user-select:none;}
        .room-bg::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(26,85,204,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,85,204,0.05) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;}
        .room-inner{position:relative;z-index:1;width:100%;max-width:620px;display:flex;flex-direction:column;gap:14px;}
        .rp{background:linear-gradient(160deg,#0d1f35,#080f1e);border:2px solid #1a3a6a;border-radius:14px;overflow:hidden;position:relative;box-shadow:0 0 0 1px #0d1f35,0 10px 32px rgba(0,0,0,0.6),inset 0 0 20px rgba(0,30,80,0.07);}
        .rp::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#1a55cc 30%,#cc1a1a 70%,transparent);}
        .rp::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);border-radius:14px;}
        .rp-body{padding:24px 20px;display:flex;flex-direction:column;align-items:center;gap:18px;position:relative;z-index:1;}
        .r-mode{display:inline-flex;align-items:center;gap:6px;background:rgba(26,85,204,0.12);border:1px solid #1a3a6a;border-radius:20px;padding:5px 14px;font-size:9px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#6a9ac0;}
        .r-code-lbl{font-size:8px;font-weight:800;letter-spacing:.22em;text-transform:uppercase;color:#3a6a9a;margin-bottom:6px;text-align:center;}
        .r-code{font-family:'Orbitron',monospace;font-weight:900;font-size:40px;color:#ff2a2a;text-shadow:0 0 20px rgba(255,30,30,0.5);letter-spacing:.15em;line-height:1;}
        .r-copy-btn{font-family:'Orbitron',monospace;font-size:12px;font-weight:700;letter-spacing:.08em;border:none;border-radius:7px;padding:9px 18px;cursor:pointer;position:relative;overflow:hidden;transition:transform .1s,filter .15s;outline:none;background:linear-gradient(180deg,#1a2a40,#0d1525);color:#6a9ac0;box-shadow:0 4px 0 #060c18;border:1px solid #1a3a6a;margin-top:8px;clip-path:polygon(5px 0%,100% 0%,calc(100% - 5px) 100%,0% 100%);}
        .r-copy-btn:hover{filter:brightness(1.2);transform:translateY(-2px);}
        .r-copy-btn.copied{background:linear-gradient(180deg,#0a7a0a,#064806);color:#fff;box-shadow:0 4px 0 #032802;border-color:transparent;}
        .r-div{width:100%;height:1px;background:linear-gradient(90deg,transparent,#1a3a6a 30%,#cc1a1a 50%,#1a3a6a 70%,transparent);}
        .r-players{display:flex;flex-wrap:wrap;justify-content:center;gap:7px;width:100%;}
        .r-chip{display:flex;align-items:center;gap:6px;background:#060f1e;border:1px solid #1a3a6a;border-radius:7px;padding:7px 12px;font-family:'Orbitron',monospace;font-size:13px;color:#c8e0ff;box-shadow:0 3px 0 #030710;animation:chipIn .3s cubic-bezier(0.34,1.56,0.64,1) both;}
        @keyframes chipIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        .r-you{font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;background:#cc1a1a;color:#fff;border-radius:4px;padding:1px 5px;}
        .r-pill{display:inline-flex;align-items:center;gap:5px;border-radius:8px;padding:6px 14px;font-family:'Orbitron',monospace;font-size:12px;font-weight:700;letter-spacing:.06em;box-shadow:0 3px 0 rgba(0,0,0,0.3);}
        .r-wait{font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;}
        .r-wait-dots span{display:inline-block;animation:dotB .8s ease-in-out infinite;}
        .r-wait-dots span:nth-child(2){animation-delay:.15s;}
        .r-wait-dots span:nth-child(3){animation-delay:.3s;}
        @keyframes dotB{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        .r-btns{display:flex;gap:10px;width:100%;}
        .r-btn{font-family:'Orbitron',monospace;font-size:13px;font-weight:700;letter-spacing:.08em;border:none;border-radius:8px;padding:13px;cursor:pointer;flex:1;position:relative;overflow:hidden;transition:transform .1s,filter .15s;outline:none;clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);}
        .r-btn:hover{filter:brightness(1.12);transform:translateY(-2px);}
        .r-btn:active{transform:translateY(3px)!important;}
        .r-btn::after{content:'';position:absolute;top:0;left:-80%;width:60%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);transform:skewX(-20deg);transition:left .4s;pointer-events:none;}
        .r-btn:hover::after{left:130%;}
        .rb-exit {background:linear-gradient(180deg,#1a2a40,#0d1525);color:#6a9ac0;box-shadow:0 5px 0 #060c18;border:1px solid #1a3a6a;}
        .rb-start{background:linear-gradient(180deg,#cc1a1a,#8a0a0a);color:#fff;box-shadow:0 5px 0 #4a0505,0 7px 16px rgba(200,10,10,0.4);}
        .room-footer{text-align:center;font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#1a3a5a;}
      `}</style>

      <div className="room-bg">
        <div className="room-inner">
          <div className="rp">
            <div className="rp-body">
              <div className="r-mode">{gameMode === 'solo' ? '🤖 Solo Mode' : '🎮 Private Room'}</div>
              <MonkeyCharacter mood="idle" size={100} />

              {gameMode === 'private' && (
                <div style={{ textAlign: 'center' }}>
                  <div className="r-code-lbl">// Share this code</div>
                  <div className="r-code">{displayCode}</div>
                  <button type="button" className={`r-copy-btn ${copied ? 'copied' : ''}`}
                    onClick={() => { if (displayCode) { navigator.clipboard.writeText(displayCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } }}>
                    {copied ? '✓ COPIED' : '⊕ COPY CODE'}
                  </button>
                </div>
              )}

              <div className="r-div" />

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                <div className="r-pill" style={{ background: `${diff.color}18`, border: `1px solid ${diff.color}40`, color: diff.color }}>{diff.label}</div>
                <div className="r-pill" style={{ background: 'rgba(26,85,204,0.12)', border: '1px solid #1a3a6a', color: '#00d4ff' }}>⏱ {timeLimit}s</div>
              </div>

              <div className="r-players">
                {displayPlayers.map((p: Player, i: number) => (
                  <div key={p.id} className="r-chip" style={{ animationDelay: `${i * .08}s` }}>
                    🤖 {p.name}
                    {p.id === player.id && <span className="r-you">YOU</span>}
                  </div>
                ))}
              </div>

              {gameMode === 'private' && (
                <div className="r-wait">Waiting for players<span className="r-wait-dots"><span>.</span><span>.</span><span>.</span></span></div>
              )}

              <div className="r-div" />

              <div className="r-btns">
                <button type="button" className="r-btn rb-exit" onClick={handleExit}>✕ EXIT</button>
                {isHost && (
                  <button type="button" className="r-btn rb-start" onClick={handleStart}>⚡ START</button>
                )}
              </div>
            </div>
          </div>
          <div className="room-footer">// RHYMEMONKEY — by @aarushe_reddy</div>
        </div>
      </div>
    </>
  );
}