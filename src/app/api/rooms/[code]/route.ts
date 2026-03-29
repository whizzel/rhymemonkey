import { type NextRequest, NextResponse } from 'next/server';
import { getRoomByCode, updateRoomStatus, leaveRoom } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    
    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    const room = await getRoomByCode(code);
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    
    return NextResponse.json({ room });
  } catch (error) {
    console.error('Error fetching room status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const { status } = await request.json();
    
    if (!code || !status) {
      return NextResponse.json({ error: 'Code and Status are required' }, { status: 400 });
    }
    
    await updateRoomStatus(code, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating room status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { playerId } = await request.json();
    
    if (!playerId) {
      return NextResponse.json({ error: 'Player ID is required' }, { status: 400 });
    }
    
    await leaveRoom(playerId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
