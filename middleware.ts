import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './config';

export const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ru',
});

export const config = {
  matcher: ['/', '/(ru|en)/:path*'],
};

export function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const token = request.cookies.get('token')?.value;

  if (token) {
    if (
      url.pathname.includes('/login') ||
      url.pathname.includes('/register') ||
      url.pathname.includes('/reset')
    ) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    if (url.pathname.includes('/api')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  if (
    url.pathname.includes('/login') ||
    url.pathname.includes('/register') ||
    url.pathname.includes('/reset')
  ) {
    return i18nMiddleware(request) || NextResponse.next();
  }

  return i18nMiddleware(request) || NextResponse.next();
}
