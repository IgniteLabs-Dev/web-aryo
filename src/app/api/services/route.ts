import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const [services]: any = await pool.execute(
      'SELECT * FROM services ORDER BY sort_order ASC, id ASC'
    );
    for (const s of services) {
      const [gallery]: any = await pool.execute(
        'SELECT id, image_url FROM service_gallery WHERE service_id = ? ORDER BY sort_order ASC',
        [s.id]
      );
      s.gallery = gallery;
    }
    return NextResponse.json(services);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { subject, name, category, description, detail_description, icon, hill_color, sky_grad, sheep_x, sheep_y } = body;

    const [result]: any = await pool.execute(
      `INSERT INTO services (subject, name, category, description, detail_description, icon, hill_color, sky_grad, sheep_x, sheep_y)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [subject, name, category, description, detail_description || '', icon || 'Code2', hill_color || '#65a30d', sky_grad || 'from-sky-100 to-sky-300', sheep_x || 50, sheep_y || 130]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
