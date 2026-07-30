import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';

interface Ctx { params: Promise<{ id: string }> }

// PUT — admin only
export async function PUT(request: NextRequest, ctx: Ctx) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await ctx.params;
  const body = await request.json();

  if (!body.name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  // type tidak boleh diubah (use admin UI for new type instead)
  const { data, error } = await supabase
    .from('categories')
    .update({
      name: body.name,
      sort_order: Number(body.sort_order ?? 0),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// DELETE — admin only
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const { id } = await ctx.params;

  // Cek apakah kategori sedang dipakai (opsional, untuk info)
  const [services, projects, pubCer] = await Promise.all([
    supabase.from('services').select('id', { count: 'exact', head: true }).eq('category',
      (await supabase.from('categories').select('name').eq('id', id).single()).data?.name ?? ''),
    supabase.from('projects').select('id', { count: 'exact', head: true }).eq('category',
      (await supabase.from('categories').select('name').eq('id', id).single()).data?.name ?? ''),
    supabase.from('pub_cer').select('id', { count: 'exact', head: true }).eq('type',
      (await supabase.from('categories').select('name').eq('id', id).single()).data?.name ?? ''),
  ]);

  const totalUsed =
    (services.count ?? 0) + (projects.count ?? 0) + (pubCer.count ?? 0);

  if (totalUsed > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete: this category is still used by ${totalUsed} item(s). Remove or reassign those items first.`,
      },
      { status: 400 }
    );
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
