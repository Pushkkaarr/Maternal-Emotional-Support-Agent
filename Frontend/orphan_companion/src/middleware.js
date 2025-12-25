import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If there's no session and the user is trying to access a protected route
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    // Instead of redirecting (which changes the browser URL), rewrite to the
    // root page so the original URL remains visible. Store the original
    // pathname in a cookie so the client can restore it after authentication.
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