'use client';

import { GamePresets } from './GamePresets';
import { PlayerRegistration } from './PlayerRegistration';
import { GameActions } from './GameActions';

interface GameMenuProps {
  playerName: string;
  selectedDifficulty: 'easy' | 'medium' | 'hard';
  selectedTime: number;
  error: string;
  onPlayerNameChange: (name: string) => void;
  onDifficultyChange: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onTimeChange: (time: number) => void;
  onStartGame: (gameMode: 'solo' | 'private') => void;
  onJoinRoom: (code: string) => void;
}

const particles = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 3.7 + 1) % 100}%`,
  delay: `${(i * 0.42) % 7}s`,
  dur: `${5 + (i % 5)}s`,
  size: [2, 3, 1.5][i % 3],
  color: i % 3 === 0 ? '#cc1a1a' : i % 3 === 1 ? '#00d4ff' : '#1a55cc',
}));

export function GameMenu({ playerName, selectedDifficulty, selectedTime, error, onPlayerNameChange, onDifficultyChange, onTimeChange, onStartGame, onJoinRoom }: GameMenuProps) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@600;700;800&display=swap');

        .gm-bg {
          min-height:100vh;
          background:
            radial-gradient(ellipse at 15% 20%,rgba(204,26,26,0.12) 0%,transparent 50%),
            radial-gradient(ellipse at 85% 80%,rgba(26,85,204,0.15) 0%,transparent 50%),
            radial-gradient(ellipse at 50% 50%,rgba(0,40,100,0.3) 0%,transparent 70%),
            linear-gradient(160deg,#050d1a 0%,#0a1628 100%);
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;position:relative;
          padding:32px 16px;font-family:'Exo 2',sans-serif;user-select:none;
        }

        /* Circuit grid */
        .gm-bg::before {
          content:'';position:fixed;inset:0;pointer-events:none;
          background-image:
            linear-gradient(rgba(26,85,204,0.06) 1px,transparent 1px),
            linear-gradient(90deg,rgba(26,85,204,0.06) 1px,transparent 1px);
          background-size:40px 40px;
          z-index:0;
        }

        /* Floating particles */
        .gm-particles { position:fixed;inset:0;pointer-events:none;z-index:0;overflow:hidden; }
        .gm-particle {
          position:absolute;bottom:-4px;border-radius:50%;
          animation:partFloat linear infinite;
        }
        @keyframes partFloat {
          0%   { transform:translateY(0) scale(1);opacity:0; }
          10%  { opacity:.8; }
          90%  { opacity:.6; }
          100% { transform:translateY(-105vh) scale(0.5);opacity:0; }
        }

        /* Card */
        .gm-card {
          position:relative;z-index:2;
          width:min(94vw, 840px);
          aspect-ratio: 16/9;
          background:linear-gradient(160deg,#0d1f35 0%,#080f1e 100%);
          border:2px solid #1a3a6a;border-radius:16px;
          box-shadow:
            0 0 0 1px #0d1f35,
            0 0 60px rgba(0,80,200,0.15),
            0 0 0 1px rgba(204,26,26,0.2),
            0 16px 48px rgba(0,0,0,0.7),
            inset 0 0 40px rgba(0,40,120,0.08);
          padding:36px 48px;
          display:flex;flex-direction:column; justify-content: space-between; gap:16px;
          animation:cardIn .45s cubic-bezier(0.34,1.56,0.64,1) both;
          overflow:hidden;
        }
        @keyframes cardIn{from{opacity:0;transform:translateY(-24px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}

        /* Top accent line */
        .gm-card::before {
          content:'';position:absolute;top:0;left:0;right:0;height:3px;
          background:linear-gradient(90deg,#1a55cc,#cc1a1a 50%,#1a55cc);
        }
        /* Scanlines */
        .gm-card::after {
          content:'';position:absolute;inset:0;pointer-events:none;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);
          border-radius:16px;
        }

        /* Corner brackets */
        .gm-corner {
          position:absolute;width:16px;height:16px;
          border-color:#cc1a1a;border-style:solid;
        }
        .gm-corner.tl { top:8px;left:8px;border-width:2px 0 0 2px; }
        .gm-corner.tr { top:8px;right:8px;border-width:2px 2px 0 0; }
        .gm-corner.bl { bottom:8px;left:8px;border-width:0 0 2px 2px; }
        .gm-corner.br { bottom:8px;right:8px;border-width:0 2px 2px 0; }

        /* Hero */
        .gm-hero { text-align:center;position:relative;z-index:1;padding:4px 0; }
        .gm-title {
          font-family:'Orbitron',monospace;font-weight:900;
          font-size:clamp(32px,7vw,52px);letter-spacing:.06em;
          background:linear-gradient(135deg,#cc1a1a 0%,#ff4444 35%,#c8e0ff 65%,#00d4ff 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
          text-shadow:none;
          animation:titleGlow 3s ease-in-out infinite alternate;
        }
        @keyframes titleGlow{
          from{filter:drop-shadow(0 0 8px rgba(204,26,26,0.6));}
          to  {filter:drop-shadow(0 0 8px rgba(0,180,255,0.6));}
        }
        .gm-sub {
          font-size:9px;font-weight:800;letter-spacing:.28em;text-transform:uppercase;
          color:#3a6a9a;margin-top:5px;
        }

        /* Divider */
        .gm-div {
          height:1px;
          background:linear-gradient(90deg,transparent,#1a3a6a 30%,#cc1a1a 50%,#1a3a6a 70%,transparent);
          position:relative;z-index:1;
        }
        /* Layout split */
        .gm-content-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          position: relative;
          z-index: 1;
          flex: 1;
        }
        @media (max-width: 768px) {
          .gm-content-split { grid-template-columns: 1fr; }
        }
        .gm-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: space-between;
        }
      `}</style>

      <div className="gm-particles">
        {particles.map(p => (
          <div key={p.id} className="gm-particle" style={{
            left: p.left, width: p.size, height: p.size,
            background: p.color, animationDuration: p.dur, animationDelay: p.delay,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }} />
        ))}
      </div>

      <div className="gm-bg">
        <div className="gm-card">
          <div className="gm-corner tl" /><div className="gm-corner tr" />
          <div className="gm-corner bl" /><div className="gm-corner br" />

          <div className="gm-hero" style={{ position: 'relative', zIndex: 1 }}>
            <h1 className="gm-title">RHYMEMONKEY</h1>
            <p className="gm-sub">// Rhyme before the clock hits zero</p>
          </div>

          <div className="gm-div" style={{ marginBottom: '8px' }} />
          
          <div className="gm-content-split">
            {/* Left side: Config */}
            <div className="gm-col">
              <GamePresets selectedDifficulty={selectedDifficulty} selectedTime={selectedTime} onDifficultyChange={onDifficultyChange} onTimeChange={onTimeChange} />
            </div>

            {/* Right side: Player & Actions */}
            <div className="gm-col">
              <PlayerRegistration playerName={playerName} onPlayerNameChange={onPlayerNameChange} error={error} />
              <GameActions onStartGame={onStartGame} onJoinRoom={onJoinRoom} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}