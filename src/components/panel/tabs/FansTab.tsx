'use client'
import { useState, useMemo } from 'react'
import { Search, Download, Users, TrendingUp, UserPlus } from 'lucide-react'
import type { TabProps } from '../DashboardClient'

export default function FansTab({ fans, palette }: TabProps) {
  const [search, setSearch] = useState('')

  const now = new Date()
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7)
  const monthAgo = new Date(); monthAgo.setDate(monthAgo.getDate() - 30)

  const newThisWeek  = fans.filter(f => new Date(f.created_at) > weekAgo).length
  const newThisMonth = fans.filter(f => new Date(f.created_at) > monthAgo).length

  const filtered = useMemo(() =>
    fans.filter(f =>
      f.email.toLowerCase().includes(search.toLowerCase()) ||
      (f.name ?? '').toLowerCase().includes(search.toLowerCase())
    ),
    [fans, search]
  )

  // Source breakdown
  const sources: Record<string, number> = {}
  fans.forEach(f => { sources[f.source ?? 'presskit'] = (sources[f.source ?? 'presskit'] ?? 0) + 1 })

  const exportCSV = () => {
    const header = 'Email,Nombre,Fuente,Fecha'
    const rows = fans.map(f =>
      `${f.email},"${f.name ?? ''}","${f.source ?? 'presskit'}","${new Date(f.created_at).toLocaleDateString('es-ES')}"`
    )
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob)
    a.download = 'fans.csv'; a.click()
  }

  return (
    <div className="px-6 lg:px-8 py-8 max-w-5xl mx-auto flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-mono text-white/25 tracking-[0.15em] uppercase mb-1">Base de datos</p>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Fans</h1>
        </div>
        {fans.length > 0 && (
          <button onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 text-sm text-white/50 hover:text-white hover:border-white/20 transition-all">
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total fans',       value: fans.length,   icon: Users,     color: palette.primary },
          { label: 'Esta semana',      value: newThisWeek,   icon: UserPlus,  color: '#22C55E' },
          { label: 'Este mes',         value: newThisMonth,  icon: TrendingUp, color: '#38BDF8' },
          { label: 'Fuentes activas',  value: Object.keys(sources).length, icon: TrendingUp, color: '#F59E0B' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl flex flex-col gap-2"
            style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">{label}</span>
            </div>
            <p className="font-display font-extrabold text-2xl">{value}</p>
          </div>
        ))}
      </div>

      {fans.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: palette.primary + '15' }}>
            👥
          </div>
          <div className="text-center">
            <p className="font-display font-bold text-xl text-white/60">Aún no tienes fans registrados</p>
            <p className="text-sm text-white/30 mt-2 max-w-sm">
              Cuando alguien te deje su email en tu press kit, aparecerá aquí.
              Comparte tu link para empezar a crecer tu base de fans.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por email o nombre..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-all"
              style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.06)' }}
            />
          </div>

          {/* Table */}
          <div className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
            {/* Header */}
            <div className="grid grid-cols-12 px-5 py-3"
              style={{ background: '#141418', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {['Email', 'Nombre', 'Fuente', 'Fecha'].map((h, i) => (
                <p key={h} className={`text-[9px] font-mono uppercase tracking-wider text-white/25 ${i === 0 ? 'col-span-5' : i === 1 ? 'col-span-3' : i === 2 ? 'col-span-2' : 'col-span-2'}`}>
                  {h}
                </p>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/[0.04]">
              {filtered.map((fan, i) => (
                <div key={fan.id ?? i} className="grid grid-cols-12 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold"
                      style={{ background: palette.primary + '22', color: palette.primary }}>
                      {fan.email[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-white/70 truncate font-mono text-xs">{fan.email}</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-white/50 truncate">{fan.name ?? '—'}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                      {fan.source ?? 'presskit'}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-[10px] font-mono text-white/25">
                      {new Date(fan.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {filtered.length === 0 && search && (
            <p className="text-center text-white/30 text-sm py-8">Sin resultados para "{search}"</p>
          )}
        </>
      )}
    </div>
  )
}
