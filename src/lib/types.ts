export interface Player {
  id: string;
  name: string;
  createdAt: string;
  totalGames: number;
  highScore: number;
  averageScore: number;
}

export interface GameSession {
  id: string;
  playerId: string;
  playerName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  score: number;
  wordsCompleted: number;
  accuracy: number;
  completedAt: string;
  duration: number; // actual time taken in seconds
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  timeRemaining: number;
  score: number;
  wordsCompleted: number;
  currentWord: string;
  userInput: string;
  accuracy: number;
  totalAttempts: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  gameMode: 'solo' | 'private';
}

export type RoomStatus = 'waiting' | 'playing' | 'finished';

export interface Room {
  id: string;
  code: string;
  hostId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  status: RoomStatus;
  players: Player[];
  createdAt: string;
}
