'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Player } from '@/lib/types';
import { useAudio } from '@/context/AudioContext';
import { MonkeyCharacter } from './MonkeyCharacter';

interface LeaderboardProps { limit?: number; }

const RANK = {
  1: { icon: '🥇', color: '#00ff88', bg: 'rgba(0,255,136,0.06)', border: 'rgba(0,255,136,0.3)' },
  2: { icon: '🥈', color: '#00d4ff', bg: 'rgba(0,212,255,0.05)', border: 'rgba(0,212,255,0.2)' },
  3: { icon: '🥉', color: '#c8e0ff', bg: 'rgba(200,224,255,0.04)', border: 'rgba(200,224,255,0.2)' },
} as Record<number, { icon: string; color: string; bg: string; border: string }>;

export function Leaderboard({ limit = 10 }: LeaderboardProps) {
  const { playClick } = useAudio();
  const [data, setData] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      setLoading(true);
      const r = await fetch(`/api/players?limit=${limit}`);
      if (r.ok) { const d = await r.json(); setData(d.leaderboard); }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [limit]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@600;700;800&display=swap');
        
        .dp {
          background:linear-gradient(160deg,#0d1f35,#080f1e);
          border:2px solid #1a3a6a;border-radius:14px;overflow:hidden;position:relative;
          box-shadow:0 0 0 1px #0d1f35,0 10px 32px rgba(0,0,0,0.6),inset 0 0 20px rgba(0,30,80,0.08);
        }
        .dp::before { content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#1a55cc 30%,#cc1a1a 70%,transparent); }
        .dp::after { content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px);border-radius:14px; }

        .dp-head { font-family:'Orbitron',monospace; font-size:11px; font-weight:700; letter-spacing:.18em; color:#00ff88; text-transform:uppercase; padding:12px 16px 11px; border-bottom:1px solid #1a3a6a; display:flex; align-items:center; gap:10px; text-shadow:0 0 10px rgba(0,255,136,0.4); position:relative; z-index:1; }
        .dp-head::after { content:'';flex:1;height:1px;background:linear-gradient(90deg,#1a3a6a,transparent); }
        .dp-body { padding:4px 0; position:relative; z-index:1; }

        .lb-refresh{background:none;border:1px solid #1a3a6a;border-radius:5px;color:#3a6a9a;font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:4px 10px;cursor:pointer;transition:color .2s,border-color .2s;outline:none;}
        .lb-refresh:hover{color:#00ff88;border-color:#00ff88;}

        .lb-loading{text-align:center;padding:40px 0;font-family:'Orbitron',monospace;font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;animation:lbPulse 1.5s infinite;}
        @keyframes lbPulse{0%,100%{opacity:.5}50%{opacity:1}}

        .lb-prow { display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #0d1f35;transition:background .2s,transform .15s; }
        .lb-prow:last-child{border-bottom:none;}
        .lb-prow:hover{background:rgba(26,85,204,0.05);transform:translateX(4px);}
        
        .lb-left{display:flex;align-items:center;gap:12px;}
        .lb-rank{font-family:'Orbitron',monospace;font-size:12px;font-weight:900;width:28px;color:#3a6a9a;}
        .lb-info{}
        .lb-name{font-family:'Orbitron',monospace;font-size:14px;color:#c8e0ff;display:block;margin-bottom:2px;}
        .lb-sub{font-family:'Exo 2',sans-serif;font-size:9px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:#3a6a9a;}
        
        .lb-right{text-align:right;}
        .lb-score{font-family:'Orbitron',monospace;font-size:18px;color:#00ff88;font-weight:700;line-height:1;display:block;}
        .lb-label{font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#3a6a9a;}

        .lb-foot{font-family:'Orbitron',monospace;font-size:9px;color:#1a3a5a;text-align:center;padding:12px;letter-spacing:.2em;text-transform:uppercase;}
      `}</style>

      <div className="dp">
        <div className="dp-head">
          <div style={{ transform: 'translateY(-2px)' }}>
            <MonkeyCharacter mood="idle" size={32} />
          </div>
          🏆 GLOBAL RANKINGS
          <div style={{ flex: 1 }} />
          <button type="button" className="lb-refresh" onClick={() => { playClick(); fetch_(); }}>↺ REFR_ESH</button>
        </div>
        
        <div className="dp-body">
          {loading ? (
            <div className="lb-loading">📡 SYNCING_RECORDS...</div>
          ) : data.length === 0 ? (
            <div className="lb-loading" style={{ opacity: 0.6 }}>// NO_DATA_AVAILABLE</div>
          ) : (
            <>
              {data.map((p, i) => {
                const rank = i + 1;
                const m = RANK[rank];
                return (
                  <div key={p.id} className="lb-prow" style={m ? { background: m.bg } : {}}>
                    <div className="lb-left">
                      <span className="lb-rank" style={{ color: m ? m.color : '#3a6a9a' }}>
                        {rank.toString().padStart(2, '0')}
                      </span>
                      <div className="lb-info">
                        <span className="lb-name">{p.name}</span>
                        <span className="lb-sub">
                          Avg: {Math.round(p.averageScore || 0)} · Games: {p.totalGames}
                        </span>
                      </div>
                    </div>
                    <div className="lb-right">
                      <span className="lb-score" style={{ color: m ? m.color : '#00ff88' }}>
                        {p.highScore.toLocaleString()}
                      </span>
                      <span className="lb-label">HIGH_SCORE</span>
                    </div>
                  </div>
                );
              })}
              <div className="lb-foot">SYNC_COMPLETE // NODE_ACTIVE</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}