import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const DAILY_LIMIT = 5

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // ── Rate limit: count AI calls today for this user ────────
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('artist_id', user.id)          // using user_id as artist_id proxy for the check
      .eq('event_type', 'ai_analysis' as never)
      .gte('created_at', todayStart.toISOString())

    const usedToday = count ?? 0
    const remaining = DAILY_LIMIT - usedToday

    if (remaining <= 0) {
      return NextResponse.json(
        { error: 'rate_limit', message: `Límite diario alcanzado (${DAILY_LIMIT}/día). Vuelve mañana.`, remaining: 0 },
        { status: 429 }
      )
    }

    const { artist, sections } = await request.json()

    const enabledSections  = sections?.filter((s: { is_enabled: boolean }) => s.is_enabled).map((s: { name: string }) => s.name) ?? []
    const disabledSections = sections?.filter((s: { is_enabled: boolean }) => !s.is_enabled).map((s: { name: string }) => s.name) ?? []
    const heroConfig  = sections?.find((s: { name: string }) => s.name === 'hero')?.config  ?? {}
    const bioConfig   = sections?.find((s: { name: string }) => s.name === 'bio')?.config   ?? {}
    const musicConfig = sections?.find((s: { name: string }) => s.name === 'music')?.config ?? {}

    const prompt = `Eres un consultor de marketing para artistas de música electrónica. Analiza este press kit y da recomendaciones específicas y accionables en español.

DATOS DEL ARTISTA:
- Nombre: ${artist.artist_name}
- Rol: ${artist.role}
- Género: ${artist.genre}
- Bio: "${(artist.bio ?? '').slice(0, 300)}"
- Palabras de sonido: ${(artist.sound_words ?? []).join(', ')}
- Logros: ${(artist.achievements ?? []).map((a: { title: string }) => a.title).join(', ') || 'ninguno'}
- Email de booking: ${artist.booking_email ? 'configurado' : 'FALTA'}
- Foto: ${artist.photo_url ? 'subida' : 'FALTA'}
- Publicado: ${artist.is_published ? 'sí' : 'no'}
- Links: Instagram: ${artist.links?.instagram ? 'sí' : 'no'}, SoundCloud: ${artist.links?.soundcloud ? 'sí' : 'no'}, Spotify: ${artist.links?.spotify ? 'sí' : 'no'}

SECCIONES ACTIVAS: ${enabledSections.join(', ') || 'ninguna'}
SECCIONES INACTIVAS: ${disabledSections.join(', ') || 'ninguna'}

HERO: tagline="${heroConfig.tagline ?? ''}", partículas=${heroConfig.particles ?? false}, imagen_fondo=${heroConfig.bg_image ? 'sí' : 'no'}
BIO: texto="${(bioConfig.text ?? '').replace(/<[^>]+>/g, '').slice(0, 200)}", stats=${(bioConfig.stats ?? []).length}
MÚSICA: tracks=${(musicConfig.tracks ?? []).length}

Devuelve EXACTAMENTE este JSON sin ningún texto adicional:
{
  "score": <número 0-100 que indica qué tan completo está el press kit>,
  "recommendations": [
    {
      "id": "unique_id",
      "priority": "high|medium|low",
      "category": "contenido|diseño|seo|conversión|visibilidad",
      "title": "título corto",
      "description": "descripción de 1-2 oraciones explicando el problema",
      "action": "acción específica a tomar",
      "impact": "qué mejora esto"
    }
  ]
}

Da entre 5 y 8 recomendaciones ordenadas por prioridad. Sé específico con el nombre del artista y sus datos reales.`

    const message = await anthropic.messages.create({
      model:      'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      messages:   [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const data = JSON.parse(jsonMatch[0])

    // ── Log this call ─────────────────────────────────────────
    await supabase.from('analytics').insert({
      artist_id:  artist.id,
      event_type: 'ai_analysis' as never,
    })

    return NextResponse.json({ ...data, remaining: remaining - 1 })
  } catch (err) {
    console.error('AI recommendations error:', err)
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 })
  }
}

// ── GET: check remaining calls for today ──────────────────────
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: artist } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!artist) return NextResponse.json({ remaining: DAILY_LIMIT, limit: DAILY_LIMIT })

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('artist_id', artist.id)
      .eq('event_type', 'ai_analysis' as never)
      .gte('created_at', todayStart.toISOString())

    const remaining = DAILY_LIMIT - (count ?? 0)
    return NextResponse.json({ remaining: Math.max(0, remaining), limit: DAILY_LIMIT })
  } catch {
    return NextResponse.json({ remaining: DAILY_LIMIT, limit: DAILY_LIMIT })
  }
}
