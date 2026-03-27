'use client';

import type { GameState, Player } from '@/lib/types';

interface GameOverProps {
  gameState: GameState;
  player: Player | null;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  onShowLeaderboard: () => void;
}

export function GameOver({ gameState, player, onPlayAgain, onBackToMenu, onShowLeaderboard }: GameOverProps) {
  const getPerformanceMessage = () => {
    const accuracy = gameState.accuracy;
    if (accuracy >= 95) return "PERFECT! 🌟";
    if (accuracy >= 85) return "EXCELLENT! 🎯";
    if (accuracy >= 75) return "GREAT JOB! 👍";
    if (accuracy >= 60) return "GOOD EFFORT! 💪";
    return "KEEP PRACTICING! 🎮";
  };

  const getScoreColor = () => {
    if (gameState.score >= 500) return 'text-yellow-400';
    if (gameState.score >= 300) return 'text-green-400';
    if (gameState.score >= 150) return 'text-blue-400';
    return 'text-white';
  };

  return (
    <div className="mario-panel flex flex-col gap-6 p-8 text-center">
      <h2 className="text-4xl font-bold text-mario-gold" style={{ textShadow: '4px 4px 0 #000' }}>
        GAME OVER
      </h2>
      
      <div className="text-2xl font-bold text-white">
        {getPerformanceMessage()}
      </div>
      
      <div className="grid grid-cols-2 gap-6 text-left">
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-white/70">Final Score</div>
          <div className={`text-3xl font-bold ${getScoreColor()}`} style={{ textShadow: '3px 3px 0 #000' }}>
            {gameState.score}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-white/70">Words Completed</div>
          <div className="text-3xl font-bold text-white" style={{ textShadow: '3px 3px 0 #000' }}>
            {gameState.wordsCompleted}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-white/70">Accuracy</div>
          <div className="text-3xl font-bold text-white" style={{ textShadow: '3px 3px 0 #000' }}>
            {gameState.accuracy}%
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-white/70">Time Used</div>
          <div className="text-3xl font-bold text-white" style={{ textShadow: '3px 3px 0 #000' }}>
            {gameState.timeLimit - gameState.timeRemaining}s
          </div>
        </div>
      </div>
      
      {player && (
        <div className="border-t border-white/20 pt-4">
          <div className="text-[10px] uppercase tracking-widest text-white/70 mb-2">Player Stats</div>
          <div className="flex justify-around text-sm">
            <div>
              <div className="text-white/70">High Score</div>
              <div className="text-xl font-bold text-mario-gold">{player.highScore}</div>
            </div>
            <div>
              <div className="text-white/70">Total Games</div>
              <div className="text-xl font-bold text-white">{player.totalGames}</div>
            </div>
            <div>
              <div className="text-white/70">Average</div>
              <div className="text-xl font-bold text-white">{Math.round(player.averageScore)}</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="mario-btn mario-btn-green text-lg px-8 py-3"
        >
          PLAY AGAIN
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onBackToMenu}
            className="mario-btn text-sm px-6 py-2"
          >
            MAIN MENU
          </button>
          <button
            type="button"
            onClick={onShowLeaderboard}
            className="mario-btn mario-btn-gold text-sm px-6 py-2"
          >
            RANKINGS
          </button>
        </div>
      </div>
    </div>
  );
}
