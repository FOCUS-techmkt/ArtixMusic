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

    // Fetch the artist record to use the correct artist.id throughout
    const { data: artistRecord } = await supabase
      .from('artists')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    const artistId = artistRecord?.id ?? user.id

    // ── Rate limit: count AI calls today for this artist ────────
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const { count } = await supabase
      .from('analytics')
      .select('*', { count: 'exact', head: true })
      .eq('artist_id', artistId)
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
    const liveConfig  = sections?.find((s: { name: string }) => s.name === 'live')?.config  ?? {}
    const linksConfig = sections?.find((s: { name: string }) => s.name === 'links')?.config ?? {}

    const bioText = (bioConfig.text ?? '').replace(/<[^>]+>/g, '').trim()
    const hasBio = bioText.length > 40
    const hasTagline = (heroConfig.tagline ?? '').length > 10
    const hasPhoto = !!artist.photo_url
    const hasBooking = !!artist.booking_email
    const trackCount = (musicConfig.tracks ?? []).length
    const showCount = (liveConfig.shows ?? []).length
    const linkCount = Object.values(linksConfig.links ?? {}).filter(Boolean).length
    const socialLinks = [
      artist.links?.instagram && 'Instagram',
      artist.links?.soundcloud && 'SoundCloud',
      artist.links?.spotify && 'Spotify',
      artist.links?.beatport && 'Beatport',
      artist.links?.youtube && 'YouTube',
      artist.links?.tiktok && 'TikTok',
    ].filter(Boolean)

    const prompt = `Eres un consultor senior de marketing para artistas de música electrónica con 10+ años de experiencia en la industria.

Analiza este press kit de ${artist.artist_name} y genera un diagnóstico honesto con recomendaciones específicas y accionables. Sé directo — si algo falta o está mal, dilo claramente.

═══════════════════════════════
DATOS DEL ARTISTA
═══════════════════════════════
Nombre: ${artist.artist_name}
Rol: ${artist.role ?? 'DJ/Producer'}
Géneros: ${Array.isArray(artist.genres) ? artist.genres.join(', ') : (artist.genre ?? 'no especificado')}
Bio disponible: ${hasBio ? `Sí (${bioText.length} chars): "${bioText.slice(0, 250)}"` : 'NO — falta completamente'}
Tagline: ${hasTagline ? `"${heroConfig.tagline}"` : 'NO — falta'}
Palabras de sonido: ${(artist.sound_words ?? []).join(', ') || 'ninguna'}
Logros: ${(artist.achievements ?? []).map((a: { title: string }) => a.title).join(', ') || 'ninguno registrado'}
Ubicación: ${artist.location ?? 'no especificada'}

PERFIL VISUAL:
- Foto: ${hasPhoto ? 'Subida ✓' : 'FALTA — crítico para bookers'}
- Logo: ${artist.logo_url ? 'Subido ✓' : 'No tiene'}
- Colores: primario=${artist.primary_color ?? 'no'}, secundario=${artist.secondary_color ?? 'no'}

CONTACTO & BOOKING:
- Email de booking: ${hasBooking ? `${artist.booking_email} ✓` : 'FALTA — imposible contratar sin esto'}
- Publicado: ${artist.is_published ? 'Sí ✓' : 'NO — nadie puede verlo'}

REDES SOCIALES: ${socialLinks.length > 0 ? socialLinks.join(', ') : 'ninguna configurada'}

SECCIONES ACTIVAS (${enabledSections.length}): ${enabledSections.join(', ') || 'ninguna'}
SECCIONES INACTIVAS (${disabledSections.length}): ${disabledSections.join(', ') || 'ninguna'}

CONTENIDO:
- Tracks en Music: ${trackCount} ${trackCount === 0 ? '⚠️ vacío' : trackCount < 3 ? '(pocos)' : '✓'}
- Shows en Live: ${showCount} ${showCount === 0 ? '(ninguno)' : '✓'}
- Links externos: ${linkCount} ${linkCount === 0 ? '(ninguno)' : '✓'}
- Hero con imagen de fondo: ${heroConfig.bg_image ? 'Sí ✓' : 'No'}
- Stats en bio: ${(bioConfig.stats ?? []).length}

═══════════════════════════════
INSTRUCCIONES
═══════════════════════════════
Calcula un score real del 0-100 basado en qué tan completo y efectivo está este press kit para atraer bookers y fans. Sé riguroso: un press kit sin foto, sin bio o sin booking email no puede pasar de 40.

Da entre 6 y 8 recomendaciones. Las de prioridad "high" deben ser problemas que están actualmente bloqueando oportunidades reales. Las "medium" son mejoras significativas. Las "low" son pulido y optimización.

Devuelve EXACTAMENTE este JSON sin texto adicional:
{
  "score": <número entero 0-100>,
  "summary": "<1 oración resumiendo el estado actual del press kit — sé específico con el nombre>",
  "recommendations": [
    {
      "id": "unique_snake_case_id",
      "priority": "high|medium|low",
      "category": "contenido|diseño|seo|conversión|visibilidad|redes",
      "title": "<título corto, máx 6 palabras>",
      "description": "<2 oraciones: qué está mal y por qué importa>",
      "action": "<acción específica y concreta que se puede hacer hoy>",
      "impact": "<resultado esperado en números o términos concretos>"
    }
  ]
}

Ordena las recomendaciones: primero las high, luego medium, luego low.`

    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 2000,
      messages:   [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const data = JSON.parse(jsonMatch[0])

    // ── Log this call with the correct artist ID ────────────────
    await supabase.from('analytics').insert({
      artist_id:  artistId,
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
