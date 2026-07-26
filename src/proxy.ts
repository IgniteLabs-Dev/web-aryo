import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me');

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/secret-admin') && path !== '/secret-admin/login') {
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/secret-admin/login', request.url));
    }
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL('/secret-admin/login', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/secret-admin/:path*',
};
