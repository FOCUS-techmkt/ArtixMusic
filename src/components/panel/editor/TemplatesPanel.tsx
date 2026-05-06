'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, Plus, Loader2, Sparkles } from 'lucide-react'
import type { LayoutVariant, Section } from '@/types'
import type { TabProps } from '../DashboardClient'

// ── Template type ─────────────────────────────────────────────────
export interface Template {
  id: string
  name: string
  tag: string
  desc: string
  fontId: string
  fontCssVar: string
  layout: LayoutVariant
  primary: string
  secondary: string
  bgDark: boolean
  effects: string[]
  effectIntensities: Record<string, number>
  visibleSections: string[]
}

// ── 8 built-in templates ──────────────────────────────────────────
export const BUILTIN_TEMPLATES: Template[] = [
  {
    id: 'noir-underground', name: 'NOIR UNDERGROUND', tag: 'TECHNO / INDUSTRIAL',
    desc: 'Oscuro, sucio, underground',
    fontId: 'bebas-neue', fontCssVar: '--font-bebas-neue', layout: 'raw',
    primary: '#EF4444', secondary: '#991B1B', bgDark: true,
    effects: ['grain', 'glow'], effectIntensities: { grain: 2, glow: 2 },
    visibleSections: ['hero', 'music', 'bio', 'gallery', 'contact'],
  },
  {
    id: 'neon-rave', name: 'NEON RAVE', tag: 'HOUSE / TECHNO',
    desc: 'Energía eléctrica, club culture',
    fontId: 'teko', fontCssVar: '--font-teko', layout: 'centered',
    primary: '#8B5CF6', secondary: '#06B6D4', bgDark: true,
    effects: ['particles', 'glow', 'parallax'], effectIntensities: { particles: 2, glow: 3, parallax: 1 },
    visibleSections: ['hero', 'music', 'community', 'releases', 'fan-capture'],
  },
  {
    id: 'editorial-pro', name: 'EDITORIAL PRO', tag: 'BOOKING / FESTIVAL',
    desc: 'Profesional, revista, booker-ready',
    fontId: 'space-grotesk', fontCssVar: '--font-display', layout: 'editorial',
    primary: '#F59E0B', secondary: '#78716C', bgDark: true,
    effects: ['parallax', 'grain'], effectIntensities: { parallax: 1, grain: 1 },
    visibleSections: ['hero', 'bio', 'music', 'supporters', 'gallery', 'contact'],
  },
  {
    id: 'minimal-wave', name: 'MINIMAL WAVE', tag: 'AMBIENT / EXPERIMENTAL',
    desc: 'Limpio, minimalista, elegante',
    fontId: 'inter', fontCssVar: '--font-inter', layout: 'centered',
    primary: '#E5E7EB', secondary: '#6B7280', bgDark: true,
    effects: [], effectIntensities: {},
    visibleSections: ['hero', 'music', 'community', 'contact'],
  },
  {
    id: 'cyberpunk', name: 'CYBERPUNK', tag: 'EBM / DARK',
    desc: 'Futurista, distópico, máxima energía',
    fontId: 'orbitron', fontCssVar: '--font-orbitron', layout: 'split',
    primary: '#06B6D4', secondary: '#8B5CF6', bgDark: true,
    effects: ['particles', 'glow', 'grain', 'parallax'], effectIntensities: { particles: 3, glow: 3, grain: 1, parallax: 2 },
    visibleSections: ['hero', 'bio', 'music', 'community', 'supporters', 'releases', 'live', 'gallery', 'contact', 'fan-capture'],
  },
  {
    id: 'ibiza-sunset', name: 'IBIZA SUNSET', tag: 'AFRO HOUSE / MELODIC',
    desc: 'Verano, poolside, festivo',
    fontId: 'barlow-condensed', fontCssVar: '--font-barlow-condensed', layout: 'editorial',
    primary: '#F97316', secondary: '#EC4899', bgDark: true,
    effects: ['parallax', 'glow'], effectIntensities: { parallax: 2, glow: 2 },
    visibleSections: ['hero', 'music', 'community', 'live', 'gallery'],
  },
  {
    id: 'deep-space', name: 'DEEP SPACE', tag: 'PROGRESSIVE / DEEP',
    desc: 'Espacial, cósmico, profundo',
    fontId: 'exo-2', fontCssVar: '--font-exo2', layout: 'raw',
    primary: '#1D4ED8', secondary: '#0EA5E9', bgDark: true,
    effects: ['particles', 'parallax', 'glow'], effectIntensities: { particles: 2, parallax: 2, glow: 2 },
    visibleSections: ['hero', 'music', 'releases', 'community', 'contact'],
  },
  {
    id: 'blood-and-gold', name: 'BLOOD & GOLD', tag: 'TECHNO / HARD',
    desc: 'Potente, oscuro, dramático',
    fontId: 'bebas-neue', fontCssVar: '--font-bebas-neue', layout: 'centered',
    primary: '#DC2626', secondary: '#CA8A04', bgDark: true,
    effects: ['grain', 'glow'], effectIntensities: { grain: 3, glow: 3 },
    visibleSections: ['hero', 'music', 'supporters', 'gallery', 'contact'],
  },
]

// ── Mini preview card ─────────────────────────────────────────────
function TemplatePreview({ tpl }: { tpl: Template }) {
  return (
    <div className="relative rounded-xl overflow-hidden w-full select-none"
      style={{ aspectRatio: '16/9', background: tpl.bgDark ? '#0a0a0f' : '#f5f5f0' }}>
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 50% 0%, ${tpl.primary}, transparent 70%)` }} />

      {/* Layout-specific elements */}
      {tpl.layout === 'centered' && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-10 h-10 rounded-full"
            style={{ background: tpl.primary + '40', border: `1.5px solid ${tpl.primary}80` }} />
          <div className="absolute bottom-[28%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            <div className="h-[4px] rounded-full" style={{ width: 48, background: tpl.primary }} />
            <div className="h-[2.5px] rounded-full opacity-50" style={{ width: 32, background: tpl.secondary }} />
          </div>
        </>
      )}
      {tpl.layout === 'editorial' && (
        <>
          <div className="absolute left-[8%] top-[15%] flex flex-col gap-1">
            <div className="h-[5px] rounded-sm" style={{ width: 52, background: tpl.primary }} />
            <div className="h-[3px] rounded-sm opacity-60" style={{ width: 38, background: tpl.secondary }} />
            <div className="h-[2px] rounded-sm opacity-30 mt-1" style={{ width: 44, background: 'white' }} />
            <div className="h-[2px] rounded-sm opacity-25" style={{ width: 36, background: 'white' }} />
          </div>
          <div className="absolute right-[6%] top-[10%] bottom-[10%] w-[32%] rounded-lg"
            style={{ background: tpl.primary + '25', border: `1px solid ${tpl.primary}40` }} />
        </>
      )}
      {tpl.layout === 'split' && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-[50%] flex flex-col justify-center pl-[8%] gap-1.5">
            <div className="h-[5px] rounded-sm" style={{ width: 44, background: tpl.primary }} />
            <div className="h-[2.5px] rounded-sm opacity-50" style={{ width: 32, background: tpl.secondary }} />
            <div className="h-[2px] opacity-25 mt-1" style={{ width: 40, background: 'white' }} />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-[48%]"
            style={{ background: `linear-gradient(135deg, ${tpl.primary}20, ${tpl.secondary}10)`, borderLeft: `1px solid ${tpl.primary}30` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full" style={{ background: tpl.primary + '30', border: `1px solid ${tpl.primary}60` }} />
            </div>
          </div>
        </>
      )}
      {tpl.layout === 'raw' && (
        <>
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${tpl.primary}15, ${tpl.secondary}08)` }} />
          <div className="absolute bottom-[12%] left-[8%] flex flex-col gap-1">
            <div className="h-[5px] rounded-sm" style={{ width: 56, background: tpl.primary }} />
            <div className="h-[3px] rounded-sm opacity-50" style={{ width: 36, background: 'rgba(255,255,255,0.6)' }} />
          </div>
        </>
      )}

      {/* Font name preview */}
      <div className="absolute top-[8%] right-[6%]">
        <span className="text-[7px] font-mono opacity-40" style={{ color: tpl.primary }}>{tpl.fontId.toUpperCase()}</span>
      </div>

      {/* Effects dots */}
      {tpl.effects.length > 0 && (
        <div className="absolute bottom-[8%] right-[6%] flex gap-1">
          {tpl.effects.slice(0, 3).map(e => (
            <div key={e} className="w-1.5 h-1.5 rounded-full opacity-60" style={{ background: tpl.primary }} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Confirmation modal ────────────────────────────────────────────
interface ConfirmModalProps {
  tpl: Template
  onCancel: () => void
  onConfirm: () => void
  loading: boolean
}
function ConfirmModal({ tpl, onCancel, onConfirm, loading }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: '#111115', border: '1px solid rgba(255,255,255,0.1)' }}>

        <div>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-2">Aplicar plantilla</p>
          <h3 className="font-display font-bold text-lg text-white">{tpl.name}</h3>
          <p className="text-[12px] text-white/50 mt-1">{tpl.desc}</p>
        </div>

        <div className="p-3 rounded-xl text-[11px] text-amber-400/80"
          style={{ background: '#F59E0B10', border: '1px solid #F59E0B25' }}>
          ⚠ Esto reemplazará tu configuración actual de diseño, efectos y orden de secciones.
        </div>

        <div className="flex gap-3 mt-1">
          <button onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:text-white/80 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.10)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold text-white disabled:opacity-60 transition-all"
            style={{ background: tpl.primary }}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Aplicar
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
interface Props {
  artist: TabProps['artist']
  sections: Section[]
  setSections: TabProps['setSections']
  setArtist: TabProps['setArtist']
  supabase: TabProps['supabase']
  palette: TabProps['palette']
  currentPrimary: string
  currentSecondary: string
  currentLayout: LayoutVariant
  currentFontId: string
  onApplied: (tpl: Template) => void
}

export default function TemplatesPanel({
  artist, sections, setSections, setArtist, supabase, palette,
  currentPrimary, currentLayout, currentFontId, onApplied,
}: Props) {
  const [confirmTpl, setConfirmTpl]     = useState<Template | null>(null)
  const [applying,   setApplying]       = useState(false)
  const [customName, setCustomName]     = useState('')
  const [savingCustom, setSavingCustom] = useState(false)
  const [savedCustom, setSavedCustom]   = useState(false)

  const isActive = (tpl: Template) =>
    tpl.primary === currentPrimary && tpl.layout === currentLayout && tpl.fontId === currentFontId

  const applyTemplate = async (tpl: Template) => {
    setApplying(true)
    try {
      // 1. Save design
      await supabase.from('artists').update({
        primary_color:   tpl.primary,
        secondary_color: tpl.secondary,
        bg_dark:         tpl.bgDark,
        layout_variant:  tpl.layout,
        font_id:         tpl.fontId,
      }).eq('user_id', artist.user_id)

      // 2. Save effects to hero section config
      const hero = sections.find(s => s.name === 'hero')
      if (hero) {
        const newHeroConfig = { ...hero.config, effects: tpl.effects, effectIntensities: tpl.effectIntensities }
        await supabase.from('sections').update({ config: newHeroConfig }).eq('id', hero.id)
      }

      // 3. Update section visibility + order
      const sectionsCopy = [...sections]
      const updated = sectionsCopy.map(s => {
        const idx = tpl.visibleSections.indexOf(s.name)
        return { ...s, is_enabled: idx >= 0, sort_order: idx >= 0 ? idx : 99 }
      }).sort((a, b) => a.sort_order - b.sort_order)

      await Promise.all(updated.map(s =>
        supabase.from('sections').update({ is_enabled: s.is_enabled, sort_order: s.sort_order }).eq('id', s.id)
      ))
      setSections(updated)

      // 4. Update artist state
      setArtist(p => ({ ...p, primary_color: tpl.primary, secondary_color: tpl.secondary, bg_dark: tpl.bgDark, layout_variant: tpl.layout, font_id: tpl.fontId }))

      onApplied(tpl)
      setConfirmTpl(null)
    } catch {
      // silent fail — user can retry
    }
    setApplying(false)
  }

  const saveCustom = async () => {
    if (!customName.trim()) return
    setSavingCustom(true)
    // Store in hero section config under "customTemplates"
    const hero = sections.find(s => s.name === 'hero')
    if (hero) {
      const existing = (hero.config.customTemplates as Template[]) ?? []
      const newTpl: Template = {
        id:               `custom-${Date.now()}`,
        name:             customName.toUpperCase(),
        tag:              'CUSTOM',
        desc:             'Plantilla personalizada',
        fontId:           artist.font_id ?? 'space-grotesk',
        fontCssVar:       '--font-display',
        layout:           artist.layout_variant ?? 'centered',
        primary:          artist.primary_color  ?? '#C026D3',
        secondary:        artist.secondary_color ?? '#7C3AED',
        bgDark:           artist.bg_dark ?? true,
        effects:          (hero.config.effects as string[]) ?? [],
        effectIntensities:(hero.config.effectIntensities as Record<string, number>) ?? {},
        visibleSections:  sections.filter(s => s.is_enabled).sort((a,b) => a.sort_order - b.sort_order).map(s => s.name),
      }
      const newConfig = { ...hero.config, customTemplates: [...existing, newTpl] }
      await supabase.from('sections').update({ config: newConfig }).eq('id', hero.id)
      setSections(prev => prev.map(s => s.id === hero.id ? { ...s, config: newConfig } : s))
      setSavedCustom(true)
      setCustomName('')
      setTimeout(() => setSavedCustom(false), 2000)
    }
    setSavingCustom(false)
  }

  const deleteCustom = async (tplId: string) => {
    const hero = sections.find(s => s.name === 'hero')
    if (!hero) return
    const existing = (hero.config.customTemplates as Template[]) ?? []
    const newConfig = { ...hero.config, customTemplates: existing.filter(t => t.id !== tplId) }
    await supabase.from('sections').update({ config: newConfig }).eq('id', hero.id)
    setSections(prev => prev.map(s => s.id === hero.id ? { ...s, config: newConfig } : s))
  }

  const hero = sections.find(s => s.name === 'hero')
  const customTemplates = (hero?.config?.customTemplates as Template[]) ?? []
  const allTemplates = [...BUILTIN_TEMPLATES, ...customTemplates]

  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: palette.primary }} />
        <p className="text-[10px] font-mono text-white/30">Aplica un look completo en un clic</p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {allTemplates.map(tpl => {
          const active = isActive(tpl)
          const isCustom = tpl.id.startsWith('custom-')
          return (
            <div key={tpl.id}
              className="group relative rounded-2xl overflow-hidden flex flex-col gap-0 transition-all"
              style={{
                border: active ? `2px solid ${tpl.primary}` : '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
                boxShadow: active ? `0 0 24px ${tpl.primary}20` : 'none',
              }}>

              {/* Active badge */}
              {active && (
                <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase"
                  style={{ background: tpl.primary, color: '#fff' }}>
                  ACTIVA
                </div>
              )}
              {isCustom && (
                <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                  CUSTOM
                </div>
              )}

              {/* Preview thumbnail */}
              <div className="relative">
                <TemplatePreview tpl={tpl} />
                {/* Hover overlay with Aplicar button — desktop only */}
                <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <button onClick={() => setConfirmTpl(tpl)}
                    className="px-4 py-2 rounded-xl text-[12px] font-semibold text-white transition-all hover:scale-105"
                    style={{ background: tpl.primary }}>
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[11px] font-bold tracking-wide text-white/90" style={{ fontFamily: `var(${tpl.fontCssVar})` }}>
                    {tpl.name}
                  </p>
                  {isCustom && (
                    <button onClick={() => deleteCustom(tpl.id)}
                      className="p-1 rounded-lg text-white/20 hover:text-rose-400 transition-colors shrink-0">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full self-start"
                  style={{ background: tpl.primary + '20', color: tpl.primary }}>
                  {tpl.tag}
                </span>
                <p className="text-[10px] text-white/35 leading-snug">{tpl.desc}</p>

                {/* Mobile: always-visible Aplicar button */}
                <button onClick={() => setConfirmTpl(tpl)}
                  className="sm:hidden mt-1 w-full py-2 rounded-xl text-[11px] font-semibold text-white"
                  style={{ background: tpl.primary + 'CC' }}>
                  Aplicar
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Save custom template */}
      <div className="p-4 rounded-2xl flex flex-col gap-3"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] font-mono uppercase tracking-wider text-white/25">Guardar configuración actual</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            placeholder="Nombre de tu plantilla..."
            maxLength={32}
            onKeyDown={e => { if (e.key === 'Enter') saveCustom() }}
            className="flex-1 bg-transparent text-[12px] text-white placeholder-white/20 outline-none border-b py-1 min-w-0"
            style={{ borderColor: 'rgba(255,255,255,0.1)' }}
          />
          <button onClick={saveCustom} disabled={!customName.trim() || savingCustom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-white disabled:opacity-40 shrink-0 transition-all"
            style={{ background: palette.primary }}>
            {savingCustom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> :
             savedCustom  ? <Check   className="w-3.5 h-3.5" />            :
             <Plus className="w-3.5 h-3.5" />}
            {savedCustom ? 'Guardada' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      <AnimatePresence>
        {confirmTpl && (
          <ConfirmModal
            tpl={confirmTpl}
            onCancel={() => setConfirmTpl(null)}
            onConfirm={() => applyTemplate(confirmTpl)}
            loading={applying}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
