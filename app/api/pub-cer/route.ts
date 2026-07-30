import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAdmin } from '@/lib/auth';

// GET — public
export async function GET() {
  const { data, error } = await supabase
    .from('pub_cer')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('id', { ascending: true });

  if (error) {
    console.error('GET /pub-cer error:', error);
    return NextResponse.json([]);
  }
  return NextResponse.json(data ?? []);
}

// POST — admin only
export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;

  const body = await request.json();

  if (!body.type || !body.date || !body.name) {
    return NextResponse.json(
      { error: 'Missing required fields (type, date, name)' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('pub_cer')
    .insert({
      type: body.type,
      date: body.date,
      name: body.name,
      id_journal_issuer: body.id_journal_issuer ?? '',
      url: body.url ?? '',
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
