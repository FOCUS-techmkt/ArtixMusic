import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase unreachable — allow the request through; server components will handle auth
  }

  const { pathname } = request.nextUrl

  // ── Dominio propio del artista → sirve su press kit en la raíz ──
  // Seguro y "no-op" hasta que exista la columna artists.custom_domain
  // y un dominio configurado: solo actúa para hosts que NO son de la app,
  // y cualquier error (p.ej. columna inexistente) cae al flujo normal.
  const host = (request.headers.get('host') || '').toLowerCase().split(':')[0]
  const APP_HOSTS = ['localhost', '127.0.0.1', 'artix-music.vercel.app', 'artistpulse.io', 'presskit.pro']
  const isAppHost = APP_HOSTS.includes(host) || host.endsWith('.vercel.app')
  if (host && !isAppHost && pathname === '/') {
    try {
      const { data } = await supabase.from('artists').select('slug').eq('custom_domain', host).maybeSingle()
      if (data?.slug) return NextResponse.rewrite(new URL(`/${data.slug}`, request.url))
    } catch { /* sin columna / error → comportamiento normal */ }
  }

  // Redirect logged-in users away from auth pages
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Protect private routes
  const protectedPrefixes = ['/dashboard', '/panel', '/onboarding']
  if (protectedPrefixes.some((p) => pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
