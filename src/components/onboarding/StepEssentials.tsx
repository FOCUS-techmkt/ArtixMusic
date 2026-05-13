'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { Music2, Mail, Calendar, MapPin, Ticket } from 'lucide-react'
import type { OnboardingData } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'

const DAY_NAMES   = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const MONTH_NAMES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']

function parseDate(dateStr: string) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T12:00:00')
  if (isNaN(d.getTime())) return null
  return { day: DAY_NAMES[d.getDay()], date: d.getDate(), month: MONTH_NAMES[d.getMonth()], year: d.getFullYear() }
}

function ShowCard({ data }: { data: OnboardingData }) {
  const parsed = parseDate(data.next_show_date)
  if (!parsed) return null

  return (
    <motion.div
      key="show-card"
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className="rounded-2xl p-5 relative overflow-hidden mt-3"
      style={{
        background:  `linear-gradient(135deg, ${data.primary_color}12, ${data.secondary_color}08)`,
        border:      `1px solid ${data.primary_color}30`,
        boxShadow:   `0 0 32px ${data.primary_color}12`,
      }}
    >
      {/* Subtle bg glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${data.primary_color}10 0%, transparent 60%)` }}
      />

      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-4 relative">
        <motion.div
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-2 h-2 rounded-full"
          style={{ background: data.primary_color, boxShadow: `0 0 6px ${data.primary_color}` }}
        />
        <span className="text-[10px] font-mono tracking-[0.22em]" style={{ color: data.primary_color }}>
          PRÓXIMO SHOW
        </span>
      </div>

      {/* Date display */}
      <div className="flex items-baseline gap-3 mb-3 relative">
        <span className="font-mono text-[11px] text-white/35 self-start mt-1">{parsed.day}</span>
        <motion.span
          key={parsed.date}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-black text-5xl text-white leading-none tracking-tight"
        >
          {parsed.date}
        </motion.span>
        <div className="flex flex-col">
          <span className="font-mono text-lg font-bold leading-none" style={{ color: data.primary_color }}>
            {parsed.month}
          </span>
          <span className="font-mono text-xs text-white/30 mt-0.5">{parsed.year}</span>
        </div>
      </div>

      {/* Venue + City */}
      <AnimatePresence>
        {(data.next_show_venue || data.next_show_city) && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 relative"
          >
            <MapPin className="w-3 h-3 shrink-0" style={{ color: data.primary_color + '80' }} />
            <span className="text-[13px] font-mono text-white/55">
              {[data.next_show_venue, data.next_show_city].filter(Boolean).join(' · ')}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ticket link */}
      <AnimatePresence>
        {data.next_show_url && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 mt-2 relative"
          >
            <Ticket className="w-3 h-3 shrink-0" style={{ color: data.primary_color + '60' }} />
            <span className="text-[11px] font-mono" style={{ color: data.primary_color + '70' }}>
              Entradas disponibles
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface Props {
  data:     OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepEssentials({ data, onChange }: Props) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-7"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Lo esencial</h2>
        <p className="text-white/50">
          Bio, contacto y tu primer link de música. Todo lo demás lo configuras desde el editor.
        </p>
      </motion.div>

      {/* Bio */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Bio breve</label>
        <textarea
          value={data.bio}
          onChange={e => onChange({ bio: e.target.value })}
          placeholder="DJ y productor con base en Madrid. Especializado en techno hipnótico, con residencias en Fabrik y Tresor…"
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all resize-none"
          style={{ fontSize: '16px' }}
        />
      </motion.div>

      {/* Music link */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Tu música</label>
        <div className="flex items-center gap-3">
          <Music2 className="w-5 h-5 text-white/30 shrink-0" />
          <input
            type="url"
            value={data.music_url}
            onChange={e => onChange({ music_url: e.target.value })}
            placeholder="Spotify, SoundCloud, YouTube…"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
            style={{ fontSize: '16px' }}
          />
        </div>
      </motion.div>

      {/* Booking email */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Email de booking</label>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.12)', color: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.2)' }}>
            CRÍTICO
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-white/30 shrink-0" />
          <input
            type="email"
            value={data.booking_email}
            onChange={e => onChange({ booking_email: e.target.value })}
            placeholder="booking@tumanager.com"
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
            style={{ fontSize: '16px' }}
          />
        </div>
        <p className="text-[11px] text-white/30 pl-8">Sin esto los bookers no pueden contactarte directamente</p>
      </motion.div>

      {/* Próxima fecha */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span className="text-[10px] font-mono text-white/25 tracking-widest">PRÓXIMO SHOW</span>
          <span className="text-[9px] font-mono text-white/20">opcional</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* 2x2 grid — 2 cols on any screen (inputs are wide enough at 157px each) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-mono text-white/30 uppercase tracking-wider">
              <Calendar className="w-3 h-3" /> Fecha
            </label>
            <input
              type="date"
              value={data.next_show_date}
              onChange={e => onChange({ next_show_date: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#C026D3]/60 transition-all"
              style={{ colorScheme: 'dark', fontSize: '16px' }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Sala / Venue</label>
            <input
              type="text"
              value={data.next_show_venue}
              onChange={e => onChange({ next_show_venue: e.target.value })}
              placeholder="Fabric…"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Ciudad</label>
            <input
              type="text"
              value={data.next_show_city}
              onChange={e => onChange({ next_show_city: e.target.value })}
              placeholder="Madrid…"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-white/30 uppercase tracking-wider">URL entradas</label>
            <input
              type="url"
              value={data.next_show_url}
              onChange={e => onChange({ next_show_url: e.target.value })}
              placeholder="tickets.com/…"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>

        {/* Animated show card preview */}
        <AnimatePresence>
          {data.next_show_date && <ShowCard data={data} />}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
