import { type NextRequest, NextResponse } from 'next/server';
import { createRoom, getRoomByCode, joinRoom } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const { action, hostId, difficulty, timeLimit, playerId, code } = await request.json();
    
    if (action === 'create') {
      if (!hostId || !difficulty || !timeLimit) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      
      const room = await createRoom(hostId, difficulty, timeLimit);
      return NextResponse.json({ room });
    }
    
    if (action === 'join') {
      if (!playerId || !code) {
        return NextResponse.json({ error: 'Missing player ID or room code' }, { status: 400 });
      }
      
      const room = await joinRoom(code, playerId);
      if (!room) {
        return NextResponse.json({ error: 'Room not found or game already started' }, { status: 404 });
      }
      
      return NextResponse.json({ room });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in rooms API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    const room = await getRoomByCode(code);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    return NextResponse.json({ room });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
