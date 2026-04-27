'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, RefreshCw, ArrowRight, TrendingUp, AlertCircle, Info, Zap } from 'lucide-react'
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
  recommendations: Recommendation[]
  remaining:       number
}

const PRIORITY_CONFIG = {
  high:   { label: 'Alta',  color: '#EF4444', bg: '#EF444415' },
  medium: { label: 'Media', color: '#F59E0B', bg: '#F59E0B15' },
  low:    { label: 'Baja',  color: '#6B7280', bg: '#6B728015' },
}

const CATEGORY_ICONS: Record<string, string> = {
  contenido:   '📝',
  diseño:      '🎨',
  seo:         '🔍',
  conversión:  '⚡',
  visibilidad: '👁',
}

export default function AITab({ artist, sections, palette }: TabProps) {
  const [result,    setResult]    = useState<AIResult | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [remaining, setRemaining] = useState<number>(DAILY_LIMIT)

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

  const scoreColor = (s: number) => s >= 80 ? '#22C55E' : s >= 50 ? '#F59E0B' : '#EF4444'
  const scoreLabel = (s: number) => s >= 80 ? 'Excelente' : s >= 60 ? 'Bueno' : s >= 40 ? 'Incompleto' : 'Básico'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl mb-1" style={{ color: palette.text }}>
            AI Coach
          </h2>
          <p className="text-sm" style={{ color: palette.textMuted }}>
            Análisis inteligente de tu press kit con recomendaciones personalizadas
          </p>
          {/* Usage indicator */}
          <div className="flex items-center gap-2 mt-3">
            <Zap className="w-3.5 h-3.5" style={{ color: remaining > 0 ? palette.primary : '#6B7280' }} />
            <div className="flex gap-1">
              {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
                <div key={i} className="w-5 h-1.5 rounded-full transition-all"
                  style={{ background: i < remaining ? palette.primary : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
            <span className="text-[11px] font-mono" style={{ color: palette.textMuted }}>
              {remaining}/{DAILY_LIMIT} hoy
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl text-center"
          style={{ border: `1px dashed ${palette.border}` }}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="text-6xl mb-5">
            🤖
          </motion.div>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: palette.text }}>
            Tu asesor personal de IA
          </h3>
          <p className="text-sm max-w-sm" style={{ color: palette.textMuted }}>
            Analiza tu press kit completo y recibe recomendaciones específicas para atraer más bookers y fans
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Contenido', 'Diseño', 'Visibilidad', 'Conversión'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-full text-xs font-mono"
                style={{ background: palette.primary + '15', color: palette.primary, border: `1px solid ${palette.primary}25` }}>
                {tag}
              </span>
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
          <p className="text-sm font-mono" style={{ color: palette.textMuted }}>Analizando tu press kit...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-6"
          style={{ background: '#EF444415', border: '1px solid #EF444430' }}>
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">Error al analizar</p>
            <p className="text-xs text-red-400/70 mt-0.5">{error.includes('ANTHROPIC') || error.includes('API') ? 'Configura ANTHROPIC_API_KEY en las variables de entorno' : error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5">

            {/* Score card */}
            <div className="p-6 rounded-2xl" style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: palette.textMuted }}>
                    Press Kit Score
                  </p>
                  <p className="text-5xl font-display font-black" style={{ color: scoreColor(result.score) }}>
                    {result.score}<span className="text-2xl">/100</span>
                  </p>
                  <p className="text-sm font-semibold mt-1" style={{ color: scoreColor(result.score) }}>
                    {scoreLabel(result.score)}
                  </p>
                </div>
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke={palette.border} strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke={scoreColor(result.score)}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={`${result.score * 0.942} 100`}
                      initial={{ strokeDasharray: '0 100' }}
                      animate={{ strokeDasharray: `${result.score * 0.942} 100` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" style={{ color: scoreColor(result.score) }} />
                  </div>
                </div>
              </div>

              {/* Priority summary */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t" style={{ borderColor: palette.border }}>
                {(['high', 'medium', 'low'] as const).map(p => {
                  const count = result.recommendations.filter(r => r.priority === p).length
                  const cfg = PRIORITY_CONFIG[p]
                  return (
                    <div key={p} className="text-center p-2 rounded-xl" style={{ background: cfg.bg }}>
                      <p className="text-xl font-display font-black" style={{ color: cfg.color }}>{count}</p>
                      <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: cfg.color }}>{cfg.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-3">
              {result.recommendations.map((rec, i) => {
                const cfg = PRIORITY_CONFIG[rec.priority]
                return (
                  <motion.div
                    key={rec.id ?? i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-2xl"
                    style={{ background: palette.surface, border: `1px solid ${palette.border}` }}>
                    <div className="flex items-start gap-3">
                      <span className="text-xl shrink-0 mt-0.5">{CATEGORY_ICONS[rec.category] ?? '💡'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider"
                            style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>
                            {rec.category}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1" style={{ color: palette.text }}>{rec.title}</h4>
                        <p className="text-xs mb-3 leading-relaxed" style={{ color: palette.textMuted }}>{rec.description}</p>
                        <div className="p-3 rounded-xl flex items-start gap-2"
                          style={{ background: palette.primary + '0C', border: `1px solid ${palette.primary}20` }}>
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: palette.primary }} />
                          <p className="text-xs" style={{ color: palette.primary }}>{rec.action}</p>
                        </div>
                        {rec.impact && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Info className="w-3 h-3" style={{ color: palette.textMuted }} />
                            <p className="text-[11px]" style={{ color: palette.textMuted }}>{rec.impact}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Disclaimer */}
            <p className="text-[10px] text-center font-mono" style={{ color: palette.textMuted }}>
              Análisis generado por Claude AI · Los resultados son orientativos
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
