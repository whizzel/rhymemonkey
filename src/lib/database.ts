import { prisma } from './prisma';
import type { Player, GameSession } from './types';

// Get or create player
export async function getOrCreatePlayer(name: string): Promise<Player> {
  const existingPlayer = await prisma.player.findFirst({
    where: { 
      name: { 
        equals: name, 
        mode: 'insensitive' 
      } 
    }
  });
  
  if (existingPlayer) {
    return {
      ...existingPlayer,
      createdAt: existingPlayer.createdAt.toISOString() // Convert Date to string
    };
  }
  
  const player = await prisma.player.create({
    data: {
      name: name.trim(),
      totalGames: 0,
      highScore: 0,
      averageScore: 0
    }
  });
  
  return {
    ...player,
    createdAt: player.createdAt.toISOString() // Convert Date to string
  };
}

// Save game session and update player stats
export async function saveGameSession(session: Omit<GameSession, 'id' | 'completedAt'>): Promise<GameSession> {
  const gameSession = await prisma.gameSession.create({
    data: {
      ...session,
      completedAt: new Date()
    }
  });
  
  // Update player stats
  const playerGames = await prisma.gameSession.findMany({
    where: { playerId: session.playerId }
  });
  
  const totalScore = playerGames.reduce((sum, game) => sum + game.score, 0);
  const averageScore = totalScore / playerGames.length;
  const highScore = Math.max(...playerGames.map(game => game.score));
  
  await prisma.player.update({
    where: { id: session.playerId },
    data: {
      totalGames: playerGames.length,
      highScore,
      averageScore
    }
  });
  
  // Convert Prisma result to match GameSession type
  return {
    ...gameSession,
    difficulty: session.difficulty, // Ensure correct type
    completedAt: gameSession.completedAt.toISOString() // Convert Date to string
  };
}

// Get leaderboard
export async function getLeaderboard(limit: number = 10): Promise<Player[]> {
  const players = await prisma.player.findMany({
    orderBy: { highScore: 'desc' },
    take: limit
  });
  
  // Convert Prisma results to match Player type
  return players.map(player => ({
    ...player,
    createdAt: player.createdAt.toISOString() // Convert Date to string
  }));
}

// Get game sessions for a player
export async function getPlayerGameSessions(playerId: string, limit: number = 10): Promise<GameSession[]> {
  const sessions = await prisma.gameSession.findMany({
    where: { playerId },
    orderBy: { completedAt: 'desc' },
    take: limit
  });
  
  // Convert Prisma results to match GameSession type
  return sessions.map(session => ({
    ...session,
    difficulty: session.difficulty as 'easy' | 'medium' | 'hard', // Type assertion
    completedAt: session.completedAt.toISOString() // Convert Date to string
  }));
}
