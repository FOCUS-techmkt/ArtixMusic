'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Clock, Globe, MousePointerClick, Eye } from 'lucide-react'

const RANGES = ['Últimos 7 días', 'Últimos 30 días', 'Últimos 90 días']

const KPIS = [
  {
    label: 'Visitas',
    value: '1,247',
    change: '+12%',
    positive: true,
    sub: 'vs. período anterior',
    icon: Eye,
    color: '#C026D3',
  },
  {
    label: 'Clics booking',
    value: '38',
    change: '+34%',
    positive: true,
    sub: 'vs. período anterior',
    icon: MousePointerClick,
    color: '#7C3AED',
  },
  {
    label: 'Tiempo promedio',
    value: '2:34',
    change: '+0:18',
    positive: true,
    sub: 'minutos por visita',
    icon: Clock,
    color: '#0EA5E9',
  },
  {
    label: 'Países únicos',
    value: '14',
    change: '+3',
    positive: true,
    sub: 'nuevos esta semana',
    icon: Globe,
    color: '#10B981',
  },
]

const BAR_DATA = [
  { day: 'Lun', value: 87, label: '87' },
  { day: 'Mar', value: 143, label: '143' },
  { day: 'Mié', value: 210, label: '210' },
  { day: 'Jue', value: 168, label: '168' },
  { day: 'Vie', value: 195, label: '195' },
  { day: 'Sáb', value: 247, label: '247' },
  { day: 'Dom', value: 197, label: '197' },
]

const MAX_BAR = 247

const SOURCES = [
  { name: 'Instagram Direct', pct: 42, color: '#E1306C' },
  { name: 'WhatsApp', pct: 28, color: '#25D366' },
  { name: 'Google', pct: 18, color: '#4285F4' },
  { name: 'Directo', pct: 12, color: '#6B7280' },
]

const COUNTRIES = [
  { name: 'Argentina', pct: 38, flag: '🇦🇷' },
  { name: 'España', pct: 22, flag: '🇪🇸' },
  { name: 'México', pct: 19, flag: '🇲🇽' },
  { name: 'Colombia', pct: 12, flag: '🇨🇴' },
  { name: 'Chile', pct: 9, flag: '🇨🇱' },
]

const ACTIVITY = [
  {
    text: 'Alguien de Buenos Aires vio tu presskit',
    time: 'hace 5 min',
    icon: Eye,
    color: '#C026D3',
  },
  {
    text: 'Click en Booking desde Instagram',
    time: 'hace 1h',
    icon: MousePointerClick,
    color: '#7C3AED',
  },
  {
    text: 'Alguien de Madrid compartió tu link',
    time: 'hace 2h',
    icon: TrendingUp,
    color: '#0EA5E9',
  },
  {
    text: 'Nuevo visitante desde México',
    time: 'hace 3h',
    icon: Globe,
    color: '#10B981',
  },
  {
    text: 'Descarga de EPK desde Spotify link',
    time: 'hace 5h',
    icon: TrendingUp,
    color: '#F59E0B',
  },
  {
    text: 'Alguien de Bogotá vio tu presskit',
    time: 'hace 6h',
    icon: Eye,
    color: '#C026D3',
  },
]

export default function AnalyticsPage() {
  const [range, setRange] = useState('Últimos 7 días')

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-8 pb-16">
      {/* Header + date range */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">Analíticas</h1>
          <p className="text-white/40 text-sm mt-1 font-mono">
            Estadísticas de tu presskit en tiempo real.
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-150 ${
                range === r
                  ? 'bg-[#C026D3] text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {KPIS.map(({ label, value, change, positive, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                {label}
              </span>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
              <div className="flex items-center gap-1.5 mt-1">
                {positive ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                )}
                <span
                  className={`text-xs font-mono ${positive ? 'text-emerald-400' : 'text-red-400'}`}
                >
                  {change}
                </span>
                <span className="text-xs text-white/25 font-mono">{sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart + sources */}
      <div className="grid grid-cols-5 gap-6">
        {/* Bar chart */}
        <div className="col-span-3 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-6">
          <h2 className="font-black tracking-tighter text-lg">Visitas por día</h2>
          <div className="flex items-end gap-3 h-40">
            {BAR_DATA.map(({ day, value, label }) => {
              const heightPct = (value / MAX_BAR) * 100
              const isMax = value === MAX_BAR
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1 h-full">
                  <span className="text-[9px] font-mono text-white/30">{label}</span>
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${heightPct}%`,
                        background: isMax
                          ? 'linear-gradient(180deg, #C026D3, #7C3AED)'
                          : 'rgba(255,255,255,0.08)',
                        boxShadow: isMax ? '0 0 16px #C026D340' : 'none',
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-white/40">{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sources */}
        <div className="col-span-2 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-black tracking-tighter text-lg">Top fuentes</h2>
          <div className="flex flex-col gap-3">
            {SOURCES.map(({ name, pct, color }) => (
              <div key={name} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">{name}</span>
                  <span className="font-mono" style={{ color }}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Countries + Activity feed */}
      <div className="grid grid-cols-5 gap-6">
        {/* Countries */}
        <div className="col-span-2 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-black tracking-tighter text-lg">Países</h2>
          <div className="flex flex-col gap-3">
            {COUNTRIES.map(({ name, pct, flag }) => (
              <div key={name} className="flex items-center gap-3">
                <span className="text-lg leading-none">{flag}</span>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70">{name}</span>
                    <span className="font-mono text-white/40">{pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C026D3] to-[#7C3AED] transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="col-span-3 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black tracking-tighter text-lg">Actividad reciente</h2>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="flex flex-col gap-2">
            {ACTIVITY.map(({ text, time, icon: Icon, color }, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 truncate">{text}</p>
                </div>
                <span className="text-[10px] font-mono text-white/25 shrink-0 whitespace-nowrap">
                  {time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
