import { type NextRequest, NextResponse } from 'next/server';
import { getOrCreatePlayer, getLeaderboard } from '@/lib/database';
import { PlayerSchema } from '@/lib/schemas';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = PlayerSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const player = await getOrCreatePlayer(result.data.name.trim());
    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error in POST /api/players:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = z.coerce.number().int().positive().default(10).parse(searchParams.get('limit') || '10');
    
    const leaderboard = await getLeaderboard(limit);
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error in GET /api/players:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : error
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
