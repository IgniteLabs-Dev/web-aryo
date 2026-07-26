import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

// POST - add image
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    const { image_url } = await request.json();

    // Check max 3 images
    const [count]: any = await pool.execute('SELECT COUNT(*) as total FROM service_gallery WHERE service_id = ?', [id]);
    if (count[0].total >= 3) {
      return NextResponse.json({ error: 'Maximum 3 images per service' }, { status: 400 });
    }

    const [result]: any = await pool.execute(
      'INSERT INTO service_gallery (service_id, image_url) VALUES (?, ?)',
      [id, image_url]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// DELETE - remove image
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });
    await pool.execute('DELETE FROM service_gallery WHERE id = ?', [imageId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
