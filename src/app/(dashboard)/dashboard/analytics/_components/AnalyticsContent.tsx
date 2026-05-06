'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

export interface AnalyticsKpi {
  label: string
  value: string
  change: number
  positive: boolean
  sub: string
  color: string
}

export interface DayBucket {
  day: string
  label: string
  value: number
}

export interface CountryRow {
  name: string
  pct: number
  flag: string
}

export interface SourceRow {
  name: string
  pct: number
  color: string
}

export interface ActivityRow {
  id: string
  tag: string
  color: string
  text: string
  time: string
}

export interface AnalyticsData {
  kpis: AnalyticsKpi[]
  daily14: DayBucket[]
  countries: CountryRow[]
  sources: SourceRow[]
  activity: ActivityRow[]
}

const FADE_UP = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 } }

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] ${className}`}
      style={{ background: 'rgba(255,255,255,0.015)' }}
    >
      {children}
    </div>
  )
}

export default function AnalyticsContent({ data }: { data: AnalyticsData }) {
  const { kpis, daily14, countries, sources, activity } = data
  const maxBar = Math.max(...daily14.map(d => d.value), 1)

  const KPI_COLORS: Record<number, string> = { 0: '#C026D3', 1: '#7C3AED', 2: '#F59E0B', 3: '#34D399' }

  return (
    <div className="flex flex-col gap-0 min-h-screen">
      {/* Page header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/[0.04]">
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em] mb-1">Panel</p>
        <h1 className="font-display font-semibold text-[28px] tracking-[-0.03em]">
          Analíticas{' '}
          <span className="font-serif italic font-normal text-white/35">de tu presskit</span>
        </h1>
      </div>

      <div className="px-8 py-7 flex flex-col gap-7">

        {/* KPI row */}
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              {...FADE_UP}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card className="p-5 flex flex-col gap-2.5">
                <p className="font-mono text-[9px] text-white/35 uppercase tracking-[0.18em]">{k.label}</p>
                <p
                  className="font-display font-semibold text-[36px] tracking-[-0.04em] leading-none"
                  style={{ color: KPI_COLORS[i] ?? '#fff' }}
                >
                  {k.value}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-[11px] ${k.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {k.change > 0 ? '+' : ''}{k.change}%
                  </span>
                  <span className="font-mono text-[10px] text-white/25">{k.sub}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bar chart + sources */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
          {/* Bar chart */}
          <motion.div
            {...FADE_UP}
            transition={{ delay: 0.28, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6 flex flex-col gap-6">
              <div className="flex items-baseline justify-between">
                <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">
                  Visitas{' '}
                  <span className="font-serif italic font-normal text-white/40">últimos 14 días</span>
                </h2>
                <span className="font-mono text-[10px] text-white/25 uppercase tracking-[0.18em]">por día</span>
              </div>
              <div className="flex items-end gap-2 h-36">
                {daily14.map(({ day, label, value }, i) => {
                  const hPct = maxBar > 0 ? (value / maxBar) * 100 : 0
                  const isMax = value === maxBar && value > 0
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full">
                      <span className="font-mono text-[8px] text-white/25">{value > 0 ? value : ''}</span>
                      <div className="flex-1 w-full flex items-end">
                        <motion.div
                          className="w-full rounded-t-md"
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(hPct, value > 0 ? 4 : 2)}%` }}
                          transition={{ delay: 0.3 + i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          style={{
                            background: isMax
                              ? 'linear-gradient(180deg, #C026D3, #7C3AED)'
                              : 'rgba(255,255,255,0.08)',
                            boxShadow: isMax ? '0 0 12px rgba(192,38,211,0.35)' : 'none',
                          }}
                        />
                      </div>
                      <span className="font-mono text-[8px] text-white/30">{label}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Sources */}
          <motion.div
            {...FADE_UP}
            transition={{ delay: 0.32, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6 flex flex-col gap-5">
              <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">Top fuentes</h2>
              {sources.length === 0 ? (
                <p className="font-mono text-[11px] text-white/20 py-6 text-center">Sin datos aún</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {sources.map(({ name, pct, color }) => (
                    <div key={name} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-white/60">{name}</span>
                        <span className="font-mono text-[11px]" style={{ color }}>{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Countries + activity */}
        <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 1.6fr' }}>
          {/* Countries */}
          <motion.div
            {...FADE_UP}
            transition={{ delay: 0.38, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="p-6 flex flex-col gap-5">
              <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">Países</h2>
              {countries.length === 0 ? (
                <p className="font-mono text-[11px] text-white/20 py-6 text-center">Sin datos aún</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {countries.map(({ name, pct, flag }) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-base leading-none w-6 shrink-0">{flag}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] text-white/70">{name}</span>
                          <span className="font-mono text-[10px] text-white/35">{pct}%</span>
                        </div>
                        <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            style={{ background: 'linear-gradient(90deg, #C026D3, #7C3AED)' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Activity */}
          <motion.div
            {...FADE_UP}
            transition={{ delay: 0.42, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <Card className="flex flex-col gap-0">
              <div className="flex items-center gap-2 px-6 py-5 border-b border-white/[0.04]">
                <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">Actividad reciente</h2>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" style={{ boxShadow: '0 0 6px #34D399' }} />
              </div>
              {activity.length === 0 ? (
                <p className="font-mono text-[11px] text-white/20 py-10 text-center">Sin actividad reciente</p>
              ) : (
                <div>
                  {activity.map((item, i) => (
                    <div
                      key={item.id}
                      className="flex gap-3 px-6 py-[11px]"
                      style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <span
                        className="font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-[0.14em] font-semibold shrink-0 self-start mt-0.5"
                        style={{ color: item.color, background: item.color + '18' }}
                      >
                        {item.tag}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] text-white/70 leading-[1.4]">{item.text}</p>
                        <p className="font-mono text-[10px] text-white/25 mt-0.5 uppercase tracking-[0.06em]">Hace {item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
