import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me-in-production-123'
);
const COOKIE_NAME = 'admin_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// =============================
// JWT helpers
// =============================
export async function signToken(payload: { id: number; username: string }) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: number; username: string };
  } catch {
    return null;
  }
}

// =============================
// Cookies (Next.js 15 — async)
// =============================
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthFromRequest(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifyToken(token);
}

// =============================
// Admin verification
// =============================
export async function verifyAdmin(request: NextRequest): Promise<NextResponse | null> {
  const auth = await getAuthFromRequest(request);
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

// =============================
// Login helper — verifies against Supabase 'admins' table + bcrypt
// =============================
export async function loginAdmin(username: string, password: string) {
  const { data, error } = await supabase
    .from('admins')
    .select('id, username, password')
    .eq('username', username)
    .single();

  if (error || !data) return null;

  const valid = await bcrypt.compare(password, data.password);
  if (!valid) return null;

  return { id: data.id, username: data.username };
}
