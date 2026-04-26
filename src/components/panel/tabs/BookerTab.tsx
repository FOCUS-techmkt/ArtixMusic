'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, Check, Copy, ExternalLink, Loader2, Music, MapPin, Mail, FileText } from 'lucide-react'
import type { TabProps } from '../DashboardClient'

export default function BookerTab({ artist, setArtist, palette, supabase }: TabProps) {
  const [bookerMode, setBookerMode] = useState(artist.is_published ?? false)
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)
  const [copied,     setCopied]     = useState(false)

  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const bookerUrl  = `${appUrl}/${artist.slug}?booker=1`

  const toggleBookerMode = async () => {
    setSaving(true)
    const next = !bookerMode
    const { error } = await supabase.from('artists').update({ is_published: next }).eq('user_id', artist.user_id)
    if (!error) {
      setBookerMode(next)
      setArtist(p => ({ ...p, is_published: next }))
      setSaved(true); setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const copyBookerLink = async () => {
    await navigator.clipboard.writeText(bookerUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const BOOKER_FEATURES = [
    { icon: FileText, label: 'Rider técnico visible',    desc: 'Promotores pueden descargar tu rider directamente' },
    { icon: Mail,     label: 'CTA de booking destacado', desc: 'Botón de contacto prominente para cerrar shows' },
    { icon: Music,    label: 'Track preview',            desc: 'Tu música carga directamente en la primera visita' },
    { icon: MapPin,   label: 'Fechas disponibles',       desc: 'Muestra tu calendario de disponibilidad' },
    { icon: Briefcase, label: 'Perfil profesional',      desc: 'Elimina elementos decorativos, enfoca en datos' },
  ]

  const WHAT_BOOKERS_SEE = [
    '✅ Nombre artístico y rol',
    '✅ Géneros y descripción de sonido',
    '✅ Logros y residencias',
    '✅ Rider técnico descargable',
    '✅ Email de booking directo',
    '✅ Links a plataformas de música',
    '✅ Historial de shows',
    '✅ Galería de fotos profesionales',
  ]

  return (
    <div className="px-6 lg:px-8 py-8 max-w-4xl mx-auto flex flex-col gap-7">

      {/* Header */}
      <div>
        <p className="text-[10px] font-mono text-white/25 tracking-[0.15em] uppercase mb-1">Modo profesional</p>
        <h1 className="font-display font-extrabold text-3xl tracking-tight">Booker Ready</h1>
        <p className="text-white/40 text-sm mt-2">
          Activa un perfil optimizado para promotores, managers y bookers.
        </p>
      </div>

      {/* Main toggle card */}
      <motion.div
        animate={{
          borderColor: bookerMode ? palette.primary + '50' : 'rgba(255,255,255,0.06)',
          backgroundColor: bookerMode ? palette.primary + '08' : '#0E0E12',
        }}
        className="p-6 rounded-2xl border transition-all"
        style={{ border: `1px solid ${bookerMode ? palette.primary + '50' : 'rgba(255,255,255,0.06)'}` }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: bookerMode ? palette.primary + '25' : 'rgba(255,255,255,0.06)' }}>
              <Briefcase className="w-6 h-6" style={{ color: bookerMode ? palette.primary : 'rgba(255,255,255,0.3)' }} />
            </div>
            <div>
              <p className="font-display font-bold text-lg text-white">
                {bookerMode ? '🟢 Booker Ready — Activo' : 'Booker Ready — Inactivo'}
              </p>
              <p className="text-sm text-white/40 mt-0.5">
                {bookerMode
                  ? 'Tu perfil está optimizado para promotores'
                  : 'Activa para mostrar un perfil profesional a bookers'}
              </p>
            </div>
          </div>

          <motion.button
            onClick={toggleBookerMode}
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-60 transition-all"
            style={{ background: bookerMode ? '#EF444440' : palette.primary }}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" />
              : saved  ? <><Check className="w-4 h-4" /> Guardado</>
              : bookerMode ? '⏸ Desactivar' : '▶ Activar Booker Ready'}
          </motion.button>
        </div>
      </motion.div>

      {/* Booker link */}
      <AnimatePresence>
        {bookerMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl"
              style={{ background: '#0E0E12', border: `1px solid ${palette.primary}30` }}>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-wider mb-1">Link para bookers</p>
                <p className="font-mono text-xs text-white/60 truncate">{bookerUrl}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={bookerUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-xs text-white/50 hover:text-white transition-all">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Ver
                </a>
                <button onClick={copyBookerLink}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ background: palette.primary }}>
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copiado' : 'Copiar link'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* What bookers see */}
        <div className="p-5 rounded-2xl flex flex-col gap-4"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Qué ven los bookers</p>
          <div className="flex flex-col gap-2">
            {WHAT_BOOKERS_SEE.map((item, i) => (
              <p key={i} className="text-xs text-white/50">{item}</p>
            ))}
          </div>
        </div>

        {/* Features activated */}
        <div className="p-5 rounded-2xl flex flex-col gap-4"
          style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Funciones activadas</p>
          <div className="flex flex-col gap-3">
            {BOOKER_FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: palette.primary + '18' }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: palette.primary }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/70">{label}</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile summary */}
      <div className="p-5 rounded-2xl"
        style={{ background: '#0E0E12', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/25 mb-4">Tu perfil de booker</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Artista',   value: artist.artist_name },
            { label: 'Género',    value: artist.genre },
            { label: 'Rol',       value: artist.role },
            { label: 'Booking',   value: artist.booking_email || '—' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[9px] font-mono text-white/25 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-xs text-white/70 font-medium truncate">{value}</p>
            </div>
          ))}
        </div>

        {!artist.booking_email && (
          <div className="mt-4 p-3 rounded-xl"
            style={{ background: '#F59E0B15', border: '1px solid #F59E0B25' }}>
            <p className="text-xs text-yellow-400">
              ⚠ No tienes email de booking configurado. Los bookers no podrán contactarte.
              <a href="#" className="underline ml-1" onClick={() => {}}>Configurarlo →</a>
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
