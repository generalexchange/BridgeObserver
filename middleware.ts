import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rewrites press.* host requests to the /press/* App Router segment so
 * press.bridgeobserver.com/dashboard serves app/press/dashboard.
 *
 * Local dev: use `127.0.0.1 press.localhost` in hosts and open http://press.localhost:3000
 * or visit http://localhost:3000/press directly.
 */
function isPressHost(host: string): boolean {
  const h = host.split(':')[0]?.toLowerCase() ?? '';
  if (h.startsWith('press.')) return true;
  if (h === 'press.localhost') return true;
  return false;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const { pathname } = request.nextUrl;

  if (!isPressHost(host)) {
    return NextResponse.next();
  }

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  if (pathname === '/' || pathname === '') {
    url.pathname = '/press';
  } else if (!pathname.startsWith('/press')) {
    url.pathname = `/press${pathname}`;
  }

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
