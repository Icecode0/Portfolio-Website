import { NextResponse, type NextRequest } from 'next/server';

// Only protect API routes, nothing else
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/user/')) {
    const token = request.cookies.get('discord_token');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/user/:path*']
};