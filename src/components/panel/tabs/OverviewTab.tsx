'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Eye, MousePointerClick, Headphones, Users,
  ExternalLink, Copy, Check, ArrowUpRight, Zap,
  TrendingUp, ArrowRight,
} from 'lucide-react'
import type { TabProps } from '../DashboardClient'

const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.4 } } }
const list = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }

function getHour(): string {
  const h = new Date().getHours()
  if (h < 13) return 'Buenos días'
  if (h < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function OverviewTab({ artist, sections, analytics, fans, palette, supabase, setTab }: TabProps) {
  const [copied, setCopied] = useState(false)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const kitUrl = `${appUrl}/${artist.slug}`

  const totalViews  = analytics.filter(a => a.event_type === 'page_view').length
  const totalClicks = analytics.filter(a => a.event_type === 'contact_click' || a.event_type === 'link_click').length
  const totalPlays  = analytics.filter(a => a.event_type === 'music_play').length
  const totalFans   = fans.length

  // Last 7 days views
  const cutoff7 = new Date(); cutoff7.setDate(cutoff7.getDate() - 7)
  const views7  = analytics.filter(a => a.event_type === 'page_view' && new Date(a.created_at) > cutoff7).length

  // Prior 7 days for trend
  const cutoff14 = new Date(); cutoff14.setDate(cutoff14.getDate() - 14)
  const viewsPrev7 = analytics.filter(a => a.event_type === 'page_view'
    && new Date(a.created_at) > cutoff14 && new Date(a.created_at) <= cutoff7).length
  const trend = viewsPrev7 > 0 ? Math.round(((views7 - viewsPrev7) / viewsPrev7) * 100) : null

  // Enabled sections count
  const enabledCount = sections.filter(s => s.is_enabled).length

  const copy = async () => {
    await navigator.clipboard.writeText(kitUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const STATS = [
    { label: 'Visitas totales', value: totalViews,  icon: Eye,               color: palette.primary },
    { label: 'Fans capturados', value: totalFans,   icon: Users,             color: '#22C55E' },
    { label: 'Plays de música',  value: totalPlays,  icon: Headphones,        color: '#38BDF8' },
    { label: 'Clicks en links',  value: totalClicks, icon: MousePointerClick, color: '#F59E0B' },
  ]

  const QUICK = [
    { label: 'Editar mi sitio',    desc: 'Colores, secciones y diseño', icon: '🎨', tab: 'editor'    as const },
    { label: 'Ver analíticas',     desc: 'Tráfico y comportamiento',    icon: '📊', tab: 'analytics' as const },
    { label: 'Mi base de fans',    desc: `${totalFans} contactos`,      icon: '👥', tab: 'fans'      as const },
  ]

  return (
    <div className="px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      <motion.div variants={list} initial="hidden" animate="show" className="flex flex-col gap-7">

        {/* Greeting */}
        <motion.div variants={item}>
          <p className="text-xs font-mono text-white/25 tracking-[0.15em] uppercase mb-1">{getHour()}</p>
          <h1 className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight">
            {artist.artist_name}
            {artist.is_published && (
              <span className="ml-3 align-middle text-[10px] font-mono px-2 py-1 rounded-full"
                style={{ background: '#22C55E18', color: '#22C55E', border: '1px solid #22C55E30' }}>
                ACTIVO
              </span>
            )}
          </h1>
          {trend !== null && (
            <p className="mt-1.5 text-sm" style={{ color: trend >= 0 ? '#22C55E' : '#F87171' }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% visitas vs. semana anterior
            </p>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-5 rounded-2xl flex flex-col gap-3"
              style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">{label}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: color + '18' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
              </div>
              <p className="font-display font-extrabold text-3xl tracking-tight">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Kit URL */}
        <motion.div variants={item}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/25 mb-1">Tu press kit</p>
            <p className="font-mono text-sm text-white/70 truncate">{kitUrl}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a href={kitUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all">
              <ExternalLink className="w-3.5 h-3.5" />
              Ver
            </a>
            <button onClick={copy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white transition-all"
              style={{ background: palette.primary }}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div variants={item}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25 mb-3">Accesos rápidos</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {QUICK.map(({ label, desc, icon, tab }) => (
              <button key={label} onClick={() => setTab(tab)}
                className="group flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:border-white/10"
                style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-2xl">{icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors">{label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Status panel */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Secciones activas */}
          <div className="p-5 rounded-2xl flex flex-col gap-4"
            style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Secciones activas</p>
              <button onClick={() => setTab('editor')}
                className="text-[11px] font-mono flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: palette.primary }}>
                Editar <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {sections.map(s => (
                <div key={s.id} className="flex items-center justify-between">
                  <span className="text-xs text-white/50 capitalize">{s.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${s.is_enabled ? '' : 'opacity-20'}`}
                    style={{ background: s.is_enabled ? palette.primary : 'rgba(255,255,255,0.3)' }} />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-mono text-white/20">{enabledCount}/{sections.length} visibles</p>
          </div>

          {/* Booker Ready nudge */}
          <div className="p-5 rounded-2xl flex flex-col justify-between gap-4"
            style={{
              background: `linear-gradient(135deg, ${palette.primary}12, ${palette.secondary}08)`,
              border: `1px solid ${palette.primary}25`,
            }}>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4" style={{ color: palette.primary }} />
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: palette.primary }}>Booker Ready</p>
              </div>
              <p className="text-sm text-white/60 leading-relaxed">
                Activa el modo booker para que promotores y managers vean tu perfil optimizado para bookings.
              </p>
            </div>
            <button onClick={() => setTab('booker')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white w-fit transition-all hover:opacity-90"
              style={{ background: palette.primary }}>
              <Zap className="w-3.5 h-3.5" />
              Configurar
            </button>
          </div>
        </motion.div>

        {/* Recent analytics */}
        {analytics.length > 0 && (
          <motion.div variants={item} className="p-5 rounded-2xl"
            style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Actividad reciente</p>
              <button onClick={() => setTab('analytics')}
                className="text-[11px] font-mono flex items-center gap-1 transition-colors hover:opacity-80"
                style={{ color: palette.primary }}>
                Ver todo <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {analytics.slice(0, 5).map((a, i) => {
                const labels: Record<string, string> = {
                  page_view:     '👁  Visita al press kit',
                  contact_click: '✉️  Click en contacto',
                  link_click:    '🔗  Click en link externo',
                  music_play:    '🎵  Reproducción de música',
                }
                const date = new Date(a.created_at)
                return (
                  <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                    <span className="text-xs text-white/50">{labels[a.event_type] ?? a.event_type}</span>
                    <span className="text-[10px] font-mono text-white/20">
                      {date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}

      </motion.div>
    </div>
  )
}
