import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { id } = await params;
    const { image_url } = await request.json();
    const [result]: any = await pool.execute(
      'INSERT INTO project_gallery (project_id, image_url) VALUES (?, ?)',
      [id, image_url]
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    if (!imageId) return NextResponse.json({ error: 'imageId required' }, { status: 400 });
    await pool.execute('DELETE FROM project_gallery WHERE id = ?', [imageId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
