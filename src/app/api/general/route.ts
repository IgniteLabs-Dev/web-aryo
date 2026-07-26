import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM general WHERE id = 1');
    return NextResponse.json(rows[0] || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { status_note, about_name, about_title, about_description, contact_email, contact_linkedin } = body;

    if (status_note && status_note.length > 60) {
      return NextResponse.json({ error: 'Status note max 60 chars' }, { status: 400 });
    }

    await pool.execute(
      `UPDATE general SET status_note=?, about_name=?, about_title=?, about_description=?, contact_email=?, contact_linkedin=? WHERE id=1`,
      [status_note || '', about_name || '', about_title || '', about_description || '', contact_email || '', contact_linkedin || '']
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
