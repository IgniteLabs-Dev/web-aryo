import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [services]: any = await pool.execute('SELECT * FROM services WHERE id = ?', [id]);
    if (services.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const [gallery]: any = await pool.execute(
      'SELECT id, image_url FROM service_gallery WHERE service_id = ? ORDER BY sort_order ASC',
      [id]
    );
    services[0].gallery = gallery;
    return NextResponse.json(services[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    const body = await request.json();
    const { subject, name, category, description, detail_description, icon, hill_color, sky_grad, sheep_x, sheep_y } = body;

    await pool.execute(
      `UPDATE services SET subject=?, name=?, category=?, description=?, detail_description=?, icon=?, hill_color=?, sky_grad=?, sheep_x=?, sheep_y=? WHERE id=?`,
      [subject, name, category, description, detail_description || '', icon || 'Code2', hill_color || '#65a30d', sky_grad || 'from-sky-100 to-sky-300', sheep_x || 50, sheep_y || 130, id]
    );
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
    await pool.execute('DELETE FROM services WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
