'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Loader2, RefreshCw, ArrowRight, TrendingUp,
  AlertCircle, Info, Zap, ChevronDown, CheckCircle2, Filter,
  ClipboardList, LayoutGrid,
} from 'lucide-react'
import type { TabProps } from '../DashboardClient'

const DAILY_LIMIT = 5

interface Recommendation {
  id:          string
  priority:    'high' | 'medium' | 'low'
  category:    string
  title:       string
  description: string
  action:      string
  impact:      string
}

interface AIResult {
  score:           number
  summary?:        string
  recommendations: Recommendation[]
  remaining:       number
}

const PRIORITY_CONFIG = {
  high:   { label: 'Alta',  color: '#EF4444', bg: '#EF444415', dot: '#EF4444' },
  medium: { label: 'Media', color: '#F59E0B', bg: '#F59E0B15', dot: '#F59E0B' },
  low:    { label: 'Baja',  color: '#6B7280', bg: '#6B728015', dot: '#6B7280' },
}

const CATEGORY_CONFIG: Record<string, { icon: string; label: string }> = {
  contenido:   { icon: '📝', label: 'Contenido' },
  diseño:      { icon: '🎨', label: 'Diseño' },
  seo:         { icon: '🔍', label: 'SEO' },
  conversión:  { icon: '⚡', label: 'Conversión' },
  visibilidad: { icon: '👁', label: 'Visibilidad' },
  redes:       { icon: '📡', label: 'Redes' },
}

type ViewMode = 'cards' | 'plan'

export default function AITab({ artist, sections, palette }: TabProps) {
  const [result,    setResult]    = useState<AIResult | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [remaining, setRemaining] = useState<number>(DAILY_LIMIT)
  const [expanded,  setExpanded]  = useState<Set<string>>(new Set())
  const [checked,   setChecked]   = useState<Set<string>>(new Set())
  const [filter,    setFilter]    = useState<string>('all')
  const [view,      setView]      = useState<ViewMode>('cards')

  useEffect(() => {
    fetch('/api/ai/recommendations')
      .then(r => r.json())
      .then(d => { if (typeof d.remaining === 'number') setRemaining(d.remaining) })
      .catch(() => {})
  }, [])

  const analyze = async () => {
    if (remaining <= 0) return
    setLoading(true)
    setError('')
    setExpanded(new Set())
    setChecked(new Set())
    setFilter('all')
    try {
      const res = await fetch('/api/ai/recommendations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ artist, sections }),
      })
      const data = await res.json()
      if (res.status === 429) {
        setError(data.message ?? 'Límite diario alcanzado. Vuelve mañana.')
        setRemaining(0)
        setLoading(false)
        return
      }
      if (!res.ok) throw new Error(data.error ?? 'Error desconocido')
      setResult(data)
      if (typeof data.remaining === 'number') setRemaining(data.remaining)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    }
    setLoading(false)
  }

  const toggleExpand = (id: string) =>
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const toggleCheck = (id: string) =>
    setChecked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const scoreColor = (s: number) => s >= 80 ? '#22C55E' : s >= 60 ? '#F59E0B' : s >= 40 ? '#F59E0B' : '#EF4444'
  const scoreLabel = (s: number) => s >= 80 ? 'Excelente' : s >= 60 ? 'Bueno' : s >= 40 ? 'Incompleto' : 'Básico'

  const categories = result
    ? Array.from(new Set(result.recommendations.map(r => r.category)))
    : []

  const filtered = result
    ? (filter === 'all'
        ? result.recommendations
        : result.recommendations.filter(r =>
            filter === 'done'   ? checked.has(r.id) :
            filter === 'todo'   ? !checked.has(r.id) :
            r.category === filter
          )
      )
    : []

  const doneCount = checked.size
  const totalCount = result?.recommendations.length ?? 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: palette.text }}>
            AI Coach
          </h2>
          <p className="text-sm mb-3" style={{ color: palette.textMuted }}>
            Análisis inteligente de tu press kit con recomendaciones accionables
          </p>
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5" style={{ color: remaining > 0 ? palette.primary : '#6B7280' }} />
            <div className="flex gap-1">
              {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                <div key={i} className="w-5 h-1.5 rounded-full transition-all"
                  style={{ background: i < remaining ? palette.primary : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
            <span className="text-[11px] font-mono" style={{ color: palette.textMuted }}>
              {remaining}/{DAILY_LIMIT} análisis hoy
            </span>
          </div>
        </div>

        <motion.button
          onClick={analyze}
          disabled={loading || remaining <= 0}
          whileHover={{ scale: remaining > 0 ? 1.03 : 1 }}
          whileTap={{ scale: remaining > 0 ? 0.97 : 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 shrink-0"
          style={{ background: remaining > 0 ? `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` : 'rgba(255,255,255,0.1)' }}>
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Analizando...</>
            : remaining <= 0
              ? 'Límite alcanzado'
              : result
                ? <><RefreshCw className="w-4 h-4" /> Re-analizar</>
                : <><Sparkles className="w-4 h-4" /> Analizar ahora</>
          }
        </motion.button>
      </div>

      {/* Empty state */}
      {!result && !loading && !error && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          <div className="flex flex-col items-center text-center py-12 px-6 rounded-2xl"
            style={{ border: `1px dashed ${palette.border}`, background: palette.primary + '06' }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              className="text-5xl mb-4">🤖</motion.div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: palette.text }}>
              Tu asesor personal de press kit
            </h3>
            <p className="text-sm max-w-sm mb-6" style={{ color: palette.textMuted }}>
              Detecta huecos críticos, genera un plan de acción priorizado y calcula qué tan listo está tu press kit para atraer bookers y fans.
            </p>
            <motion.button
              onClick={analyze}
              disabled={loading || remaining <= 0}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
              <Sparkles className="w-4 h-4" /> Analizar mi perfil ahora
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: '📝', title: 'Contenido', desc: 'Bio, géneros, logros, rider. Detecta huecos que frenan a los bookers.' },
              { icon: '🎨', title: 'Diseño & SEO', desc: 'Foto, colores, tipografía, estructura visual y posicionamiento.' },
              { icon: '⚡', title: 'Conversión', desc: 'CTAs, booking email, redes sociales. Qué te hace perder contactos.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="p-4 rounded-2xl flex flex-col gap-2"
                style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-2xl">{icon}</span>
                <p className="text-sm font-semibold text-white/80">{title}</p>
                <p className="text-[11px] text-white/35 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative w-16 h-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-2 border-transparent"
              style={{ borderTopColor: palette.primary }} />
            <div className="absolute inset-3 rounded-full flex items-center justify-center"
              style={{ background: palette.primary + '20' }}>
              <Sparkles className="w-4 h-4" style={{ color: palette.primary }} />
            </div>
          </div>
          <p className="text-sm font-mono" style={{ color: palette.textMuted }}>
            Analizando tu press kit con Claude AI...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
          style={{ background: '#EF444415', border: '1px solid #EF444430' }}>
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">Error al analizar</p>
            <p className="text-xs text-red-400/70 mt-0.5">
              {error.includes('ANTHROPIC') || error.includes('API')
                ? 'Configura ANTHROPIC_API_KEY en las variables de entorno'
                : error}
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">

            {/* Score card */}
            <div className="p-6 rounded-2xl" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: palette.textMuted }}>
                    Press Kit Score
                  </p>
                  <div className="flex items-end gap-2">
                    <motion.p
                      className="text-6xl font-display font-black leading-none"
                      style={{ color: scoreColor(result.score) }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, type: 'spring' }}>
                      {result.score}
                    </motion.p>
                    <span className="text-xl font-mono mb-1" style={{ color: palette.textMuted }}>/100</span>
                  </div>
                  <p className="text-sm font-semibold mt-1" style={{ color: scoreColor(result.score) }}>
                    {scoreLabel(result.score)}
                  </p>
                  {result.summary && (
                    <p className="text-xs mt-2 max-w-xs leading-relaxed" style={{ color: palette.textMuted }}>
                      {result.summary}
                    </p>
                  )}
                </div>

                <div className="relative w-24 h-24 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke={palette.border} strokeWidth="2.5" />
                    <motion.circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={scoreColor(result.score)}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={`${result.score * 0.942} 100`}
                      initial={{ strokeDasharray: '0 100' }}
                      animate={{ strokeDasharray: `${result.score * 0.942} 100` }}
                      transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" style={{ color: scoreColor(result.score) }} />
                  </div>
                </div>
              </div>

              {/* Priority summary + progress */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t mb-4" style={{ borderColor: palette.border }}>
                {(['high', 'medium', 'low'] as const).map(p => {
                  const count = result.recommendations.filter(r => r.priority === p).length
                  const cfg = PRIORITY_CONFIG[p]
                  return (
                    <div key={p} className="text-center p-3 rounded-xl cursor-pointer transition-all hover:scale-105"
                      style={{ background: cfg.bg }}
                      onClick={() => setFilter(filter === p ? 'all' : p as string)}>
                      <p className="text-2xl font-display font-black" style={{ color: cfg.color }}>{count}</p>
                      <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</p>
                    </div>
                  )
                })}
              </div>

              {/* Progress bar */}
              {totalCount > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
                      Plan de acción
                    </span>
                    <span className="text-[10px] font-mono" style={{ color: palette.textMuted }}>
                      {doneCount}/{totalCount} completados
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: palette.border }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(doneCount / totalCount) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Filter + View controls */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-3.5 h-3.5" style={{ color: palette.textMuted }} />
                {[
                  { key: 'all',  label: 'Todas' },
                  { key: 'todo', label: 'Pendientes' },
                  { key: 'done', label: 'Hechas' },
                  ...categories.map(c => ({
                    key: c,
                    label: CATEGORY_CONFIG[c]?.icon + ' ' + (CATEGORY_CONFIG[c]?.label ?? c),
                  })),
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className="px-3 py-1 rounded-full text-[11px] font-mono transition-all"
                    style={{
                      background: filter === key ? palette.primary + '25' : 'rgba(255,255,255,0.05)',
                      color:      filter === key ? palette.primary          : 'rgba(255,255,255,0.4)',
                      border:     filter === key ? `1px solid ${palette.primary}50` : '1px solid transparent',
                    }}>
                    {label}
                  </button>
                ))}
              </div>

              <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {([
                  { v: 'cards', Icon: LayoutGrid },
                  { v: 'plan',  Icon: ClipboardList },
                ] as { v: ViewMode; Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }[]).map(({ v, Icon }) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ background: view === v ? palette.primary + '30' : 'transparent' }}>
                    <Icon className="w-3.5 h-3.5"
                      style={{ color: view === v ? palette.primary : 'rgba(255,255,255,0.3)' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendations — Cards view */}
            {view === 'cards' && (
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((rec, i) => {
                    const cfg = CATEGORY_CONFIG[rec.category] ?? { icon: '💡', label: rec.category }
                    const pcfg = PRIORITY_CONFIG[rec.priority]
                    const isOpen = expanded.has(rec.id)
                    const isDone = checked.has(rec.id)
                    return (
                      <motion.div
                        key={rec.id ?? i}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: isDone ? 0.55 : 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: i * 0.04 }}
                        className="rounded-2xl overflow-hidden"
                        style={{ background: palette.surface, border: `1px solid ${isDone ? 'rgba(255,255,255,0.04)' : palette.border}` }}>

                        {/* Rec header — always visible */}
                        <div
                          className="flex items-center gap-3 p-4 cursor-pointer select-none"
                          onClick={() => toggleExpand(rec.id)}>
                          <button
                            onClick={e => { e.stopPropagation(); toggleCheck(rec.id) }}
                            className="shrink-0 transition-all">
                            <CheckCircle2
                              className="w-5 h-5"
                              style={{ color: isDone ? '#22C55E' : 'rgba(255,255,255,0.15)' }} />
                          </button>

                          <div className="w-1 h-8 rounded-full shrink-0" style={{ background: pcfg.dot }} />

                          <span className="text-lg shrink-0">{cfg.icon}</span>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
                                style={{ background: pcfg.bg, color: pcfg.color }}>
                                {pcfg.label}
                              </span>
                              <span className="text-[10px] font-mono" style={{ color: palette.textMuted }}>
                                {cfg.label}
                              </span>
                            </div>
                            <p className={`text-sm font-semibold ${isDone ? 'line-through' : ''}`}
                              style={{ color: palette.text }}>
                              {rec.title}
                            </p>
                          </div>

                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="shrink-0">
                            <ChevronDown className="w-4 h-4" style={{ color: palette.textMuted }} />
                          </motion.div>
                        </div>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden">
                              <div className="px-4 pb-4 flex flex-col gap-3"
                                style={{ borderTop: `1px solid ${palette.border}` }}>
                                <p className="text-xs leading-relaxed pt-3" style={{ color: palette.textMuted }}>
                                  {rec.description}
                                </p>
                                <div className="p-3 rounded-xl flex items-start gap-2"
                                  style={{ background: palette.primary + '0C', border: `1px solid ${palette.primary}20` }}>
                                  <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: palette.primary }} />
                                  <p className="text-xs" style={{ color: palette.primary }}>{rec.action}</p>
                                </div>
                                {rec.impact && (
                                  <div className="flex items-center gap-1.5">
                                    <Info className="w-3 h-3 shrink-0" style={{ color: palette.textMuted }} />
                                    <p className="text-[11px]" style={{ color: palette.textMuted }}>{rec.impact}</p>
                                  </div>
                                )}
                                <button
                                  onClick={() => toggleCheck(rec.id)}
                                  className="self-start flex items-center gap-1.5 text-xs font-semibold mt-1 transition-all"
                                  style={{ color: isDone ? '#22C55E' : palette.primary }}>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  {isDone ? 'Marcar como pendiente' : 'Marcar como hecha'}
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
                {filtered.length === 0 && (
                  <div className="text-center py-8" style={{ color: palette.textMuted }}>
                    <p className="text-sm">No hay recomendaciones en este filtro</p>
                  </div>
                )}
              </div>
            )}

            {/* Plan de acción — checklist view */}
            {view === 'plan' && (
              <div className="rounded-2xl overflow-hidden" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
                <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: palette.border }}>
                  <ClipboardList className="w-4 h-4" style={{ color: palette.primary }} />
                  <p className="text-sm font-semibold" style={{ color: palette.text }}>Plan de acción</p>
                  <span className="ml-auto text-xs font-mono" style={{ color: palette.textMuted }}>
                    {doneCount}/{totalCount}
                  </span>
                </div>
                {(['high', 'medium', 'low'] as const).map(priority => {
                  const recs = filtered.filter(r => r.priority === priority)
                  if (recs.length === 0) return null
                  const pcfg = PRIORITY_CONFIG[priority]
                  return (
                    <div key={priority}>
                      <div className="px-4 py-2 flex items-center gap-2"
                        style={{ background: pcfg.bg + '80' }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: pcfg.dot }} />
                        <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: pcfg.color }}>
                          Prioridad {pcfg.label} · {recs.length} tareas
                        </p>
                      </div>
                      {recs.map((rec, i) => {
                        const cfg = CATEGORY_CONFIG[rec.category] ?? { icon: '💡', label: rec.category }
                        const isDone = checked.has(rec.id)
                        return (
                          <div
                            key={rec.id}
                            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-white/[0.02]"
                            style={{ borderTop: i > 0 ? `1px solid ${palette.border}` : undefined }}
                            onClick={() => toggleCheck(rec.id)}>
                            <CheckCircle2
                              className="w-4 h-4 shrink-0"
                              style={{ color: isDone ? '#22C55E' : 'rgba(255,255,255,0.15)' }} />
                            <span className="text-sm shrink-0">{cfg.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${isDone ? 'line-through opacity-50' : ''}`}
                                style={{ color: palette.text }}>
                                {rec.title}
                              </p>
                              <p className="text-[11px] truncate" style={{ color: palette.textMuted }}>
                                {rec.action}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}

            <p className="text-[10px] text-center font-mono" style={{ color: palette.textMuted }}>
              Análisis generado por Claude Sonnet · Los resultados son orientativos
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
