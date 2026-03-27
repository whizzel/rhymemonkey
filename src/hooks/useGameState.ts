import { useState, useEffect, useCallback } from 'react';
import type { GameState, Player, GameSession } from '@/lib/types';
import { getRandomRhymeGroup, getRandomWordFromGroup, type RhymeGroup } from '@/lib/rhymingWords';

const DIFFICULTY_SETTINGS = {
  easy: { timeMultiplier: 1.2, scoreMultiplier: 1, wordComplexity: 'simple' },
  medium: { timeMultiplier: 1, scoreMultiplier: 1.5, wordComplexity: 'medium' },
  hard: { timeMultiplier: 0.8, scoreMultiplier: 2, wordComplexity: 'complex' }
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    timeRemaining: 60,
    score: 0,
    wordsCompleted: 0,
    currentWord: '',
    userInput: '',
    accuracy: 100,
    difficulty: 'medium',
    timeLimit: 60,
    gameMode: 'solo'
  });

  const [currentRhymeGroup, setCurrentRhymeGroup] = useState<RhymeGroup | null>(null);
  const [showError, setShowError] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);

  const endGame = useCallback(async () => {
    if (!player || !gameState.isPlaying) return;

    const sessionData = {
      playerId: player.id,
      playerName: player.name,
      difficulty: gameState.difficulty,
      timeLimit: gameState.timeLimit,
      score: gameState.score,
      wordsCompleted: gameState.wordsCompleted,
      accuracy: gameState.accuracy,
      duration: gameState.timeLimit - gameState.timeRemaining
    };

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });

      if (response.ok) {
        const { session } = await response.json();
        setGameHistory(prev => [session, ...prev]);
      }
    } catch (error) {
      console.error('Error saving game session:', error);
    }

    setGameState(prev => ({ ...prev, isPlaying: false }));
  }, [player, gameState]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && !gameState.isPaused && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0 && gameState.isPlaying) {
      endGame();
    }

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeRemaining, endGame]);

  const startGame = useCallback((playerData: Player, difficulty: 'easy' | 'medium' | 'hard', timeLimit: number, gameMode: 'solo' | 'private') => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const adjustedTimeLimit = Math.floor(timeLimit * settings.timeMultiplier);
    
    // Get a random rhyme group and word
    const rhymeGroup = getRandomRhymeGroup(difficulty);
    const firstWord = getRandomWordFromGroup(rhymeGroup);
    
    setPlayer(playerData);
    setCurrentRhymeGroup(rhymeGroup);
    setGameState({
      isPlaying: true,
      isPaused: false,
      timeRemaining: adjustedTimeLimit,
      score: 0,
      wordsCompleted: 0,
      currentWord: firstWord,
      userInput: '',
      accuracy: 100,
      difficulty,
      timeLimit: adjustedTimeLimit,
      gameMode
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleInput = useCallback((input: string) => {
    if (!gameState.isPlaying || gameState.isPaused || !currentRhymeGroup) return;

    setGameState(prev => ({ ...prev, userInput: input }));

    // Check if input rhymes with current word
    const allValidRhymes = [currentRhymeGroup.baseWord, ...currentRhymeGroup.rhymes];
    const normalizedInput = input.toLowerCase().trim();
    const isRhyme = allValidRhymes.some(rhyme => rhyme.toLowerCase() === normalizedInput);

    if (isRhyme) {
      const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
      const points = Math.floor(10 * settings.scoreMultiplier);
      
      // Get new rhyme group and word for next round
      const newRhymeGroup = getRandomRhymeGroup(gameState.difficulty);
      const newWord = getRandomWordFromGroup(newRhymeGroup);
      
      setCurrentRhymeGroup(newRhymeGroup);
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        wordsCompleted: prev.wordsCompleted + 1,
        currentWord: newWord,
        userInput: ''
      }));
    } else if (input.trim() !== '') {
      // Show error for wrong word
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      setGameState(prev => ({ ...prev, userInput: '' }));
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.difficulty, currentRhymeGroup]);

  const handleSkip = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || !currentRhymeGroup) return;

    // Get new rhyme group and word
    const newRhymeGroup = getRandomRhymeGroup(gameState.difficulty);
    const newWord = getRandomWordFromGroup(newRhymeGroup);
    
    setCurrentRhymeGroup(newRhymeGroup);
    setGameState(prev => ({
      ...prev,
      currentWord: newWord,
      userInput: ''
    }));
  }, [gameState.isPlaying, gameState.isPaused, gameState.difficulty, currentRhymeGroup]);

  const resetGame = useCallback(() => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      timeRemaining: 60,
      score: 0,
      wordsCompleted: 0,
      currentWord: '',
      userInput: '',
      accuracy: 100,
      difficulty: 'medium',
      timeLimit: 60,
      gameMode: 'solo'
    });
  }, []);

  return {
    gameState,
    currentRhymeGroup,
    showError,
    player,
    gameHistory,
    startGame,
    pauseGame,
    endGame,
    handleInput,
    handleSkip,
    resetGame
  };
}
