import { type NextRequest, NextResponse } from 'next/server';
import { saveGameSession, getPlayerGameSessions } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const gameData = await request.json();
    
    const { playerId, playerName, difficulty, timeLimit, score, wordsCompleted, accuracy, duration } = gameData;
    
    if (!playerId || !playerName || !difficulty || !timeLimit || score === undefined || wordsCompleted === undefined || accuracy === undefined || duration === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const session = await saveGameSession({
      playerId,
      playerName,
      difficulty,
      timeLimit,
      score,
      wordsCompleted,
      accuracy,
      duration
    });
    
    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error saving game session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    if (playerId) {
      const games = await getPlayerGameSessions(playerId, limit);
      return NextResponse.json({ games });
    } else {
      return NextResponse.json(
        { error: 'playerId is required' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error fetching game sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
