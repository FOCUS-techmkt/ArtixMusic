'use client'
import { useState, useRef } from 'react'
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
  ToggleLeft, ToggleRight, Loader2, Check, RefreshCw,
  Smartphone, Monitor, Maximize2, Sun, Moon, GripVertical,
  ChevronRight, Settings2, Sparkles,
} from 'lucide-react'
import type { TabProps } from '../DashboardClient'
import { COLOR_PRESETS, LAYOUT_META } from '@/types'
import type { LayoutVariant, Section } from '@/types'
import SectionConfigPanel from '../editor/SectionConfigPanel'

const SECTION_LABELS: Record<string, { icon: string; label: string }> = {
  hero:         { icon: '🎯', label: 'Hero & Portada' },
  bio:          { icon: '📝', label: 'Biografía' },
  music:        { icon: '🎵', label: 'Música' },
  community:    { icon: '👥', label: 'Comunidad' },
  supporters:   { icon: '⭐', label: 'Apoyado por' },
  releases:     { icon: '💿', label: 'Discografía' },
  live:         { icon: '🎤', label: 'En Vivo' },
  contact:      { icon: '📬', label: 'Contacto & Booking' },
  'fan-capture':{ icon: '💌', label: 'Fan Database' },
}

const FONTS = [
  { id: 'space', label: 'Space Grotesk', css: 'var(--font-display)' },
  { id: 'inter', label: 'Inter',          css: 'var(--font-inter)'   },
  { id: 'mono',  label: 'JetBrains Mono', css: 'var(--font-mono)'    },
]

const EFFECTS = [
  { id: 'particles', label: 'Partículas',   desc: 'Partículas flotantes en hero' },
  { id: 'glow',      label: 'Glow',         desc: 'Halo luminoso de tu color'    },
  { id: 'parallax',  label: 'Parallax',     desc: 'Profundidad en scroll'        },
  { id: 'grain',     label: 'Grain',        desc: 'Textura granulada de film'    },
]

export default function EditorTab({ artist, setArtist, sections, setSections, palette, supabase }: TabProps) {
  const [primary,   setPrimary]   = useState(artist.primary_color   ?? '#C026D3')
  const [secondary, setSecondary] = useState(artist.secondary_color ?? '#7C3AED')
  const [bgDark,    setBgDark]    = useState(artist.bg_dark         ?? true)
  const [layout,    setLayout]    = useState<LayoutVariant>(artist.layout_variant ?? 'centered')
  const [font,      setFont]      = useState('space')
  const [effects,   setEffects]   = useState<string[]>(['glow'])
  const [saving,    setSaving]    = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [toggling,  setToggling]  = useState<string | null>(null)
  const [device,    setDevice]    = useState<'desktop' | 'mobile'>('desktop')
  const [panel,     setPanel]     = useState<'sections' | 'design' | 'effects'>('sections')
  const [activeSection, setActiveSection] = useState<Section | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const previewUrl = `${appUrl}/${artist.slug}`

  const reloadPreview = () => iframeRef.current?.contentWindow?.location.reload()
  const toggleEffect  = (id: string) => setEffects(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id])

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

  const handleSaveDesign = async () => {
    setSaving(true)
    const { error } = await supabase.from('artists').update({
      primary_color:   primary,
      secondary_color: secondary,
      bg_dark:         bgDark,
      layout_variant:  layout,
    }).eq('user_id', artist.user_id)
    if (!error) {
      setArtist(p => ({ ...p, primary_color: primary, secondary_color: secondary, bg_dark: bgDark, layout_variant: layout }))
      setSaved(true)
      setTimeout(() => { setSaved(false); reloadPreview() }, 1200)
    }
    setSaving(false)
  }

  return (
    <div className="flex h-full flex-col lg:flex-row" style={{ minHeight: 'calc(100vh - 60px)' }}>

      {/* ── LEFT PANEL ─────────────────────────────────── */}
      <div className="w-full lg:w-[300px] shrink-0 flex flex-col"
        style={{ background: '#0A0A0E', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Panel tabs */}
        <div className="flex border-b border-white/[0.05] sticky top-0 z-10 shrink-0" style={{ background: '#0A0A0E' }}>
          {(['sections', 'design', 'effects'] as const).map(p => (
            <button key={p} onClick={() => { setPanel(p); setActiveSection(null) }}
              className="flex-1 py-3 text-[11px] font-mono uppercase tracking-wider transition-all"
              style={{
                color:        panel === p ? palette.primary : 'rgba(255,255,255,0.3)',
                borderBottom: panel === p ? `2px solid ${palette.primary}` : '2px solid transparent',
              }}>
              {p === 'sections' ? 'Secciones' : p === 'design' ? 'Diseño' : 'Efectos'}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">

          {/* ── SECTIONS PANEL ── */}
          {panel === 'sections' && !activeSection && (
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
              <p className="text-[10px] font-mono text-white/25 px-1 mb-1">Arrastra para reordenar · Click para editar</p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                  {[...sections].sort((a, b) => a.sort_order - b.sort_order).map(section => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      palette={palette}
                      toggling={toggling}
                      onToggle={() => toggleSection(section.id, section.is_enabled)}
                      onEdit={() => setActiveSection(section)}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* ── SECTION CONFIG PANEL ── */}
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

              {/* Photo upload */}
              <div className="flex flex-col gap-2">
                <Label>Foto principal</Label>
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
                  folder="avatar"
                  label="Foto de artista"
                  aspect="1/1"
                  accentColor={primary}
                />
              </div>

              {/* Colors */}
              <div className="flex flex-col gap-3">
                <Label>Colores</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Principal', value: primary, onChange: setPrimary },
                    { label: 'Secundario', value: secondary, onChange: setSecondary },
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
                    <button key={p.name} onClick={() => { setPrimary(p.primary); setSecondary(p.secondary) }}
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
                    <button key={String(dark)} onClick={() => setBgDark(dark)}
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

              {/* Layout */}
              <div className="flex flex-col gap-2">
                <Label>Layout</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(LAYOUT_META) as [LayoutVariant, typeof LAYOUT_META[LayoutVariant]][]).map(([key, meta]) => (
                    <button key={key} onClick={() => setLayout(key)}
                      className="p-3 rounded-xl text-left border transition-all"
                      style={{
                        borderColor:     layout === key ? primary : 'rgba(255,255,255,0.07)',
                        backgroundColor: layout === key ? primary + '12' : 'rgba(255,255,255,0.02)',
                      }}>
                      <p className="text-[11px] font-semibold" style={{ color: layout === key ? primary : 'rgba(255,255,255,0.6)' }}>
                        {meta.label}
                      </p>
                      <p className="text-[9px] text-white/25 mt-0.5 leading-relaxed">{meta.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fonts */}
              <div className="flex flex-col gap-2">
                <Label>Tipografía</Label>
                <div className="flex flex-col gap-1.5">
                  {FONTS.map(f => (
                    <button key={f.id} onClick={() => setFont(f.id)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all"
                      style={{
                        borderColor:     font === f.id ? primary : 'rgba(255,255,255,0.07)',
                        backgroundColor: font === f.id ? primary + '10' : 'rgba(255,255,255,0.02)',
                      }}>
                      <span className="text-xl font-bold w-8" style={{ fontFamily: f.css, color: font === f.id ? primary : 'rgba(255,255,255,0.5)' }}>
                        Ag
                      </span>
                      <span className="text-[11px] font-mono" style={{ color: font === f.id ? primary : 'rgba(255,255,255,0.4)' }}>
                        {f.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <motion.button onClick={handleSaveDesign} disabled={saving}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: palette.primary }}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" />
                  : saved  ? <><Check className="w-4 h-4" /> Guardado</>
                  : 'Guardar diseño'}
              </motion.button>
            </div>
          )}

          {/* ── EFFECTS PANEL ── */}
          {panel === 'effects' && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: palette.primary + '10', border: `1px solid ${palette.primary}25` }}>
                <Sparkles className="w-4 h-4 shrink-0" style={{ color: palette.primary }} />
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Efectos visuales que se aplican a tu press kit público.
                </p>
              </div>
              {EFFECTS.map(({ id, label, desc }) => (
                <div key={id}
                  className="flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: effects.includes(id) ? palette.primary + '0C' : 'rgba(255,255,255,0.02)',
                    border:     `1px solid ${effects.includes(id) ? palette.primary + '30' : 'rgba(255,255,255,0.05)'}`,
                  }}
                  onClick={() => toggleEffect(id)}>
                  <div>
                    <p className="text-[12px] font-medium text-white/80">{label}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{desc}</p>
                  </div>
                  {effects.includes(id)
                    ? <ToggleRight className="w-6 h-6 shrink-0" style={{ color: palette.primary }} />
                    : <ToggleLeft className="w-6 h-6 shrink-0 text-white/25" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── PREVIEW PANE ─────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-0" style={{ background: '#070709' }}>
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
            <button onClick={reloadPreview} className="p-2 rounded-lg text-white/30 hover:text-white transition-colors">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg text-white/30 hover:text-white transition-colors">
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
  )
}

// ── Sortable section row ──────────────────────────────────────

function SortableSection({ section, palette, toggling, onToggle, onEdit }: {
  section: Section
  palette: ReturnType<typeof import('@/types').deriveArtistPalette>
  toggling: string | null
  onToggle: () => void
  onEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id })
  const meta = SECTION_LABELS[section.name] ?? { icon: '📄', label: section.name }

  return (
    <div ref={setNodeRef}
      style={{
        transform:  CSS.Transform.toString(transform),
        transition,
        opacity:    isDragging ? 0.5 : 1,
        background: section.is_enabled ? palette.primary + '0C' : 'rgba(255,255,255,0.02)',
        border:     `1px solid ${section.is_enabled ? palette.primary + '25' : 'rgba(255,255,255,0.05)'}`,
      }}
      className="flex items-center gap-2 p-3 rounded-xl transition-all">

      {/* Drag handle */}
      <button {...attributes} {...listeners} className="p-1 text-white/15 hover:text-white/40 cursor-grab active:cursor-grabbing transition-colors">
        <GripVertical className="w-4 h-4" />
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-white/80 truncate">{meta.icon} {meta.label}</p>
        <p className="text-[9px] font-mono text-white/25 mt-0.5">{section.is_enabled ? 'visible' : 'oculta'}</p>
      </div>

      {/* Edit button */}
      <button onClick={onEdit} className="p-1.5 rounded-lg transition-colors text-white/25 hover:text-white/70">
        <Settings2 className="w-3.5 h-3.5" />
      </button>

      {/* Toggle */}
      <button
        onClick={onToggle}
        disabled={toggling === section.id || section.name === 'hero'}
        className="transition-all disabled:opacity-30">
        {toggling === section.id
          ? <Loader2 className="w-5 h-5 animate-spin text-white/30" />
          : section.is_enabled
            ? <ToggleRight className="w-6 h-6" style={{ color: palette.primary }} />
            : <ToggleLeft className="w-6 h-6 text-white/25" />}
      </button>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">{children}</p>
}
