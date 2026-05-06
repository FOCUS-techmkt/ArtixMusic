'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CHECKLIST, type ChecklistItem } from '@/lib/dashboard-mocks'

interface Props { checklist?: ChecklistItem[] }

export function ProfileChecklist({ checklist }: Props) {
  const data  = checklist ?? CHECKLIST
  const done  = data.filter(i => i.done).length
  const total = data.length
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
      <div className="flex items-baseline justify-between">
        <h2 className="font-display font-semibold text-[16px] tracking-[-0.02em]">Completa tu perfil</h2>
        <span className="font-mono text-[11px] text-white/35">{done}/{total}</span>
      </div>

      <div
        className="h-1 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Perfil ${pct}% completo`}
        style={{ background: 'rgba(255,255,255,0.06)' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #C026D3, #E879F9)' }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {data.map(({ id, label, done: isDone, href }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, x: 4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
            style={{ opacity: isDone ? 0.5 : 1 }}
          >
            {isDone ? (
              <div className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: '#C026D3', border: '1.5px solid #C026D3' }}
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-[13px] text-white/40 line-through flex-1">{label}</span>
              </div>
            ) : (
              <Link href={href} className="flex items-center gap-2.5 group">
                <div className="w-4 h-4 rounded-full shrink-0" style={{ border: '1.5px solid rgba(255,255,255,0.20)' }} />
                <span className="text-[13px] text-white flex-1 group-hover:text-white/80 transition-colors">{label}</span>
                <ArrowRight className="w-3 h-3 text-white/25 group-hover:text-white/50 transition-colors shrink-0" />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
