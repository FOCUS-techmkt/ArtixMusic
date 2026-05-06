'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import ImageUpload from '@/components/shared/ImageUpload'
import {
  ToggleLeft, ToggleRight, Loader2, RefreshCw,
  Smartphone, Monitor, Maximize2, Sun, Moon, GripVertical,
  Settings2, Sparkles, Copy, Check, ExternalLink, Cloud, CloudOff,
  AlertCircle, LayoutTemplate,
} from 'lucide-react'
import type { TabProps } from '../DashboardClient'
import { COLOR_PRESETS, LAYOUT_META } from '@/types'
import type { LayoutVariant, Section } from '@/types'
import { FONTS_CATALOG } from '@/lib/fonts'
import SectionConfigPanel from '../editor/SectionConfigPanel'
import TemplatesPanel, { type Template } from '../editor/TemplatesPanel'

// ── Section labels ────────────────────────────────────────────────
const SECTION_LABELS: Record<string, { icon: string; label: string }> = {
  hero:           { icon: '🎯', label: 'Hero & Portada' },
  bio:            { icon: '📝', label: 'Biografía' },
  music:          { icon: '🎵', label: 'Música' },
  community:      { icon: '👥', label: 'Comunidad' },
  supporters:     { icon: '⭐', label: 'Apoyado por' },
  releases:       { icon: '💿', label: 'Discografía' },
  live:           { icon: '🎤', label: 'En Vivo' },
  gallery:        { icon: '🖼️', label: 'Galería' },
  contact:        { icon: '📬', label: 'Contacto & Booking' },
  'fan-capture':  { icon: '💌', label: 'Fan Database' },
  links:          { icon: '🔗', label: 'Links / Linktree' },
  testimonials:   { icon: '💬', label: 'Testimonios' },
}

// ── Effects catalog ───────────────────────────────────────────────
const EFFECTS = [
  { id: 'particles', label: 'Partículas', desc: 'Partículas flotantes en hero',   emoji: '✦' },
  { id: 'glow',      label: 'Glow',       desc: 'Halo luminoso de tu color',      emoji: '◎' },
  { id: 'parallax',  label: 'Parallax',   desc: 'Profundidad en scroll',          emoji: '⧉' },
  { id: 'grain',     label: 'Grain',      desc: 'Textura granulada de film',      emoji: '▒' },
  { id: 'scanlines', label: 'Scanlines',  desc: 'Líneas CRT retro',               emoji: '≡' },
  { id: 'glitch',    label: 'Glitch',     desc: 'Distorsión digital intensa',     emoji: '⚡' },
  { id: 'aurora',    label: 'Aurora',     desc: 'Gradiente nórdico animado',      emoji: '◈' },
  { id: 'chromatic', label: 'Chromatic',  desc: 'Aberración cromática RGB',       emoji: '◊' },
]

const INTENSITY_LABELS = ['', 'Baja', 'Media', 'Alta']

// ── Section animations ────────────────────────────────────────────
const ANIMATIONS = [
  { id: 'none',       label: 'Sin animación' },
  { id: 'fade',       label: 'Fade in' },
  { id: 'slide-up',   label: 'Slide arriba' },
  { id: 'slide-left', label: 'Slide lateral' },
  { id: 'scale',      label: 'Escala' },
  { id: 'blur',       label: 'Blur in' },
]

type SaveStatus = 'idle' | 'pending' | 'saving' | 'saved' | 'error'
type PanelId = 'templates' | 'sections' | 'design' | 'effects'

// ── Layout SVG thumbnails ─────────────────────────────────────────
function LayoutThumb({ variant, color }: { variant: LayoutVariant; color: string }) {
  if (variant === 'centered') return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-auto opacity-80">
      <rect x="0" y="0" width="80" height="52" rx="4" fill="#0a0a0f" />
      <circle cx="40" cy="18" r="7" fill={color} opacity="0.35" />
      <rect x="22" y="30" width="36" height="4" rx="2" fill={color} opacity="0.6" />
      <rect x="28" y="38" width="24" height="3" rx="1.5" fill={color} opacity="0.25" />
    </svg>
  )
  if (variant === 'editorial') return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-auto opacity-80">
      <rect x="0" y="0" width="80" height="52" rx="4" fill="#0a0a0f" />
      <rect x="7" y="10" width="34" height="4" rx="2" fill={color} opacity="0.65" />
      <rect x="7" y="18" width="26" height="3" rx="1.5" fill={color} opacity="0.3" />
      <rect x="7" y="25" width="30" height="2" rx="1" fill="white" opacity="0.12" />
      <rect x="7" y="31" width="22" height="2" rx="1" fill="white" opacity="0.08" />
      <rect x="48" y="7" width="25" height="38" rx="4" fill={color} opacity="0.18" />
      <line x1="48" y1="7" x2="48" y2="45" stroke={color} strokeOpacity="0.25" strokeWidth="1" />
    </svg>
  )
  if (variant === 'split') return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-auto opacity-80">
      <rect x="0" y="0" width="80" height="52" rx="4" fill="#0a0a0f" />
      <rect x="7" y="16" width="28" height="4" rx="2" fill={color} opacity="0.65" />
      <rect x="7" y="24" width="20" height="3" rx="1.5" fill={color} opacity="0.3" />
      <rect x="7" y="31" width="24" height="2" rx="1" fill="white" opacity="0.12" />
      <line x1="44" y1="0" x2="44" y2="52" stroke={color} strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="61" cy="26" r="10" fill={color} opacity="0.14" />
      <circle cx="61" cy="26" r="10" stroke={color} strokeOpacity="0.3" strokeWidth="1" fill="none" />
    </svg>
  )
  // raw
  return (
    <svg viewBox="0 0 80 52" fill="none" className="w-full h-auto opacity-80">
      <rect x="0" y="0" width="80" height="52" rx="4" fill="#0a0a0f" />
      <rect x="4" y="6" width="64" height="22" rx="3" fill={color} opacity="0.08" />
      <rect x="6" y="35" width="42" height="5" rx="2" fill={color} opacity="0.65" transform="rotate(-1.5 6 35)" />
      <rect x="6" y="44" width="30" height="3" rx="1.5" fill={color} opacity="0.3" transform="rotate(-0.5 6 44)" />
    </svg>
  )
}

export default function EditorTab({ artist, setArtist, sections, setSections, palette, supabase }: TabProps) {
  const [primary,   setPrimary]   = useState(artist.primary_color   ?? '#C026D3')
  const [secondary, setSecondary] = useState(artist.secondary_color ?? '#7C3AED')
  const [bgDark,    setBgDark]    = useState(artist.bg_dark         ?? true)
  const [layout,    setLayout]    = useState<LayoutVariant>(artist.layout_variant ?? 'centered')
  const [fontId,    setFontId]    = useState(artist.font_id ?? 'space-grotesk')

  // Effects: intensities 0=off, 1-3=on
  const heroSection = sections.find(s => s.name === 'hero')
  const [effectIntensities, setEffectIntensities] = useState<Record<string, number>>(
    () => (heroSection?.config?.effectIntensities as Record<string, number>) ?? {}
  )

  const [saveStatus,     setSaveStatus]     = useState<SaveStatus>('idle')
  const [toggling,       setToggling]       = useState<string | null>(null)
  const [device,         setDevice]         = useState<'desktop' | 'mobile'>('desktop')
  const [panel,          setPanel]          = useState<PanelId>('sections')
  const [activeSection,  setActiveSection]  = useState<Section | null>(null)
  const [lastEditedId,   setLastEditedId]   = useState<string | null>(null)
  const [copied,         setCopied]         = useState(false)
  const [mobilePane,     setMobilePane]     = useState<'controls' | 'preview'>('controls')
  const [openAnimPicker, setOpenAnimPicker] = useState<string | null>(null)
  const [justApplied,   setJustApplied]   = useState<string | null>(null)

  const iframeRef   = useRef<HTMLIFrameElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestDesign = useRef({ primary, secondary, bgDark, layout, fontId })
  const hasInit = useRef(false)

  useEffect(() => { hasInit.current = true }, [])

  // ── beforeunload guard ────────────────────────────────────────
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (saveStatus === 'pending' || saveStatus === 'saving') e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [saveStatus])

  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const previewUrl = `${appUrl}/${artist.slug}`

  const reloadPreview = () => iframeRef.current?.contentWindow?.location.reload()

  const copyLink = async () => {
    await navigator.clipboard.writeText(previewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Auto-save design with debounce ────────────────────────────
  const scheduleSave = (patch: Partial<{ primary: string; secondary: string; bgDark: boolean; layout: LayoutVariant; fontId: string }>) => {
    latestDesign.current = { ...latestDesign.current, ...patch }
    if (!hasInit.current) return
    setSaveStatus('pending')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSaveStatus('saving')
      const v = latestDesign.current
      const { error } = await supabase.from('artists').update({
        primary_color:   v.primary,
        secondary_color: v.secondary,
        bg_dark:         v.bgDark,
        layout_variant:  v.layout,
        font_id:         v.fontId,
      }).eq('user_id', artist.user_id)
      if (error) {
        setSaveStatus('error')
      } else {
        setArtist(p => ({ ...p, primary_color: v.primary, secondary_color: v.secondary, bg_dark: v.bgDark, layout_variant: v.layout, font_id: v.fontId }))
        setSaveStatus('saved')
        setTimeout(reloadPreview, 400)
        setTimeout(() => setSaveStatus('idle'), 3000)
      }
    }, 800)
  }

  const handlePrimary   = (v: string) => { setPrimary(v);   scheduleSave({ primary: v }) }
  const handleSecondary = (v: string) => { setSecondary(v); scheduleSave({ secondary: v }) }
  const handleBgDark    = (v: boolean) => { setBgDark(v);   scheduleSave({ bgDark: v }) }
  const handleLayout    = (v: LayoutVariant) => { setLayout(v); scheduleSave({ layout: v }) }
  const handleFontId    = (v: string) => { setFontId(v);   scheduleSave({ fontId: v }) }

  // ── Effects ───────────────────────────────────────────────────
  const saveEffects = async (intensities: Record<string, number>) => {
    const hero = sections.find(s => s.name === 'hero')
    if (!hero) return
    const newConfig = { ...hero.config, effectIntensities: intensities, effects: Object.entries(intensities).filter(([, v]) => v > 0).map(([k]) => k) }
    await supabase.from('sections').update({ config: newConfig }).eq('id', hero.id)
    setSections(prev => prev.map(s => s.id === hero.id ? { ...s, config: newConfig } : s))
  }

  const toggleEffect = async (id: string) => {
    const next = { ...effectIntensities, [id]: effectIntensities[id] > 0 ? 0 : 2 }
    setEffectIntensities(next)
    await saveEffects(next)
  }

  const setEffectIntensity = async (id: string, level: number) => {
    const next = { ...effectIntensities, [id]: level }
    setEffectIntensities(next)
    await saveEffects(next)
  }

  // ── Section reorder ───────────────────────────────────────────
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = sections.findIndex(s => s.id === active.id)
    const newIndex = sections.findIndex(s => s.id === over.id)
    const reordered = arrayMove(sections, oldIndex, newIndex).map((s, i) => ({ ...s, sort_order: i }))
    setSections(reordered)
    await Promise.all(
      reordered.map(s => supabase.from('sections').update({ sort_order: s.sort_order }).eq('id', s.id))
    )
  }

  const toggleSection = async (id: string, current: boolean) => {
    if (sections.find(s => s.id === id)?.name === 'hero') return
    setToggling(id)
    const { error } = await supabase.from('sections').update({ is_enabled: !current }).eq('id', id)
    if (!error) setSections(prev => prev.map(s => s.id === id ? { ...s, is_enabled: !current } : s))
    setToggling(null)
  }

  const handleAnimationChange = async (sectionId: string, animId: string) => {
    const section = sections.find(s => s.id === sectionId)
    if (!section) return
    const newConfig = { ...section.config, animation: animId }
    await supabase.from('sections').update({ config: newConfig }).eq('id', sectionId)
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, config: newConfig } : s))
    setOpenAnimPicker(null)
  }

  // ── Template applied callback ─────────────────────────────────
  const onTemplateApplied = (tpl: Template) => {
    setPrimary(tpl.primary)
    setSecondary(tpl.secondary)
    setBgDark(tpl.bgDark)
    setLayout(tpl.layout)
    setFontId(tpl.fontId)
    setEffectIntensities(tpl.effectIntensities)
    latestDesign.current = { primary: tpl.primary, secondary: tpl.secondary, bgDark: tpl.bgDark, layout: tpl.layout, fontId: tpl.fontId }
    setPanel('design')
    setJustApplied(tpl.name)
    setTimeout(reloadPreview, 600)
    setTimeout(() => setJustApplied(null), 6000)
  }

  return (
    <div className="flex h-full flex-col" style={{ minHeight: 'calc(100dvh - 112px)' }}>

      {/* Mobile toggle */}
      <div className="flex lg:hidden border-b border-white/[0.05] shrink-0" style={{ background: '#0A0A0E' }}>
        {(['controls', 'preview'] as const).map(v => (
          <button key={v} onClick={() => setMobilePane(v)}
            className="flex-1 py-3 text-[11px] font-mono uppercase tracking-wider transition-all"
            style={{
              color:        mobilePane === v ? palette.primary : 'rgba(255,255,255,0.3)',
              borderBottom: mobilePane === v ? `2px solid ${palette.primary}` : '2px solid transparent',
            }}>
            {v === 'controls' ? '⚙ Controles' : '👁 Vista previa'}
          </button>
        ))}
      </div>

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row">

        {/* ── LEFT PANEL ──────────────────────────────────────── */}
        <div className={`w-full lg:w-[300px] shrink-0 flex flex-col ${mobilePane === 'preview' ? 'hidden lg:flex' : 'flex'}`}
          style={{ background: '#0A0A0E', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2">
              <SaveIndicator status={saveStatus} />
              <span className="text-[11px] font-mono text-white/20">·</span>
              <span className="text-[11px] font-mono" style={{ color: palette.primary }}>/{artist.slug}</span>
            </div>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono transition-all hover:opacity-80"
              style={{ background: palette.primary + '18', color: palette.primary, border: `1px solid ${palette.primary}25` }}>
              <ExternalLink className="w-3 h-3" /> Ver
            </a>
          </div>

          {/* Panel tabs */}
          <div className="flex border-b border-white/[0.05] sticky top-0 z-10 shrink-0 overflow-x-auto" style={{ background: '#0A0A0E' }}>
            {([ 'templates', 'sections', 'design', 'effects'] as PanelId[]).map(p => (
              <button key={p} onClick={() => { setPanel(p); setActiveSection(null) }}
                className="flex-1 min-w-[60px] py-3 text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap px-1"
                style={{
                  color:        panel === p ? palette.primary : 'rgba(255,255,255,0.3)',
                  borderBottom: panel === p ? `2px solid ${palette.primary}` : '2px solid transparent',
                }}>
                {p === 'templates' ? '🎨' : p === 'sections' ? 'Secc.' : p === 'design' ? 'Diseño' : 'FX'}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

            {/* ── TEMPLATES PANEL ── */}
            {panel === 'templates' && (
              <TemplatesPanel
                artist={artist}
                sections={sections}
                setSections={setSections}
                setArtist={setArtist}
                supabase={supabase}
                palette={palette}
                currentPrimary={primary}
                currentSecondary={secondary}
                currentLayout={layout}
                currentFontId={fontId}
                onApplied={onTemplateApplied}
              />
            )}

            {/* ── SECTIONS PANEL ── */}
            {panel === 'sections' && !activeSection && (
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                {sections.length === 0 ? (
                  <EmptySections palette={palette} artistId={artist.id} supabase={supabase} onCreated={setSections} />
                ) : (
                  <>
                    <p className="text-[10px] font-mono text-white/25 px-1 mb-1">Arrastra · Click ⚙ para editar · 🎬 para animación</p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                        {[...sections].sort((a, b) => a.sort_order - b.sort_order).map(section => (
                          <SortableSection
                            key={section.id}
                            section={section}
                            palette={palette}
                            toggling={toggling}
                            isActive={lastEditedId === section.id}
                            openAnimPicker={openAnimPicker}
                            onToggle={() => toggleSection(section.id, section.is_enabled)}
                            onEdit={() => { setActiveSection(section); setLastEditedId(section.id) }}
                            onOpenAnimPicker={() => setOpenAnimPicker(p => p === section.id ? null : section.id)}
                            onAnimationChange={animId => handleAnimationChange(section.id, animId)}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </>
                )}
              </div>
            )}

            {/* ── SECTION CONFIG ── */}
            {panel === 'sections' && activeSection && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <button
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 px-4 py-3 text-xs text-white/40 hover:text-white/70 transition-colors shrink-0 border-b border-white/[0.05]">
                  ← Volver a secciones
                </button>
                <div className="flex-1 overflow-hidden">
                  <SectionConfigPanel
                    section={activeSection}
                    palette={palette}
                    supabase={supabase}
                    onSaved={updated => {
                      setSections(prev => prev.map(s => s.id === updated.id ? updated : s))
                      setActiveSection(updated)
                      reloadPreview()
                    }}
                  />
                </div>
              </div>
            )}

            {/* ── DESIGN PANEL ── */}
            {panel === 'design' && (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

                {/* "Just applied" banner */}
                <AnimatePresence>
                  {justApplied && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2.5 p-3 rounded-xl -mb-1"
                      style={{ background: palette.primary + '14', border: `1px solid ${palette.primary}30` }}>
                      <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: palette.primary }} />
                      <div>
                        <p className="text-[11px] font-semibold leading-tight" style={{ color: palette.primary }}>
                          {justApplied} aplicada
                        </p>
                        <p className="text-[10px] text-white/35 mt-0.5">
                          Personaliza colores, fuente y layout →
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Photo */}
                <div className="flex flex-col gap-2">
                  <Label>Foto de artista</Label>
                  <ImageUpload
                    value={artist.photo_url ?? null}
                    onChange={async url => {
                      await supabase.from('artists').update({ photo_url: url }).eq('user_id', artist.user_id)
                      setArtist(p => ({ ...p, photo_url: url }))
                    }}
                    onRemove={async () => {
                      await supabase.from('artists').update({ photo_url: null }).eq('user_id', artist.user_id)
                      setArtist(p => ({ ...p, photo_url: null }))
                    }}
                    folder="avatar" label="Subir foto" aspect="1/1" accentColor={primary}
                  />
                </div>

                {/* Logo */}
                <div className="flex flex-col gap-2">
                  <Label>Logo / Marca</Label>
                  <ImageUpload
                    value={artist.logo_url ?? null}
                    onChange={async url => {
                      await supabase.from('artists').update({ logo_url: url }).eq('user_id', artist.user_id)
                      setArtist(p => ({ ...p, logo_url: url }))
                    }}
                    onRemove={async () => {
                      await supabase.from('artists').update({ logo_url: null }).eq('user_id', artist.user_id)
                      setArtist(p => ({ ...p, logo_url: null }))
                    }}
                    folder="logo" label="Subir logo" hint="PNG transparente recomendado" aspect="16/9" accentColor={primary}
                  />
                </div>

                {/* Colors */}
                <div className="flex flex-col gap-3">
                  <Label>Colores</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Principal',  value: primary,   onChange: handlePrimary },
                      { label: 'Secundario', value: secondary, onChange: handleSecondary },
                    ].map(({ label, value, onChange }) => (
                      <div key={label} className="flex items-center gap-2 p-2.5 rounded-xl"
                        style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
                          <input type="color" value={value} onChange={e => onChange(e.target.value)}
                            className="absolute inset-0 w-full h-full cursor-pointer opacity-0" />
                          <div className="w-full h-full rounded-lg" style={{ background: value }} />
                        </div>
                        <div>
                          <p className="text-[10px] font-mono" style={{ color: value }}>{value.toUpperCase()}</p>
                          <p className="text-[9px] text-white/20">{label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map(p => (
                      <button key={p.name}
                        onClick={() => { handlePrimary(p.primary); handleSecondary(p.secondary) }}
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-mono border transition-all"
                        style={{
                          borderColor:     primary === p.primary ? p.primary : 'rgba(255,255,255,0.07)',
                          color:           primary === p.primary ? p.primary : 'rgba(255,255,255,0.3)',
                          backgroundColor: primary === p.primary ? p.primary + '15' : 'transparent',
                        }}>
                        <span className="flex rounded-full overflow-hidden w-3 h-3">
                          <span className="w-1/2 h-full" style={{ background: p.primary }} />
                          <span className="w-1/2 h-full" style={{ background: p.secondary }} />
                        </span>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div className="flex flex-col gap-2">
                  <Label>Fondo</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[{ dark: true, Icon: Moon, label: 'Oscuro' }, { dark: false, Icon: Sun, label: 'Claro' }].map(({ dark, Icon, label }) => (
                      <button key={String(dark)} onClick={() => handleBgDark(dark)}
                        className="flex items-center gap-2 p-3 rounded-xl text-xs font-medium border transition-all"
                        style={{
                          borderColor:     bgDark === dark ? primary : 'rgba(255,255,255,0.07)',
                          color:           bgDark === dark ? primary : 'rgba(255,255,255,0.35)',
                          backgroundColor: bgDark === dark ? primary + '12' : 'transparent',
                        }}>
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout with SVG thumbnails */}
                <div className="flex flex-col gap-2">
                  <Label>Layout</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.entries(LAYOUT_META) as [LayoutVariant, (typeof LAYOUT_META)[LayoutVariant]][]).map(([key, meta]) => (
                      <button key={key} onClick={() => handleLayout(key)}
                        className="p-2 rounded-xl text-left border transition-all flex flex-col gap-1.5"
                        style={{
                          borderColor:     layout === key ? primary : 'rgba(255,255,255,0.07)',
                          backgroundColor: layout === key ? primary + '10' : 'rgba(255,255,255,0.02)',
                        }}>
                        <LayoutThumb variant={key} color={layout === key ? primary : 'rgba(255,255,255,0.35)'} />
                        <p className="text-[10px] font-semibold px-0.5" style={{ color: layout === key ? primary : 'rgba(255,255,255,0.5)' }}>
                          {meta.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fonts at 72px height */}
                <div className="flex flex-col gap-2">
                  <Label>Tipografía</Label>
                  {Object.entries(
                    FONTS_CATALOG.reduce<Record<string, typeof FONTS_CATALOG>>((acc, f) => {
                      ;(acc[f.category] = acc[f.category] ?? []).push(f)
                      return acc
                    }, {})
                  ).map(([cat, fonts]) => (
                    <div key={cat} className="flex flex-col gap-1">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-white/20 px-1 mt-1">{cat}</p>
                      {fonts.map(f => {
                        const active = fontId === f.id
                        return (
                          <button key={f.id} onClick={() => handleFontId(f.id)}
                            className="flex items-center px-3 rounded-xl border text-left transition-all overflow-hidden"
                            style={{
                              height: '72px',
                              borderColor:     active ? primary : 'rgba(255,255,255,0.06)',
                              backgroundColor: active ? primary + '10' : 'rgba(255,255,255,0.02)',
                            }}>
                            <span className="text-4xl font-black leading-none shrink-0 w-12"
                              style={{ fontFamily: `var(${f.cssVar})`, color: active ? primary : 'rgba(255,255,255,0.45)' }}>
                              Aa
                            </span>
                            <div className="ml-3">
                              <p className="text-[12px] font-semibold" style={{ color: active ? primary : 'rgba(255,255,255,0.65)' }}>
                                {f.label}
                              </p>
                              <p className="text-[9px] font-mono mt-0.5" style={{ color: active ? primary + 'AA' : 'rgba(255,255,255,0.2)' }}>
                                {f.category}
                              </p>
                            </div>
                            {active && <Check className="w-3.5 h-3.5 ml-auto shrink-0" style={{ color: primary }} />}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── EFFECTS PANEL ── */}
            {panel === 'effects' && (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 p-3 rounded-xl"
                  style={{ background: palette.primary + '10', border: `1px solid ${palette.primary}25` }}>
                  <Sparkles className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
                  <p className="text-[11px] text-white/60 leading-relaxed">
                    Los efectos activos se guardan automáticamente.
                  </p>
                </div>
                {EFFECTS.map(({ id, label, desc, emoji }) => {
                  const intensity = effectIntensities[id] ?? 0
                  const isOn = intensity > 0
                  return (
                    <div key={id}
                      className="rounded-xl transition-all overflow-hidden"
                      style={{
                        background: isOn ? palette.primary + '0C' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isOn ? palette.primary + '30' : 'rgba(255,255,255,0.05)'}`,
                      }}>
                      <div className="flex items-center justify-between p-3.5 cursor-pointer"
                        onClick={() => toggleEffect(id)}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-base opacity-70">{emoji}</span>
                          <div>
                            <p className="text-[12px] font-medium text-white/80">{label}</p>
                            <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>
                          </div>
                        </div>
                        {isOn
                          ? <ToggleRight className="w-6 h-6 shrink-0" style={{ color: palette.primary }} />
                          : <ToggleLeft className="w-6 h-6 shrink-0 text-white/25" />}
                      </div>
                      {/* Intensity slider — only shown when effect is on */}
                      <AnimatePresence>
                        {isOn && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="overflow-hidden">
                            <div className="flex gap-1.5 px-3.5 pb-3">
                              {[1, 2, 3].map(level => (
                                <button key={level}
                                  onClick={() => setEffectIntensity(id, level)}
                                  className="flex-1 py-1.5 rounded-lg text-[10px] font-mono transition-all"
                                  style={{
                                    background:  intensity === level ? palette.primary : 'rgba(255,255,255,0.05)',
                                    color:       intensity === level ? '#fff' : 'rgba(255,255,255,0.35)',
                                    border:      `1px solid ${intensity === level ? palette.primary + '60' : 'transparent'}`,
                                  }}>
                                  {INTENSITY_LABELS[level]}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── PREVIEW PANE ──────────────────────────────────────── */}
        <div className={`flex-1 flex flex-col min-h-0 ${mobilePane === 'controls' ? 'hidden lg:flex' : 'flex'}`} style={{ background: '#070709' }}>
          <div className="flex items-center justify-between px-4 py-2.5 shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-1.5">
              {[{ v: 'desktop' as const, Icon: Monitor }, { v: 'mobile' as const, Icon: Smartphone }].map(({ v, Icon }) => (
                <button key={v} onClick={() => setDevice(v)}
                  className="p-2 rounded-lg transition-all"
                  style={{
                    background: device === v ? palette.primary + '20' : 'transparent',
                    color:      device === v ? palette.primary : 'rgba(255,255,255,0.3)',
                  }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-white/20 truncate max-w-[200px]">/{artist.slug}</p>
            <div className="flex items-center gap-1.5">
              <button onClick={reloadPreview} className="p-2 rounded-lg text-white/30 hover:text-white transition-colors" title="Recargar">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button onClick={copyLink}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all"
                style={{
                  background: copied ? '#22C55E18' : palette.primary + '18',
                  color:      copied ? '#22C55E'  : palette.primary,
                  border:     `1px solid ${copied ? '#22C55E30' : palette.primary + '30'}`,
                }}>
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copiado' : 'Copiar link'}
              </button>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-white/30 hover:text-white transition-colors" title="Abrir en nueva pestaña">
                <Maximize2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <div className="flex-1 flex items-start justify-center overflow-auto p-4">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-500"
              style={{
                width:       device === 'mobile' ? '390px' : '100%',
                maxWidth:    device === 'desktop' ? '100%' : '390px',
                aspectRatio: device === 'mobile' ? '390/844' : undefined,
                height:      device === 'desktop' ? 'calc(100vh - 180px)' : undefined,
                border:      '1px solid rgba(255,255,255,0.08)',
                boxShadow:   `0 0 60px ${palette.primary}20`,
              }}>
              <iframe ref={iframeRef} src={previewUrl}
                className="w-full h-full" style={{ border: 'none' }} title="Press kit preview" />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// ── Save indicator ────────────────────────────────────────────────
function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === 'saving' || status === 'pending') return (
    <span className="flex items-center gap-1.5">
      <Loader2 className="w-3 h-3 animate-spin text-white/30" />
      <span className="text-[11px] font-mono text-white/30">Guardando…</span>
    </span>
  )
  if (status === 'saved') return (
    <span className="flex items-center gap-1.5">
      <Cloud className="w-3 h-3 text-emerald-400" />
      <span className="text-[11px] font-mono text-emerald-400">Guardado</span>
    </span>
  )
  if (status === 'error') return (
    <span className="flex items-center gap-1.5">
      <CloudOff className="w-3 h-3 text-red-400" />
      <span className="text-[11px] font-mono text-red-400">Error al guardar</span>
    </span>
  )
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      <span className="text-[11px] font-mono text-white/40">Mi Sitio</span>
    </span>
  )
}

// ── Sortable section row ──────────────────────────────────────────
function SortableSection({ section, palette, toggling, isActive, openAnimPicker, onToggle, onEdit, onOpenAnimPicker, onAnimationChange }: {
  section:          Section
  palette:          ReturnType<typeof import('@/types').deriveArtistPalette>
  toggling:         string | null
  isActive:         boolean
  openAnimPicker:   string | null
  onToggle:         () => void
  onEdit:           () => void
  onOpenAnimPicker: () => void
  onAnimationChange:(animId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const meta = SECTION_LABELS[section.name] ?? { icon: '📄', label: section.name }
  const currentAnim = (section.config?.animation as string) ?? 'none'
  const isAnimPickerOpen = openAnimPicker === section.id

  const borderColor = isDragging
    ? palette.primary + '60'
    : isActive ? palette.primary + '55'
    : section.is_enabled ? palette.primary + '22'
    : 'rgba(255,255,255,0.05)'

  const bgColor = isDragging
    ? palette.primary + '18'
    : isActive ? palette.primary + '12'
    : section.is_enabled ? palette.primary + '08'
    : 'rgba(255,255,255,0.02)'

  return (
    <div className="flex flex-col">
      <div ref={setNodeRef}
        style={{
          transform:  CSS.Transform.toString(transform),
          transition: isDragging ? 'none' : transition ?? undefined,
          zIndex:     isDragging ? 50 : undefined,
          background: bgColor,
          border:     `1px solid ${borderColor}`,
          boxShadow:  isDragging
            ? `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${palette.primary}25`
            : isActive ? `0 0 0 1px ${palette.primary}20` : 'none',
        }}
        className="flex items-center gap-2 p-3 rounded-xl transition-all duration-150">

        <button {...attributes} {...listeners}
          className="p-1 text-white/15 hover:text-white/40 cursor-grab active:cursor-grabbing transition-colors shrink-0">
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium truncate" style={{ color: isActive ? palette.primary : 'rgba(255,255,255,0.8)' }}>
            {meta.icon} {meta.label}
          </p>
          <p className="text-[9px] font-mono mt-0.5" style={{ color: isActive ? palette.primary + 'AA' : 'rgba(255,255,255,0.2)' }}>
            {section.is_enabled ? 'visible' : 'oculta'}
            {currentAnim !== 'none' && <span className="ml-1.5 opacity-60">· {currentAnim}</span>}
          </p>
        </div>

        {/* Animation picker button */}
        <button onClick={onOpenAnimPicker}
          className="p-1.5 rounded-lg transition-colors shrink-0 text-[13px]"
          style={{ color: currentAnim !== 'none' ? palette.primary : 'rgba(255,255,255,0.2)' }}
          title="Animación de entrada">
          🎬
        </button>

        <button onClick={onEdit}
          className="p-1.5 rounded-lg transition-colors shrink-0"
          style={{ color: isActive ? palette.primary : 'rgba(255,255,255,0.25)' }}>
          <Settings2 className="w-3.5 h-3.5" />
        </button>

        <button onClick={onToggle}
          disabled={toggling === section.id || section.name === 'hero'}
          className="transition-all disabled:opacity-30 shrink-0">
          {toggling === section.id
            ? <Loader2 className="w-5 h-5 animate-spin text-white/30" />
            : section.is_enabled
              ? <ToggleRight className="w-6 h-6" style={{ color: palette.primary }} />
              : <ToggleLeft className="w-6 h-6 text-white/25" />}
        </button>
      </div>

      {/* Inline animation picker */}
      <AnimatePresence>
        {isAnimPickerOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="overflow-hidden">
            <div className="grid grid-cols-3 gap-1 p-2 rounded-b-xl mt-0.5"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderTop: 'none' }}>
              {ANIMATIONS.map(anim => (
                <button key={anim.id}
                  onClick={() => onAnimationChange(anim.id)}
                  className="py-1.5 px-1 rounded-lg text-[9px] font-mono transition-all text-center"
                  style={{
                    background:  currentAnim === anim.id ? palette.primary + '20' : 'transparent',
                    color:       currentAnim === anim.id ? palette.primary : 'rgba(255,255,255,0.35)',
                    border:      `1px solid ${currentAnim === anim.id ? palette.primary + '40' : 'transparent'}`,
                  }}>
                  {anim.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">{children}</p>
}

// ── Empty sections recovery ───────────────────────────────────────
const DEFAULT_SECTION_NAMES = ['hero', 'bio', 'music', 'live', 'gallery', 'contact', 'links', 'testimonials'] as const

function EmptySections({ palette, artistId, supabase, onCreated }: {
  palette:   ReturnType<typeof import('@/types').deriveArtistPalette>
  artistId:  string
  supabase:  ReturnType<typeof import('@/lib/supabase/client').createClient>
  onCreated: (sections: import('@/types').Section[]) => void
}) {
  const [creating, setCreating] = useState(false)

  const create = async () => {
    setCreating(true)
    const rows = DEFAULT_SECTION_NAMES.map((name, i) => ({
      artist_id:  artistId,
      name,
      sort_order: i,
      is_enabled: true,
      config:     {},
    }))
    const { data, error } = await supabase.from('sections').insert(rows).select()
    if (!error && data) onCreated(data)
    setCreating(false)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4 text-center">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
        style={{ background: palette.primary + '18', border: `1px solid ${palette.primary}25` }}>
        🎯
      </div>
      <div>
        <p className="text-[13px] text-white/60 font-medium mb-1">No hay secciones todavía</p>
        <p className="text-[11px] font-mono text-white/25">Crea las secciones por defecto para empezar</p>
      </div>
      <button onClick={create} disabled={creating}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold text-white disabled:opacity-60 transition-all"
        style={{ background: palette.primary }}>
        {creating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
        {creating ? 'Creando…' : 'Crear secciones'}
      </button>
    </div>
  )
}
