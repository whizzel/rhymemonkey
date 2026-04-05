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

// Save game session and update player stats
export async function saveGameSession(session: Omit<GameSession, 'id' | 'completedAt'>): Promise<GameSession> {
  return await prisma.$transaction(async (tx) => {
    // 1. Create game session
    const gameSession = await tx.gameSession.create({
      data: {
        ...session,
        completedAt: new Date()
      }
    });

    // 2. Aggregate stats for the player
    const stats = await tx.gameSession.aggregate({
      where: { playerId: session.playerId },
      _count: { id: true },
      _sum: { score: true },
      _max: { score: true }
    });

    const totalGames = stats._count.id;
    const totalScore = stats._sum.score || 0;
    const highScore = stats._max.score || 0;
    const averageScore = totalGames > 0 ? totalScore / totalGames : 0;

    // 3. Update player stats
    await tx.player.update({
      where: { id: session.playerId },
      data: {
        totalGames,
        highScore,
        averageScore
      }
    });

    // Note: Global ranking update is removed from the critical path
    // rankings can be calculated on-the-fly or in a background job

    return {
      ...gameSession,
      difficulty: session.difficulty as 'easy' | 'medium' | 'hard',
      completedAt: gameSession.completedAt.toISOString()
    };
  });
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
