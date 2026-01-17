/**
 * @description Middleware for protecting Aperture routes
 * Only users with admin, manager, or staff roles can access Aperture
 */

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = ['/aperture/login']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/aperture')) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/aperture/login', request.url))
    }

    const { data: staff } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (!staff || !['admin', 'manager', 'staff'].includes(staff.role)) {
      return NextResponse.redirect(new URL('/aperture/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/aperture/:path*',
    '/api/aperture/:path*',
  ],
}
