'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, Zap, BarChart2, Users, Lock, Plus } from 'lucide-react'
import type { TabProps } from '../DashboardClient'

const AUTOMATIONS = [
  { id: 'welcome',  label: 'Bienvenida automática', desc: 'Se envía cuando alguien se suscribe', icon: '👋', active: false },
  { id: 'release',  label: 'Nuevo lanzamiento',     desc: 'Notifica a tus fans cuando publicas', icon: '🎵', active: false },
  { id: 'event',    label: 'Próximo evento',         desc: 'Aviso automático de shows',          icon: '🎤', active: false },
]

const DEMO_STATS = [
  { label: 'Enviados',    value: '—', icon: Send,     color: '#38BDF8' },
  { label: 'Aperturas',   value: '—', icon: Mail,     color: '#22C55E' },
  { label: 'Clics',       value: '—', icon: BarChart2, color: '#F59E0B' },
  { label: 'Suscriptores', value: '—', icon: Users,   color: '#C026D3' },
]

export default function EmailTab({ palette, fans }: TabProps) {
  const [automations, setAutomations] = useState(AUTOMATIONS)

  const toggleAuto = (id: string) =>
    setAutomations(p => p.map(a => a.id === id ? { ...a, active: !a.active } : a))

  return (
    <div className="px-6 lg:px-8 py-8 max-w-4xl mx-auto flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-mono text-white/25 tracking-[0.15em] uppercase mb-1">Marketing</p>
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Email Marketing</h1>
        </div>
        <button disabled
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/40 cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Plus className="w-4 h-4" />
          Nueva campaña
          <Lock className="w-3 h-3 ml-1" />
        </button>
      </div>

      {/* Coming soon banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden p-6 rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${palette.primary}15, ${palette.secondary}08)`, border: `1px solid ${palette.primary}25` }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: palette.primary + '25' }}>
              <Mail className="w-5 h-5" style={{ color: palette.primary }} />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-white">Email Marketing — En construcción</p>
              <p className="text-[11px] font-mono" style={{ color: palette.primary }}>PRÓXIMAMENTE</p>
            </div>
          </div>
          <p className="text-sm text-white/50 leading-relaxed max-w-xl">
            Pronto podrás enviar campañas de email a tus {fans.length} fans, crear automatizaciones
            de bienvenida, notificar lanzamientos y medir el rendimiento de cada envío directamente desde aquí.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-10"
          style={{ background: palette.primary }} />
      </motion.div>

      {/* Stats (placeholder) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl flex flex-col gap-2 opacity-40"
            style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">{label}</span>
            </div>
            <p className="font-display font-extrabold text-2xl text-white/20">{value}</p>
          </div>
        ))}
      </div>

      {/* Automations */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Automatizaciones</p>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.25)' }}>
            PRÓXIMAMENTE
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {automations.map(({ id, label, desc, icon, active }) => (
            <div key={id}
              className="flex items-center justify-between p-4 rounded-2xl opacity-50 cursor-not-allowed"
              style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-4">
                <span className="text-2xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium text-white/70">{label}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-5 rounded-full bg-white/10 relative">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature list */}
      <div className="p-5 rounded-2xl" style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/25 mb-4">Lo que vendrá</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '📧', text: 'Editor de emails drag & drop' },
            { icon: '🎯', text: 'Segmentación de audiencia' },
            { icon: '📊', text: 'Analytics de campañas en tiempo real' },
            { icon: '🤖', text: 'Automatizaciones basadas en eventos' },
            { icon: '🎨', text: 'Templates con tu branding' },
            { icon: '📅', text: 'Programación de envíos' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <span className="text-lg">{icon}</span>
              <span className="text-xs text-white/40">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
