import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const [projects]: any = await pool.execute(
      'SELECT * FROM projects ORDER BY sort_order ASC, id ASC'
    );
    for (const p of projects) {
      const [gallery]: any = await pool.execute(
        'SELECT id, image_url FROM project_gallery WHERE project_id = ? ORDER BY sort_order ASC',
        [p.id]
      );
      p.gallery = gallery;
      p.tags = p.tags ? p.tags.split(',').map((t: string) => t.trim()) : [];
      p.hill_colors = p.hill_colors ? p.hill_colors.split(',') : ['#a3e635', '#65a30d'];
    }
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { name, category, it_sub_category, description, tags, sky_grad, hill_colors } = body;
    const tagsStr = Array.isArray(tags) ? tags.join(',') : tags;
    const colorsStr = Array.isArray(hill_colors) ? hill_colors.join(',') : hill_colors;

    const [result]: any = await pool.execute(
      `INSERT INTO projects (name, category, it_sub_category, description, tags, sky_grad, hill_colors) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, category, it_sub_category || '', description, tagsStr || '', sky_grad || 'from-sky-200 to-sky-400', colorsStr || '#a3e635,#65a30d']
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
