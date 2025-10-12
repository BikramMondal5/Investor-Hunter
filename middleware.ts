import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_session')?.value
  const pathname = request.nextUrl.pathname
  
  // Check if this is a redirect from OAuth with success params
  const searchParams = request.nextUrl.searchParams
  const isOAuthRedirect = searchParams.has('registered') || searchParams.has('signin')
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/investor', '/submit', '/internal-interview', '/investor-meeting']
  const adminRoutes = ['/admin']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // Routes accessible to both roles
  const sharedRoutes = ['/investor-meeting']
  const isSharedRoute = sharedRoutes.some(route => pathname.startsWith(route))
  
  // Admin routes - require admin role
  if (isAdminRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/?redirected=true', request.url))
    }
    
    try {
      const userData = JSON.parse(session)
      if (userData.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      
      const response = NextResponse.next()
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      return response
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  // If trying to access protected routes without authentication
  // BUT allow OAuth redirects to pass through (cookie will be set via redirect)
  if (!session && isProtectedRoute && !isOAuthRedirect) {
    const url = new URL('/', request.url)
    url.searchParams.set('redirected', 'true')
    const response = NextResponse.redirect(url)
    
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  }
  
  // If OAuth redirect but no session yet, allow it through once
  // The cookie should be present on the next request
  if (!session && isOAuthRedirect && isProtectedRoute) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    return response
  }
  
  // If authenticated, check role-based access
  if (session && isProtectedRoute) {
    try {
      const userData = JSON.parse(session)
      const userRole = userData.role
      
      // Skip role check for shared routes
      if (isSharedRoute) {
        const response = NextResponse.next()
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
      
      const response = NextResponse.next()
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      return response
      
    } catch (error) {
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
    '/internal-interview/:path*',
    '/admin/:path*'
  ]
}