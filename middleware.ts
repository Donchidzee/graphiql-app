import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales } from './config';

// Initialize i18n middleware
export const i18nMiddleware = createMiddleware({
  locales,
  defaultLocale: 'ru',
});

export const config = {
  matcher: ['/', '/(ru|en)/:path*'],
};

export function middleware(request: NextRequest) {
  // Handle i18n
  const i18nResponse = i18nMiddleware(request);

  const url = new URL(request.url);
  if (url.pathname.includes('/login') || url.pathname.includes('/register')) {
    return i18nResponse || NextResponse.next();
  }

  const authToken = request.cookies.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.redirect(new URL('/ru/login', request.url));
  }

  // Proceed with i18n or other responses
  return i18nResponse || NextResponse.next();
}
