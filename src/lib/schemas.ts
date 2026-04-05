import { z } from 'zod';

export const DifficultySchema = z.enum(['easy', 'medium', 'hard']);
export const RoomStatusSchema = z.enum(['waiting', 'playing', 'finished']);

export const PlayerSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string().min(1).max(20),
  totalGames: z.number().int().nonnegative().optional(),
  highScore: z.number().int().nonnegative().optional(),
  averageScore: z.number().nonnegative().optional(),
  createdAt: z.string().datetime().optional(),
});

export const GameSessionSchema = z.object({
  playerId: z.string().cuid(),
  playerName: z.string(),
  difficulty: DifficultySchema,
  timeLimit: z.number().int().positive(),
  score: z.number().int().nonnegative(),
  wordsCompleted: z.number().int().nonnegative(),
  accuracy: z.number().min(0).max(100),
  duration: z.number().int().nonnegative(),
});

export const RoomSchema = z.object({
  id: z.string().cuid().optional(),
  code: z.string().length(6).optional(),
  hostId: z.string().cuid(),
  difficulty: DifficultySchema,
  timeLimit: z.number().int().positive(),
  status: RoomStatusSchema.optional(),
  createdAt: z.string().datetime().optional(),
});
