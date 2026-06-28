import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    // Acepta tanto artistSlug (legacy) como artist_slug (FanCaptureSection),
    // y propaga `source` (ej. "presskit:gift") para poder segmentar luego.
    const { email, name } = body as { email: string; name?: string }
    const artistSlug: string | undefined = body.artistSlug ?? body.artist_slug
    const source: string = typeof body.source === 'string' && body.source ? body.source : 'presskit'

    // Basic validation
    if (!email || !artistSlug) {
      return NextResponse.json({ error: 'email y artistSlug son requeridos' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const supabase = await createClient()

    const row = {
      artist_slug: artistSlug.toLowerCase().trim(),
      email:       email.toLowerCase().trim(),
      name:        name?.trim() ?? null,
      source,
    }

    // Upsert: evita duplicados por (artist_slug, email) y refresca name/source
    // si el fan vuelve a suscribirse. Idempotente por diseño.
    const { error } = await supabase
      .from('fan_subscribers')
      .upsert(row, { onConflict: 'artist_slug,email' })

    if (error) {
      // Si la constraint no coincide, tratamos el duplicado como éxito (idempotente)
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
