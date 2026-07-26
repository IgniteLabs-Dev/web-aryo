import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';

// PENTING: export runtime agar bisa pakai Node.js API
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    console.log('Login attempt:', username);

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username & password required' },
        { status: 400 }
      );
    }

    const [rows]: any = await pool.execute(
      'SELECT id, username, password_hash FROM admin_users WHERE username = ?',
      [username]
    );

    console.log('User found:', rows.length > 0);

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    
    console.log('Password valid:', valid);

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await signToken({ id: user.id, username: user.username });
    await setAuthCookie(token);

    return NextResponse.json({ success: true, username: user.username });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}
