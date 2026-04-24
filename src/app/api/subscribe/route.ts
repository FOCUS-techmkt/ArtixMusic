import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, artistSlug, name } = body as {
      email: string
      artistSlug: string
      name?: string
    }

    // Basic validation
    if (!email || !artistSlug) {
      return NextResponse.json({ error: 'email y artistSlug son requeridos' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const supabase = await createClient()

    const { error } = await supabase
      .from('fan_subscribers')
      .insert({
        artist_slug: artistSlug.toLowerCase().trim(),
        email:       email.toLowerCase().trim(),
        name:        name?.trim() ?? null,
        source:      'presskit',
      })

    if (error) {
      // Unique constraint: already subscribed — treat as success (idempotent)
      if (error.code === '23505') {
        return NextResponse.json({ ok: true, message: 'Ya estás suscrito' })
      }
      console.error('[subscribe]', error)
      return NextResponse.json({ error: 'Error al guardar suscripción' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[subscribe] unexpected error', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
