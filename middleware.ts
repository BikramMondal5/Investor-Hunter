import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session')?.value
  const pathname = request.nextUrl.pathname
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/investor', '/submit', '/internal-interview', '/investor-meeting']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Routes accessible to both roles
  const sharedRoutes = ['/investor-meeting']
  const isSharedRoute = sharedRoutes.some(route => pathname.startsWith(route))
  
  // If trying to access protected routes without authentication
  if (!session && isProtectedRoute) {
    // Redirect to home page (which will show the auth modal)
    const url = new URL('/', request.url)
    url.searchParams.set('redirected', 'true')
    const response = NextResponse.redirect(url)
    
    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  }
  
  // If authenticated, check role-based access
  if (session && isProtectedRoute) {
    try {
      // Parse the session to get user role
      const userData = JSON.parse(session)
      const userRole = userData.role
      
      // Skip role check for shared routes
      if (isSharedRoute) {
        const response = NextResponse.next()
        // Prevent caching of authenticated pages
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
        return response
      }
      
      // Entrepreneur trying to access investor routes
      if (userRole === 'entrepreneur' && pathname.startsWith('/investor')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      
      // Investor trying to access entrepreneur routes
      if (userRole === 'investor' && (
        pathname.startsWith('/dashboard') || 
        pathname.startsWith('/submit') ||
        pathname.startsWith('/internal-interview')
      )) {
        return NextResponse.redirect(new URL('/investor', request.url))
      }
      
      // Add cache control to authenticated pages
      const response = NextResponse.next()
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      return response
      
    } catch (error) {
      // If session parsing fails, clear the invalid session and redirect to home
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.set('user_session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
      })
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/investor/:path*',
    '/submit/:path*',
    '/internal-interview/:path*'
  ]
}