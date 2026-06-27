import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const DAILY_LIMIT = 20

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: artistRecord } = await supabase
      .from('artists').select('id').eq('user_id', user.id).maybeSingle()
    const artistId = artistRecord?.id ?? user.id

    // Rate limit
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
    const { count } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('artist_id', artistId)
      .eq('event_type', 'ai_email' as never)
      .gte('created_at', todayStart.toISOString())
    const remaining = DAILY_LIMIT - (count ?? 0)
    if (remaining <= 0) {
      return NextResponse.json({ error: 'rate_limit', message: `Límite diario alcanzado (${DAILY_LIMIT}/día).`, remaining: 0 }, { status: 429 })
    }

    const { artistName, goal, layout, genres, tone, instruction } = await request.json()

    const prompt = `Eres un copywriter experto en email marketing musical. Escribes emails que los fans ABREN y en los que hacen CLIC — cálidos, directos, con la voz auténtica de un artista, nunca corporativos.

ARTISTA: ${artistName || 'el artista'}
GÉNEROS: ${Array.isArray(genres) ? genres.join(', ') : (genres || 'música electrónica')}
OBJETIVO DEL EMAIL: ${goal || 'conectar con fans'}
TIPO/PLANTILLA: ${layout || 'general'}
TONO DESEADO: ${tone || 'cercano, auténtico, con energía'}
${instruction ? `INSTRUCCIÓN ESPECÍFICA DEL ARTISTA: ${instruction}` : ''}

Escribe el copy en ESPAÑOL (a menos que la instrucción pida otro idioma). Reglas:
- Asunto: máx 50 caracteres, que genere curiosidad o urgencia real. Sin clickbait barato.
- Preheader: complementa al asunto (no lo repite), máx 90 caracteres.
- Heading: gancho corto y potente.
- Body: 2-3 párrafos cortos, en primera persona, escaneable. Usa saltos \\n\\n entre párrafos.
- CTA: 2-4 palabras, orientado a la acción.

Devuelve EXACTAMENTE este JSON sin texto adicional:
{
  "subject": "...",
  "subject_alt": "<una variante A/B del asunto>",
  "preheader": "...",
  "heading": "...",
  "body": "...",
  "cta_text": "..."
}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1200,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')
    const data = JSON.parse(jsonMatch[0])

    await supabase.from('analytics').insert({ artist_id: artistId, event_type: 'ai_email' as never })
    return NextResponse.json({ ...data, remaining: remaining - 1 })
  } catch (err) {
    console.error('AI email error:', err)
    return NextResponse.json({ error: 'Failed to generate copy' }, { status: 500 })
  }
}
