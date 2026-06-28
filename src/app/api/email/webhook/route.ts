import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ════════════════════════════════════════════════════════════════
// Webhook de Resend → registra aperturas/clics/entregas en `analytics`.
// Configurar en Resend → Webhooks apuntando a /api/email/webhook.
// Atribución por tag `artist` (slug) que añade /api/email/send.
//
// Seguridad: comprobación de secreto compartido vía query `?key=` o
// header `x-webhook-key` contra RESEND_WEBHOOK_SECRET. (La verificación
// Svix completa sería el siguiente paso de hardening.)
// Usa service-role para escribir analytics sin sesión de usuario.
// ════════════════════════════════════════════════════════════════

const EVENT_MAP: Record<string, string> = {
  'email.sent':       'email_sent',
  'email.delivered':  'email_delivered',
  'email.opened':     'email_opened',
  'email.clicked':    'email_clicked',
  'email.bounced':    'email_bounced',
  'email.complained': 'email_complained',
}

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.RESEND_WEBHOOK_SECRET
    if (secret) {
      const key = req.nextUrl.searchParams.get('key') ?? req.headers.get('x-webhook-key')
      if (key !== secret) return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const type = body?.type as string | undefined
    const eventType = type ? EVENT_MAP[type] : undefined
    if (!eventType) return NextResponse.json({ ok: true, ignored: type })

    // Atribución: tag `artist` = slug (lo añade el envío)
    const tags = (body?.data?.tags ?? []) as { name: string; value: string }[]
    const slug = Array.isArray(tags) ? tags.find(t => t.name === 'artist')?.value : undefined
    if (!slug) return NextResponse.json({ ok: true, note: 'sin artist tag' })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) return NextResponse.json({ ok: true, note: 'sin service role' })
    const supabase = createClient(url, serviceKey)

    const { data: artist } = await supabase.from('artists').select('id').eq('slug', slug).maybeSingle()
    if (!artist) return NextResponse.json({ ok: true, note: 'artista no encontrado' })

    await supabase.from('analytics').insert({ artist_id: artist.id, event_type: eventType as never })
    return NextResponse.json({ ok: true, logged: eventType })
  } catch (err) {
    console.error('[email/webhook]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
