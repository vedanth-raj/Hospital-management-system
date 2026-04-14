import { NextRequest, NextResponse } from 'next/server';

function roleFromToken(token: string): string | null {
  if (token.startsWith('demo:')) {
    const parts = token.split(':');
    return parts[2] || null;
  }

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return payload?.role || null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const roleCookie = request.cookies.get('auth_role')?.value;
  const pathname = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/auth/login',
    '/auth/register',
    '/',
    '/emergency',
    '/api/emergency',
    '/api/auth/login',
    '/api/auth/register',
  ];

  // Check if route is public
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If user is already logged in and tries to access auth pages, redirect to dashboard
    if (token && (pathname === '/auth/login' || pathname === '/auth/register')) {
      const role = roleCookie || roleFromToken(token);
      if (role) {
        const roleRedirects: Record<string, string> = {
          admin: '/admin/dashboard',
          doctor: '/doctor/queue',
          reception: '/reception/dashboard',
          driver: '/driver/dashboard',
          patient: '/patient/dashboard',
        };
        return NextResponse.redirect(new URL(roleRedirects[role] || '/', request.url));
      }
    }
    return NextResponse.next();
  }

  // Protected routes - verify token
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const role = roleCookie || roleFromToken(token);
  if (!role) return NextResponse.redirect(new URL('/auth/login', request.url));

  // Role-based access control
  const rolePatterns: Record<string, RegExp[]> = {
    admin: [/^\/admin/, /^\/api\/admin/],
    doctor: [/^\/doctor/, /^\/api\/doctor/],
    reception: [/^\/reception/, /^\/api\/reception/],
    driver: [/^\/driver/, /^\/api\/driver/],
    patient: [/^\/patient/, /^\/api\/patient/],
  };

  const allowedPatterns = rolePatterns[role] || [];
  const hasAccess = allowedPatterns.some((pattern) => pattern.test(pathname));

  if (!hasAccess && !pathname.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
