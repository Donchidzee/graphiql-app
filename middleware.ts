import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: '/api/:function*',
};

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
