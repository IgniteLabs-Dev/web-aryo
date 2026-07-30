import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';

// GET — public
export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*, gallery:project_gallery(*)')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('GET /projects error:', error);
    return NextResponse.json([]);
  }
  return NextResponse.json(data ?? []);
}

// POST — admin only
export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const body = await request.json();

  if (!body.name || !body.category || !body.description) {
    return NextResponse.json(
      { error: 'Missing required fields (name, category, description)' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: body.name,
      category: body.category,
      it_sub_category: body.it_sub_category ?? '',
      description: body.description,
      tags: Array.isArray(body.tags) ? body.tags : [],
      sky_grad: body.sky_grad ?? 'from-sky-200 to-sky-400',
      hill_colors: Array.isArray(body.hill_colors) && body.hill_colors.length > 0
        ? body.hill_colors
        : ['#a3e635', '#65a30d'],
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
