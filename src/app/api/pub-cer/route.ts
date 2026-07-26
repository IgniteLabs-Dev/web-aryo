import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM pub_cer ORDER BY sort_order ASC, id DESC');
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { type, date, name, id_journal_issuer, url } = await request.json();
    
    // Validasi type ada di categories
    const [valid]: any = await pool.execute(
      'SELECT id FROM categories WHERE name = ? AND type = ?',
      [type, 'pub_cer']
    );
    
    if (valid.length === 0) {
      return NextResponse.json({ error: 'Invalid type. Please select from existing categories.' }, { status: 400 });
    }
    
    const [result]: any = await pool.execute(
      'INSERT INTO pub_cer (type, date, name, id_journal_issuer, url) VALUES (?, ?, ?, ?, ?)',
      [type, date, name, id_journal_issuer || '', url || '']
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}
