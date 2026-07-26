import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [projects]: any = await pool.execute('SELECT * FROM projects WHERE id = ?', [id]);
    if (projects.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const [gallery]: any = await pool.execute(
      'SELECT id, image_url FROM project_gallery WHERE project_id = ? ORDER BY sort_order ASC',
      [id]
    );
    const p = projects[0];
    p.gallery = gallery;
    p.tags = p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [];
    p.hill_colors = p.hill_colors ? p.hill_colors.split(',') : ['#a3e635', '#65a30d'];
    return NextResponse.json(p);
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
    const { name, category, it_sub_category, description, tags, sky_grad, hill_colors } = body;
    const tagsStr = Array.isArray(tags) ? tags.join(',') : tags;
    const colorsStr = Array.isArray(hill_colors) ? hill_colors.join(',') : hill_colors;

    await pool.execute(
      `UPDATE projects SET name=?, category=?, it_sub_category=?, description=?, tags=?, sky_grad=?, hill_colors=? WHERE id=?`,
      [name, category, it_sub_category || '', description, tagsStr || '', sky_grad || 'from-sky-200 to-sky-400', colorsStr || '#a3e635,#65a30d', id]
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
    await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
