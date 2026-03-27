import { type NextRequest, NextResponse } from 'next/server';
import { getOrCreatePlayer, getLeaderboard } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Player name is required' },
        { status: 400 }
      );
    }
    
    if (name.trim().length > 20) {
      return NextResponse.json(
        { error: 'Player name must be 20 characters or less' },
        { status: 400 }
      );
    }
    
    const player = await getOrCreatePlayer(name.trim());
    return NextResponse.json({ player });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leaderboard = await getLeaderboard(10);
    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
