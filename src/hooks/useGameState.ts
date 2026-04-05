import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameState, Player, GameSession, RhymeGroup } from '@/lib/types';
import { getRandomRhymeGroup, getRandomWordFromGroup } from '@/lib/rhymingWords';

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
    accuracy: 0,
    totalAttempts: 0,
    difficulty: 'medium',
    timeLimit: 60,
    gameMode: 'solo',
  });

  const [currentRhymeGroup, setCurrentRhymeGroup] = useState<RhymeGroup | null>(null);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameHistory, setGameHistory] = useState<GameSession[]>([]);

  // Pre-loaded queue of upcoming rhyme groups (2 ahead)
  const preloadQueue = useRef<RhymeGroup[]>([]);
  const isPreloading = useRef(false);

  // Fill the preload queue with upcoming words
  const fillPreloadQueue = useCallback(async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (isPreloading.current) return;
    isPreloading.current = true;
    
    while (preloadQueue.current.length < 2) {
      const group = await getRandomRhymeGroup(difficulty);
      preloadQueue.current.push(group);
    }
    
    isPreloading.current = false;
  }, []);

  // Get the next word instantly from queue, or generate one on the spot
  const getNextGroup = useCallback(async (difficulty: 'easy' | 'medium' | 'hard'): Promise<RhymeGroup> => {
    if (preloadQueue.current.length > 0) {
      const next = preloadQueue.current.shift();
      if (next) {
        fillPreloadQueue(difficulty);
        return next;
      }
    }
    // Instant fallback — getRandomRhymeGroup now uses local data
    const group = await getRandomRhymeGroup(difficulty);
    fillPreloadQueue(difficulty);
    return group;
  }, [fillPreloadQueue]);

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

  // Timer effect — no longer depends on isLoading
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

  const startGame = useCallback(async (playerData: Player, difficulty: 'easy' | 'medium' | 'hard', timeLimit: number, gameMode: 'solo' | 'private') => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const adjustedTimeLimit = Math.floor(timeLimit * settings.timeMultiplier);
    
    setPlayer(playerData);
    preloadQueue.current = [];

    // Get first word instantly (local data, no network wait)
    const rhymeGroup = await getRandomRhymeGroup(difficulty);
    const firstWord = getRandomWordFromGroup(rhymeGroup);
    
    setCurrentRhymeGroup(rhymeGroup);
    setGameState({
      isPlaying: true,
      isPaused: false,
      timeRemaining: adjustedTimeLimit,
      score: 0,
      wordsCompleted: 0,
      currentWord: firstWord,
      userInput: '',
      accuracy: 0,
      totalAttempts: 0,
      difficulty,
      timeLimit: adjustedTimeLimit,
      gameMode,
    });

    // Pre-fill the queue in background
    fillPreloadQueue(difficulty);
  }, [fillPreloadQueue]);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleInputChange = useCallback((input: string) => {
    if (!gameState.isPlaying || gameState.isPaused || !currentRhymeGroup) return;
    setGameState(prev => ({ ...prev, userInput: input }));
  }, [gameState.isPlaying, gameState.isPaused, currentRhymeGroup]);

  const advanceToNextWord = useCallback(async (difficulty: 'easy' | 'medium' | 'hard') => {
    const nextGroup = await getNextGroup(difficulty);
    const newWord = getRandomWordFromGroup(nextGroup);
    setCurrentRhymeGroup(nextGroup);
    return newWord;
  }, [getNextGroup]);

  const handleSubmitWord = useCallback(async () => {
    if (!gameState.isPlaying || gameState.isPaused || !currentRhymeGroup) return;

    const input = gameState.userInput.trim();
    if (!input) return;

    const allValidRhymes = [currentRhymeGroup.word, ...currentRhymeGroup.rhymes];
    const normalizedInput = input.toLowerCase();
    
    const isSameWord = normalizedInput === gameState.currentWord.toLowerCase();
    const isRhyme = !isSameWord && allValidRhymes.some(rhyme => rhyme.toLowerCase() === normalizedInput);

    if (isRhyme) {
      const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
      const points = Math.floor(10 * settings.scoreMultiplier);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 500);

      const newWord = await advanceToNextWord(gameState.difficulty);

      setGameState(prev => {
        const nextWordsCompleted = prev.wordsCompleted + 1;
        const nextTotalAttempts = prev.totalAttempts + 1;
        return {
          ...prev,
          score: prev.score + points,
          wordsCompleted: nextWordsCompleted,
          totalAttempts: nextTotalAttempts,
          accuracy: Math.round((nextWordsCompleted / nextTotalAttempts) * 100),
          currentWord: newWord,
          userInput: '',
        };
      });
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      setGameState(prev => {
        const nextTotalAttempts = prev.totalAttempts + 1;
        return {
          ...prev,
          userInput: '',
          totalAttempts: nextTotalAttempts,
          accuracy: Math.round((prev.wordsCompleted / nextTotalAttempts) * 100),
        };
      });
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.difficulty, gameState.userInput, gameState.currentWord, currentRhymeGroup, advanceToNextWord]);

  const handleSkip = useCallback(async () => {
    if (!gameState.isPlaying || gameState.isPaused || !currentRhymeGroup) return;

    const newWord = await advanceToNextWord(gameState.difficulty);

    setGameState(prev => {
      const nextTotalAttempts = prev.totalAttempts + 1;
      const nextScore = Math.max(0, prev.score - 5);
      
      return {
        ...prev,
        userInput: '',
        score: nextScore,
        totalAttempts: nextTotalAttempts,
        accuracy: Math.round((prev.wordsCompleted / nextTotalAttempts) * 100),
        currentWord: newWord,
      };
    });
  }, [gameState.isPlaying, gameState.isPaused, gameState.difficulty, currentRhymeGroup, advanceToNextWord]);

  const resetGame = useCallback(() => {
    setGameState({
      isPlaying: false,
      isPaused: false,
      timeRemaining: 60,
      score: 0,
      wordsCompleted: 0,
      currentWord: '',
      userInput: '',
      accuracy: 0,
      totalAttempts: 0,
      difficulty: 'medium',
      timeLimit: 60,
      gameMode: 'solo',
    });
    setCurrentRhymeGroup(null);
    preloadQueue.current = [];
  }, []);

  return {
    gameState,
    isLoading: false, // Always false now — no visible loading states
    isNextLoading: false, // Always false — preloading is invisible
    currentRhymeGroup,
    showError,
    showSuccess,
    player,
    gameHistory,
    startGame,
    pauseGame,
    endGame,
    handleInputChange,
    handleSubmitWord,
    handleSkip,
    resetGame
  };
}
