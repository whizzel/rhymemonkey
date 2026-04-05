import { type NextRequest, NextResponse } from 'next/server';
import { saveGameSession, getPlayerGameSessions } from '@/lib/database';
import { GameSessionSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = GameSessionSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const session = await saveGameSession(result.data);
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
    const limit = z.coerce.number().int().positive().default(10).parse(searchParams.get('limit') || '10');
    
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
