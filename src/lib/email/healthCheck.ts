// ════════════════════════════════════════════════════════════════
// Chequeo de salud / deliverability de un email — 100% local, sin
// servicios externos. Detecta señales típicas de spam y errores de
// entregabilidad antes de enviar.
// ════════════════════════════════════════════════════════════════
import type { EmailContent } from './catalog'

export interface HealthIssue { level: 'error' | 'warn' | 'tip'; msg: string }
export interface HealthResult { score: number; issues: HealthIssue[] }

// Palabras/patrones que disparan filtros de spam (ES/EN)
const SPAM_WORDS = [
  'gratis', 'free', 'gana dinero', 'ganador', 'urgente', 'urgent', 'click aquí',
  'clic aquí', 'compra ahora', 'oferta limitada', '100% gratis', 'sin costo',
  'garantizado', 'felicidades', 'has sido seleccionado', 'dinero rápido', 'viagra',
]

export function checkEmailHealth(content: EmailContent, html: string): HealthResult {
  const issues: HealthIssue[] = []
  let score = 100
  const penalize = (n: number, issue: HealthIssue) => { score -= n; issues.push(issue) }

  const subject = (content.subject ?? '').trim()
  const body = (content.body ?? '').trim()
  const lowerSubj = subject.toLowerCase()

  // ── Asunto ──
  if (!subject) penalize(30, { level: 'error', msg: 'El asunto está vacío — es lo primero que decide si lo abren.' })
  else {
    if (subject.length > 60) penalize(8, { level: 'warn', msg: `Asunto largo (${subject.length} car.). Bajo 50 se ve completo en móvil.` })
    const letters = subject.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, '')
    if (letters.length > 6 && letters === letters.toUpperCase())
      penalize(12, { level: 'warn', msg: 'Asunto EN MAYÚSCULAS — los filtros lo penalizan.' })
    if (/[!?]{2,}/.test(subject)) penalize(8, { level: 'warn', msg: 'Demasiados signos (!!! ???) en el asunto.' })
    if ((subject.match(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu) ?? []).length > 2)
      penalize(5, { level: 'tip', msg: 'Más de 2 emojis en el asunto puede verse spammy.' })
  }
  const spamHit = SPAM_WORDS.filter(w => lowerSubj.includes(w) || body.toLowerCase().includes(w))
  if (spamHit.length) penalize(6 * spamHit.length, { level: 'warn', msg: `Palabras que activan spam: ${spamHit.slice(0, 3).join(', ')}.` })

  // ── Preheader ──
  if (!(content.preheader ?? '').trim())
    penalize(6, { level: 'tip', msg: 'Sin preheader — desperdicias el texto de vista previa de la bandeja.' })

  // ── Cuerpo ──
  const bodyLen = body.replace(/\s+/g, ' ').length
  if (bodyLen < 40) penalize(15, { level: 'warn', msg: 'Cuerpo muy corto — los emails casi vacíos parecen spam.' })

  // ── CTA ──
  if (!(content.cta_url ?? '').trim())
    penalize(8, { level: 'tip', msg: 'El botón no tiene URL — añade el enlace de destino.' })

  // ── HTML / estructura ──
  const imgCount = (html.match(/<img/gi) ?? []).length
  const textLen = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length
  if (imgCount > 0 && textLen < 120)
    penalize(12, { level: 'warn', msg: 'Mucha imagen y poco texto — mal ratio para deliverability.' })
  const linkCount = (html.match(/<a\s/gi) ?? []).length
  if (linkCount > 12) penalize(8, { level: 'warn', msg: `Muchos enlaces (${linkCount}) — reduce para evitar filtros.` })
  if (!/unsubscribe/i.test(html))
    penalize(20, { level: 'error', msg: 'Falta enlace de baja (unsubscribe) — obligatorio y crítico para no caer en spam.' })

  score = Math.max(0, Math.min(100, score))
  if (!issues.length) issues.push({ level: 'tip', msg: 'Todo en orden — listo para enviar.' })
  return { score, issues }
}
