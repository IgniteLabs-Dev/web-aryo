import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    const { is_read } = await request.json();
    await pool.execute('UPDATE messages SET is_read = ? WHERE id = ?', [is_read ? 1 : 0, id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    await pool.execute('DELETE FROM messages WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
