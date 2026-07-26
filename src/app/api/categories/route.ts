import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAdmin } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET - list categories by type (public, no auth needed)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    
    let query = 'SELECT * FROM categories';
    const params: any[] = [];
    
    if (type) {
      query += ' WHERE type = ?';
      params.push(type);
    }
    
    query += ' ORDER BY type ASC, sort_order ASC, id ASC';
    
    const [rows]: any = await pool.execute(query, params);
    return NextResponse.json(rows);
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}

// POST - create category (admin only)
export async function POST(request: NextRequest) {
  const authError = await verifyAdmin(request);
  if (authError) return authError;
  
  try {
    const { name, type, sort_order } = await request.json();
    
    if (!name || !type) {
      return NextResponse.json({ error: 'Name and type required' }, { status: 400 });
    }
    
    if (!['service', 'project', 'pub_cer'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
    
    const [result]: any = await pool.execute(
      'INSERT INTO categories (name, type, sort_order) VALUES (?, ?, ?)',
      [name.trim(), type, sort_order || 0]
    );
    
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Category name already exists for this type' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed', details: error.message }, { status: 500 });
  }
}
