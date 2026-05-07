'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import ImageUpload from '@/components/shared/ImageUpload'
import TagInput from '@/components/shared/TagInput'
import type { HeroConfig, HeroSocialLink, HeroLayoutVariant } from '@/types/sections'

// ── Shared primitives ─────────────────────────────────────────────
type Setter = <T>(key: string, value: T) => void

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-mono uppercase tracking-wider text-white/30">{label}</label>
      {children}
      {hint && <p className="text-[9px] font-mono text-white/20">{hint}</p>}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-3 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none min-h-[44px]"
      style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }} />
  )
}

function SmallInput({ value, onChange, placeholder, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string
}) {
  return (
    <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className={`px-3 py-2.5 rounded-lg text-xs text-white placeholder-white/20 focus:outline-none min-h-[40px] ${className}`}
      style={{ background: '#0A0A0E', border: '1px solid rgba(255,255,255,0.08)' }} />
  )
}

function Toggle({ value, onChange, label, accent }: {
  value: boolean; onChange: (v: boolean) => void; label: string; accent: string
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-white/60">{label}</span>
      <button type="button" onClick={() => onChange(!value)}
        className="w-12 h-7 rounded-full transition-all relative shrink-0"
        style={{ background: value ? accent : 'rgba(255,255,255,0.1)' }}>
        <span className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all"
          style={{ left: value ? '22px' : '2px' }} />
      </button>
    </div>
  )
}

function Slider({ value, onChange, min = 0, max = 100, label, unit = '' }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; unit?: string
}) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-current" style={{ accentColor: 'inherit' }} />
        <span className="text-[11px] font-mono text-white/40 w-12 text-right shrink-0">{value}{unit}</span>
      </div>
    </Field>
  )
}

function ColorPicker({ value, onChange, label, accent }: {
  value: string; onChange: (v: string) => void; label: string; accent: string
}) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-xl"
      style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="relative w-7 h-7 rounded-lg overflow-hidden shrink-0">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="absolute inset-0 w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer opacity-0" />
        <div className="w-full h-full rounded-lg" style={{ background: value }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono truncate" style={{ color: accent }}>{value.toUpperCase()}</p>
        <p className="text-[9px] text-white/20">{label}</p>
      </div>
    </div>
  )
}

function Pills<T extends string>({ options, value, onChange, accent }: {
  options: { key: T; label: string }[]; value: T; onChange: (v: T) => void; accent: string
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(({ key, label }) => (
        <button key={key} type="button" onClick={() => onChange(key)}
          className="px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all"
          style={{
            background: value === key ? accent + '20' : 'rgba(255,255,255,0.04)',
            color:      value === key ? accent : 'rgba(255,255,255,0.35)',
            border:     `1px solid ${value === key ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
          }}>
          {label}
        </button>
      ))}
    </div>
  )
}

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between py-2 px-0.5 text-[10px] font-mono uppercase tracking-wider text-white/25 hover:text-white/50 transition-colors">
        {title}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
            className="overflow-hidden">
            <div className="flex flex-col gap-4 pb-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Layout thumbnails ─────────────────────────────────────────────
const HERO_LAYOUTS: { key: HeroLayoutVariant; label: string; desc: string }[] = [
  { key: 'fullscreen-centered', label: 'Full Screen',     desc: 'Contenido centrado' },
  { key: 'split',               label: 'Split Screen',    desc: 'Foto + texto' },
  { key: 'minimal-dark',        label: 'Minimal Dark',    desc: 'Solo tipografía' },
  { key: 'cinematic',           label: 'Cinematic',       desc: 'Video en primer plano' },
  { key: 'overlay-portrait',    label: 'Portrait',        desc: 'Artista emergiendo' },
  { key: 'magazine',            label: 'Magazine',        desc: 'Estilo revista' },
  { key: 'immersive-3d',        label: 'Immersive 3D',   desc: 'Efecto Three.js' },
]

function LayoutThumbHero({ variant, color, active }: { variant: HeroLayoutVariant; color: string; active: boolean }) {
  const c = active ? color : 'rgba(255,255,255,0.3)'
  const bg = '#0a0a0f'
  return (
    <svg viewBox="0 0 64 40" fill="none" className="w-full h-auto">
      <rect width="64" height="40" rx="3" fill={bg} />
      {variant === 'fullscreen-centered' && (
        <>
          <rect x="0" y="0" width="64" height="40" rx="3" fill={active ? color + '18' : 'transparent'} />
          <circle cx="32" cy="14" r="5" fill={c} opacity="0.4" />
          <rect x="18" y="23" width="28" height="3" rx="1.5" fill={c} opacity="0.7" />
          <rect x="22" y="29" width="20" height="2" rx="1" fill={c} opacity="0.3" />
        </>
      )}
      {variant === 'split' && (
        <>
          <rect x="0" y="0" width="31" height="40" rx="0" fill={active ? color + '20' : 'rgba(255,255,255,0.04)'} />
          <circle cx="16" cy="20" r="8" fill={c} opacity="0.25" />
          <line x1="33" y1="0" x2="33" y2="40" stroke={c} strokeOpacity="0.2" />
          <rect x="37" y="14" width="20" height="3" rx="1.5" fill={c} opacity="0.7" />
          <rect x="37" y="21" width="14" height="2" rx="1" fill={c} opacity="0.35" />
          <rect x="37" y="28" width="16" height="4" rx="2" fill={c} opacity="0.5" />
        </>
      )}
      {variant === 'minimal-dark' && (
        <>
          <rect x="4" y="8" width="56" height="10" rx="2" fill={c} opacity="0.65" />
          <rect x="10" y="23" width="44" height="5" rx="1.5" fill={c} opacity="0.2" />
          <rect x="20" y="31" width="24" height="3" rx="1.5" fill={c} opacity="0.15" />
        </>
      )}
      {variant === 'cinematic' && (
        <>
          <rect x="0" y="0" width="64" height="40" rx="3" fill={active ? color + '12' : 'rgba(255,255,255,0.03)'} />
          <rect x="2" y="2" width="60" height="4" rx="1" fill="rgba(0,0,0,0.6)" />
          <rect x="2" y="34" width="60" height="4" rx="1" fill="rgba(0,0,0,0.6)" />
          <rect x="12" y="22" width="40" height="3" rx="1.5" fill={c} opacity="0.7" />
          <rect x="18" y="27" width="28" height="2" rx="1" fill={c} opacity="0.3" />
        </>
      )}
      {variant === 'overlay-portrait' && (
        <>
          <rect x="14" y="2" width="36" height="36" rx="2" fill={active ? color + '15' : 'rgba(255,255,255,0.05)'} />
          <rect x="0" y="0" width="64" height="40" rx="3"
            fill={`url(#vgn-${active ? 'a' : 'b'})`} opacity="0.7" />
          <defs>
            <linearGradient id={`vgn-a`} x1="0" y1="1" x2="0" y2="0">
              <stop stopColor={color} stopOpacity="0.6" />
              <stop offset="0.5" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`vgn-b`} x1="0" y1="1" x2="0" y2="0">
              <stop stopColor="rgba(255,255,255,0.15)" />
              <stop offset="0.5" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>
          <rect x="8" y="28" width="28" height="3" rx="1.5" fill={c} opacity="0.8" />
          <rect x="8" y="34" width="18" height="2" rx="1" fill={c} opacity="0.35" />
        </>
      )}
      {variant === 'magazine' && (
        <>
          <rect x="0" y="0" width="34" height="40" rx="0" fill={active ? color + '18' : 'rgba(255,255,255,0.04)'} />
          <line x1="36" y1="0" x2="36" y2="40" stroke={c} strokeOpacity="0.25" strokeWidth="0.5" />
          <rect x="38" y="6" width="5" height="1.5" rx="0.5" fill={c} opacity="0.4" />
          <rect x="38" y="10" width="20" height="4" rx="1" fill={c} opacity="0.7" />
          <rect x="38" y="17" width="14" height="2" rx="1" fill={c} opacity="0.35" />
          <rect x="38" y="22" width="18" height="1.5" rx="0.5" fill="white" opacity="0.1" />
          <rect x="38" y="25.5" width="15" height="1.5" rx="0.5" fill="white" opacity="0.1" />
          <rect x="38" y="32" width="16" height="4" rx="2" fill={c} opacity="0.5" />
        </>
      )}
      {variant === 'immersive-3d' && (
        <>
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={8 + i * 7} cy={12 + (i % 3) * 8} r="1.5" fill={c} opacity={0.15 + i * 0.08} />
          ))}
          <line x1="8" y1="12" x2="22" y2="20" stroke={c} strokeOpacity="0.12" strokeWidth="0.5" />
          <line x1="22" y1="20" x2="36" y2="12" stroke={c} strokeOpacity="0.12" strokeWidth="0.5" />
          <line x1="36" y1="12" x2="50" y2="28" stroke={c} strokeOpacity="0.12" strokeWidth="0.5" />
          <rect x="10" y="28" width="44" height="3" rx="1.5" fill={c} opacity="0.65" />
        </>
      )}
    </svg>
  )
}

// ── Social platforms ──────────────────────────────────────────────
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

// ── CTA style picker ──────────────────────────────────────────────
function CtaStylePicker({ value, onChange, accent }: { value: string; onChange: (v: string) => void; accent: string }) {
  return (
    <Pills
      options={[{ key: 'filled', label: 'Relleno' }, { key: 'outline', label: 'Borde' }, { key: 'ghost', label: 'Ghost' }]}
      value={value as 'filled' | 'outline' | 'ghost'}
      onChange={onChange as (v: 'filled' | 'outline' | 'ghost') => void}
      accent={accent}
    />
  )
}

// ═══════════════════════════════════════════════
// Main HeroEditorPanel
// ═══════════════════════════════════════════════
type HeroTab = 'layout' | 'content' | 'bg' | 'text' | 'fx' | 'extras'

interface Props {
  config:          HeroConfig
  set:             Setter
  accent:          string
}

export default function HeroEditorPanel({ config, set, accent }: Props) {
  const [tab, setTab] = useState<HeroTab>('layout')

  const heroLayout     = config.hero_layout ?? 'fullscreen-centered'
  const bgType         = config.bg_type ?? (config.video_url ? 'video' : config.bg_image ? 'image' : 'none')
  const socials        = config.socials ?? []
  const textEffect     = config.text_effect ?? 'none'
  const scrollStyle    = config.scroll_indicator_style ?? 'line'

  const updateSocial = (i: number, field: keyof HeroSocialLink, val: unknown) =>
    set('socials', socials.map((s, j) => j === i ? { ...s, [field]: val } : s))

  const updatePrimary   = (field: string, val: unknown) =>
    set('cta_primary',   { ...(config.cta_primary   ?? {}), [field]: val })
  const updateSecondary = (field: string, val: unknown) =>
    set('cta_secondary', { ...(config.cta_secondary ?? {}), [field]: val })

  const TABS: { id: HeroTab; label: string }[] = [
    { id: 'layout',  label: 'Layout' },
    { id: 'content', label: 'Cont.'  },
    { id: 'bg',      label: 'Fondo'  },
    { id: 'text',    label: 'Texto'  },
    { id: 'fx',      label: 'FX'     },
    { id: 'extras',  label: '+'      },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex shrink-0 border-b border-white/[0.05] overflow-x-auto" style={{ background: '#0A0A0E' }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            className="flex-1 min-w-[42px] py-2.5 text-[10px] font-mono uppercase tracking-wider transition-all relative whitespace-nowrap"
            style={{ color: tab === id ? accent : 'rgba(255,255,255,0.22)' }}>
            {label}
            {tab === id && (
              <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full" style={{ background: accent }} />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">

        {/* ── LAYOUT ── */}
        {tab === 'layout' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              {HERO_LAYOUTS.map(({ key, label, desc }) => {
                const active = heroLayout === key
                return (
                  <button key={key} type="button" onClick={() => set('hero_layout', key)}
                    className="flex flex-col gap-1.5 p-2 rounded-xl border text-left transition-all"
                    style={{
                      borderColor:     active ? accent : 'rgba(255,255,255,0.07)',
                      backgroundColor: active ? accent + '0E' : 'rgba(255,255,255,0.02)',
                      boxShadow:       active ? `0 0 16px ${accent}18` : 'none',
                    }}>
                    <LayoutThumbHero variant={key} color={accent} active={active} />
                    <div>
                      <p className="text-[10px] font-semibold leading-tight" style={{ color: active ? accent : 'rgba(255,255,255,0.55)' }}>
                        {label}
                      </p>
                      <p className="text-[8px] font-mono mt-0.5" style={{ color: active ? accent + 'AA' : 'rgba(255,255,255,0.2)' }}>
                        {desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Split photo side */}
            {(heroLayout === 'split' || heroLayout === 'magazine' || heroLayout === 'overlay-portrait') && (
              <Field label="Posición de la foto">
                <Pills
                  options={[{ key: 'left', label: 'Izquierda' }, { key: 'right', label: 'Derecha' }]}
                  value={config.split_photo_side ?? 'left'}
                  onChange={v => set('split_photo_side', v)}
                  accent={accent}
                />
              </Field>
            )}

            {/* Alignment */}
            <Field label="Alineación del texto">
              <Pills
                options={[{ key: 'left', label: 'Izq' }, { key: 'center', label: 'Centro' }, { key: 'right', label: 'Der' }]}
                value={config.text_align ?? 'center'}
                onChange={v => set('text_align', v)}
                accent={accent}
              />
            </Field>

            {/* Vertical padding */}
            <Slider
              value={config.content_padding_y ?? 0}
              onChange={v => set('content_padding_y', v)}
              min={0} max={120}
              label="Espacio vertical extra"
              unit="px"
            />
          </>
        )}

        {/* ── CONTENT ── */}
        {tab === 'content' && (
          <>
            <Field label="Tagline principal">
              <TextInput value={config.tagline ?? ''} onChange={v => set('tagline', v)} placeholder="Tu música. Tu mundo." />
            </Field>
            <Field label="Subtítulo">
              <TextInput value={config.sub_tagline ?? ''} onChange={v => set('sub_tagline', v)} placeholder="DJ · Productor · Live Act" />
            </Field>

            {/* Primary CTA */}
            <Section title="Botón Principal">
              <SmallInput value={config.cta_primary?.text ?? ''} onChange={v => updatePrimary('text', v)} placeholder="Solicitar Booking" className="w-full" />
              <SmallInput value={config.cta_primary?.url ?? ''} onChange={v => updatePrimary('url', v)} placeholder="#contact" className="w-full" />
              <CtaStylePicker value={config.cta_primary?.style ?? 'filled'} onChange={v => updatePrimary('style', v)} accent={accent} />
            </Section>

            {/* Secondary CTA */}
            <Section title="Botón Secundario" defaultOpen={false}>
              <Toggle value={config.cta_secondary?.enabled ?? false}
                onChange={v => updateSecondary('enabled', v)} label="Mostrar botón secundario" accent={accent} />
              {config.cta_secondary?.enabled && (
                <>
                  <SmallInput value={config.cta_secondary?.text ?? ''} onChange={v => updateSecondary('text', v)} placeholder="Ver Música" className="w-full" />
                  <SmallInput value={config.cta_secondary?.url ?? ''} onChange={v => updateSecondary('url', v)} placeholder="#music" className="w-full" />
                  <CtaStylePicker value={config.cta_secondary?.style ?? 'outline'} onChange={v => updateSecondary('style', v)} accent={accent} />
                </>
              )}
            </Section>

            {/* Socials */}
            <Section title="Redes Sociales" defaultOpen={false}>
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
                  </div>
                ))}
              </div>
            </Section>

            {/* Ticker */}
            <Section title="Ticker de Artistas" defaultOpen={false}>
              <TagInput value={config.supporters ?? []} onChange={v => set('supporters', v)} accentColor={accent} placeholder="Nombre..." />
              <Slider value={config.ticker_speed ?? 5} onChange={v => set('ticker_speed', v)} min={1} max={10} label="Velocidad" />
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
            </Section>
          </>
        )}

        {/* ── BACKGROUND ── */}
        {tab === 'bg' && (
          <>
            <Section title="Tipo de Fondo">
              <Pills
                options={[
                  { key: 'none',     label: 'Default'   },
                  { key: 'solid',    label: 'Color'     },
                  { key: 'gradient', label: 'Gradiente' },
                  { key: 'image',    label: 'Imagen'    },
                  { key: 'video',    label: 'Video'     },
                ]}
                value={bgType}
                onChange={v => {
                  set('bg_type', v)
                  if (v !== 'video') set('video_url', null)
                  if (v !== 'image' && v !== 'video') set('bg_image', null)
                }}
                accent={accent}
              />

              {bgType === 'solid' && (
                <ColorPicker value={config.bg_color ?? '#0A0A0E'} onChange={v => set('bg_color', v)} label="Color de fondo" accent={accent} />
              )}

              {bgType === 'gradient' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <ColorPicker value={config.bg_gradient_from ?? '#0A0A0E'} onChange={v => set('bg_gradient_from', v)} label="Desde" accent={accent} />
                    <ColorPicker value={config.bg_gradient_to ?? '#1A0A2E'} onChange={v => set('bg_gradient_to', v)} label="Hasta" accent={accent} />
                  </div>
                  <Toggle value={!!config.bg_gradient_mid} onChange={v => set('bg_gradient_mid', v ? '#7C3AED' : null)} label="Color intermedio" accent={accent} />
                  {config.bg_gradient_mid && (
                    <ColorPicker value={config.bg_gradient_mid} onChange={v => set('bg_gradient_mid', v)} label="Color medio" accent={accent} />
                  )}
                  <Slider value={config.bg_gradient_angle ?? 135} onChange={v => set('bg_gradient_angle', v)} min={0} max={360} label="Ángulo" unit="°" />
                  <Field label="Tipo">
                    <Pills
                      options={[{ key: 'linear', label: 'Lineal' }, { key: 'radial', label: 'Radial' }]}
                      value={config.bg_gradient_type ?? 'linear'}
                      onChange={v => set('bg_gradient_type', v)}
                      accent={accent}
                    />
                  </Field>
                </>
              )}

              {bgType === 'image' && (
                <>
                  <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)}
                    onRemove={() => set('bg_image', null)} folder="hero" aspect="16/9" accentColor={accent} />
                  <Slider value={config.bg_image_blur ?? 0} onChange={v => set('bg_image_blur', v)} min={0} max={20} label="Blur" unit="px" />
                  <Field label="Filtro">
                    <Pills
                      options={[
                        { key: 'none',     label: 'Normal'    },
                        { key: 'bw',       label: 'B&W'       },
                        { key: 'sepia',    label: 'Sépia'     },
                        { key: 'contrast', label: 'Contraste' },
                        { key: 'duotone',  label: 'Duotono'   },
                      ]}
                      value={config.bg_image_filter ?? 'none'}
                      onChange={v => set('bg_image_filter', v)}
                      accent={accent}
                    />
                  </Field>
                  {config.bg_image_filter === 'duotone' && (
                    <div className="grid grid-cols-2 gap-2">
                      <ColorPicker value={config.bg_image_duotone_from ?? '#C026D3'} onChange={v => set('bg_image_duotone_from', v)} label="Sombras" accent={accent} />
                      <ColorPicker value={config.bg_image_duotone_to ?? '#7C3AED'} onChange={v => set('bg_image_duotone_to', v)} label="Luces" accent={accent} />
                    </div>
                  )}
                  <div className="flex flex-col gap-1">
                    <Toggle value={config.parallax_bg ?? true} onChange={v => set('parallax_bg', v)} label="Parallax en scroll" accent={accent} />
                    <Toggle value={config.ken_burns ?? false} onChange={v => set('ken_burns', v)} label="Ken Burns (zoom lento)" accent={accent} />
                    {config.ken_burns && (
                      <Field label="Dirección">
                        <Pills
                          options={[{ key: 'in', label: 'Zoom In' }, { key: 'out', label: 'Zoom Out' }]}
                          value={config.ken_burns_direction ?? 'in'}
                          onChange={v => set('ken_burns_direction', v)}
                          accent={accent}
                        />
                      </Field>
                    )}
                    <Toggle value={config.oscillate ?? false} onChange={v => set('oscillate', v)} label="Oscilación suave" accent={accent} />
                  </div>
                  <Toggle value={config.img_vignette ?? false} onChange={v => set('img_vignette', v)} label="Vignette" accent={accent} />
                  {config.img_vignette && (
                    <Slider value={config.img_vignette_intensity ?? 50} onChange={v => set('img_vignette_intensity', v)} min={0} max={100} label="Intensidad vignette" unit="%" />
                  )}
                  <Toggle value={config.bg_grain ?? false} onChange={v => set('bg_grain', v)} label="Grain / Ruido" accent={accent} />
                  {config.bg_grain && (
                    <Field label="Intensidad grain">
                      <Pills
                        options={[{ key: '1', label: 'Baja' }, { key: '2', label: 'Media' }, { key: '3', label: 'Alta' }]}
                        value={String(config.bg_grain_intensity ?? 2)}
                        onChange={v => set('bg_grain_intensity', Number(v))}
                        accent={accent}
                      />
                    </Field>
                  )}
                </>
              )}

              {bgType === 'video' && (
                <>
                  <TextInput value={config.video_url ?? ''} onChange={v => set('video_url', v || null)} placeholder="YouTube, Vimeo o URL .mp4" />
                  <p className="text-[9px] font-mono text-white/25">Se detecta automáticamente el tipo</p>
                  <div>
                    <p className="text-[10px] font-mono text-white/30 mb-1.5">Fallback (si el video falla)</p>
                    <ImageUpload value={config.bg_image} onChange={url => set('bg_image', url)}
                      onRemove={() => set('bg_image', null)} folder="hero" aspect="16/9" accentColor={accent} />
                  </div>
                </>
              )}
            </Section>

            {/* Overlay */}
            <Section title="Overlay">
              <div className="grid grid-cols-2 gap-2">
                <ColorPicker value={config.overlay_color ?? '#000000'} onChange={v => set('overlay_color', v)} label="Color" accent={accent} />
              </div>
              <Slider
                value={Math.round((config.overlay_opacity ?? 0.5) * 100)}
                onChange={v => set('overlay_opacity', v / 100)}
                min={0} max={100} label="Opacidad" unit="%"
              />
              <Toggle value={config.overlay_gradient ?? false} onChange={v => set('overlay_gradient', v)} label="Gradiente de overlay" accent={accent} />
              {config.overlay_gradient && (
                <Field label="Dirección">
                  <Pills
                    options={[
                      { key: 'to-top',    label: 'Arriba'  },
                      { key: 'to-bottom', label: 'Abajo'   },
                      { key: 'to-left',   label: 'Izq'     },
                      { key: 'to-right',  label: 'Der'     },
                      { key: 'radial',    label: 'Radial'  },
                    ]}
                    value={config.overlay_gradient_dir ?? 'to-top'}
                    onChange={v => set('overlay_gradient_dir', v)}
                    accent={accent}
                  />
                </Field>
              )}
              <Field label="Blend Mode">
                <Pills
                  options={[
                    { key: 'normal',   label: 'Normal'   },
                    { key: 'multiply', label: 'Multiply' },
                    { key: 'screen',   label: 'Screen'   },
                    { key: 'overlay',  label: 'Overlay'  },
                  ]}
                  value={config.overlay_blend_mode ?? 'normal'}
                  onChange={v => set('overlay_blend_mode', v)}
                  accent={accent}
                />
              </Field>
            </Section>

            {/* Animated bg */}
            <Section title="Fondo Animado" defaultOpen={false}>
              <Toggle value={config.gradient_animated ?? true} onChange={v => set('gradient_animated', v)} label="Blobs de gradiente" accent={accent} />
            </Section>

            {/* Pattern overlay */}
            <Section title="Patrón de Textura" defaultOpen={false}>
              <Field label="Patrón">
                <Pills
                  options={[
                    { key: 'none',     label: 'Ninguno'   },
                    { key: 'dots',     label: 'Puntos'    },
                    { key: 'grid',     label: 'Cuadrícula'},
                    { key: 'diagonal', label: 'Diagonal'  },
                    { key: 'noise',    label: 'Ruido'     },
                  ]}
                  value={config.bg_pattern ?? 'none'}
                  onChange={v => set('bg_pattern', v)}
                  accent={accent}
                />
              </Field>
              {(config.bg_pattern ?? 'none') !== 'none' && (
                <Slider
                  value={config.bg_pattern_opacity ?? 15}
                  onChange={v => set('bg_pattern_opacity', v)}
                  min={2} max={60}
                  label="Opacidad del patrón"
                  unit="%"
                />
              )}
            </Section>
          </>
        )}

        {/* ── TYPOGRAPHY ── */}
        {tab === 'text' && (
          <>
            <Section title="Tamaños">
              <Slider value={config.name_size ?? 72} onChange={v => set('name_size', v)} min={40} max={200} label="Nombre del artista" unit="px" />
              <Slider value={config.tagline_size ?? 20} onChange={v => set('tagline_size', v)} min={12} max={80} label="Tagline" unit="px" />
              <Slider value={config.sub_tagline_size ?? 11} onChange={v => set('sub_tagline_size', v)} min={8} max={40} label="Sub-tagline" unit="px" />
              <Slider value={config.letter_spacing ?? 0} onChange={v => set('letter_spacing', v)} min={-5} max={20} label="Letter spacing" unit="px" />
            </Section>

            <Section title="Color Sub-tagline" defaultOpen={false}>
              <Toggle
                value={config.sub_tagline_color !== null && config.sub_tagline_color !== undefined}
                onChange={v => set('sub_tagline_color', v ? 'rgba(255,255,255,0.5)' : null)}
                label="Color personalizado" accent={accent}
              />
              {config.sub_tagline_color != null && (
                <ColorPicker value={config.sub_tagline_color} onChange={v => set('sub_tagline_color', v)} label="Color sub-tagline" accent={accent} />
              )}
            </Section>

            <Section title="Color">
              <Toggle value={config.text_color !== null && config.text_color !== undefined}
                onChange={v => set('text_color', v ? '#ffffff' : null)} label="Color personalizado" accent={accent} />
              {config.text_color != null && (
                <ColorPicker value={config.text_color} onChange={v => set('text_color', v)} label="Color del texto" accent={accent} />
              )}
            </Section>

            <Section title="Efecto de texto">
              <Field label="Estilo">
                <Pills
                  options={[
                    { key: 'none',     label: 'Normal'   },
                    { key: 'outline',  label: 'Outline'  },
                    { key: 'shadow',   label: 'Shadow'   },
                    { key: 'glow',     label: 'Glow'     },
                    { key: 'gradient', label: 'Gradient' },
                  ]}
                  value={textEffect}
                  onChange={v => set('text_effect', v)}
                  accent={accent}
                />
              </Field>

              {textEffect === 'shadow' && (
                <>
                  <ColorPicker value={config.text_shadow_color ?? '#000000'} onChange={v => set('text_shadow_color', v)} label="Color sombra" accent={accent} />
                  <Slider value={config.text_shadow_blur ?? 20} onChange={v => set('text_shadow_blur', v)} min={0} max={60} label="Blur" unit="px" />
                  <div className="grid grid-cols-2 gap-2">
                    <Slider value={config.text_shadow_offset_x ?? 0} onChange={v => set('text_shadow_offset_x', v)} min={-20} max={20} label="Offset X" unit="px" />
                    <Slider value={config.text_shadow_offset_y ?? 4} onChange={v => set('text_shadow_offset_y', v)} min={-20} max={20} label="Offset Y" unit="px" />
                  </div>
                </>
              )}
              {textEffect === 'glow' && (
                <>
                  <ColorPicker value={config.text_glow_color ?? accent} onChange={v => set('text_glow_color', v)} label="Color glow" accent={accent} />
                  <Slider value={config.text_glow_intensity ?? 20} onChange={v => set('text_glow_intensity', v)} min={0} max={40} label="Intensidad" unit="px" />
                </>
              )}
              {(textEffect === 'gradient') && (
                <>
                  <ColorPicker value={config.text_gradient_from ?? '#C026D3'} onChange={v => set('text_gradient_from', v)} label="Desde" accent={accent} />
                  <ColorPicker value={config.text_gradient_to ?? '#7C3AED'} onChange={v => set('text_gradient_to', v)} label="Hasta" accent={accent} />
                </>
              )}
            </Section>

            <Section title="Halo detrás del nombre" defaultOpen={false}>
              <Toggle value={config.glow_behind_name ?? false} onChange={v => set('glow_behind_name', v)} label="Activar halo" accent={accent} />
              {config.glow_behind_name && (
                <>
                  <Slider
                    value={config.glow_behind_name_intensity ?? 50}
                    onChange={v => set('glow_behind_name_intensity', v)}
                    min={10} max={100}
                    label="Intensidad"
                    unit="%"
                  />
                  <Toggle
                    value={config.glow_behind_name_color !== null && config.glow_behind_name_color !== undefined}
                    onChange={v => set('glow_behind_name_color', v ? accent : null)}
                    label="Color personalizado" accent={accent}
                  />
                  {config.glow_behind_name_color != null && (
                    <ColorPicker value={config.glow_behind_name_color} onChange={v => set('glow_behind_name_color', v)} label="Color halo" accent={accent} />
                  )}
                </>
              )}
            </Section>
          </>
        )}

        {/* ── FX ── */}
        {tab === 'fx' && (
          <>
            <Section title="Animación de Texto">
              <div className="grid grid-cols-2 gap-1.5">
                {([
                  { key: 'fade',        label: 'Fade'        },
                  { key: 'slide',       label: 'Slide Up'    },
                  { key: 'slide-down',  label: 'Slide Down'  },
                  { key: 'glitch',      label: 'Glitch'      },
                  { key: 'typewriter',  label: 'Typewriter'  },
                  { key: 'reveal',      label: 'Reveal'      },
                  { key: 'word-by-word',label: 'Palabra × palabra' },
                  { key: 'scale-up',    label: 'Scale Up'    },
                  { key: 'blur-in',     label: 'Blur In'     },
                  { key: 'float',       label: 'Float'       },
                ] as const).map(({ key, label }) => (
                  <button key={key} type="button" onClick={() => set('text_animation', key)}
                    className="py-2 px-2 rounded-xl text-[10px] font-mono transition-all text-left"
                    style={{
                      background: (config.text_animation ?? 'slide') === key ? accent + '20' : 'rgba(255,255,255,0.03)',
                      color:      (config.text_animation ?? 'slide') === key ? accent : 'rgba(255,255,255,0.4)',
                      border:     `1px solid ${(config.text_animation ?? 'slide') === key ? accent + '40' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    {label}
                  </button>
                ))}
              </div>
            </Section>

            {/* Three.js */}
            <Section title="Efectos 3D — Three.js">
              <Toggle value={config.three_bg ?? false} onChange={v => set('three_bg', v)} label="Activar Three.js" accent={accent} />
              {config.three_bg && (
                <>
                  <Field label="Efecto">
                    <div className="flex flex-col gap-1.5">
                      {([
                        { key: 'particles',  label: 'Partículas',     desc: 'Nube de puntos flotantes' },
                        { key: 'waves',      label: 'Ondas',          desc: 'Malla wireframe animada'  },
                        { key: 'volumetric', label: 'Luz volumétrica',desc: 'Rayos de luz con niebla'  },
                        { key: 'neural',     label: 'Red neuronal',   desc: 'Nodos conectados'         },
                        { key: 'polygons',   label: 'Polígonos 3D',   desc: 'Formas geométricas'       },
                      ] as const).map(({ key, label, desc }) => {
                        const active = (config.three_effect ?? 'particles') === key
                        return (
                          <button key={key} type="button" onClick={() => set('three_effect', key)}
                            className="flex items-start gap-2 p-2.5 rounded-xl text-left transition-all"
                            style={{
                              background: active ? accent + '16' : 'rgba(255,255,255,0.02)',
                              border:     `1px solid ${active ? accent + '35' : 'rgba(255,255,255,0.06)'}`,
                            }}>
                            <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: active ? accent : 'rgba(255,255,255,0.15)' }} />
                            <span>
                              <span className="block text-[11px] font-medium" style={{ color: active ? accent : 'rgba(255,255,255,0.6)' }}>{label}</span>
                              <span className="block text-[9px] font-mono text-white/25 mt-0.5">{desc}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </Field>
                  <Slider value={config.three_intensity ?? 50} onChange={v => set('three_intensity', v)} min={10} max={100} label="Intensidad" unit="%" />
                  <Toggle value={config.three_color !== null && config.three_color !== undefined}
                    onChange={v => set('three_color', v ? accent : null)} label="Color personalizado" accent={accent} />
                  {config.three_color != null && (
                    <ColorPicker value={config.three_color} onChange={v => set('three_color', v)} label="Color 3D" accent={accent} />
                  )}
                </>
              )}
            </Section>

            {/* Particles canvas (lightweight) */}
            {!config.three_bg && (
              <Section title="Partículas Canvas (ligero)" defaultOpen={false}>
                <Toggle value={config.particles ?? true} onChange={v => set('particles', v)} label="Partículas canvas" accent={accent} />
                {config.particles && (
                  <Slider value={config.particles_density ?? 60} onChange={v => set('particles_density', v)} min={20} max={120} label="Densidad" />
                )}
              </Section>
            )}
          </>
        )}

        {/* ── EXTRAS ── */}
        {tab === 'extras' && (
          <>
            {/* Scroll indicator */}
            <Section title="Indicador de Scroll">
              <Toggle value={config.show_scroll ?? true} onChange={v => set('show_scroll', v)} label="Mostrar indicador" accent={accent} />
              {config.show_scroll && (
                <Field label="Estilo">
                  <Pills
                    options={[
                      { key: 'line',  label: 'Línea'  },
                      { key: 'arrow', label: 'Flecha' },
                      { key: 'dot',   label: 'Punto'  },
                      { key: 'text',  label: 'Texto'  },
                    ]}
                    value={scrollStyle}
                    onChange={v => set('scroll_indicator_style', v)}
                    accent={accent}
                  />
                </Field>
              )}
            </Section>

            {/* Social links display */}
            <Section title="Redes Sociales — Visualización">
              <Toggle value={config.show_socials ?? true} onChange={v => set('show_socials', v)} label="Mostrar redes" accent={accent} />
              {config.show_socials && (
                <>
                  <Field label="Posición">
                    <Pills
                      options={[
                        { key: 'default',      label: 'Defecto'  },
                        { key: 'top',          label: 'Arriba'   },
                        { key: 'lateral-left', label: 'Lateral ←' },
                        { key: 'lateral-right',label: 'Lateral →' },
                      ]}
                      value={config.socials_position ?? 'default'}
                      onChange={v => set('socials_position', v)}
                      accent={accent}
                    />
                  </Field>
                  <Field label="Estilo">
                    <Pills
                      options={[
                        { key: 'icon',      label: 'Ícono'        },
                        { key: 'icon-text', label: 'Ícono + texto' },
                        { key: 'button',    label: 'Botón'        },
                      ]}
                      value={config.socials_style ?? 'icon'}
                      onChange={v => set('socials_style', v)}
                      accent={accent}
                    />
                  </Field>
                </>
              )}
            </Section>

            {/* Ticker position */}
            <Section title="Ticker — Posición" defaultOpen={false}>
              <Field label="Posición del ticker">
                <Pills
                  options={[{ key: 'bottom', label: 'Abajo' }, { key: 'top', label: 'Arriba' }]}
                  value={config.ticker_position ?? 'bottom'}
                  onChange={v => set('ticker_position', v)}
                  accent={accent}
                />
              </Field>
              <Toggle value={config.ticker_bg_color !== null && config.ticker_bg_color !== undefined}
                onChange={v => set('ticker_bg_color', v ? 'rgba(0,0,0,0.4)' : null)} label="Color de fondo personalizado" accent={accent} />
              {config.ticker_bg_color && (
                <ColorPicker value={config.ticker_bg_color} onChange={v => set('ticker_bg_color', v)} label="Fondo ticker" accent={accent} />
              )}
              <Toggle value={config.ticker_text_color !== null && config.ticker_text_color !== undefined}
                onChange={v => set('ticker_text_color', v ? '#ffffff' : null)} label="Color de texto personalizado" accent={accent} />
              {config.ticker_text_color && (
                <ColorPicker value={config.ticker_text_color} onChange={v => set('ticker_text_color', v)} label="Texto ticker" accent={accent} />
              )}
            </Section>

            {/* Availability badge */}
            <Section title="Badge de Disponibilidad" defaultOpen={false}>
              <Toggle value={config.show_badge ?? false} onChange={v => set('show_badge', v)} label="Mostrar badge" accent={accent} />
              {config.show_badge && (
                <>
                  <TextInput value={config.badge_text ?? ''} onChange={v => set('badge_text', v)} placeholder="Fechas disponibles Q2–Q3 2026" />
                  <div className="grid grid-cols-2 gap-2">
                    <ColorPicker value={config.badge_color ?? accent} onChange={v => set('badge_color', v)} label="Fondo" accent={accent} />
                    <ColorPicker value={config.badge_text_color ?? '#ffffff'} onChange={v => set('badge_text_color', v)} label="Texto" accent={accent} />
                  </div>
                  <Field label="Posición">
                    <Pills
                      options={[
                        { key: 'top-left',     label: '↖ Arriba izq' },
                        { key: 'top-right',    label: '↗ Arriba der' },
                        { key: 'bottom-left',  label: '↙ Abajo izq'  },
                        { key: 'bottom-right', label: '↘ Abajo der'  },
                      ]}
                      value={config.badge_position ?? 'top-right'}
                      onChange={v => set('badge_position', v)}
                      accent={accent}
                    />
                  </Field>
                  <Toggle value={config.badge_pulse ?? false} onChange={v => set('badge_pulse', v)} label="Animación pulse" accent={accent} />
                </>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  )
}
