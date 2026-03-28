'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Player } from '@/lib/types';

interface LeaderboardProps {
  limit?: number;
}

export function Leaderboard({ limit = 10 }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/players?limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-white/70';
  };

  if (loading) {
    return (
      <div className="mario-panel p-6">
        <h3 className="text-[10px] uppercase tracking-widest text-mario-gold mb-4 text-center">
          LEADERBOARD
        </h3>
        <div className="text-center text-white/70 py-8">
          Loading rankings...
        </div>
      </div>
    );
  }

  return (
    <div className="mario-panel p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[10px] uppercase tracking-widest text-mario-gold">
          LEADERBOARD
        </h3>
        <button
          type="button"
          onClick={fetchLeaderboard}
          className="text-[8px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          REFRESH
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center text-white/70 py-8">
          No games played yet. Be the first!
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={player.id}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
            >
              <div className="flex items-center gap-3">
                <div className={`text-lg font-bold ${getRankColor(index + 1)}`} style={{ textShadow: '2px 2px 0 #000' }}>
                  {getRankIcon(index + 1)}
                </div>
                <div>
                  <div className="text-white font-semibold" style={{ textShadow: '1px 1px 0 #000' }}>
                    {player.name}
                  </div>
                  <div className="text-[10px] text-white/50">
                    {player.totalGames} games • {(player.averageScore || 0).toFixed(0)} avg
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xl font-bold text-mario-gold" style={{ textShadow: '2px 2px 0 #000' }}>
                  {player.highScore}
                </div>
                <div className="text-[8px] text-white/50 uppercase tracking-widest">
                  HIGH SCORE
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {leaderboard.length > 0 && (
        <div className="mt-6 pt-4 border-t border-white/20">
          <div className="text-center text-[10px] text-white/50">
            Total Players: {leaderboard.length}
          </div>
        </div>
      )}
    </div>
  );
}
