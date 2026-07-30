import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';

interface Ctx { params: Promise<{ id: string }> }

// POST — add gallery image
export async function POST(request: NextRequest, ctx: Ctx) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await ctx.params;
  const body = await request.json();

  if (!body.image_url) {
    return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('project_gallery')
    .insert({ project_id: id, image_url: body.image_url })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE — remove gallery image
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await ctx.params;
  const url = new URL(request.url);
  const imageId = url.searchParams.get('imageId');

  if (!imageId) {
    return NextResponse.json({ error: 'imageId is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('project_gallery')
    .delete()
    .eq('id', imageId)
    .eq('project_id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
