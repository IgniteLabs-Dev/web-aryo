import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-change-me-in-production-123'
);

const COOKIE_NAME = 'admin_token';
const LOGIN_PATH = '/secret-admin/login';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================================
  // Hanya protect /secret-admin/* (kecuali /secret-admin/login)
  // ============================================================
  if (pathname.startsWith('/secret-admin') && pathname !== LOGIN_PATH) {
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // Tidak ada token → redirect ke login
    if (!token) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set('redirect', pathname); // optional: save intended URL
      return NextResponse.redirect(loginUrl);
    }

    // Ada token → verify
    try {
      await jwtVerify(token, secret);
      return NextResponse.next(); // Token valid, lanjut
    } catch (err) {
      // Token invalid/expired → hapus cookie + redirect
      const loginUrl = new URL(LOGIN_PATH, request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  // ============================================================
  // Semua route lain → lanjut
  // ============================================================
  return NextResponse.next();
}

// ============================================================
// CONFIG: Hanya jalankan untuk path /secret-admin/*
// ============================================================
export const config = {
  matcher: [
    '/secret-admin/:path*',
  ],
};
