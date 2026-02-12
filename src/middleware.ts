import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/public') ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)
  ) {
    return NextResponse.next()
  }

  // Check if user is trying to access protected routes
  const isProtectedRoute = pathname.startsWith('/dashboard')
  const isAuthRoute = pathname.startsWith('/auth') || pathname.startsWith('/login') || pathname.startsWith('/register')
  const isInstallerRoute = pathname.startsWith('/install')

  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value

  if (isProtectedRoute && !token) {
    // Redirect to login if accessing dashboard without token
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if ((isAuthRoute || isInstallerRoute) && token) {
    // Redirect to dashboard if already logged in and trying to access auth routes
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
