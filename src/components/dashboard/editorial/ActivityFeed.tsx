'use client'
import { motion } from 'framer-motion'
import { PulseDot } from '@/components/dashboard/PulseDot'
import { ACTIVITY, type ActivityItem } from '@/lib/dashboard-mocks'

const SOURCE_ICONS: Record<string, string> = {
  Instagram: '📸',
  Google:    '🔍',
  Twitter:   '𝕏',
  Facebook:  '👤',
  Externo:   '🔗',
  Directo:   '🎯',
}

interface Props { activity?: ActivityItem[] }

export function ActivityFeed({ activity }: Props) {
  const data = activity ?? ACTIVITY

  return (
    <div className="border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'rgba(255,255,255,0.015)' }}>
      <div className="flex items-center gap-2">
        <h2 className="font-display font-semibold text-[16px] tracking-[-0.02em]">Actividad</h2>
        <PulseDot color="#34D399" />
        <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-[0.18em]">En vivo</span>
      </div>

      {data.length === 0 ? (
        <p className="text-[12px] font-mono text-white/25 py-6 text-center">Sin actividad reciente</p>
      ) : (
        <div>
          {data.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 + i * 0.06, duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-3 py-[11px]"
              style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.04)' }}
            >
              <div className="shrink-0 pt-0.5">
                <span
                  className="font-mono text-[8px] px-1.5 py-0.5 rounded uppercase tracking-[0.14em] font-semibold"
                  style={{ color: item.color, background: item.color + '18' }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-white/70 leading-[1.4]">{item.text}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {item.source && (
                    <span className="font-mono text-[9px] text-white/25 flex items-center gap-1">
                      {SOURCE_ICONS[item.source] ?? '🔗'} {item.source}
                    </span>
                  )}
                  {item.country && (
                    <span className="font-mono text-[9px] text-white/25">· {item.country}</span>
                  )}
                  <span className="font-mono text-[9px] text-white/20 uppercase tracking-[0.06em]">Hace {item.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
