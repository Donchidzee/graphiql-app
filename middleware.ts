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
  const i18nResponse = i18nMiddleware(request);

  const url = new URL(request.url);
  if (
    url.pathname.includes('/login') ||
    url.pathname.includes('/register') ||
    url.pathname.includes('/reset')
  ) {
    return i18nResponse || NextResponse.next();
  }

  const authToken = request.cookies.get('authToken')?.value;

  if (!authToken && url.pathname.includes('/api')) {
    return NextResponse.redirect(new URL('/ru/login', request.url));
  }

  return i18nResponse || NextResponse.next();
}
