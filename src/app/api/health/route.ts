import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows]: any = await pool.execute('SELECT 1 as ok');
    const [tables]: any = await pool.execute('SHOW TABLES');
    return NextResponse.json({
      success: true,
      db: rows[0],
      tables: tables.map((t: any) => Object.values(t)[0]),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code,
    }, { status: 500 });
  }
}
