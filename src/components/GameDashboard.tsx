'use client';

import { GameBoard } from './GameBoard';
import { Leaderboard } from './Leaderboard';
import type { GameState, Player } from '@/lib/types';
import type { RhymeGroup } from '@/lib/rhymingWords';

interface GameDashboardProps {
  gameState: GameState;
  currentRhymeGroup: RhymeGroup | null;
  showError: boolean;
  showSuccess: boolean;
  player: Player | null;
  onInput: (input: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  onPause: () => void;
  onBackToMenu: () => void;
  onShowLeaderboard: () => void;
}

export function GameDashboard({ 
  gameState, 
  currentRhymeGroup,
  showError,
  showSuccess,
  player, 
  onInput, 
  onSubmit,
  onSkip,
  onPause, 
  onBackToMenu, 
  onShowLeaderboard 
}: GameDashboardProps) {
  return (
    <div className="relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden font-retro bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2">
            <div className="mario-panel p-6">
              {/* Game Header Stats */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1">TIME</div>
                  <div className="text-2xl font-bold text-white">{gameState.timeRemaining}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1">ATTEMPTED</div>
                  <div className="text-2xl font-bold text-white">{gameState.wordsCompleted}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1">CORRECT</div>
                  <div className="text-2xl font-bold text-green-400">{gameState.wordsCompleted}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-white/70 mb-1">SKIPPED</div>
                  <div className="text-2xl font-bold text-yellow-400">0</div>
                </div>
              </div>

              {/* Game Board */}
              <GameBoard 
                gameState={gameState} 
                showError={showError}
                showSuccess={showSuccess}
                onInput={onInput} 
                onSubmit={onSubmit}
                onSkip={onSkip}
                onPause={onPause}
              />
            </div>
          </div>

          {/* Side Panel - Player Info & Leaderboard */}
          <div className="space-y-6">
            {/* Player Info Card */}
            {player && (
              <div className="mario-panel p-4">
                <h3 className="text-[12px] uppercase tracking-widest text-mario-gold mb-3">PLAYER INFO</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-white/70">Name:</span>
                    <span className="text-[10px] text-white font-bold">{player.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-white/70">High Score:</span>
                    <span className="text-[10px] text-mario-gold font-bold">{player.highScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-white/70">Games:</span>
                    <span className="text-[10px] text-white font-bold">{player.totalGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[10px] text-white/70">Average:</span>
                    <span className="text-[10px] text-white font-bold">{Math.round(player.averageScore || 0)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rankings */}
            <div className="mario-panel p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[12px] uppercase tracking-widest text-mario-gold">RANKINGS</h3>
                <button
                  type="button"
                  onClick={onShowLeaderboard}
                  className="text-[8px] uppercase tracking-widest text-white/50 hover:text-white transition-colors"
                >
                  VIEW ALL
                </button>
              </div>
              <Leaderboard limit={5} />
            </div>

            {/* Game Controls */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={onPause}
                className="mario-btn w-full text-sm"
              >
                {gameState.isPaused ? 'RESUME' : 'PAUSE'}
              </button>
              <button
                type="button"
                onClick={onBackToMenu}
                className="mario-btn w-full text-sm"
              >
                EXIT GAME
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-[8px] text-white/50">BY @AARUSHE_REDDY</p>
        </div>
      </div>
    </div>
  );
}
