import { prisma } from './prisma';
import type { Player, GameSession, Room } from './types';

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

// Update player rankings based on high scores
async function updatePlayerRankings(): Promise<void> {
  const players = await prisma.player.findMany({
    orderBy: { highScore: 'desc' }
  });
  
  // Update rankings in bulk
  const updatePromises = players.map((player, index) => 
    prisma.player.update({
      where: { id: player.id },
      data: { ranking: index + 1 }
    })
  );
  
  await Promise.all(updatePromises);
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
  
  // Update player ranking
  await updatePlayerRankings();
  
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

// --- Room Management ---

export async function createRoom(hostId: string, difficulty: 'easy' | 'medium' | 'hard', timeLimit: number): Promise<Room> {
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const room = await prisma.room.create({
    data: {
      code,
      hostId,
      difficulty,
      timeLimit,
      status: 'waiting',
      players: {
        connect: { id: hostId }
      }
    },
    include: {
      players: true
    }
  });
  
  return {
    ...room,
    difficulty: room.difficulty as 'easy' | 'medium' | 'hard',
    status: room.status as 'waiting' | 'playing' | 'finished',
    createdAt: room.createdAt.toISOString(),
    players: room.players.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString()
    }))
  };
}

export async function getRoomByCode(code: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() },
    include: {
      players: true
    }
  });
  
  if (!room) return null;
  
  return {
    ...room,
    difficulty: room.difficulty as 'easy' | 'medium' | 'hard',
    status: room.status as 'waiting' | 'playing' | 'finished',
    createdAt: room.createdAt.toISOString(),
    players: room.players.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString()
    }))
  };
}

export async function joinRoom(code: string, playerId: string): Promise<Room | null> {
  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase() }
  });
  
  if (!room || room.status !== 'waiting') return null;
  
  const updatedRoom = await prisma.room.update({
    where: { id: room.id },
    data: {
      players: {
        connect: { id: playerId }
      }
    },
    include: {
      players: true
    }
  });
  
  return {
    ...updatedRoom,
    difficulty: updatedRoom.difficulty as 'easy' | 'medium' | 'hard',
    status: updatedRoom.status as 'waiting' | 'playing' | 'finished',
    createdAt: updatedRoom.createdAt.toISOString(),
    players: updatedRoom.players.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString()
    }))
  };
}

export async function leaveRoom(playerId: string): Promise<void> {
  const player = await prisma.player.findUnique({
    where: { id: playerId },
    include: { joinedRooms: true }
  });
  
  if (!player?.joinedRooms.length) return;
  
  const roomId = player.joinedRooms[0].id;
  
  await prisma.player.update({
    where: { id: playerId },
    data: {
      joinedRooms: {
        disconnect: { id: roomId }
      }
    }
  });
  
  // Cleanup empty rooms
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: { players: true }
  });
  
  if (room && room.players.length === 0) {
    await prisma.room.delete({
      where: { id: room.id }
    });
  }
}

export async function updateRoomStatus(code: string, status: 'waiting' | 'playing' | 'finished'): Promise<void> {
  await prisma.room.update({
    where: { code: code.toUpperCase() },
    data: { status }
  });
}
