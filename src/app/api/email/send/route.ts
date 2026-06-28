import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ════════════════════════════════════════════════════════════════
// Envío real de email vía Resend (REST API, sin dependencia npm).
// Requiere variables de entorno:
//   RESEND_API_KEY   — API key de Resend
//   RESEND_FROM      — remitente verificado, ej. "Artista <hola@tudominio.com>"
// Si faltan, devuelve 503 con instrucciones (no rompe el build).
// ════════════════════════════════════════════════════════════════

const RESEND_ENDPOINT = 'https://api.resend.com/emails/batch'
const MAX_RECIPIENTS = 500   // tope de seguridad por envío

interface SendBody {
  subject:    string
  html:       string
  recipients: string[]      // emails del segmento (calculados en cliente)
  test?:      boolean       // si true, ignora recipients y envía solo a testEmail
  testEmail?: string
  variant?:   'A' | 'B'     // A/B test: etiqueta la variante para el tracking
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: artist } = await supabase
      .from('artists').select('id, slug, artist_name, booking_email').eq('user_id', user.id).maybeSingle()
    if (!artist) return NextResponse.json({ error: 'Artist not found' }, { status: 404 })

    const apiKey = process.env.RESEND_API_KEY
    const from   = process.env.RESEND_FROM
    if (!apiKey || !from) {
      return NextResponse.json({
        error: 'no_provider',
        message: 'Envío no configurado. Añade RESEND_API_KEY y RESEND_FROM (remitente de dominio verificado) en tus variables de entorno para activar el envío real.',
      }, { status: 503 })
    }

    const body = (await req.json()) as SendBody
    if (!body.subject || !body.html) {
      return NextResponse.json({ error: 'subject y html son requeridos' }, { status: 400 })
    }

    // Resolver destinatarios
    let recipients: string[]
    if (body.test) {
      const to = (body.testEmail || artist.booking_email || user.email || '').trim()
      if (!to) return NextResponse.json({ error: 'Sin email de prueba disponible' }, { status: 400 })
      recipients = [to]
    } else {
      recipients = [...new Set((body.recipients ?? []).map(e => e.trim().toLowerCase()).filter(Boolean))]
      if (recipients.length === 0) return NextResponse.json({ error: 'Segmento sin destinatarios' }, { status: 400 })
      if (recipients.length > MAX_RECIPIENTS) {
        return NextResponse.json({ error: `Máximo ${MAX_RECIPIENTS} destinatarios por envío` }, { status: 400 })
      }
    }

    // Resend batch: un objeto por destinatario (envío individual, sin exponer la lista)
    const payload = recipients.map(to => ({
      from,
      to: [to],
      subject: body.subject,
      html: body.html.replace(/\{\{unsubscribe_url\}\}/g, `https://artistpulse.io/u/${artist.slug}?e=${encodeURIComponent(to)}`),
      // Tags para atribuir aperturas/clics al artista (y variante A/B) en el webhook
      tags: [
        { name: 'artist', value: artist.slug },
        ...(body.variant ? [{ name: 'variant', value: body.variant }] : []),
      ],
    }))

    // Resend procesa hasta 100 por batch
    let sent = 0
    const errors: string[] = []
    for (let i = 0; i < payload.length; i += 100) {
      const chunk = payload.slice(i, i + 100)
      const res = await fetch(RESEND_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk),
      })
      if (res.ok) sent += chunk.length
      else errors.push(`${res.status}: ${(await res.text()).slice(0, 140)}`)
    }

    if (sent === 0) {
      return NextResponse.json({ error: 'send_failed', message: errors[0] ?? 'No se pudo enviar' }, { status: 502 })
    }

    // Log
    await supabase.from('analytics').insert({ artist_id: artist.id, event_type: 'email_sent' as never })

    return NextResponse.json({ ok: true, sent, test: !!body.test, partialErrors: errors })
  } catch (err) {
    console.error('[email/send] error', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
