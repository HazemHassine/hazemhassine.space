import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function proxy(request) {
  const path = request.nextUrl.pathname;

  // Paths that require authentication
  const isProtectedPath = path.startsWith('/admin') || path.startsWith('/api/admin/save');
  
  // Public paths inside /admin
  const isPublicPath = path === '/admin/login';

  if (isProtectedPath && !isPublicPath) {
    const token = request.cookies.get('admin_session')?.value;

    if (!token) {
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      // Invalid or expired token
      if (path.startsWith('/api/')) {
        return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/save'
  ],
};
