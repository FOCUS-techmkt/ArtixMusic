'use client'
import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Eye, Users, Headphones, MousePointerClick, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { TabProps } from '../DashboardClient'

type Period = '7d' | '30d' | '90d' | 'all'

function AnimatedBar({ value, max, color, label, count }: {
  value: number; max: number; color: string; label: string; count: number
}) {
  const [hovered, setHovered] = useState(false)
  const pct = max > 0 ? (value / max) * 88 : 0

  return (
    <div className="flex-1 flex flex-col items-center gap-1.5 relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {hovered && (
        <div className="absolute bottom-[calc(100%+4px)] z-10 px-2.5 py-1.5 rounded-lg text-[10px] font-mono whitespace-nowrap pointer-events-none"
          style={{ background: '#1A1A22', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}>
          {label} — {count}
        </div>
      )}
      <div className="w-full flex items-end justify-center" style={{ height: 80 }}>
        <motion.div
          className="w-full rounded-t-md"
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: hovered
              ? `linear-gradient(180deg, ${color}, ${color}99)`
              : `linear-gradient(180deg, ${color}80, ${color}30)`,
            transition: 'background 0.2s',
          }}
        />
      </div>
      <span className="text-[8px] font-mono text-white/20 truncate w-full text-center">{label.slice(0, 6)}</span>
    </div>
  )
}

function SparkLine({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null
  const max = Math.max(...data, 1)
  const W = 300; const H = 60
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - (v / max) * H * 0.85 - H * 0.05,
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${W} ${H} L 0 ${H} Z`
  const uid = color.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${uid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Trend({ value }: { value: number }) {
  if (value === 0) return <Minus className="w-3 h-3 text-white/25" />
  return value > 0
    ? <TrendingUp  className="w-3 h-3" style={{ color: '#22C55E' }} />
    : <TrendingDown className="w-3 h-3" style={{ color: '#F87171' }} />
}

export default function AnalyticsTab({ analytics, fans, palette }: TabProps) {
  const [period, setPeriod] = useState<Period>('30d')

  const cutoff = useMemo(() => {
    const d = new Date()
    if (period === '7d')  d.setDate(d.getDate() - 7)
    if (period === '30d') d.setDate(d.getDate() - 30)
    if (period === '90d') d.setDate(d.getDate() - 90)
    return period === 'all' ? new Date(0) : d
  }, [period])

  const filtered = useMemo(() =>
    analytics.filter(a => new Date(a.created_at) >= cutoff),
    [analytics, cutoff]
  )

  const views    = filtered.filter(a => a.event_type === 'page_view').length
  const clicks   = filtered.filter(a => a.event_type === 'contact_click' || a.event_type === 'link_click').length
  const plays    = filtered.filter(a => a.event_type === 'music_play').length
  const fanCount = fans.length

  // Daily chart data
  const days = period === 'all' ? 30 : parseInt(period)
  const chartData = useMemo(() => {
    const buckets: Record<string, number> = {}
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      buckets[d.toISOString().slice(0, 10)] = 0
    }
    filtered.filter(a => a.event_type === 'page_view').forEach(a => {
      const key = a.created_at.slice(0, 10)
      if (key in buckets) buckets[key]++
    })
    return Object.entries(buckets).map(([date, value]) => ({
      label: new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      value,
    }))
  }, [filtered, days])

  // Prev period comparison
  const prevCutoff = useMemo(() => {
    if (period === 'all') return new Date(0)
    const d = new Date(cutoff)
    d.setDate(d.getDate() - days)
    return d
  }, [cutoff, days, period])
  const prevFiltered = useMemo(() =>
    analytics.filter(a => new Date(a.created_at) >= prevCutoff && new Date(a.created_at) < cutoff),
    [analytics, prevCutoff, cutoff]
  )
  const prevViews  = prevFiltered.filter(a => a.event_type === 'page_view').length
  const prevClicks = prevFiltered.filter(a => a.event_type === 'contact_click' || a.event_type === 'link_click').length
  const prevPlays  = prevFiltered.filter(a => a.event_type === 'music_play').length
  const trendPct   = (cur: number, prev: number) => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : 0

  // Event breakdown
  const eventTypes = [
    { key: 'page_view',     label: 'Visitas',    color: palette.primary },
    { key: 'contact_click', label: 'Contacto',   color: '#22C55E' },
    { key: 'link_click',    label: 'Links',       color: '#F59E0B' },
    { key: 'music_play',    label: 'Música',      color: '#38BDF8' },
  ]
  const totalEvents = filtered.length || 1
  const eventBreakdown = eventTypes.map(e => ({
    ...e,
    count: filtered.filter(a => a.event_type === e.key).length,
    pct:   Math.round((filtered.filter(a => a.event_type === e.key).length / totalEvents) * 100),
  }))

  // Country breakdown
  const countryCounts: Record<string, number> = {}
  filtered.forEach(a => { if (a.country) countryCounts[a.country] = (countryCounts[a.country] ?? 0) + 1 })
  const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

  // Referrer breakdown
  const refCounts: Record<string, number> = {}
  filtered.forEach(a => {
    let ref = 'directo'
    try { ref = a.referrer ? (new URL(a.referrer).hostname || 'directo') : 'directo' } catch { ref = a.referrer ?? 'directo' }
    refCounts[ref] = (refCounts[ref] ?? 0) + 1
  })
  const topRefs = Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 6)

  const sparkData    = chartData.map(d => d.value)
  const bars14       = chartData.slice(-14)
  const bars7        = chartData.slice(-7)
  const maxBar14     = Math.max(...bars14.map(d => d.value), 1)
  const maxBar7      = Math.max(...bars7.map(d => d.value), 1)

  const KPIS = [
    { label: 'Visitas',    value: views,    prev: prevViews,  icon: Eye,               color: palette.primary },
    { label: 'Clicks',     value: clicks,   prev: prevClicks, icon: MousePointerClick, color: '#F59E0B' },
    { label: 'Plays',      value: plays,    prev: prevPlays,  icon: Headphones,        color: '#38BDF8' },
    { label: 'Fans total', value: fanCount, prev: fanCount,   icon: Users,             color: '#22C55E' },
  ]

  return (
    <div className="px-4 lg:px-8 py-6 lg:py-8 max-w-5xl mx-auto flex flex-col gap-6 lg:gap-7">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-mono text-white/25 tracking-[0.15em] uppercase mb-1">Panel de analíticas</p>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Métricas</h1>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.06)' }}>
          {(['7d', '30d', '90d', 'all'] as Period[]).map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono transition-all"
              style={{
                background: period === p ? palette.primary + '25' : 'transparent',
                color:      period === p ? palette.primary : 'rgba(255,255,255,0.35)',
              }}>
              {p === 'all' ? 'Todo' : p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards with trend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(({ label, value, prev, icon: Icon, color }) => {
          const t = trendPct(value, prev)
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="p-4 rounded-2xl flex flex-col gap-3"
              style={{ background: '#0E0E12', border: `1px solid ${color}15` }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">{label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trend value={t} />
                  {prev > 0 && (
                    <span className="text-[9px] font-mono"
                      style={{ color: t > 0 ? '#22C55E' : t < 0 ? '#F87171' : 'rgba(255,255,255,0.2)' }}>
                      {t > 0 ? '+' : ''}{t}%
                    </span>
                  )}
                </div>
              </div>
              <p className="font-display font-extrabold text-2xl tracking-tight">{value}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Sparkline trend chart */}
      <div className="p-5 rounded-2xl flex flex-col gap-4"
        style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Visitas — últimos {days} días</p>
          <p className="text-[11px] font-mono" style={{ color: palette.primary }}>{views} visitas</p>
        </div>
        <div className="h-[72px] w-full">
          <SparkLine data={sparkData} color={palette.primary} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-white/20">{chartData[0]?.label}</span>
          <span className="text-[9px] font-mono text-white/20">{chartData[chartData.length - 1]?.label}</span>
        </div>
      </div>

      {/* Animated bar chart */}
      <div className="p-4 lg:p-5 rounded-2xl flex flex-col gap-4"
        style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Distribución diaria</p>
        {/* Mobile: 7 bars — Desktop: 14 bars */}
        <div className="flex items-end gap-1.5 w-full lg:hidden">
          {bars7.map((d, i) => (
            <AnimatedBar key={`m-${period}-${i}`} value={d.value} max={maxBar7} color={palette.primary} label={d.label} count={d.value} />
          ))}
        </div>
        <div className="hidden lg:flex items-end gap-1.5 w-full">
          {bars14.map((d, i) => (
            <AnimatedBar key={`d-${period}-${i}`} value={d.value} max={maxBar14} color={palette.primary} label={d.label} count={d.value} />
          ))}
        </div>
      </div>

      {/* Breakdown row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Event types */}
        <div className="p-5 rounded-2xl flex flex-col gap-4"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Por tipo de evento</p>
          <div className="flex flex-col gap-3.5">
            {eventBreakdown.map(({ label, count, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="text-xs font-mono text-white/40">{count}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="p-5 rounded-2xl flex flex-col gap-4"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Países</p>
          {topCountries.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {topCountries.map(([country, count], idx) => (
                <div key={country} className="flex items-center gap-3">
                  <span className="text-xs text-white/60 w-14 truncate shrink-0">{country}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / (topCountries[0][1] || 1)) * 100}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      style={{ background: palette.primary }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 w-5 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/25">Sin datos de país aún.</p>
          )}
        </div>

        {/* Referrers */}
        <div className="p-5 rounded-2xl flex flex-col gap-4"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Fuentes de tráfico</p>
          {topRefs.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {topRefs.map(([ref, count], idx) => (
                <div key={ref} className="flex items-center gap-3">
                  <span className="text-xs text-white/60 truncate max-w-[80px] shrink-0">{ref}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / (topRefs[0][1] || 1)) * 100}%` }}
                      transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      style={{ background: palette.secondary }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/30 w-5 text-right shrink-0">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/25">Sin datos de fuente aún.</p>
          )}
        </div>
      </div>

      {/* Empty state */}
      {analytics.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-white/40 text-sm">Aún no hay datos de analíticas.</p>
          <p className="text-white/25 text-xs mt-1">Comparte tu press kit para empezar a ver métricas.</p>
        </div>
      )}
    </div>
  )
}
