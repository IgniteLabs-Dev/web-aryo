import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    const { type, date, name, id_journal_issuer, url } = await request.json();
    await pool.execute(
      'UPDATE pub_cer SET type=?, date=?, name=?, id_journal_issuer=?, url=? WHERE id=?',
      [type, date, name, id_journal_issuer || '', url || '', id]
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    await pool.execute('DELETE FROM pub_cer WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}
