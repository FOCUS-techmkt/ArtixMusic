'use client'
import { motion } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { useState } from 'react'
import type { PressMeta } from '@/app/(dashboard)/dashboard/_components/DashboardContent'
import type { KpiItem } from '@/lib/dashboard-mocks'
import { ARTIST, KPIS } from '@/lib/dashboard-mocks'

interface Props {
  pressMeta?: PressMeta
  kpis?: KpiItem[]
}

export function InsightCard({ pressMeta, kpis }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const firstName = pressMeta?.firstName ?? ARTIST.firstName
  const visits    = kpis?.[0] ?? KPIS[0]
  const hasGrowth = visits.change > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: 0.3, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-2xl p-7 overflow-hidden"
      style={{
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(135deg, rgba(192,38,211,0.06) 0%, rgba(124,58,237,0.02) 100%)',
      }}
    >
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-4 right-4 p-1.5 rounded-lg text-white/20 hover:text-white/50 transition-colors"
        aria-label="Descartar"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-3 mb-5">
        <span className="font-mono text-[10px] text-magenta-400 uppercase tracking-[0.22em]">
          Historia de la semana
        </span>
        <div className="flex-1 h-px" style={{ background: 'rgba(232,121,249,0.2)' }} />
      </div>

      <h2 className="font-display font-medium text-[28px] leading-[1.05] tracking-[-0.03em] mb-3">
        {hasGrowth ? (
          <>Tu presskit creció <span className="font-serif italic font-normal text-magenta-400">{visits.change}%</span> esta semana.</>
        ) : (
          <>Bienvenido al panel de <span className="font-serif italic font-normal text-magenta-400">{firstName}</span>.</>
        )}
      </h2>

      <p className="text-[14px] text-white/55 leading-[1.55] mb-6 max-w-[520px]">
        {hasGrowth
          ? <>Tus visitas crecieron <strong className="text-white/80">{visits.change}%</strong> respecto al período anterior. Es el momento de capturar más contactos de booking.</>
          : <>Completa tu perfil y activa las secciones para que tu presskit destaque. Cada campo que llenas aumenta tu visibilidad.</>
        }
      </p>

      <div className="flex gap-3">
        <a
          href={hasGrowth ? '/dashboard?tab=analytics' : '/dashboard?tab=editor'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold bg-white text-[#0A0A0F] hover:bg-white/90 transition-colors"
        >
          {hasGrowth ? 'Ver analíticas' : 'Completar perfil'} <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-medium text-white/60 hover:text-white/80 transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.10)' }}
        >
          Descartar
        </button>
      </div>
    </motion.div>
  )
}
