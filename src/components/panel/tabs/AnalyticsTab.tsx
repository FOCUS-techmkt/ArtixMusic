'use client'
import { useState, useMemo } from 'react'
import { Eye, Users, Headphones, MousePointerClick, TrendingUp } from 'lucide-react'
import type { TabProps } from '../DashboardClient'

type Period = '7d' | '30d' | '90d' | 'all'

function LineChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  const W = 600; const H = 100
  const pts = data.map((d, i) => ({
    x: (i / Math.max(data.length - 1, 1)) * W,
    y: H - (d.value / max) * H * 0.85 - H * 0.05,
  }))
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L ${W} ${H} L 0 ${H} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`g-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#g-${color.replace('#', '')})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-1 h-24 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm transition-all" style={{ height: `${(d.value / max) * 80}px`, background: color + '60' }} />
        </div>
      ))}
    </div>
  )
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

  // Event breakdown
  const eventTypes = [
    { key: 'page_view',     label: 'Visitas',      color: palette.primary },
    { key: 'contact_click', label: 'Contacto',     color: '#22C55E' },
    { key: 'link_click',    label: 'Links',         color: '#F59E0B' },
    { key: 'music_play',    label: 'Reproducc.',    color: '#38BDF8' },
  ]
  const totalEvents = filtered.length || 1
  const eventBreakdown = eventTypes.map(e => ({
    ...e,
    count: filtered.filter(a => a.event_type === e.key).length,
    pct:   Math.round((filtered.filter(a => a.event_type === e.key).length / totalEvents) * 100),
  }))

  // Country breakdown
  const countryCounts: Record<string, number> = {}
  filtered.forEach(a => {
    if (a.country) countryCounts[a.country] = (countryCounts[a.country] ?? 0) + 1
  })
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // Referrer breakdown
  const refCounts: Record<string, number> = {}
  filtered.forEach(a => {
    let ref = 'directo'
    try { ref = a.referrer ? (new URL(a.referrer).hostname || 'directo') : 'directo' } catch { ref = a.referrer ?? 'directo' }
    refCounts[ref] = (refCounts[ref] ?? 0) + 1
  })
  const topRefs = Object.entries(refCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const STATS = [
    { label: 'Visitas',         value: views,    icon: Eye,               color: palette.primary },
    { label: 'Clicks',          value: clicks,   icon: MousePointerClick, color: '#F59E0B' },
    { label: 'Plays',           value: plays,    icon: Headphones,        color: '#38BDF8' },
    { label: 'Fans total',      value: fanCount, icon: Users,             color: '#22C55E' },
    { label: 'Eventos totales', value: filtered.length, icon: TrendingUp, color: palette.secondary },
  ]

  return (
    <div className="px-6 lg:px-8 py-8 max-w-5xl mx-auto flex flex-col gap-7">

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
              className="px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all"
              style={{
                background: period === p ? palette.primary + '25' : 'transparent',
                color:      period === p ? palette.primary : 'rgba(255,255,255,0.35)',
              }}>
              {p === 'all' ? 'Todo' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl flex flex-col gap-2"
            style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} />
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">{label}</span>
            </div>
            <p className="font-display font-extrabold text-2xl tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Line chart */}
      <div className="p-5 rounded-2xl flex flex-col gap-3"
        style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Visitas — últimos {days} días</p>
          <p className="text-[11px] font-mono" style={{ color: palette.primary }}>{views} visitas</p>
        </div>
        <div className="h-24 w-full">
          <LineChart data={chartData} color={palette.primary} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-mono text-white/20">{chartData[0]?.label}</span>
          <span className="text-[9px] font-mono text-white/20">{chartData[chartData.length - 1]?.label}</span>
        </div>
      </div>

      {/* Breakdown row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Event breakdown */}
        <div className="p-5 rounded-2xl flex flex-col gap-4"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Por tipo de evento</p>
          <div className="flex flex-col gap-3">
            {eventBreakdown.map(({ label, count, pct, color }) => (
              <div key={label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">{label}</span>
                  <span className="text-xs font-mono text-white/40">{count}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
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
              {topCountries.map(([country, count]) => (
                <div key={country} className="flex items-center justify-between">
                  <span className="text-xs text-white/60">{country}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(count / (topCountries[0][1] || 1)) * 100}%`, background: palette.primary }} />
                    </div>
                    <span className="text-[10px] font-mono text-white/30 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/25">Sin datos de país aún</p>
          )}
        </div>

        {/* Referrers */}
        <div className="p-5 rounded-2xl flex flex-col gap-4"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Fuentes de tráfico</p>
          {topRefs.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {topRefs.map(([ref, count]) => (
                <div key={ref} className="flex items-center justify-between">
                  <span className="text-xs text-white/60 truncate max-w-[100px]">{ref}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full" style={{ width: `${(count / (topRefs[0][1] || 1)) * 100}%`, background: palette.secondary }} />
                    </div>
                    <span className="text-[10px] font-mono text-white/30 w-4 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-white/25">Sin datos de fuente aún</p>
          )}
        </div>
      </div>

      {/* Bar chart for 7-day distribution */}
      <div className="p-5 rounded-2xl flex flex-col gap-3"
        style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Distribución diaria de visitas</p>
        <BarChart data={chartData.slice(-7)} color={palette.primary} />
        <div className="flex justify-between">
          {chartData.slice(-7).map((d, i) => (
            <span key={i} className="text-[8px] font-mono text-white/20">{d.label.slice(0, 6)}</span>
          ))}
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
