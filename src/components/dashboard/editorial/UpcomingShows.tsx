'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CalendarDays, Plus } from 'lucide-react'
import { UPCOMING, type ShowItem } from '@/lib/dashboard-mocks'

interface Props { upcoming?: ShowItem[] }

export function UpcomingShows({ upcoming }: Props) {
  const data = upcoming ?? UPCOMING

  return (
    <div className="border border-white/[0.06] rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.015)' }}>
      <div className="flex items-baseline justify-between px-6 py-5 border-b border-white/[0.04]">
        <h3 className="font-display font-semibold text-[18px] tracking-[-0.02em]">Próximos shows</h3>
        <Link href="/panel" className="font-mono text-[11px] text-magenta-400 flex items-center gap-1 hover:text-magenta-300 transition-colors">
          <Plus className="w-3 h-3" /> Agregar
        </Link>
      </div>

      {data.length === 0 ? (
        <div className="px-6 py-10 flex flex-col items-center gap-3">
          <CalendarDays className="w-7 h-7 text-white/10" aria-hidden="true" />
          <p className="text-[12px] text-white/25 font-mono">Sin fechas próximas</p>
          <Link href="/panel" className="text-[12px] font-mono text-magenta-400 hover:text-magenta-300 transition-colors">
            Añadir fechas en el editor →
          </Link>
        </div>
      ) : (
        <div>
          {data.map((show, i) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="grid items-center gap-4 px-6 py-[14px] hover:bg-white/[0.02] transition-colors"
              style={{
                gridTemplateColumns: '72px 1fr auto',
                borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span className="font-mono text-[11px] text-magenta-400 uppercase tracking-[0.1em]">{show.date}</span>
              <div className="min-w-0">
                <p className="font-display text-[17px] font-medium tracking-[-0.02em] truncate">{show.city}</p>
                <p className="text-[12px] text-white/40 truncate">{show.venue}</p>
              </div>
              <span
                className="font-mono text-[9px] px-2.5 py-1 rounded-full uppercase tracking-[0.16em] shrink-0"
                style={{
                  background: show.status === 'Confirmado' ? 'rgba(52,211,153,0.10)' : 'rgba(245,158,11,0.10)',
                  color:      show.status === 'Confirmado' ? '#34D399' : '#F59E0B',
                  border:     `1px solid ${show.status === 'Confirmado' ? 'rgba(52,211,153,0.20)' : 'rgba(245,158,11,0.20)'}`,
                }}
              >
                {show.status}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
