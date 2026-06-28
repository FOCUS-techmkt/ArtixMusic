import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// ════════════════════════════════════════════════════════════════
// Webhook de Resend → registra aperturas/clics/entregas en `analytics`.
// Configurar en Resend → Webhooks apuntando a /api/email/webhook.
// Atribución por tag `artist` (slug) que añade /api/email/send.
//
// Seguridad: verificación de firma Svix (la usa Resend). El secreto
// (RESEND_WEBHOOK_SECRET, formato "whsec_…") firma `${id}.${ts}.${body}`.
// Si el secreto no tiene formato whsec_, se acepta como clave compartida
// simple vía header `svix-signature`/`x-webhook-key`. Sin secreto = abierto
// (solo dev). Usa service-role para escribir analytics sin sesión.
// ════════════════════════════════════════════════════════════════

const EVENT_MAP: Record<string, string> = {
  'email.sent':       'email_sent',
  'email.delivered':  'email_delivered',
  'email.opened':     'email_opened',
  'email.clicked':    'email_clicked',
  'email.bounced':    'email_bounced',
  'email.complained': 'email_complained',
}

// Verificación de firma Svix (https://docs.svix.com/receiving/verifying-payloads/how-manual)
function verifySvix(secret: string, headers: Headers, body: string): boolean {
  const id = headers.get('svix-id')
  const ts = headers.get('svix-timestamp')
  const sigHeader = headers.get('svix-signature')
  if (!id || !ts || !sigHeader) return false
  // tolerancia de 5 min para evitar replays
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - Number(ts)) > 60 * 5) return false

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${id}.${ts}.${body}`
  const expected = crypto.createHmac('sha256', secretBytes).update(signedContent).digest('base64')

  // svix-signature: "v1,<sig> v1,<sig2> …"
  return sigHeader.split(' ').some(part => {
    const sig = part.split(',')[1] ?? part
    try {
      return sig.length === expected.length &&
        crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    } catch { return false }
  })
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text()
    const secret = process.env.RESEND_WEBHOOK_SECRET

    if (secret) {
      const ok = secret.startsWith('whsec_')
        ? verifySvix(secret, req.headers, raw)
        : (req.headers.get('x-webhook-key') === secret || req.nextUrl.searchParams.get('key') === secret)
      if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
    }

    const body = JSON.parse(raw || '{}')
    const type = body?.type as string | undefined
    const eventType = type ? EVENT_MAP[type] : undefined
    if (!eventType) return NextResponse.json({ ok: true, ignored: type })

    const tags = (body?.data?.tags ?? []) as { name: string; value: string }[]
    const slug = Array.isArray(tags) ? tags.find(t => t.name === 'artist')?.value : undefined
    const variant = Array.isArray(tags) ? tags.find(t => t.name === 'variant')?.value : undefined
    if (!slug) return NextResponse.json({ ok: true, note: 'sin artist tag' })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) return NextResponse.json({ ok: true, note: 'sin service role' })
    const supabase = createClient(url, serviceKey)

    const { data: artist } = await supabase.from('artists').select('id').eq('slug', slug).maybeSingle()
    if (!artist) return NextResponse.json({ ok: true, note: 'artista no encontrado' })

    // La variante A/B se guarda en `referrer` (sin migración de schema)
    await supabase.from('analytics').insert({
      artist_id: artist.id,
      event_type: eventType as never,
      ...(variant ? { referrer: variant } : {}),
    } as never)
    return NextResponse.json({ ok: true, logged: eventType, variant })
  } catch (err) {
    console.error('[email/webhook]', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
