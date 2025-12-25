import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();

  const cookieHeader = req.headers.get('cookie') || '';

  // Ask the backend to validate the session. The backend holds the
  // Supabase service role key and can safely verify sessions.
  const sessionResp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/session`, {
    method: 'GET',
    headers: {
      cookie: cookieHeader,
    },
  });

  let session = null;
  if (sessionResp.ok) {
    try {
      const json = await sessionResp.json();
      session = json.session ?? null;
    } catch (e) {
      session = null;
    }
  }

  // If there's no session and the user is trying to access a protected route
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    // Rewrite to the root page so the original URL remains visible. Store
    // the original pathname in a cookie so the client can restore it after auth.
    res.cookies.set({ name: 'redirectedFrom', value: req.nextUrl.pathname, path: '/' });
    return NextResponse.rewrite(new URL('/', req.url));
  }

  return res;
}

// Specify which routes should be protected
export const config = {
  matcher: [
    '/Models/:path*',
    '/About/:path*',
    '/Donation/:path*',
    '/Adoption/:path*',
    '/Community/:path*',
  ],
}; 