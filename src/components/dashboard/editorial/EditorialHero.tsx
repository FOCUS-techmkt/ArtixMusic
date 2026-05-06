'use client'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/dashboard/Avatar'
import { PulseDot } from '@/components/dashboard/PulseDot'
import type { PressMeta } from '@/app/(dashboard)/dashboard/_components/DashboardContent'
import type { KpiItem } from '@/lib/dashboard-mocks'
import { ARTIST, KPIS } from '@/lib/dashboard-mocks'

const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } } }

function getGreeting(firstName: string): { greeting: string; sub: string } {
  const h   = new Date().getHours()
  const day = new Date().getDay()
  if (h >= 0  && h < 5)  return { greeting: 'Madrugada,',    sub: 'Los nocturnos crean los mejores sets.' }
  if (h >= 5  && h < 9)  return { greeting: 'Buen día,',     sub: 'Perfecta hora para revisar tus métricas.' }
  if (h >= 9  && h < 12) return { greeting: 'Buenos días,',  sub: day === 1 ? 'Semana nueva, energía nueva.' : 'La mañana es para los que crean.' }
  if (h >= 12 && h < 14) return { greeting: 'Buenas tardes,', sub: 'El momentum está de tu lado.' }
  if (h >= 14 && h < 17) return { greeting: 'Buenas tardes,', sub: day === 5 ? '¡Viernes! La escena te espera.' : 'Tarde productiva para tu música.' }
  if (h >= 17 && h < 20) return { greeting: 'Buenas tardes,', sub: day >= 5 ? 'El fin de semana empieza.' : 'El atardecer suena mejor con beats.' }
  if (h >= 20 && h < 23) return { greeting: 'Buenas noches,', sub: 'La noche es cuando todo cobra vida.' }
  return { greeting: 'Buenas noches,', sub: 'Los mejores tracks nacen de noche.' }
}

function useEditionInfo() {
  const now = new Date()
  const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const weekNum = Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))
  return {
    dayName: days[now.getDay()],
    dateStr: `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`,
    vol: '014',
    week: String(weekNum).padStart(2, '0'),
  }
}

interface Props {
  pressMeta?: PressMeta
  kpis?: KpiItem[]
}

export function EditorialHero({ pressMeta, kpis }: Props) {
  const firstName  = pressMeta?.firstName  ?? ARTIST.firstName
  const initials   = pressMeta?.initials   ?? ARTIST.initials
  const photoUrl   = pressMeta?.photoUrl   ?? null
  const planDays   = pressMeta?.planDaysLeft ?? ARTIST.planDaysLeft
  const visits     = kpis?.[0] ?? KPIS[0]
  const ed         = useEditionInfo()
  const { greeting, sub: greetingSub } = getGreeting(firstName)

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
      initial="hidden"
      animate="show"
      className="px-4 lg:px-8 pt-6 lg:pt-8 pb-0"
    >
      {/* Edition header */}
      <motion.div variants={fade} className="flex items-center gap-3 mb-7">
        <div className="flex items-center gap-2">
          <PulseDot />
          <span className="font-mono text-[10px] text-magenta-500 uppercase tracking-[0.22em]">
            Edición · {ed.dayName} {ed.dateStr}
          </span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-magenta-500/30 to-transparent" />
        <span className="font-mono text-[10px] text-white/25 uppercase tracking-[0.18em]">
          Vol. {ed.vol} · Semana {ed.week}
        </span>
      </motion.div>

      {/* Hero row */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 min-w-0">
          <motion.h1
            variants={fade}
            className="font-display font-medium leading-[0.95] tracking-[-0.04em] mb-4 text-white"
            style={{ fontSize: 'clamp(2.4rem, 4.5vw, 4.2rem)' }}
          >
            {greeting}{' '}
            <span className="font-serif italic font-normal text-magenta-400">
              {firstName}.
            </span>
          </motion.h1>
          <motion.p variants={fade} className="text-[13px] text-white/35 mb-4 font-mono tracking-wide">{greetingSub}</motion.p>

          <motion.p variants={fade} className="text-[17px] text-white/50 max-w-[580px] leading-[1.45]">
            Tu presskit recibió{' '}
            <strong className="text-white font-semibold">{visits.display} visitas</strong>{' '}
            en los últimos 14 días
            {visits.change !== 0 && (
              <>
                {' '}—{' '}
                <strong className={`font-semibold ${visits.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {visits.positive ? '+' : ''}{visits.change}%
                </strong>{' '}
                respecto al período anterior
              </>
            )}.
          </motion.p>
        </div>

        {/* Avatar + plan */}
        <motion.div variants={fade} className="shrink-0 flex flex-col items-end gap-2.5 pt-1">
          <Avatar initials={initials} src={photoUrl} size="lg" />
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-[9px] text-magenta-400 uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border border-magenta-500/20 bg-magenta-500/08">
              ⚡ Plan Pro
            </span>
            <span className="font-mono text-[9px] text-white/25">{planDays} días restantes</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
