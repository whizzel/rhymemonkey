'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Player } from '@/lib/types';

interface LeaderboardProps { limit?: number; }

const RANK = {
  1: { icon: '🥇', color: '#ffd700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.2)' },
  2: { icon: '🥈', color: '#c0d0e0', bg: 'rgba(192,208,224,0.07)', border: 'rgba(192,208,224,0.15)' },
  3: { icon: '🥉', color: '#ff8c42', bg: 'rgba(255,140,66,0.08)', border: 'rgba(255,140,66,0.2)' },
} as Record<number, { icon: string; color: string; bg: string; border: string }>;

export function Leaderboard({ limit = 10 }: LeaderboardProps) {
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
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Exo+2:wght@700;800&display=swap');
        .lb-wrap{font-family:'Exo 2',sans-serif;display:flex;flex-direction:column;gap:0;}
        .lb-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;}
        .lb-title{font-family:'Orbitron',monospace;font-size:11px;font-weight:700;letter-spacing:.18em;color:#00d4ff;text-transform:uppercase;display:flex;align-items:center;gap:7px;text-shadow:0 0 8px rgba(0,180,255,0.4);}
        .lb-title::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,#1a3a6a,transparent);min-width:16px;}
        .lb-refresh{background:none;border:1px solid #1a3a6a;border-radius:5px;color:#3a6a9a;font-family:'Exo 2',sans-serif;font-size:8px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;padding:3px 8px;cursor:pointer;transition:color .2s,border-color .2s;outline:none;}
        .lb-refresh:hover{color:#00d4ff;border-color:#00d4ff;}
        .lb-loading{text-align:center;padding:20px 0;font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;}
        .lb-empty{text-align:center;padding:20px 0;font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;}
        .lb-row{display:flex;align-items:center;justify-content:space-between;padding:8px 10px;border-radius:8px;border:1px solid rgba(26,58,106,0.5);background:rgba(6,15,30,0.6);margin-bottom:6px;transition:filter .15s,transform .12s;animation:rowIn .3s ease both;}
        @keyframes rowIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        .lb-row:last-child{margin-bottom:0;}
        .lb-row:hover{filter:brightness(1.2);transform:translateX(3px);}
        .lb-left{display:flex;align-items:center;gap:8px;}
        .lb-icon{font-size:18px;min-width:22px;text-align:center;}
        .lb-num{font-family:'Orbitron',monospace;font-size:12px;color:#3a6a9a;min-width:22px;text-align:center;}
        .lb-name{font-family:'Orbitron',monospace;font-size:13px;color:#c8e0ff;line-height:1;}
        .lb-sub{font-size:8px;font-weight:800;letter-spacing:.08em;color:#3a6a9a;margin-top:1px;}
        .lb-right{text-align:right;}
        .lb-score{font-family:'Orbitron',monospace;font-size:18px;line-height:1;}
        .lb-slbl{font-size:7px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#3a6a9a;}
        .lb-foot{margin-top:8px;padding-top:8px;border-top:1px solid #1a3a6a;text-align:center;font-size:8px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#3a6a9a;}
      `}</style>
      <div className="lb-wrap">
        <div className="lb-head">
          <div className="lb-title">Leaderboard</div>
          <button type="button" className="lb-refresh" onClick={fetch_}>↺ Refresh</button>
        </div>
        {loading ? (
          <div className="lb-loading">🤖 Loading rankings...</div>
        ) : data.length === 0 ? (
          <div className="lb-empty">// No data — be the first!</div>
        ) : (
          <>
            {data.map((p, i) => {
              const rank = i + 1;
              const m = RANK[rank];
              return (
                <div key={p.id} className="lb-row" style={m ? { background: m.bg, borderColor: m.border, animationDelay: `${i * .06}s` } : { animationDelay: `${i * .06}s` }}>
                  <div className="lb-left">
                    {m ? <span className="lb-icon">{m.icon}</span> : <span className="lb-num">#{rank}</span>}
                    <div>
                      <div className="lb-name">{p.name}</div>
                      <div className="lb-sub">{p.totalGames} games · {Math.round(p.averageScore || 0)} avg</div>
                    </div>
                  </div>
                  <div className="lb-right">
                    <div className="lb-score" style={{ color: m ? m.color : '#c8e0ff', textShadow: m ? `0 0 8px ${m.color}40` : 'none' }}>{p.highScore}</div>
                    <div className="lb-slbl">best</div>
                  </div>
                </div>
              );
            })}
            <div className="lb-foot">// {data.length} player{data.length !== 1 ? 's' : ''} online</div>
          </>
        )}
      </div>
    </>
  );
}