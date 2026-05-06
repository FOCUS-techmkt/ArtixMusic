'use client'
import { motion } from 'framer-motion'
import { Sparkline } from '@/components/dashboard/Sparkline'
import { KPIS, type KpiItem } from '@/lib/dashboard-mocks'

interface Props { kpis?: KpiItem[] }

export function HeroStatsRow({ kpis }: Props) {
  const data = kpis ?? KPIS
  const [main, ...rest] = data

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="mx-4 lg:mx-8 mt-7 rounded-2xl overflow-hidden border border-white/[0.05] grid grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]"
    >
      {/* Big first cell */}
      <div
        className="col-span-2 lg:col-span-1 px-6 py-5 flex flex-col gap-3"
        style={{ background: '#0A0A0F', borderRight: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em]">{main.label}</span>
          <span className={`font-mono text-[11px] ${main.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {main.change >= 0 ? '+' : ''}{main.change}%
          </span>
        </div>
        <div className="flex items-end gap-4">
          <span className="font-display font-medium text-white leading-[0.9] tracking-[-0.04em] text-[52px]">
            {main.display}
          </span>
          <div className="pb-1">
            <Sparkline data={main.sparkData} color="#C026D3" width={160} height={52} fill />
          </div>
        </div>
        <span className="font-mono text-[10px] text-white/25 tracking-[0.12em] uppercase">{main.sub}</span>
      </div>

      {/* Smaller cells */}
      {rest.map((kpi, i) => (
        <div
          key={kpi.id}
          className="px-5 py-5 flex flex-col gap-3 justify-between"
          style={{
            background: '#0A0A0F',
            borderRight: i < rest.length - 1 ? '1px solid rgba(255,255,255,0.05)' : undefined,
          }}
        >
          <span className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em] leading-tight">{kpi.label}</span>
          <span className="font-display font-medium text-white leading-[1] tracking-[-0.04em] text-[36px]">{kpi.display}</span>
          <div className="flex items-center gap-2">
            <span className={`font-mono text-[11px] ${kpi.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {kpi.change >= 0 ? '+' : ''}{Math.abs(kpi.change)}%
            </span>
            <span className="text-[11px] text-white/30 truncate">· {kpi.sub}</span>
          </div>
        </div>
      ))}
    </motion.div>
  )
}
