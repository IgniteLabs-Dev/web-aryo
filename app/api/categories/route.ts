import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';

// GET — public
export async function GET() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('GET /categories error:', error);
    return NextResponse.json([]);
  }
  return NextResponse.json(data ?? []);
}

// POST — admin only
export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const body = await request.json();

  if (!body.name || !body.type) {
    return NextResponse.json({ error: 'name and type are required' }, { status: 400 });
  }

  if (!['service', 'project', 'pub_cer'].includes(body.type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: body.name,
      type: body.type,
      sort_order: Number(body.sort_order ?? 0),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
