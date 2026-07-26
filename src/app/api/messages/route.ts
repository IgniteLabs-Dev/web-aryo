import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const [rows]: any = await pool.execute(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
