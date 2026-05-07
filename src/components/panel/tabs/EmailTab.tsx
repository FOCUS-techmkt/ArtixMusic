'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Send, BarChart2, Users, Plus, X, ChevronRight,
  Eye, Zap, Calendar, Heart, Megaphone, Star, ArrowLeft,
} from 'lucide-react'
import type { TabProps } from '../DashboardClient'

/* ─────────────────────────────────────────────
   Email template definitions
───────────────────────────────────────────── */
interface EmailTemplate {
  id:          string
  name:        string
  category:    string
  desc:        string
  preview:     React.ReactNode
  subject:     string
  bestFor:     string
}

function MockupBienvenida({ primary }: { primary: string }) {
  return (
    <div className="w-full h-full bg-[#0a0a0f] flex flex-col text-[6px] overflow-hidden">
      {/* Header bar */}
      <div className="h-6 flex items-center justify-center" style={{ background: primary + '20' }}>
        <div className="w-12 h-1.5 rounded-full" style={{ background: primary }} />
      </div>
      {/* Hero photo placeholder */}
      <div className="mx-3 mt-2 h-10 rounded-lg flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${primary}30, ${primary}10)`, border: `1px solid ${primary}20` }}>
        <span className="text-[10px]">🎵</span>
      </div>
      {/* Content */}
      <div className="px-3 py-2 flex flex-col gap-1.5">
        <div className="w-16 h-1.5 rounded-full bg-white/60 mx-auto" />
        <div className="w-20 h-1 rounded-full bg-white/20 mx-auto" />
        <div className="w-24 h-1 rounded-full bg-white/15 mx-auto" />
        <div className="w-20 h-1 rounded-full bg-white/15 mx-auto" />
      </div>
      {/* CTA */}
      <div className="mx-3 mt-1">
        <div className="h-4 rounded-md flex items-center justify-center"
          style={{ background: primary }}>
          <div className="w-10 h-1 rounded-full bg-white/70" />
        </div>
      </div>
      {/* Footer */}
      <div className="mt-auto px-3 pb-2 pt-2 border-t border-white/5 flex justify-center gap-2">
        {['⬛','⬛','⬛'].map((_, i) => (
          <div key={i} className="w-3 h-1 rounded-full bg-white/10" />
        ))}
      </div>
    </div>
  )
}

function MockupLanzamiento({ primary }: { primary: string }) {
  return (
    <div className="w-full h-full bg-[#060608] flex flex-col text-[6px] overflow-hidden">
      {/* Big dark hero */}
      <div className="h-20 relative overflow-hidden flex items-center justify-center"
        style={{ background: `radial-gradient(circle at 50% 60%, ${primary}40 0%, #000 70%)` }}>
        <div className="w-14 h-14 rounded-xl border-2 flex items-center justify-center"
          style={{ borderColor: primary + '60', background: primary + '15' }}>
          <span className="text-[18px]">💿</span>
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center gap-0.5">
          <div className="w-14 h-1.5 rounded-full bg-white/70" />
          <div className="w-8 h-1 rounded-full" style={{ background: primary + '80' }} />
        </div>
      </div>
      {/* Track info */}
      <div className="px-3 py-2 flex flex-col gap-1">
        <div className="w-20 h-1 rounded-full bg-white/15" />
        <div className="w-16 h-1 rounded-full bg-white/10" />
      </div>
      {/* Streaming buttons */}
      <div className="px-3 flex flex-col gap-1">
        {[primary, '#1DB954', '#FF5500'].map((c, i) => (
          <div key={i} className="h-3 rounded-md flex items-center px-1 gap-1"
            style={{ background: c + '20', border: `1px solid ${c}30` }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
            <div className="flex-1 h-0.5 rounded-full" style={{ background: c + '50' }} />
          </div>
        ))}
      </div>
      <div className="mt-auto px-3 pb-2 pt-1 border-t border-white/5">
        <div className="w-12 h-0.5 rounded-full bg-white/10 mx-auto" />
      </div>
    </div>
  )
}

function MockupEvento({ primary }: { primary: string }) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: `linear-gradient(160deg, #0a0014 0%, #0a0a1a 100%)` }}>
      {/* Date badge */}
      <div className="mx-auto mt-3 px-3 py-1 rounded-full text-[6px] font-bold tracking-widest"
        style={{ background: primary, color: '#000' }}>
        SAT · 24 MAY
      </div>
      {/* Big headline */}
      <div className="px-3 mt-2 flex flex-col items-center gap-1">
        <div className="w-20 h-2 rounded-full bg-white/80" />
        <div className="w-14 h-1.5 rounded-full" style={{ background: primary + '60' }} />
      </div>
      {/* Venue card */}
      <div className="mx-3 mt-3 p-2 rounded-lg border"
        style={{ borderColor: primary + '30', background: primary + '08' }}>
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: primary }} />
          <div className="w-14 h-1 rounded-full bg-white/50" />
        </div>
        <div className="w-18 h-0.5 rounded-full bg-white/15" />
        <div className="w-12 h-0.5 rounded-full bg-white/10 mt-0.5" />
      </div>
      {/* CTA */}
      <div className="mx-3 mt-2">
        <div className="h-4 rounded-md flex items-center justify-center"
          style={{ background: `linear-gradient(90deg, ${primary}, ${primary}aa)` }}>
          <div className="w-12 h-1 rounded-full bg-white/80" />
        </div>
      </div>
      <div className="mt-auto px-3 pb-2 pt-2 border-t border-white/5">
        <div className="w-16 h-0.5 rounded-full bg-white/10 mx-auto" />
      </div>
    </div>
  )
}

function MockupNewsletter({ primary }: { primary: string }) {
  return (
    <div className="w-full h-full bg-[#0c0c14] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2">
        <div className="w-4 h-4 rounded-full" style={{ background: primary + '40' }} />
        <div className="w-10 h-1 rounded-full" style={{ background: primary + '60' }} />
        <div className="ml-auto text-[6px] font-mono" style={{ color: primary }}>MAYO 2026</div>
      </div>
      {/* Greeting */}
      <div className="px-3 pt-2 flex flex-col gap-1">
        <div className="w-14 h-1.5 rounded-full bg-white/60" />
        <div className="w-20 h-1 rounded-full bg-white/20" />
        <div className="w-18 h-1 rounded-full bg-white/15" />
      </div>
      {/* Grid of 2 cards */}
      <div className="px-3 mt-2 grid grid-cols-2 gap-1.5">
        {[primary, '#60A5FA'].map((c, i) => (
          <div key={i} className="rounded-md p-1.5"
            style={{ background: c + '12', border: `1px solid ${c}20` }}>
            <div className="w-full h-4 rounded mb-1 flex items-center justify-center"
              style={{ background: c + '20' }}>
              <span className="text-[8px]">{i === 0 ? '🎵' : '📅'}</span>
            </div>
            <div className="w-full h-0.5 rounded-full bg-white/20 mb-0.5" />
            <div className="w-3/4 h-0.5 rounded-full bg-white/10" />
          </div>
        ))}
      </div>
      {/* Text block */}
      <div className="px-3 mt-1.5 flex flex-col gap-0.5">
        <div className="w-full h-0.5 rounded-full bg-white/10" />
        <div className="w-full h-0.5 rounded-full bg-white/10" />
        <div className="w-3/4 h-0.5 rounded-full bg-white/10" />
      </div>
      <div className="mt-auto px-3 pb-2 pt-1 border-t border-white/5 flex justify-between">
        <div className="w-8 h-0.5 rounded-full bg-white/10" />
        <div className="w-8 h-0.5 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

function MockupExclusivo({ primary }: { primary: string }) {
  return (
    <div className="w-full h-full flex flex-col overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 50% 0%, ${primary}25 0%, #040408 60%)` }}>
      {/* Crown */}
      <div className="flex justify-center mt-3">
        <div className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: primary + '20', border: `1px solid ${primary}40` }}>
          <span className="text-[10px]">⭐</span>
        </div>
      </div>
      {/* VIP Badge */}
      <div className="mx-auto mt-1 px-2 py-0.5 rounded-full text-[5px] font-bold tracking-[0.2em]"
        style={{ background: primary + '20', color: primary, border: `1px solid ${primary}40` }}>
        EXCLUSIVO FANS
      </div>
      {/* Title */}
      <div className="px-3 mt-2 flex flex-col items-center gap-1">
        <div className="w-22 h-1.5 rounded-full bg-white/70" />
        <div className="w-16 h-1 rounded-full bg-white/30" />
      </div>
      {/* Content box */}
      <div className="mx-3 mt-2 p-2 rounded-lg"
        style={{ background: primary + '10', border: `1px solid ${primary}25` }}>
        <div className="flex flex-col gap-1">
          <div className="w-full h-0.5 rounded-full bg-white/20" />
          <div className="w-full h-0.5 rounded-full bg-white/15" />
          <div className="w-3/4 h-0.5 rounded-full bg-white/10" />
        </div>
      </div>
      {/* Download CTA */}
      <div className="mx-3 mt-2">
        <div className="h-4 rounded-md flex items-center justify-center gap-1"
          style={{ background: primary }}>
          <div className="w-8 h-1 rounded-full bg-white/80" />
        </div>
      </div>
      <div className="mt-auto px-3 pb-2 pt-1 border-t border-white/5">
        <div className="w-20 h-0.5 rounded-full bg-white/10 mx-auto" />
      </div>
    </div>
  )
}

function MockupReengagement({ primary }: { primary: string }) {
  return (
    <div className="w-full h-full bg-[#0a0a0f] flex flex-col overflow-hidden">
      {/* Emoji centered */}
      <div className="flex justify-center mt-4">
        <span className="text-[22px]">💔</span>
      </div>
      {/* Headline */}
      <div className="px-3 mt-2 flex flex-col items-center gap-1.5">
        <div className="w-18 h-1.5 rounded-full bg-white/70" />
        <div className="w-22 h-1 rounded-full bg-white/25" />
      </div>
      {/* Text */}
      <div className="px-4 mt-2 flex flex-col gap-0.5">
        <div className="w-full h-0.5 rounded-full bg-white/15" />
        <div className="w-full h-0.5 rounded-full bg-white/12" />
        <div className="w-3/4 h-0.5 rounded-full bg-white/10" />
      </div>
      {/* What's new teaser */}
      <div className="mx-3 mt-2 p-2 rounded-lg border border-white/5 bg-white/[0.02]">
        <div className="text-[5px] font-mono mb-1" style={{ color: primary }}>MIENTRAS ESTABAS AUSENTE</div>
        {['🎵', '📅', '🎤'].map((e, i) => (
          <div key={i} className="flex items-center gap-1 mb-0.5">
            <span className="text-[7px]">{e}</span>
            <div className="h-0.5 flex-1 rounded-full bg-white/15" />
          </div>
        ))}
      </div>
      {/* CTA */}
      <div className="mx-3 mt-1.5">
        <div className="h-4 rounded-md flex items-center justify-center"
          style={{ background: `linear-gradient(90deg, ${primary}, ${primary}bb)` }}>
          <div className="w-14 h-1 rounded-full bg-white/80" />
        </div>
      </div>
      <div className="mt-auto px-3 pb-2 pt-1 border-t border-white/5">
        <div className="w-16 h-0.5 rounded-full bg-white/10 mx-auto" />
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
const AUTOMATIONS = [
  { id: 'welcome', label: 'Bienvenida automática', desc: 'Se envía al suscribirse', icon: '👋', template: 'bienvenida' },
  { id: 'release', label: 'Nuevo lanzamiento',     desc: 'Notifica cuando publicas', icon: '🎵', template: 'lanzamiento' },
  { id: 'event',   label: 'Próximo show',          desc: 'Aviso automático de shows', icon: '🎤', template: 'evento' },
]

const DEMO_STATS = [
  { label: 'Enviados',     value: '—', Icon: Send,      color: '#38BDF8' },
  { label: 'Aperturas',    value: '—', Icon: Mail,      color: '#22C55E' },
  { label: 'Clics',        value: '—', Icon: BarChart2, color: '#F59E0B' },
  { label: 'Suscriptores', value: '—', Icon: Users,     color: '#C026D3' },
]

export default function EmailTab({ palette, fans, artist }: TabProps) {
  const [automations, setAutomations] = useState(
    AUTOMATIONS.map(a => ({ ...a, active: false }))
  )
  const [showTemplates, setShowTemplates] = useState(false)
  const [selected, setSelected]           = useState<string | null>(null)
  const [preview, setPreview]             = useState<string | null>(null)

  const primary = palette.primary

  const TEMPLATES: EmailTemplate[] = [
    {
      id:       'bienvenida',
      name:     'Bienvenida Cálida',
      category: 'Automatización',
      desc:     'Email de bienvenida para nuevos suscriptores. Preséntate, comparte tu sonido y deja un primer link de escucha.',
      subject:  `Bienvenido/a a la familia de ${artist.artist_name} 👋`,
      bestFor:  'Nuevos fans que acaban de suscribirse',
      preview:  <MockupBienvenida primary={primary} />,
    },
    {
      id:       'lanzamiento',
      name:     'Nuevo Lanzamiento',
      category: 'Campaña',
      desc:     'Anuncia un nuevo track, EP o álbum. Con portada grande, links a plataformas y llamada a compartir.',
      subject:  `${artist.artist_name} acaba de lanzar algo nuevo 💿`,
      bestFor:  'Días de release, pre-saves, exclusivas',
      preview:  <MockupLanzamiento primary={primary} />,
    },
    {
      id:       'evento',
      name:     'Próximo Show',
      category: 'Automatización',
      desc:     'Notificación de evento con fecha, venue, ciudad y link de tickets. Diseño de póster oscuro e impactante.',
      subject:  `${artist.artist_name} toca en tu ciudad 🎤`,
      bestFor:  'Anuncios de shows y giras',
      preview:  <MockupEvento primary={primary} />,
    },
    {
      id:       'newsletter',
      name:     'Newsletter Mensual',
      category: 'Campaña',
      desc:     'Resumen mensual: qué ha pasado, próximos shows, nueva música y noticias del estudio. Formato editorial.',
      subject:  `Novedades de ${artist.artist_name} — ${new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' })}`,
      bestFor:  'Updates regulares para mantener el engagement',
      preview:  <MockupNewsletter primary={primary} />,
    },
    {
      id:       'exclusivo',
      name:     'Drop Exclusivo VIP',
      category: 'Campaña',
      desc:     'Contenido solo para suscriptores: stem pack, descarga exclusiva, acceso anticipado o entrada con descuento.',
      subject:  `Solo para ti: acceso exclusivo 🌟`,
      bestFor:  'Recompensar a tus fans más fieles',
      preview:  <MockupExclusivo primary={primary} />,
    },
    {
      id:       'reengagement',
      name:     'Re-engagement',
      category: 'Automatización',
      desc:     'Para fans inactivos hace +60 días. Muestra qué se perdieron y los invita a reconectarse con un incentivo.',
      subject:  `Te echamos de menos, ${'{'}nombre{'}'}`,
      bestFor:  'Reactivar suscriptores que ya no abren tus emails',
      preview:  <MockupReengagement primary={primary} />,
    },
  ]

  const toggleAuto = (id: string) =>
    setAutomations(p => p.map(a => a.id === id ? { ...a, active: !a.active } : a))

  const handleUseTemplate = (id: string) => {
    setSelected(id)
    setShowTemplates(false)
  }

  const selectedTemplate = TEMPLATES.find(t => t.id === selected)
  const previewTemplate  = TEMPLATES.find(t => t.id === preview)

  return (
    <div className="px-5 lg:px-8 py-8 max-w-4xl mx-auto flex flex-col gap-7">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="text-[10px] font-mono text-white/25 tracking-[0.15em] uppercase mb-1">Marketing</p>
          <h1 className="font-display font-extrabold text-3xl tracking-tight" style={{ color: palette.text }}>
            Email Marketing
          </h1>
          <p className="text-sm mt-1" style={{ color: palette.textMuted }}>
            {fans.length > 0
              ? `${fans.length} suscriptor${fans.length !== 1 ? 'es' : ''} en tu lista`
              : 'Empieza a capturar fans con el formulario de tu presskit'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowTemplates(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
          <Plus className="w-4 h-4" /> Nueva campaña
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {DEMO_STATS.map(({ label, value, Icon, color }) => (
          <div key={label} className="p-4 rounded-2xl flex flex-col gap-2"
            style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)', opacity: fans.length === 0 ? 0.4 : 1 }}>
            <div className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">{label}</span>
            </div>
            <p className="font-display font-extrabold text-2xl"
              style={{ color: label === 'Suscriptores' && fans.length > 0 ? color : 'rgba(255,255,255,0.2)' }}>
              {label === 'Suscriptores' && fans.length > 0 ? fans.length : value}
            </p>
          </div>
        ))}
      </div>

      {/* Template selected notice */}
      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 p-4 rounded-2xl"
            style={{ background: palette.primary + '12', border: `1px solid ${palette.primary}30` }}>
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0"
              style={{ border: `1px solid ${palette.primary}30` }}>
              {selectedTemplate.preview}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold" style={{ color: palette.text }}>
                Plantilla seleccionada: {selectedTemplate.name}
              </p>
              <p className="text-[11px] truncate" style={{ color: palette.textMuted }}>
                Asunto: {selectedTemplate.subject}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTemplates(true)}
                className="text-xs px-3 py-1.5 rounded-lg font-medium"
                style={{ background: palette.primary + '20', color: palette.primary }}>
                Cambiar
              </button>
              <button onClick={() => setSelected(null)} style={{ color: palette.textMuted }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Automations */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>
            Automatizaciones
          </p>
          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: palette.primary + '15', color: palette.primary }}>
            {automations.filter(a => a.active).length} activas
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {automations.map(({ id, label, desc, icon, active, template }) => (
            <div key={id}
              className="flex items-center justify-between p-4 rounded-2xl transition-all"
              style={{
                background: active ? palette.primary + '0A' : '#0E0E12',
                border: `1px solid ${active ? palette.primary + '30' : 'rgba(255,255,255,0.05)'}`,
              }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: palette.text }}>{label}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: palette.textMuted }}>{desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setPreview(template); setShowTemplates(true) }}
                  className="text-[10px] font-mono px-2 py-1 rounded-lg transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', color: palette.textMuted }}>
                  <Eye className="w-3 h-3" />
                </button>
                <button
                  onClick={() => toggleAuto(id)}
                  className="w-10 h-5 rounded-full relative transition-all"
                  style={{ background: active ? palette.primary : 'rgba(255,255,255,0.1)' }}>
                  <motion.div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow"
                    animate={{ left: active ? '22px' : '2px' }}
                    transition={{ duration: 0.2 }}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns list - empty state */}
      <div className="flex flex-col gap-3">
        <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: palette.textMuted }}>
          Campañas enviadas
        </p>
        <div className="flex flex-col items-center py-10 rounded-2xl"
          style={{ background: '#0E0E12', border: '1px dashed rgba(255,255,255,0.07)' }}>
          <Mail className="w-8 h-8 mb-3" style={{ color: palette.textMuted }} />
          <p className="text-sm font-medium mb-1" style={{ color: palette.text }}>Sin campañas todavía</p>
          <p className="text-xs mb-4" style={{ color: palette.textMuted }}>
            Crea tu primera campaña eligiendo una plantilla
          </p>
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold"
            style={{ background: palette.primary + '20', color: palette.primary }}>
            <Plus className="w-3.5 h-3.5" /> Elegir plantilla
          </button>
        </div>
      </div>

      {/* ─── Template picker modal ─────────────────────────── */}
      <AnimatePresence>
        {showTemplates && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={() => { setShowTemplates(false); setPreview(null) }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-hidden rounded-t-3xl flex flex-col"
              style={{ background: '#0E0E14', border: '1px solid rgba(255,255,255,0.08)' }}>

              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  {preview && (
                    <button onClick={() => setPreview(null)} style={{ color: palette.textMuted }}>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div>
                    <h2 className="font-display font-bold text-lg" style={{ color: palette.text }}>
                      {preview && previewTemplate ? previewTemplate.name : 'Elige una plantilla'}
                    </h2>
                    <p className="text-xs" style={{ color: palette.textMuted }}>
                      {preview && previewTemplate
                        ? previewTemplate.bestFor
                        : '6 diseños profesionales listos para personalizar'}
                    </p>
                  </div>
                </div>
                <button onClick={() => { setShowTemplates(false); setPreview(null) }}
                  className="p-2 rounded-xl transition-colors hover:bg-white/5"
                  style={{ color: palette.textMuted }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Template grid or detail */}
              <div className="overflow-y-auto flex-1 p-6">
                {!preview ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {TEMPLATES.map(tpl => (
                      <motion.div
                        key={tpl.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="flex flex-col rounded-2xl overflow-hidden cursor-pointer group"
                        style={{
                          border: selected === tpl.id
                            ? `2px solid ${palette.primary}`
                            : '1px solid rgba(255,255,255,0.07)',
                          background: '#0a0a10',
                        }}
                        onClick={() => setPreview(tpl.id)}>

                        {/* Mini email preview */}
                        <div className="relative h-44 overflow-hidden">
                          <div className="absolute inset-0">
                            {tpl.preview}
                          </div>
                          {/* Hover overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: 'rgba(0,0,0,0.5)' }}>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                              style={{ background: palette.primary }}>
                              <Eye className="w-3.5 h-3.5" /> Vista previa
                            </div>
                          </div>
                          {/* Selected badge */}
                          {selected === tpl.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: palette.primary }}>
                              <span className="text-[8px] text-white font-bold">✓</span>
                            </div>
                          )}
                          {/* Category badge */}
                          <div className="absolute top-2 left-2">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full"
                              style={{
                                background: tpl.category === 'Automatización'
                                  ? '#7C3AED20' : palette.primary + '20',
                                color: tpl.category === 'Automatización'
                                  ? '#A78BFA' : palette.primary,
                              }}>
                              {tpl.category === 'Automatización' ? <><Zap className="inline w-2.5 h-2.5 mr-0.5" />{tpl.category}</> : <><Megaphone className="inline w-2.5 h-2.5 mr-0.5" />{tpl.category}</>}
                            </span>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3 flex flex-col gap-1 border-t"
                          style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                          <p className="text-sm font-semibold" style={{ color: palette.text }}>{tpl.name}</p>
                          <p className="text-[11px] leading-relaxed" style={{ color: palette.textMuted }}>{tpl.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : previewTemplate ? (
                  /* ── Detail view ── */
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Large preview */}
                    <div className="w-full md:w-64 h-80 rounded-2xl overflow-hidden shrink-0"
                      style={{ border: `1px solid rgba(255,255,255,0.08)` }}>
                      {previewTemplate.preview}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col gap-4">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full mb-2 inline-block"
                          style={{ background: palette.primary + '20', color: palette.primary }}>
                          {previewTemplate.category}
                        </span>
                        <h3 className="font-display font-bold text-2xl mt-2" style={{ color: palette.text }}>
                          {previewTemplate.name}
                        </h3>
                        <p className="text-sm mt-1 leading-relaxed" style={{ color: palette.textMuted }}>
                          {previewTemplate.desc}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="p-3 rounded-xl" style={{ background: '#0a0a10', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: palette.textMuted }}>
                            Asunto sugerido
                          </p>
                          <p className="text-xs" style={{ color: palette.text }}>{previewTemplate.subject}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: '#0a0a10', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: palette.textMuted }}>
                            Ideal para
                          </p>
                          <p className="text-xs" style={{ color: palette.text }}>{previewTemplate.bestFor}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleUseTemplate(previewTemplate.id)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                          style={{ background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})` }}>
                          <ChevronRight className="w-4 h-4" />
                          Usar esta plantilla
                        </motion.button>
                        <button
                          onClick={() => setPreview(null)}
                          className="px-4 py-2.5 rounded-xl text-sm"
                          style={{ background: 'rgba(255,255,255,0.05)', color: palette.textMuted }}>
                          Volver
                        </button>
                      </div>

                      <p className="text-[10px]" style={{ color: palette.textMuted }}>
                        El editor de contenido y el envío real estarán disponibles próximamente.
                        Puedes seleccionar la plantilla ahora para reservar tu elección.
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
