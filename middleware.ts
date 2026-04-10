import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Rewrites subdomain hosts to App Router segments:
 * - press.* → /press/* (Press CMS — unchanged)
 * - markets.* → /markets/* (Market Intelligence Workstation)
 *
 * Local: press.localhost / markets.localhost in hosts, or use /press and /markets on localhost.
 */
function hostName(host: string): string {
  return host.split(':')[0]?.toLowerCase() ?? '';
}

function isPressHost(h: string): boolean {
  return h.startsWith('press.') || h === 'press.localhost';
}

function isMarketsHost(h: string): boolean {
  return h.startsWith('markets.') || h === 'markets.localhost';
}

function shouldBypass(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

function rewriteToSegment(request: NextRequest, segment: 'press' | 'markets'): NextResponse {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  if (pathname === '/' || pathname === '') {
    url.pathname = `/${segment}`;
  } else if (!pathname.startsWith(`/${segment}`)) {
    url.pathname = `/${segment}${pathname}`;
  }

  return NextResponse.rewrite(url);
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  const { pathname } = request.nextUrl;
  const h = hostName(host);

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  if (isMarketsHost(h)) {
    return rewriteToSegment(request, 'markets');
  }

  if (isPressHost(h)) {
    return rewriteToSegment(request, 'press');
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
