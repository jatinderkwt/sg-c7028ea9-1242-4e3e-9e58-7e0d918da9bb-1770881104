import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Check if user is trying to access protected routes
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')
    const isAuthRoute = ['/login', '/register', '/forgot-password'].includes(pathname)
    const isInstallerRoute = pathname.startsWith('/install')

    if (isProtectedRoute && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if ((isAuthRoute || isInstallerRoute) && token) {
      if (token.role === 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true // Let the middleware function handle the logic
    },
  }
)



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
