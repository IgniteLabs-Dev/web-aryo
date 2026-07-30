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

  // Validasi max 3 images per service
  const { count } = await supabase
    .from('service_gallery')
    .select('*', { count: 'exact', head: true })
    .eq('service_id', id);

  if ((count ?? 0) >= 3) {
    return NextResponse.json(
      { error: 'Maximum 3 images per service' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('service_gallery')
    .insert({ service_id: id, image_url: body.image_url })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE — remove gallery image (by imageId in query)
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
    .from('service_gallery')
    .delete()
    .eq('id', imageId)
    .eq('service_id', id); // safety: ensure image belongs to this service

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
