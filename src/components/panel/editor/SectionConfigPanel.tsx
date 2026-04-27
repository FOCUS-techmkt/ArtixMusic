'use client'
import { useState, useEffect } from 'react'
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Section, ArtistPalette } from '@/types'
import type {
  HeroConfig, HeroSocialLink, BioConfig, MusicConfig, CommunityConfig,
  SupportersConfig, ReleasesConfig, LiveConfig, ContactConfig, FanCaptureConfig,
  GalleryConfig,
} from '@/types/sections'
import { DEFAULT_CONFIGS } from '@/types/sections'
import ImageUpload from '@/components/shared/ImageUpload'
import RichTextEditor from '@/components/shared/RichTextEditor'
import TagInput from '@/components/shared/TagInput'

type ConfigTab = 'content' | 'design' | 'anim'

interface Props {
  section:  Section
  palette:  ArtistPalette
  supabase: SupabaseClient
  onSaved:  (section: Section) => void
}

export default function SectionConfigPanel({ section, palette, supabase, onSaved }: Props) {
  const [config, setConfig] = useState<Record<string, unknown>>(
    Object.keys(section.config ?? {}).length > 0
      ? section.config as Record<string, unknown>
      : (DEFAULT_CONFIGS[section.name] as unknown as Record<string, unknown>) ?? {}
  )
  const [saving, setSaving] = useState(false)
  const [tab,    setTab]    = useState<ConfigTab>('content')

  useEffect(() => {
    setConfig(
      Object.keys(section.config ?? {}).length > 0
        ? section.config as Record<string, unknown>
        : (DEFAULT_CONFIGS[section.name] as unknown as Record<string, unknown>) ?? {}
    )
    setTab('content')
  }, [section.id])

  const set = <T,>(key: string, value: T) => setConfig(prev => ({ ...prev, [key]: value }))

  const save = async () => {
    setSaving(true)
    const { error } = await supabase.from('sections').update({ config }).eq('id', section.id)
    if (error) {
      toast.error('Error al guardar')
    } else {
      onSaved({ ...section, config })
      toast.success('Sección guardada')
    }
    setSaving(false)
  }

  const accent = palette.primary

  return (
    <div className="flex flex-col h-full">

      {/* ── Tab bar ── */}
      <div className="flex shrink-0 px-3 gap-0.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {(['content', 'design', 'anim'] as ConfigTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-3 pt-3 pb-2.5 text-[10px] font-mono uppercase tracking-widest transition-all relative"
            style={{ color: tab === t ? accent : 'rgba(255,255,255,0.22)' }}>
            {t === 'content' ? 'Contenido' : t === 'design' ? 'Diseño' : 'Animación'}
            {tab === t && (
              <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full" style={{ background: accent }} />
            )}
          </button>
        ))}
      </div>

      {/* ── Panel body ── */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
        {section.name === 'hero'        && <HeroPanel        config={config as unknown as HeroConfig}        set={set} accent={accent} tab={tab} />}
        {section.name === 'bio'         && <BioPanel         config={config as unknown as BioConfig}         set={set} accent={accent} tab={tab} />}
        {section.name === 'music'       && <MusicPanel       config={config as unknown as MusicConfig}       set={set} accent={accent} tab={tab} />}
        {section.name === 'community'   && <CommunityPanel   config={config as unknown as CommunityConfig}   set={set} accent={accent} tab={tab} />}
        {section.name === 'supporters'  && <SupportersPanel  config={config as unknown as SupportersConfig}  set={set} accent={accent} tab={tab} />}
        {section.name === 'releases'    && <ReleasesPanel    config={config as unknown as ReleasesConfig}    set={set} accent={accent} tab={tab} />}
        {section.name === 'live'        && <LivePanel        config={config as unknown as LiveConfig}        set={set} accent={accent} tab={tab} />}
        {section.name === 'gallery'     && <GalleryPanel     config={config as unknown as GalleryConfig}     set={set} accent={accent} tab={tab} />}
        {section.name === 'contact'     && <ContactPanel     config={config as unknown as ContactConfig}     set={set} accent={accent} tab={tab} />}
        {section.name === 'fan-capture' && <FanCapturePanel  config={config as unknown as FanCaptureConfig}  set={set} accent={accent} tab={tab} />}
      </div>

      {/* ── Save ── */}
      <div className="p-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={save} disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60 transition-all active:scale-[0.98]"
          style={{ background: accent }}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar sección'}
        </button>
      </div>
    </div>
  )
}

// ── Shared primitives ──────────────────────────────────────────

type Setter = <T>(key: string, value: T) => void

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-mono uppercase tracking-wider text-white/30">{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none transition-all"
      style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }} />
  )
}

function Toggle({ value, onChange, label, accent }: { value: boolean; onChange: (v: boolean) => void; label: string; accent: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-white/60">{label}</span>
      <button type="button" onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full transition-all relative shrink-0"
        style={{ background: value ? accent : 'rgba(255,255,255,0.1)' }}>
        <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
          style={{ left: value ? '22px' : '2px' }} />
      </button>
    </div>
  )
}

function SliderInput({ value, onChange, min = 0, max = 100, label }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1" />
        <span className="text-xs font-mono text-white/40 w-8 text-right">{value}</span>
      </div>
    </Field>
  )
}

function SmallInput({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`px-3 py-2 rounded-lg text-xs text-white placeholder-white/20 focus:outline-none ${className}`}
      style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }} />
  )
}

function EmptyTab({ label = 'Sin opciones para esta sección' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <p className="text-[11px] font-mono text-white/15 text-center">{label}</p>
    </div>
  )
}

// ── HERO ─────────────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  { platform: 'instagram',  label: 'Instagram',       abbr: 'IG' },
  { platform: 'soundcloud', label: 'SoundCloud',       abbr: 'SC' },
  { platform: 'spotify',    label: 'Spotify',          abbr: 'SP' },
  { platform: 'youtube',    label: 'YouTube',          abbr: 'YT' },
  { platform: 'beatport',   label: 'Beatport',         abbr: 'BP' },
  { platform: 'ra',         label: 'Resident Advisor', abbr: 'RA' },
  { platform: 'tiktok',     label: 'TikTok',           abbr: 'TK' },
  { platform: 'twitter',    label: 'X / Twitter',      abbr: 'X'  },
  { platform: 'bandcamp',   label: 'Bandcamp',         abbr: 'BC' },
]

const TICKER_SEPARATORS = ['·', '/', '—', '★', '|', '♦']

function HeroPanel({ config, set, accent, tab }: { config: HeroConfig; set: Setter; accent: string; tab: ConfigTab }) {
  const socials = config.socials ?? []

  const updateSocial = (i: number, field: keyof HeroSocialLink, val: unknown) =>
    set('socials', socials.map((s, j) => j === i ? { ...s, [field]: val } : s))

  const moveSocial = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= socials.length) return
    const next = [...socials]
    ;[next[i], next[j]] = [next[j], next[i]]
    set('socials', next.map((s, idx) => ({ ...s, sort_order: idx })))
  }

  const updatePrimary   = (field: string, val: unknown) =>
    set('cta_primary',   { ...(config.cta_primary   ?? {}), [field]: val })
  const updateSecondary = (field: string, val: unknown) =>
    set('cta_secondary', { ...(config.cta_secondary ?? {}), [field]: val })

  // ── Contenido ──────────────────────────────────────────────
  if (tab === 'content') return (
    <>
      <Field label="Tagline principal">
        <TextInput value={config.tagline ?? ''} onChange={v => set('tagline', v)} placeholder="Tu música. Tu mundo." />
      </Field>
      <Field label="Subtítulo">
        <TextInput value={config.sub_tagline ?? ''} onChange={v => set('sub_tagline', v)} placeholder="DJ · Productor · Live Act" />
      </Field>

      {/* Primary CTA */}
      <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/30">Botón Principal</span>
        <SmallInput value={config.cta_primary?.text ?? config.cta_text ?? ''}
          onChange={v => updatePrimary('text', v)} placeholder="Solicitar Booking" className="w-full" />
        <SmallInput value={config.cta_primary?.url ?? config.cta_url ?? ''}
          onChange={v => updatePrimary('url', v)} placeholder="#contact" className="w-full" />
        <CtaStylePicker value={config.cta_primary?.style ?? 'filled'} onChange={v => updatePrimary('style', v)} accent={accent} />
      </div>

      {/* Secondary CTA */}
      <div className="flex flex-col gap-2 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Toggle value={config.cta_secondary?.enabled ?? false}
          onChange={v => updateSecondary('enabled', v)} label="Botón Secundario" accent={accent} />
        {config.cta_secondary?.enabled && (
          <>
            <SmallInput value={config.cta_secondary?.text ?? ''} onChange={v => updateSecondary('text', v)} placeholder="Ver Música" className="w-full" />
            <SmallInput value={config.cta_secondary?.url ?? ''} onChange={v => updateSecondary('url', v)} placeholder="#music" className="w-full" />
            <CtaStylePicker value={config.cta_secondary?.style ?? 'outline'} onChange={v => updateSecondary('style', v)} accent={accent} />
          </>
        )}
      </div>

      {/* Ticker */}
      <Field label="Ticker de supporters">
        <TagInput value={config.supporters ?? []} onChange={v => set('supporters', v)} accentColor={accent} placeholder="Nombre del artista..." />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <SliderInput value={config.ticker_speed ?? 5} onChange={v => set('ticker_speed', v)} min={1} max={10} label={`Velocidad: ${config.ticker_speed ?? 5}`} />
        <Field label="Separador">
          <div className="flex gap-1.5 flex-wrap">
            {TICKER_SEPARATORS.map(sep => (
              <button key={sep} type="button" onClick={() => set('ticker_separator', sep)}
                className="w-8 h-8 rounded-lg text-sm transition-all"
                style={{
                  background: (config.ticker_separator ?? '·') === sep ? accent + '22' : 'rgba(255,255,255,0.04)',
                  color:      (config.ticker_separator ?? '·') === sep ? accent : 'rgba(255,255,255,0.4)',
                  border:     `1px solid ${(config.ticker_separator ?? '·') === sep ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
                }}>
                {sep}
              </button>
            ))}
          </div>
        </Field>
      </div>

      {/* Social links */}
      <Field label="Redes sociales">
        <div className="flex flex-col gap-1.5">
          {socials.map((social, i) => (
            <div key={social.id} className="flex items-center gap-2 p-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <button type="button" onClick={() => updateSocial(i, 'enabled', !social.enabled)}
                className="shrink-0 w-8 h-7 rounded-lg text-[9px] font-bold uppercase transition-all"
                style={{
                  background: social.enabled ? accent + '22' : 'rgba(255,255,255,0.04)',
                  color:      social.enabled ? accent : 'rgba(255,255,255,0.28)',
                  border:     `1px solid ${social.enabled ? accent + '38' : 'rgba(255,255,255,0.06)'}`,
                }}>
                {SOCIAL_PLATFORMS.find(p => p.platform === social.platform)?.abbr ?? '??'}
              </button>
              <SmallInput value={social.url} onChange={v => updateSocial(i, 'url', v)}
                placeholder="https://..." className="flex-1 min-w-0" />
              <div className="flex flex-col gap-0.5 shrink-0">
                <button type="button" onClick={() => moveSocial(i, -1)} disabled={i === 0}
                  className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors p-0.5">
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button type="button" onClick={() => moveSocial(i, 1)} disabled={i === socials.length - 1}
                  className="text-white/20 hover:text-white/60 disabled:opacity-20 transition-colors p-0.5">
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Field>
    </>
  )

  // ── Diseño ─────────────────────────────────────────────────
  if (tab === 'design') {
    const bgType = config.video_url ? 'video' : config.bg_image ? 'image' : 'none'
    return (
      <>
        <Field label="Layout">
          <div className="grid grid-cols-2 gap-1.5">
            {([
              { key: 'centered', label: 'Centrado'   },
              { key: 'left',     label: 'Izquierda'  },
              { key: 'right',    label: 'Derecha'    },
              { key: 'split',    label: 'Split'      },
            ] as const).map(({ key, label }) => (
              <button key={key} type="button" onClick={() => set('layout', key)}
                className="py-2.5 px-3 rounded-xl text-xs font-mono transition-all text-left"
                style={{
                  background: (config.layout ?? 'centered') === key ? accent + '18' : 'rgba(255,255,255,0.03)',
                  color:      (config.layout ?? 'centered') === key ? accent : 'rgba(255,255,255,0.4)',
                  border:     `1px solid ${(config.layout ?? 'centered') === key ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
                }}>
                {label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Tipo de fondo">
          <div className="flex gap-1.5 mb-3">
            {([
              { k: 'none',  l: 'Ninguno' },
              { k: 'image', l: 'Imagen'  },
              { k: 'video', l: 'Video'   },
            ] as const).map(({ k, l }) => (
              <button key={k} type="button"
                onClick={() => {
                  if (k === 'none')  { set('bg_image', null); set('video_url', null) }
                  if (k === 'image') { set('video_url', null) }
                  if (k === 'video') { set('bg_image', null); set('video_url', '') }
                }}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-mono transition-all"
                style={{
                  background: bgType === k ? accent + '18' : 'rgba(255,255,255,0.03)',
                  color:      bgType === k ? accent : 'rgba(255,255,255,0.35)',
                  border:     `1px solid ${bgType === k ? accent + '35' : 'rgba(255,255,255,0.07)'}`,
                }}>
                {l}
              </button>
            ))}
          </div>

          {bgType === 'image' && (
            <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)}
              onRemove={() => set('bg_image', null)} folder="hero" aspect="16/9" accentColor={accent} />
          )}
          {bgType === 'video' && (
            <>
              <TextInput value={config.video_url ?? ''} onChange={v => set('video_url', v || null)}
                placeholder="YouTube, Vimeo o URL directa .mp4" />
              <p className="text-[9px] font-mono text-white/25 mt-1">Se detecta automáticamente el tipo de video</p>
              <div className="mt-2">
                <p className="text-[10px] font-mono uppercase tracking-wider text-white/30 mb-1.5">Imagen de fallback</p>
                <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)}
                  onRemove={() => set('bg_image', null)} folder="hero" aspect="16/9" accentColor={accent} />
              </div>
            </>
          )}
        </Field>

        <SliderInput
          value={Math.round((config.overlay_opacity ?? 0.5) * 100)}
          onChange={v => set('overlay_opacity', v / 100)} min={0} max={100}
          label={`Overlay: ${Math.round((config.overlay_opacity ?? 0.5) * 100)}%`}
        />
        <div className="flex flex-col gap-1">
          <Toggle value={config.parallax_bg      ?? true}  onChange={v => set('parallax_bg', v)}      label="Parallax en scroll"      accent={accent} />
          <Toggle value={config.ken_burns         ?? false} onChange={v => set('ken_burns', v)}         label="Ken Burns (zoom lento)"  accent={accent} />
          <Toggle value={config.gradient_animated ?? true}  onChange={v => set('gradient_animated', v)} label="Gradiente animado"       accent={accent} />
        </div>
      </>
    )
  }

  // ── Animación ──────────────────────────────────────────────
  return (
    <>
      <Field label="Animación de texto">
        <div className="grid grid-cols-3 gap-1.5">
          {([
            { key: 'fade',       label: 'Fade'       },
            { key: 'slide',      label: 'Slide up'   },
            { key: 'reveal',     label: 'Reveal'     },
            { key: 'typewriter', label: 'Typewriter' },
            { key: 'glitch',     label: 'Glitch'     },
          ] as const).map(({ key, label }) => (
            <button key={key} type="button" onClick={() => set('text_animation', key)}
              className="py-2 rounded-xl text-[10px] font-mono transition-all"
              style={{
                background: (config.text_animation ?? 'slide') === key ? accent + '20' : 'rgba(255,255,255,0.03)',
                color:      (config.text_animation ?? 'slide') === key ? accent : 'rgba(255,255,255,0.4)',
                border:     `1px solid ${(config.text_animation ?? 'slide') === key ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
              }}>
              {label}
            </button>
          ))}
        </div>
      </Field>

      {/* Three.js */}
      <div className="flex flex-col gap-2.5 p-3 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <Toggle value={config.three_bg ?? false} onChange={v => set('three_bg', v)} label="Three.js activo" accent={accent} />
        {config.three_bg && (
          <>
            <Field label="Efecto">
              <div className="flex flex-col gap-1.5">
                {([
                  { key: 'particles',  label: 'Partículas 3D',      desc: 'Nube de puntos flotantes'  },
                  { key: 'waves',      label: 'Ondas geométricas',   desc: 'Malla wireframe animada'   },
                  { key: 'volumetric', label: 'Luz volumétrica',     desc: 'Rayos de luz con niebla'   },
                ] as const).map(({ key, label, desc }) => {
                  const active = (config.three_effect ?? 'particles') === key
                  return (
                    <button key={key} type="button" onClick={() => set('three_effect', key)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all"
                      style={{
                        background: active ? accent + '16' : 'rgba(255,255,255,0.02)',
                        border:     `1px solid ${active ? accent + '35' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <span className="w-2 h-2 rounded-full shrink-0 mt-0.5"
                        style={{ background: active ? accent : 'rgba(255,255,255,0.15)' }} />
                      <span>
                        <span className="block text-[11px] font-medium" style={{ color: active ? accent : 'rgba(255,255,255,0.6)' }}>{label}</span>
                        <span className="block text-[9px] font-mono text-white/25 mt-0.5">{desc}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </Field>
            <SliderInput value={config.three_intensity ?? 50} onChange={v => set('three_intensity', v)}
              min={10} max={100} label={`Intensidad: ${config.three_intensity ?? 50}%`} />
          </>
        )}
      </div>

      {!config.three_bg && (
        <div className="flex flex-col gap-1">
          <Toggle value={config.particles ?? true} onChange={v => set('particles', v)} label="Partículas canvas (ligero)" accent={accent} />
          {config.particles && (
            <SliderInput value={config.particles_density ?? 60} onChange={v => set('particles_density', v)}
              min={20} max={120} label={`Densidad: ${config.particles_density ?? 60}`} />
          )}
        </div>
      )}

      <div className="flex flex-col gap-1 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Toggle value={config.show_socials ?? true} onChange={v => set('show_socials', v)} label="Mostrar redes sociales" accent={accent} />
        <Toggle value={config.show_scroll  ?? true} onChange={v => set('show_scroll', v)}  label="Indicador de scroll"    accent={accent} />
      </div>
    </>
  )
}

function CtaStylePicker({ value, onChange, accent }: { value: string; onChange: (v: string) => void; accent: string }) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {(['filled', 'outline', 'ghost'] as const).map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className="py-1.5 rounded-lg text-[10px] font-mono transition-all"
          style={{
            background: value === s ? accent + '20' : 'rgba(255,255,255,0.03)',
            color:      value === s ? accent : 'rgba(255,255,255,0.35)',
            border:     `1px solid ${value === s ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
          }}>
          {s === 'filled' ? 'Relleno' : s === 'outline' ? 'Borde' : 'Ghost'}
        </button>
      ))}
    </div>
  )
}

// ── BIO ──────────────────────────────────────────────────────

function BioPanel({ config, set, accent, tab }: { config: BioConfig; set: Setter; accent: string; tab: ConfigTab }) {
  if (tab === 'content') return (
    <>
      <Field label="Biografía">
        <RichTextEditor value={config.text ?? ''} onChange={v => set('text', v)} accentColor={accent} placeholder="Escribe tu historia..." />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ciudad"><TextInput value={config.city} onChange={v => set('city', v)} placeholder="Madrid" /></Field>
        <Field label="País"><TextInput value={config.country} onChange={v => set('country', v)} placeholder="España" /></Field>
      </div>
      <Field label="Géneros">
        <TagInput value={config.genres ?? []} onChange={v => set('genres', v)} accentColor={accent} placeholder="Techno, House..." />
      </Field>
      <Field label="Badges">
        <TagInput value={config.badges ?? []} onChange={v => set('badges', v)} accentColor={accent} placeholder="Independent, International..." />
      </Field>
      <Field label="Estadísticas">
        <StatsList stats={config.stats ?? []} onChange={v => set('stats', v)} accent={accent} />
      </Field>
    </>
  )

  if (tab === 'design') return (
    <>
      <Field label="Imagen de fondo">
        <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)} onRemove={() => set('bg_image', null)}
          folder="hero" aspect="16/9" accentColor={accent} />
      </Field>
      <SliderInput value={Math.round((config.overlay_opacity ?? 0.7) * 100)} onChange={v => set('overlay_opacity', v / 100)} min={0} max={100} label={`Opacidad overlay: ${Math.round((config.overlay_opacity ?? 0.7) * 100)}%`} />
    </>
  )

  return (
    <Toggle value={config.parallax ?? true} onChange={v => set('parallax', v)} label="Efecto parallax en scroll" accent={accent} />
  )
}

function StatsList({ stats, onChange, accent }: { stats: { label: string; value: string }[]; onChange: (v: { label: string; value: string }[]) => void; accent: string }) {
  const update = (i: number, field: 'label' | 'value', val: string) => {
    onChange(stats.map((s, j) => j === i ? { ...s, [field]: val } : s))
  }
  return (
    <div className="flex flex-col gap-2">
      {stats.map((s, i) => (
        <div key={i} className="flex gap-2 items-center">
          <SmallInput value={s.value} onChange={v => update(i, 'value', v)} placeholder="50+" className="w-20" />
          <SmallInput value={s.label} onChange={v => update(i, 'label', v)} placeholder="Shows" className="flex-1" />
          <button type="button" onClick={() => onChange(stats.filter((_, j) => j !== i))} className="p-2 text-white/20 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...stats, { label: '', value: '' }])}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-white/30 hover:text-white/60 transition-all"
        style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
        <Plus className="w-3 h-3" /> Añadir stat
      </button>
    </div>
  )
}

// ── MUSIC ────────────────────────────────────────────────────

function MusicPanel({ config, set, accent, tab }: { config: MusicConfig; set: Setter; accent: string; tab: ConfigTab }) {
  const tracks = config.tracks ?? []
  const update = (i: number, field: string, val: string) => {
    set('tracks', tracks.map((t, j) => j === i ? { ...t, [field]: val } : t))
  }

  if (tab === 'content') return (
    <>
      <Field label="Título de sección">
        <TextInput value={config.section_title ?? 'Música'} onChange={v => set('section_title', v)} />
      </Field>
      <Field label="Tracks">
        <div className="flex flex-col gap-2">
          {tracks.map((t, i) => (
            <div key={t.id} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <select value={t.platform} onChange={e => update(i, 'platform', e.target.value)}
                  className="text-xs font-mono bg-transparent text-white/50 focus:outline-none">
                  {['youtube', 'soundcloud', 'spotify', 'bandcamp'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <button type="button" onClick={() => set('tracks', tracks.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <SmallInput value={t.title} onChange={v => update(i, 'title', v)} placeholder="Título del track" className="w-full" />
              <SmallInput value={t.url} onChange={v => update(i, 'url', v)} placeholder="URL del track" className="w-full" />
            </div>
          ))}
          <button type="button"
            onClick={() => set('tracks', [...tracks, { id: Date.now().toString(), platform: 'youtube', url: '', title: '', cover: null }])}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-white/30 hover:text-white/60 transition-all"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Plus className="w-3 h-3" /> Añadir track
          </button>
        </div>
      </Field>
    </>
  )

  if (tab === 'design') return (
    <Field label="Layout">
      <div className="grid grid-cols-3 gap-1.5">
        {(['2col', '3col', 'list'] as const).map(l => (
          <button key={l} type="button" onClick={() => set('layout', l)}
            className="py-2 rounded-xl text-xs font-mono transition-all"
            style={{
              background:   config.layout === l ? accent + '20' : 'rgba(255,255,255,0.03)',
              color:        config.layout === l ? accent : 'rgba(255,255,255,0.4)',
              border:       `1px solid ${config.layout === l ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
            }}>
            {l}
          </button>
        ))}
      </div>
    </Field>
  )

  return (
    <Toggle value={config.audio_visualizer ?? false} onChange={v => set('audio_visualizer', v)} label="Visualizador de audio" accent={accent} />
  )
}

// ── COMMUNITY ────────────────────────────────────────────────

function CommunityPanel({ config, set, accent, tab }: { config: CommunityConfig; set: Setter; accent: string; tab: ConfigTab }) {
  const platforms = config.platforms ?? []
  const update = (i: number, field: string, val: string) => {
    set('platforms', platforms.map((p, j) => j === i ? { ...p, [field]: val } : p))
  }

  if (tab === 'content') return (
    <>
      <Field label="Título"><TextInput value={config.section_title ?? 'Comunidad'} onChange={v => set('section_title', v)} /></Field>
      <Field label="Alcance total"><TextInput value={config.total_reach ?? ''} onChange={v => set('total_reach', v)} placeholder="50K" /></Field>
      <Field label="Plataformas">
        <div className="flex flex-col gap-2">
          {platforms.map((p, i) => (
            <div key={p.id} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="grid grid-cols-2 gap-2">
                <SmallInput value={p.name} onChange={v => update(i, 'name', v)} placeholder="Instagram" className="w-full" />
                <SmallInput value={p.count} onChange={v => update(i, 'count', v)} placeholder="10K" className="w-full" />
              </div>
              <SmallInput value={p.handle} onChange={v => update(i, 'handle', v)} placeholder="@tuartista" className="w-full" />
              <SmallInput value={p.url} onChange={v => update(i, 'url', v)} placeholder="https://..." className="w-full" />
              <button type="button" onClick={() => set('platforms', platforms.filter((_, j) => j !== i))} className="self-end text-white/20 hover:text-red-400 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button type="button"
            onClick={() => set('platforms', [...platforms, { id: Date.now().toString(), name: '', handle: '', count: '', url: '', icon: '' }])}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-white/30 hover:text-white/60 transition-all"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Plus className="w-3 h-3" /> Añadir plataforma
          </button>
        </div>
      </Field>
    </>
  )

  if (tab === 'design') return <EmptyTab />

  return (
    <Toggle value={config.count_up_animation ?? true} onChange={v => set('count_up_animation', v)} label="Animación de conteo" accent={accent} />
  )
}

// ── SUPPORTERS ───────────────────────────────────────────────

function SupportersPanel({ config, set, accent, tab }: { config: SupportersConfig; set: Setter; accent: string; tab: ConfigTab }) {
  if (tab === 'content') return (
    <>
      <Field label="Título"><TextInput value={config.section_title ?? 'Apoyado por'} onChange={v => set('section_title', v)} /></Field>
      <Field label="Nombres para el ticker">
        <TagInput value={config.ticker_names ?? []} onChange={v => set('ticker_names', v)} accentColor={accent} placeholder="Nombre del artista..." />
      </Field>
    </>
  )

  return <EmptyTab />
}

// ── RELEASES ─────────────────────────────────────────────────

function ReleasesPanel({ config, set, accent, tab }: { config: ReleasesConfig; set: Setter; accent: string; tab: ConfigTab }) {
  const releases = config.releases ?? []
  const update = (i: number, field: string, val: string | null) => {
    set('releases', releases.map((r, j) => j === i ? { ...r, [field]: val } : r))
  }

  if (tab === 'content') return (
    <>
      <Field label="Título"><TextInput value={config.section_title ?? 'Discografía'} onChange={v => set('section_title', v)} /></Field>
      <Field label="Lanzamientos">
        <div className="flex flex-col gap-3">
          {releases.map((r, i) => (
            <div key={r.id} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-white/30">Release #{i + 1}</span>
                <button type="button" onClick={() => set('releases', releases.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="max-w-[100px]">
                <ImageUpload value={r.cover} onChange={url => update(i, 'cover', url)} onRemove={() => update(i, 'cover', null)}
                  folder="releases" aspect="1/1" accentColor={accent} />
              </div>
              <SmallInput value={r.title} onChange={v => update(i, 'title', v)} placeholder="Título" className="w-full" />
              <div className="grid grid-cols-2 gap-2">
                <SmallInput value={r.label} onChange={v => update(i, 'label', v)} placeholder="Sello" className="w-full" />
                <SmallInput value={r.year} onChange={v => update(i, 'year', v)} placeholder="2024" className="w-full" />
              </div>
              <SmallInput value={r.spotify_url} onChange={v => update(i, 'spotify_url', v)} placeholder="Spotify URL" className="w-full" />
              <SmallInput value={r.beatport_url} onChange={v => update(i, 'beatport_url', v)} placeholder="Beatport URL" className="w-full" />
            </div>
          ))}
          <button type="button"
            onClick={() => set('releases', [...releases, { id: Date.now().toString(), title: '', label: '', cover: null, spotify_url: '', beatport_url: '', year: new Date().getFullYear().toString() }])}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-white/30 hover:text-white/60 transition-all"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Plus className="w-3 h-3" /> Añadir lanzamiento
          </button>
        </div>
      </Field>
    </>
  )

  return <EmptyTab />
}

// ── LIVE ─────────────────────────────────────────────────────

function LivePanel({ config, set, accent, tab }: { config: LiveConfig; set: Setter; accent: string; tab: ConfigTab }) {
  const venues = config.venues ?? []
  const update = (i: number, field: string, val: string) => {
    set('venues', venues.map((v, j) => j === i ? { ...v, [field]: val } : v))
  }

  if (tab === 'content') return (
    <>
      <Field label="Título"><TextInput value={config.section_title ?? 'En vivo'} onChange={v => set('section_title', v)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Total shows"><TextInput value={config.total_shows ?? ''} onChange={v => set('total_shows', v)} placeholder="50+" /></Field>
        <Field label="Países"><TextInput value={config.countries_count ?? ''} onChange={v => set('countries_count', v)} placeholder="8" /></Field>
      </div>
      <Field label="Texto CTA"><TextInput value={config.cta_text ?? ''} onChange={v => set('cta_text', v)} placeholder="Sé el próximo" /></Field>
      <Field label="URL CTA"><TextInput value={config.cta_url ?? ''} onChange={v => set('cta_url', v)} placeholder="#contact" /></Field>
      <Field label="Shows / venues">
        <div className="flex flex-col gap-2">
          {venues.map((v, i) => (
            <div key={v.id} className="p-3 rounded-xl flex flex-col gap-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-white/30">Venue #{i + 1}</span>
                <button type="button" onClick={() => set('venues', venues.filter((_, j) => j !== i))} className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <SmallInput value={v.name} onChange={v2 => update(i, 'name', v2)} placeholder="Nombre del venue" className="w-full" />
              <div className="grid grid-cols-2 gap-2">
                <SmallInput value={v.city} onChange={v2 => update(i, 'city', v2)} placeholder="Ciudad" className="w-full" />
                <SmallInput value={v.country} onChange={v2 => update(i, 'country', v2)} placeholder="País" className="w-full" />
              </div>
              <input type="date" value={v.date} onChange={e => update(i, 'date', e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-xs text-white focus:outline-none"
                style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
          ))}
          <button type="button"
            onClick={() => set('venues', [...venues, { id: Date.now().toString(), name: '', city: '', country: '', lat: null, lng: null, instagram: '', date: '' }])}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-white/30 hover:text-white/60 transition-all"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Plus className="w-3 h-3" /> Añadir venue
          </button>
        </div>
      </Field>
    </>
  )

  return <EmptyTab />
}

// ── CONTACT ──────────────────────────────────────────────────

function ContactPanel({ config, set, accent, tab }: { config: ContactConfig; set: Setter; accent: string; tab: ConfigTab }) {
  if (tab === 'content') return (
    <>
      <Field label="Título"><TextInput value={config.section_title ?? 'Contacto'} onChange={v => set('section_title', v)} /></Field>
      <Field label="Tiempo de respuesta"><TextInput value={config.response_time ?? ''} onChange={v => set('response_time', v)} placeholder="24-48 horas" /></Field>
      <Field label="Disponibilidad"><TextInput value={config.availability ?? ''} onChange={v => set('availability', v)} placeholder="Fechas disponibles Q2-Q3 2026" /></Field>
      <Field label="Texto botón"><TextInput value={config.cta_text ?? ''} onChange={v => set('cta_text', v)} placeholder="Solicitar Booking" /></Field>
      <Field label="URL de booking"><TextInput value={config.cta_url ?? ''} onChange={v => set('cta_url', v)} type="url" placeholder="https://..." /></Field>
      <Toggle value={config.show_rider ?? false} onChange={v => set('show_rider', v)} label="Mostrar rider técnico" accent={accent} />
    </>
  )

  if (tab === 'design') return (
    <Field label="Imagen de fondo">
      <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)} onRemove={() => set('bg_image', null)}
        folder="hero" aspect="16/9" accentColor={accent} />
    </Field>
  )

  return <EmptyTab />
}

// ── FAN CAPTURE ──────────────────────────────────────────────

function FanCapturePanel({ config, set, accent, tab }: { config: FanCaptureConfig; set: Setter; accent: string; tab: ConfigTab }) {
  if (tab === 'content') return (
    <>
      <Field label="Título"><TextInput value={config.section_title ?? ''} onChange={v => set('section_title', v)} /></Field>
      <Field label="Subtítulo"><TextInput value={config.subtitle ?? ''} onChange={v => set('subtitle', v)} /></Field>
      <Field label="Texto del botón"><TextInput value={config.button_text ?? ''} onChange={v => set('button_text', v)} /></Field>
      <Field label="Texto de privacidad"><TextInput value={config.privacy_text ?? ''} onChange={v => set('privacy_text', v)} placeholder="Sin spam. Solo buena música." /></Field>
    </>
  )

  if (tab === 'design') return (
    <Field label="Imagen de fondo">
      <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)} onRemove={() => set('bg_image', null)}
        folder="hero" aspect="16/9" accentColor={accent} />
    </Field>
  )

  return <EmptyTab />
}

// ── GALLERY ──────────────────────────────────────────────────

function GalleryPanel({ config, set, accent, tab }: { config: GalleryConfig; set: Setter; accent: string; tab: ConfigTab }) {
  const images = config.images ?? []

  if (tab === 'content') return (
    <>
      <Field label="Título de sección">
        <TextInput value={config.section_title ?? 'Galería'} onChange={v => set('section_title', v)} />
      </Field>
      <Field label={`Fotos (${images.length})`}>
        <div className="flex flex-col gap-3">
          {images.map((img, i) => (
            <div key={img.id} className="p-3 rounded-xl flex flex-col gap-2"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-white/30">Foto #{i + 1}</span>
                <button type="button"
                  onClick={() => set('images', images.filter((_, j) => j !== i))}
                  className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <ImageUpload
                value={img.url || null}
                onChange={url => set('images', images.map((im, j) => j === i ? { ...im, url } : im))}
                onRemove={() => set('images', images.map((im, j) => j === i ? { ...im, url: '' } : im))}
                folder="gallery" aspect="1/1" accentColor={accent}
              />
              <SmallInput
                value={img.caption}
                onChange={v => set('images', images.map((im, j) => j === i ? { ...im, caption: v } : im))}
                placeholder="Descripción opcional..." className="w-full"
              />
            </div>
          ))}
          <button type="button"
            onClick={() => set('images', [...images, { id: Date.now().toString(), url: '', caption: '' }])}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-white/30 hover:text-white/60 transition-all"
            style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <Plus className="w-3 h-3" /> Añadir foto
          </button>
        </div>
      </Field>
    </>
  )

  if (tab === 'design') return (
    <>
      <Field label="Columnas">
        <div className="grid grid-cols-3 gap-1.5">
          {([2, 3, 4] as const).map(n => (
            <button key={n} type="button" onClick={() => set('columns', n)}
              className="py-2 rounded-xl text-xs font-mono transition-all"
              style={{
                background:   (config.columns ?? 3) === n ? accent + '20' : 'rgba(255,255,255,0.03)',
                color:        (config.columns ?? 3) === n ? accent : 'rgba(255,255,255,0.4)',
                border:       `1px solid ${(config.columns ?? 3) === n ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
              }}>
              {n} col
            </button>
          ))}
        </div>
      </Field>
      <Field label="Imagen de fondo (opcional)">
        <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)} onRemove={() => set('bg_image', null)}
          folder="hero" aspect="16/9" accentColor={accent} />
      </Field>
      <SliderInput value={Math.round((config.overlay_opacity ?? 0.6) * 100)} onChange={v => set('overlay_opacity', v / 100)} min={0} max={100} label={`Opacidad overlay: ${Math.round((config.overlay_opacity ?? 0.6) * 100)}%`} />
    </>
  )

  return <EmptyTab />
}
