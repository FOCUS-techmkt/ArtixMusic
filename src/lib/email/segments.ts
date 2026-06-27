// ════════════════════════════════════════════════════════════════
// Segmentación de fans para email marketing.
// Trabaja sobre los campos reales de fan_subscribers:
// { email, name, source, created_at }. Sin dependencias.
// ════════════════════════════════════════════════════════════════
import type { FanSubscriber } from '@/types'

export interface Segment {
  id:    string
  label: string
  desc:  string
  icon:  string
  match: (f: FanSubscriber) => boolean
}

const daysAgo = (n: number) => Date.now() - n * 86400000

// Mapa de "source" → etiqueta legible del objetivo de captación
const SOURCE_LABELS: Record<string, string> = {
  community: 'Club de fans', gift: 'Regalo', presale: 'Preventa',
  vip: 'VIP', guestlist: 'Guestlist', download: 'Descarga',
}
export function sourceGoal(source: string): string | null {
  const m = (source ?? '').match(/presskit:(\w+)/)
  return m ? m[1] : null
}

/** Construye la lista de segmentos disponibles a partir de los fans reales. */
export function buildSegments(fans: FanSubscriber[]): Segment[] {
  const base: Segment[] = [
    { id: 'all', label: 'Todos', desc: 'Toda tu lista de suscriptores', icon: '👥', match: () => true },
    { id: 'new', label: 'Nuevos (30 días)', desc: 'Se unieron en el último mes', icon: '✨', match: f => new Date(f.created_at).getTime() >= daysAgo(30) },
    { id: 'recent', label: 'Recientes (7 días)', desc: 'Se unieron esta semana', icon: '🔥', match: f => new Date(f.created_at).getTime() >= daysAgo(7) },
    { id: 'named', label: 'Con nombre', desc: 'Dejaron su nombre — más personalizable', icon: '🙋', match: f => !!(f.name && f.name.trim()) },
  ]

  // Segmentos dinámicos por objetivo de captación (source)
  const goals = new Map<string, number>()
  for (const f of fans) {
    const g = sourceGoal(f.source)
    if (g) goals.set(g, (goals.get(g) ?? 0) + 1)
  }
  const goalSegments: Segment[] = [...goals.keys()].map(g => ({
    id: `goal:${g}`,
    label: SOURCE_LABELS[g] ?? g,
    desc: `Captados vía "${SOURCE_LABELS[g] ?? g}"`,
    icon: '🎯',
    match: (f: FanSubscriber) => sourceGoal(f.source) === g,
  }))

  return [...base, ...goalSegments]
}

export function segmentRecipients(fans: FanSubscriber[], seg: Segment): FanSubscriber[] {
  return fans.filter(seg.match)
}
