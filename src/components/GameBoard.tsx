'use client';

import { useEffect, useRef, useState } from 'react';
import { MonkeyCharacter, type MonkeyMood } from './MonkeyCharacter';
import type { GameState } from '@/lib/types';

interface GameBoardProps {
  gameState: GameState;
  showError: boolean;
  showSuccess: boolean;
  onInput: (value: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onPause: () => void;
}

function getMood(err: boolean, ok: boolean): MonkeyMood {
  if (err) return 'sad';
  if (ok) return 'happy';
  return 'idle';
}

export function GameBoard({ gameState, showError, showSuccess, onInput, onSubmit, onSkip, onPause }: GameBoardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [scorePop, setScorePop] = useState(false);
  const [lastScore, setLastScore] = useState(gameState.score);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused) inputRef.current?.focus();
  }, [gameState.isPlaying, gameState.isPaused]);

  useEffect(() => {
    if (gameState.score !== lastScore) {
      setScorePop(true); setLastScore(gameState.score);
      setTimeout(() => setScorePop(false), 380);
    }
  }, [gameState.score]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const isLow = gameState.timeRemaining <= 10;
  const isMid = gameState.timeRemaining <= 30;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@600;700;800&display=swap');

        .gb-root {
          font-family:'Exo 2',sans-serif;
          position:relative; overflow:hidden;
          background:linear-gradient(160deg,#0d1f35 0%,#050d1a 100%);
          border:2px solid #1a3a6a;
          border-radius:14px;
          box-shadow:0 0 0 1px #0d2a50, inset 0 0 40px rgba(0,80,180,0.08);
          padding:20px;
          display:flex; flex-direction:column; gap:16px;
        }
        /* Scanline overlay */
        .gb-root::after {
          content:'';
          position:absolute; inset:0; pointer-events:none;
          background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.06) 3px,rgba(0,0,0,0.06) 4px);
          border-radius:14px;
        }

        /* Stats */
        .gb-stats { display:flex; gap:10px; justify-content:space-between; }
        .gb-stat {
          background:#060f1e; border:1px solid #1a3a6a; border-radius:8px;
          padding:7px 12px; text-align:center; flex:1;
          box-shadow:inset 0 0 10px rgba(0,60,140,0.2);
        }
        .gb-lbl { font-size:8px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:#3a6a9a; margin-bottom:2px; }
        .gb-val { font-family:'Orbitron',monospace; font-size:22px; color:#c8e0ff; line-height:1; transition:transform .15s,color .15s; }
        .gb-val.pop    { transform:scale(1.5); color:#ff2a2a; }
        .gb-val.green  { color:#00ff88; }
        .gb-val.warn   { color:#ffaa00; }
        .gb-val.danger { color:#ff2a2a; animation:timerPulse .55s ease-in-out infinite; }
        @keyframes timerPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}

        /* Middle row */
        .gb-mid { display:flex; align-items:center; gap:14px; }

        /* Word display */
        .gb-word-panel {
          flex:1;
          background:#060f1e; border:1px solid #1a3a6a; border-radius:12px;
          padding:22px 18px; text-align:center;
          box-shadow:0 0 20px rgba(0,100,255,0.1),inset 0 0 20px rgba(0,40,100,0.2);
          position:relative; overflow:hidden;
        }
        .gb-word-panel::before {
          content:''; position:absolute; top:0;left:0;right:0;height:2px;
          background:linear-gradient(90deg,transparent,#00d4ff,transparent);
        }
        .gb-word-label { font-size:9px; font-weight:800; letter-spacing:.2em; text-transform:uppercase; color:#3a6a9a; margin-bottom:10px; }
        .gb-word { font-family:'Orbitron',monospace; font-size:42px; color:#c8e0ff; text-shadow:0 0 20px rgba(0,180,255,0.5); letter-spacing:.08em; line-height:1; }

        /* Input */
        .gb-input {
          font-family:'Orbitron',monospace; font-size:22px; text-align:center;
          width:100%; background:#060f1e; border:2px solid #1a3a6a; border-radius:10px;
          padding:13px 16px; color:#c8e0ff; outline:none;
          box-shadow:inset 0 0 14px rgba(0,40,100,0.3);
          transition:border-color .2s,box-shadow .2s; letter-spacing:.06em;
        }
        .gb-input::placeholder { color:#1a3a5a; font-size:16px; }
        .gb-input:focus  { border-color:#00d4ff; box-shadow:0 0 0 3px rgba(0,180,255,0.15),inset 0 0 14px rgba(0,40,100,0.3); }
        .gb-input.error  { border-color:#ff2a2a; box-shadow:0 0 0 3px rgba(255,30,30,0.2); color:#ff8888; animation:gbShake .45s ease-in-out; }
        .gb-input.ok     { border-color:#00ff88; box-shadow:0 0 0 3px rgba(0,255,136,0.2); color:#00ff88; animation:gbPop .4s ease-out; }
        @keyframes gbShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes gbPop{0%{transform:scale(1)}50%{transform:scale(1.02)}100%{transform:scale(1)}}

        /* Flash */
        .gb-flash { position:absolute;inset:0;border-radius:14px;pointer-events:none;z-index:10;animation:flashOut .5s ease-out forwards; }
        .gb-flash.err { background:rgba(255,30,30,0.12); }
        .gb-flash.ok  { background:rgba(0,255,136,0.1); }
        @keyframes flashOut{0%{opacity:1}100%{opacity:0}}

        /* Buttons */
        .gb-btns { display:flex; gap:10px; }
        .gb-btn {
          font-family:'Orbitron',monospace; font-size:13px; font-weight:700; letter-spacing:.08em;
          border:none; border-radius:8px; padding:12px 18px;
          cursor:pointer; position:relative; overflow:hidden;
          transition:transform .1s,filter .15s; outline:none; user-select:none;
          clip-path:polygon(6px 0%,100% 0%,calc(100% - 6px) 100%,0% 100%);
        }
        .gb-btn:hover:not(:disabled)  { filter:brightness(1.15); transform:translateY(-2px); }
        .gb-btn:active:not(:disabled) { transform:translateY(3px)!important; }
        .gb-btn:disabled { opacity:.35; cursor:not-allowed; }
        .gb-btn::after {
          content:''; position:absolute; top:0;left:-80%;width:60%;height:100%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
          transform:skewX(-20deg); transition:left .4s; pointer-events:none;
        }
        .gb-btn:hover::after { left:130%; }

        .btn-skip   { background:linear-gradient(180deg,#1a3a5a,#0d1f35); color:#6a9ac0; box-shadow:0 4px 0 #060f1e,0 5px 12px rgba(0,0,0,0.5); border:1px solid #1a3a6a; }
        .btn-submit { flex:1; background:linear-gradient(180deg,#cc1a1a,#8a0a0a); color:#fff; box-shadow:0 4px 0 #4a0505,0 5px 14px rgba(200,10,10,0.4); font-size:15px; }
        .btn-pause  { background:linear-gradient(180deg,#1a55cc,#0a2a8a); color:#c8e0ff; box-shadow:0 4px 0 #060f1e,0 5px 12px rgba(10,50,200,0.4); border:1px solid #2a4a9a; }

        /* Pause overlay */
        .gb-pause {
          position:absolute;inset:0;background:rgba(5,13,26,0.92);
          backdrop-filter:blur(6px);border-radius:14px;
          display:flex;align-items:center;justify-content:center;z-index:20;
          animation:fadeIn .2s ease;
        }
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .gb-pause-title { font-family:'Orbitron',monospace; font-size:36px; font-weight:900; color:#00d4ff; text-shadow:0 0 20px rgba(0,180,255,0.6); margin:12px 0 20px; }
      `}</style>

      <div className="gb-root">
        {showError && <div className="gb-flash err" />}
        {showSuccess && <div className="gb-flash ok" />}

        <div className="gb-stats">
          {[
            { lbl: 'Score', val: gameState.score, cls: scorePop ? 'pop' : '' },
            { lbl: 'Words', val: gameState.wordsCompleted, cls: '' },
            { lbl: 'Accuracy', val: `${gameState.accuracy}%`, cls: 'green' },
            { lbl: 'Time', val: fmt(gameState.timeRemaining), cls: isLow ? 'danger' : isMid ? 'warn' : 'green' },
          ].map(s => (
            <div key={s.lbl} className="gb-stat">
              <div className="gb-lbl">{s.lbl}</div>
              <div className={`gb-val ${s.cls}`}>{s.val}</div>
            </div>
          ))}
        </div>

        <div className="gb-mid">
          <div className="gb-word-panel">
            <div className="gb-word-label">⚡ Rhyme this word</div>
            <div className="gb-word">{gameState.currentWord.toUpperCase()}</div>
          </div>
          <MonkeyCharacter mood={getMood(showError, showSuccess)} size={108} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={gameState.userInput}
          onChange={e => onInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSubmit(); } }}
          className={`gb-input ${showError ? 'error' : showSuccess ? 'ok' : ''}`}
          placeholder="enter your rhyme..."
          disabled={!gameState.isPlaying || gameState.isPaused}
        />

        <div className="gb-btns">
          <button type="button" className="gb-btn btn-skip" onClick={onSkip} disabled={!gameState.isPlaying || gameState.isPaused}>⏭ SKIP</button>
          <button type="button" className="gb-btn btn-submit" onClick={onSubmit} disabled={!gameState.isPlaying || gameState.isPaused}>⚡ SUBMIT</button>
          <button type="button" className="gb-btn btn-pause" onClick={onPause} disabled={!gameState.isPlaying}>{gameState.isPaused ? '▶' : '⏸'}</button>
        </div>

        {gameState.isPaused && (
          <div className="gb-pause">
            <div style={{ textAlign: 'center' }}>
              <MonkeyCharacter mood="idle" size={100} />
              <div className="gb-pause-title">// PAUSED</div>
              <button type="button" className="gb-btn btn-submit" style={{ fontSize: 16, padding: '14px 36px' }} onClick={onPause}>▶ RESUME</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}