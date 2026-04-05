import { useState, useEffect, useCallback } from 'react';
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
  const [nextRhymeGroup, setNextRhymeGroup] = useState<RhymeGroup | null>(null);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    
    if (gameState.isPlaying && !gameState.isPaused && !isLoading && gameState.timeRemaining > 0) {
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
  }, [gameState.isPlaying, gameState.isPaused, gameState.timeRemaining, endGame, isLoading]);

  const startGame = useCallback(async (playerData: Player, difficulty: 'easy' | 'medium' | 'hard', timeLimit: number, gameMode: 'solo' | 'private') => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const adjustedTimeLimit = Math.floor(timeLimit * settings.timeMultiplier);
    
    setPlayer(playerData);
    setIsLoading(true);
    setGameState({
      isPlaying: true,
      isPaused: false,
      timeRemaining: adjustedTimeLimit,
      score: 0,
      wordsCompleted: 0,
      currentWord: 'Loading...',
      userInput: '',
      accuracy: 0,
      totalAttempts: 0,
      difficulty,
      timeLimit: adjustedTimeLimit,
      gameMode,
    });

    // Only wait for the FIRST rhyme group to start
    const rhymeGroup = await getRandomRhymeGroup(difficulty);
    const firstWord = getRandomWordFromGroup(rhymeGroup);
    
    setCurrentRhymeGroup(rhymeGroup);
    setGameState(prev => ({
      ...prev,
      currentWord: firstWord
    }));
    setIsLoading(false);

    // Fetch the NEXT word in the background immediately
    setIsNextLoading(true);
    getRandomRhymeGroup(difficulty).then(group => {
      setNextRhymeGroup(group);
      setIsNextLoading(false);
    });
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const handleInputChange = useCallback((input: string) => {
    if (!gameState.isPlaying || gameState.isPaused || !currentRhymeGroup) return;
    setGameState(prev => ({ ...prev, userInput: input }));
  }, [gameState.isPlaying, gameState.isPaused, currentRhymeGroup]);

  const handleSubmitWord = useCallback(async () => {
    if (!gameState.isPlaying || gameState.isPaused || isLoading || !currentRhymeGroup) return;

    const input = gameState.userInput.trim();
    if (!input) return;

    // Check if input rhymes with current word
    const allValidRhymes = [currentRhymeGroup.word, ...currentRhymeGroup.rhymes];
    const normalizedInput = input.toLowerCase();
    
    // The input cannot be the exact same word as the one given
    const isSameWord = normalizedInput === gameState.currentWord.toLowerCase();
    const isRhyme = !isSameWord && allValidRhymes.some(rhyme => rhyme.toLowerCase() === normalizedInput);

    if (isRhyme) {
      const settings = DIFFICULTY_SETTINGS[gameState.difficulty];
      const points = Math.floor(10 * settings.scoreMultiplier);
      
      // Show success for right word
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 500);

      // Use pre-loaded next word if available, otherwise load new one
      if (nextRhymeGroup) {
        const newWord = getRandomWordFromGroup(nextRhymeGroup);
        
        const usedGroup = nextRhymeGroup;
        setCurrentRhymeGroup(usedGroup);
        setNextRhymeGroup(null); // Clear it as it's now current
        
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
        
        // Pre-load next word in background
        setIsNextLoading(true);
        getRandomRhymeGroup(gameState.difficulty).then(group => {
          setNextRhymeGroup(group);
          setIsNextLoading(false);
        });
      } else {
        // Fallback: load new word if next not available yet
        setIsLoading(true);
        setGameState(prev => ({ ...prev, currentWord: 'Loading...', userInput: '' }));

        const newRhymeGroup = await getRandomRhymeGroup(gameState.difficulty);
        const newWord = getRandomWordFromGroup(newRhymeGroup);
        
        setCurrentRhymeGroup(newRhymeGroup);
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
        setIsLoading(false);
        
        // Pre-load next word for future
        setIsNextLoading(true);
        getRandomRhymeGroup(gameState.difficulty).then(group => {
          setNextRhymeGroup(group);
          setIsNextLoading(false);
        });
      }
    } else {
      // Show error for wrong word
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
  }, [gameState.isPlaying, gameState.isPaused, isLoading, gameState.difficulty, gameState.userInput, gameState.currentWord, currentRhymeGroup, nextRhymeGroup]);

  const handleSkip = useCallback(async () => {
    if (!gameState.isPlaying || gameState.isPaused || isLoading || !currentRhymeGroup) return;

    // Use pre-loaded next word if available, otherwise load new one
    if (nextRhymeGroup) {
      const newWord = getRandomWordFromGroup(nextRhymeGroup);
      
      setCurrentRhymeGroup(nextRhymeGroup);
      setGameState(prev => {
        const nextTotalAttempts = prev.totalAttempts + 1;
        const nextScore = Math.max(0, prev.score - 5); // Add -5 penalty
        
        return {
          ...prev,
          userInput: '',
          score: nextScore,
          totalAttempts: nextTotalAttempts,
          accuracy: Math.round((prev.wordsCompleted / nextTotalAttempts) * 100),
          currentWord: newWord,
        };
      });
      
      // Pre-load next word in background
      setIsNextLoading(true);
      getRandomRhymeGroup(gameState.difficulty).then(group => {
        setNextRhymeGroup(group);
        setIsNextLoading(false);
      });
    } else {
      // Fallback: load new word if next not available
      setIsLoading(true);
      setGameState(prev => ({ ...prev, currentWord: 'Loading...', userInput: '' }));

      const newRhymeGroup = await getRandomRhymeGroup(gameState.difficulty);
      const newWord = getRandomWordFromGroup(newRhymeGroup);
      
      setCurrentRhymeGroup(newRhymeGroup);
      setGameState(prev => {
        const nextTotalAttempts = prev.totalAttempts + 1;
        const nextScore = Math.max(0, prev.score - 5); // Add -5 penalty
        
        return {
          ...prev,
          score: nextScore,
          totalAttempts: nextTotalAttempts,
          accuracy: Math.round((prev.wordsCompleted / nextTotalAttempts) * 100),
          currentWord: newWord,
        };
      });
      setIsLoading(false);
      
      // Pre-load next word for future
      setIsNextLoading(true);
      getRandomRhymeGroup(gameState.difficulty).then(group => {
        setNextRhymeGroup(group);
        setIsNextLoading(false);
      });
    }
  }, [gameState.isPlaying, gameState.isPaused, isLoading, gameState.difficulty, currentRhymeGroup, nextRhymeGroup]);


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
    setNextRhymeGroup(null);
  }, []);

  return {
    gameState,
    isLoading,
    isNextLoading,
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
