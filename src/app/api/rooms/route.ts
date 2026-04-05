import { type NextRequest, NextResponse } from 'next/server';
import { createRoom, getRoomByCode, joinRoom } from '@/lib/database';
import { z } from 'zod';
import { DifficultySchema } from '@/lib/schemas';

const CreateRoomSchema = z.object({
  action: z.literal('create'),
  hostId: z.string().cuid(),
  difficulty: DifficultySchema,
  timeLimit: z.number().int().positive()
});

const JoinRoomSchema = z.object({
  action: z.literal('join'),
  code: z.string().length(6),
  playerId: z.string().cuid()
});

const RoomActionSchema = z.discriminatedUnion('action', [CreateRoomSchema, JoinRoomSchema]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = RoomActionSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const data = result.data;
    
    if (data.action === 'create') {
      const room = await createRoom(data.hostId, data.difficulty, data.timeLimit);
      return NextResponse.json({ room });
    }
    
    if (data.action === 'join') {
      const room = await joinRoom(data.code, data.playerId);
      if (!room) {
        return NextResponse.json(
          { error: 'Room not found or game already started' },
          { status: 404 }
        );
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
    const code = z.string().length(6).safeParse(searchParams.get('code'));
    
    if (!code.success) {
      return NextResponse.json({ error: 'Valid room code is required' }, { status: 400 });
    }
    
    const room = await getRoomByCode(code.data);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    return NextResponse.json({ room });
  } catch (error) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
