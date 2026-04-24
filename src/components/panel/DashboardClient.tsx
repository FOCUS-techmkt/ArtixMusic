'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  Eye, Copy, BarChart2, ToggleLeft, ToggleRight, Check,
  ExternalLink, LogOut, Loader2, Palette, Layout,
} from 'lucide-react'
import type { Artist, Section, AnalyticsRow, LayoutVariant } from '@/types'
import { LAYOUT_META, COLOR_PRESETS, deriveArtistPalette } from '@/types'
import { fadeUpItem, staggerContainer } from '@/lib/utils'

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero & Portada', bio: 'Biografía & Stats',
  music: 'Música', live: 'Historial en Vivo',
  gallery: 'Galería de Medios', contact: 'Contacto & Booking',
}

interface Props {
  initialArtist: Artist
  initialSections: Section[]
  analytics: Pick<AnalyticsRow, 'event_type' | 'created_at'>[]
}

export default function DashboardClient({ initialArtist, initialSections, analytics }: Props) {
  const supabase = createClient()
  const [artist, setArtist] = useState(initialArtist)
  const [sections, setSections] = useState(initialSections)
  const [copied, setCopied] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  // Design panel state
  const [openPanel, setOpenPanel] = useState<'colors' | 'layout' | null>(null)
  const [primary, setPrimary]     = useState(initialArtist.primary_color   ?? '#C026D3')
  const [secondary, setSecondary] = useState(initialArtist.secondary_color ?? '#7C3AED')
  const [bgDark, setBgDark]       = useState(initialArtist.bg_dark         ?? true)
  const [layout, setLayout]       = useState<LayoutVariant>((initialArtist as any).layout_variant ?? 'centered')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)

  const kitUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/${artist.slug}`
  const palette = deriveArtistPalette(artist.primary_color ?? '#C026D3', artist.secondary_color ?? '#7C3AED', artist.bg_dark ?? true)

  const totalViews  = analytics.filter(a => a.event_type === 'page_view').length
  const totalClicks = analytics.filter(a => a.event_type === 'contact_click' || a.event_type === 'link_click').length
  const totalPlays  = analytics.filter(a => a.event_type === 'music_play').length

  const copyLink = async () => {
    await navigator.clipboard.writeText(kitUrl)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const toggleSection = async (id: string, current: boolean) => {
    setToggling(id)
    const { error } = await supabase.from('sections').update({ is_enabled: !current }).eq('id', id)
    if (!error) setSections(prev => prev.map(s => s.id === id ? { ...s, is_enabled: !current } : s))
    setToggling(null)
  }

  const saveDesign = async () => {
    setSaving(true)
    const { error } = await supabase.from('artists').update({
      primary_color: primary, secondary_color: secondary,
      bg_dark: bgDark, layout_variant: layout,
    }).eq('user_id', artist.user_id)

    if (!error) {
      setArtist(p => ({ ...p, primary_color: primary, secondary_color: secondary, bg_dark: bgDark, layout_variant: layout } as any))
      setSaved(true); setTimeout(() => { setSaved(false); setOpenPanel(null) }, 1200)
    }
    setSaving(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut(); window.location.href = '/'
  }

  // Mini preview of colors
  const MiniPreview = () => (
    <div className="w-full rounded-xl overflow-hidden relative" style={{ height: '90px', backgroundColor: bgDark ? '#080808' : '#FAF9F6' }}>
      <div className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${primary}66, transparent 60%), radial-gradient(ellipse at 80% 50%, ${secondary}44, transparent 50%)` }}
      />
      <div className="absolute inset-0 flex items-center px-4 gap-3">
        <div className="font-display font-extrabold text-xl" style={{ color: bgDark ? '#F5F5F5' : '#1A1A1A', textShadow: `0 0 20px ${primary}66` }}>
          {artist.artist_name}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono" style={{ backgroundColor: primary + '20', color: primary, border: `1px solid ${primary}44` }}>
            {artist.genre.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#080808', color: '#F5F5F5' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 z-30 bg-[#080808]/90 backdrop-blur-sm">
        <Link href="/" className="font-display font-bold tracking-widest text-lg">
          PRESSKIT<span style={{ color: palette.primary }}>.PRO</span>
        </Link>
        <div className="flex items-center gap-3">
          <a href={kitUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/60 hover:text-white text-sm transition-colors"
          >
            <Eye className="w-4 h-4" /> Ver kit <ExternalLink className="w-3 h-3" />
          </a>
          <button onClick={handleLogout} className="text-white/30 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-6">

          {/* Greeting */}
          <motion.div variants={fadeUpItem}>
            <p className="text-xs font-mono text-white/30 tracking-widest uppercase mb-1">Panel de control</p>
            <h1 className="font-display font-extrabold text-4xl">
              Hola, <span style={{ color: palette.primary }}>{artist.artist_name}</span>
            </h1>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUpItem} className="grid grid-cols-3 gap-4">
            {[
              { label: 'Visitas',  value: totalViews,  icon: Eye },
              { label: 'Clicks',   value: totalClicks, icon: BarChart2 },
              { label: 'Plays',    value: totalPlays,  icon: BarChart2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="p-5 rounded-2xl border" style={{ borderColor: '#1F1F1F', backgroundColor: '#111111' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: palette.primary }} />
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wider">{label}</span>
                </div>
                <p className="font-display font-bold text-3xl">{value}</p>
              </div>
            ))}
          </motion.div>

          {/* Share link */}
          <motion.div variants={fadeUpItem}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl border"
            style={{ borderColor: '#1F1F1F', backgroundColor: '#111111' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-1">Tu link público</p>
              <p className="font-mono text-sm text-white/80 truncate">{kitUrl}</p>
            </div>
            <button onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0"
              style={{ backgroundColor: palette.primary, color: '#fff' }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </motion.div>

          {/* ── DESIGN PANEL ──────────────────────────── */}
          <motion.div variants={fadeUpItem} className="rounded-2xl border overflow-hidden" style={{ borderColor: '#1F1F1F' }}>
            {/* Panel header */}
            <div className="flex divide-x divide-white/5" style={{ backgroundColor: '#111111' }}>
              {[
                { key: 'colors' as const, icon: Palette, label: 'Colores' },
                { key: 'layout' as const, icon: Layout,  label: 'Layout' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setOpenPanel(p => p === key ? null : key)}
                  className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors"
                  style={{ color: openPanel === key ? palette.primary : 'rgba(255,255,255,0.4)' }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  <motion.span animate={{ rotate: openPanel === key ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-xs opacity-40">▾</motion.span>
                </button>
              ))}
            </div>

            {/* Color picker panel */}
            <AnimatePresence initial={false}>
              {openPanel === 'colors' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden', backgroundColor: '#0D0D0D' }}
                >
                  <div className="p-5 flex flex-col gap-5">
                    {/* Preview */}
                    <MiniPreview />

                    {/* Pickers */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Color principal', value: primary, onChange: setPrimary },
                        { label: 'Color secundario', value: secondary, onChange: setSecondary },
                      ].map(({ label, value, onChange }) => (
                        <div key={label} className="flex items-center gap-3 p-3 rounded-xl border border-white/8 bg-white/3">
                          <input type="color" value={value}
                            onChange={e => { onChange(e.target.value) }}
                            className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0 bg-transparent"
                          />
                          <div>
                            <p className="text-xs font-mono text-white">{value.toUpperCase()}</p>
                            <p className="text-[10px] text-white/30">{label}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Dark/Light */}
                    <div className="flex gap-2">
                      {[{ dark: true, label: '🌑 Fondo oscuro' }, { dark: false, label: '☀️ Fondo claro' }].map(({ dark, label }) => (
                        <button key={String(dark)} onClick={() => setBgDark(dark)}
                          className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all"
                          style={{
                            borderColor: bgDark === dark ? primary : 'rgba(255,255,255,0.08)',
                            color: bgDark === dark ? primary : 'rgba(255,255,255,0.4)',
                            backgroundColor: bgDark === dark ? primary + '12' : 'transparent',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {/* Presets */}
                    <div>
                      <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Paletas rápidas</p>
                      <div className="flex flex-wrap gap-1.5">
                        {COLOR_PRESETS.map(p => (
                          <button key={p.name} onClick={() => { setPrimary(p.primary); setSecondary(p.secondary) }}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono transition-all"
                            style={{
                              borderColor: primary === p.primary ? p.primary : 'rgba(255,255,255,0.08)',
                              color: primary === p.primary ? p.primary : 'rgba(255,255,255,0.35)',
                              backgroundColor: primary === p.primary ? p.primary + '15' : 'transparent',
                            }}
                          >
                            <span className="flex rounded-full overflow-hidden w-3 h-3">
                              <span className="w-1/2 h-full" style={{ backgroundColor: p.primary }} />
                              <span className="w-1/2 h-full" style={{ backgroundColor: p.secondary }} />
                            </span>
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Save */}
                    <div className="flex justify-end pt-2 border-t border-white/5">
                      <motion.button onClick={saveDesign} disabled={saving}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
                        style={{ backgroundColor: primary }}
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" /> Guardado</> : 'Aplicar colores'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Layout picker panel */}
            <AnimatePresence initial={false}>
              {openPanel === 'layout' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden', backgroundColor: '#0D0D0D' }}
                >
                  <div className="p-5 flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.entries(LAYOUT_META) as [LayoutVariant, typeof LAYOUT_META[LayoutVariant]][]).map(([key, meta]) => (
                        <button key={key} onClick={() => setLayout(key)}
                          className="flex flex-col items-start gap-1.5 p-3 rounded-xl border text-left transition-all"
                          style={{
                            borderColor: layout === key ? primary : 'rgba(255,255,255,0.08)',
                            backgroundColor: layout === key ? primary + '10' : 'rgba(255,255,255,0.02)',
                          }}
                        >
                          <p className="text-sm font-semibold" style={{ color: layout === key ? primary : 'rgba(255,255,255,0.7)' }}>
                            {meta.label}
                          </p>
                          <p className="text-[10px] text-white/30 leading-relaxed">{meta.desc}</p>
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end pt-2 border-t border-white/5">
                      <motion.button onClick={saveDesign} disabled={saving}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ backgroundColor: primary }}
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" /> Guardado</> : 'Aplicar layout'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── SECTIONS ─────────────────────────────── */}
          <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
            <p className="text-xs font-mono text-white/30 uppercase tracking-widest mb-1">Secciones visibles</p>
            {sections.map(section => (
              <motion.div key={section.id} layout
                className="flex items-center justify-between p-4 rounded-2xl border transition-colors"
                style={{
                  borderColor: section.is_enabled ? palette.primary + '40' : '#1F1F1F',
                  backgroundColor: section.is_enabled ? palette.primary + '08' : '#111111',
                }}
              >
                <div>
                  <p className="font-medium text-sm" style={{ color: section.is_enabled ? '#F5F5F5' : '#6B7280' }}>
                    {SECTION_LABELS[section.name] ?? section.name}
                  </p>
                  <p className="text-xs font-mono text-white/20">{section.is_enabled ? 'visible' : 'oculto'}</p>
                </div>
                <button onClick={() => toggleSection(section.id, section.is_enabled)}
                  disabled={toggling === section.id || section.name === 'hero'}
                  className="hover:scale-110 transition-transform disabled:opacity-40"
                >
                  {toggling === section.id ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white/30" />
                  ) : section.is_enabled ? (
                    <ToggleRight className="w-7 h-7" style={{ color: palette.primary }} />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-white/30" />
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </main>
    </div>
  )
}
