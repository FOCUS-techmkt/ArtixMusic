'use client'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import type { OnboardingData } from '@/types'
import { deriveArtistPalette } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'
import ImageUpload from '@/components/shared/ImageUpload'

const TEMPLATE_PALETTES: Record<string, Array<{ primary: string; secondary: string; label: string }>> = {
  noir:      [
    { primary: '#D4D4D4', secondary: '#737373', label: 'Platinum' },
    { primary: '#F5F5F5', secondary: '#A3A3A3', label: 'White' },
    { primary: '#D4A853', secondary: '#92400E', label: 'Gold Noir' },
  ],
  acid:      [
    { primary: '#B5FF3A', secondary: '#00FF88', label: 'Acid Green' },
    { primary: '#FF1493', secondary: '#FF6B6B', label: 'Acid Pink' },
    { primary: '#FFE500', secondary: '#FF6B00', label: 'Acid Yellow' },
  ],
  editorial: [
    { primary: '#E94560', secondary: '#1A1A2E', label: 'Red Editorial' },
    { primary: '#1A1A2E', secondary: '#E94560', label: 'Ink Blue' },
    { primary: '#2D6A4F', secondary: '#1B4332', label: 'Green Print' },
  ],
  warm:      [
    { primary: '#F59E0B', secondary: '#EC4899', label: 'Amber Pink' },
    { primary: '#F97316', secondary: '#FCD34D', label: 'Terracotta' },
    { primary: '#EC4899', secondary: '#F59E0B', label: 'Rose Warm' },
  ],
  trap:      [
    { primary: '#EF4444', secondary: '#D97706', label: 'Blood Gold' },
    { primary: '#DC2626', secondary: '#7F1D1D', label: 'Pure Blood' },
    { primary: '#F97316', secondary: '#EF4444', label: 'Inferno' },
  ],
  festival:  [
    { primary: '#3B82F6', secondary: '#8B5CF6', label: 'Electric' },
    { primary: '#06B6D4', secondary: '#3B82F6', label: 'Ocean' },
    { primary: '#8B5CF6', secondary: '#EC4899', label: 'Laser' },
  ],
}

const DEFAULT_PALETTES = [
  { primary: '#C026D3', secondary: '#7C3AED', label: 'Magenta' },
  { primary: '#3B82F6', secondary: '#8B5CF6', label: 'Blue' },
  { primary: '#F59E0B', secondary: '#EC4899', label: 'Warm' },
]

function MiniPreview({ data }: { data: OnboardingData }) {
  const palette = deriveArtistPalette(data.primary_color, data.secondary_color, data.bg_dark)
  return (
    <motion.div
      layout
      className="relative w-full rounded-2xl overflow-hidden border"
      style={{ height: '160px', backgroundColor: palette.bg, borderColor: palette.border }}
    >
      {/* Gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at 30% 40%, ${data.primary_color}40, transparent 60%), radial-gradient(ellipse at 80% 70%, ${data.secondary_color}25, transparent 50%)` }}
      />

      <div className="absolute inset-0 flex items-center gap-4 px-5">
        {/* Photo circle */}
        <div
          className="shrink-0 rounded-full overflow-hidden flex items-center justify-center"
          style={{ width: '72px', height: '72px', background: `${data.primary_color}18`, border: `2px solid ${data.primary_color}40` }}
        >
          {data.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.photo_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <span style={{ color: data.primary_color, fontSize: '22px', opacity: 0.5 }}>◆</span>
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5">
          <div
            className="font-display font-extrabold text-2xl tracking-tight leading-none"
            style={{ color: palette.text, textShadow: `0 0 24px ${data.primary_color}60` }}
          >
            {data.artist_name || 'TU NOMBRE'}
          </div>
          <div className="flex gap-1.5">
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono"
              style={{ backgroundColor: data.primary_color + '20', color: data.primary_color, border: `1px solid ${data.primary_color}40` }}
            >
              {data.genre}
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono"
              style={{ backgroundColor: data.secondary_color + '20', color: data.secondary_color, border: `1px solid ${data.secondary_color}40` }}
            >
              {data.role}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface Props {
  data:     OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepMedia({ data, onChange }: Props) {
  const palettes = TEMPLATE_PALETTES[data.template_id] ?? DEFAULT_PALETTES

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Tu foto y tu color</h2>
        <p className="text-white/50">
          Sube tu foto principal y elige los colores de tu marca. La vista previa se actualiza en tiempo real.
        </p>
      </motion.div>

      {/* Photo upload */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Foto de artista</label>
        <ImageUpload
          value={data.photo_url ?? null}
          onChange={url => onChange({ photo_url: url })}
          onRemove={() => onChange({ photo_url: null })}
          folder="avatar"
          label="Subir tu foto"
          hint="PNG, JPG, WEBP · Recomendado: cuadrada 1000×1000px"
          aspect="1/1"
          accentColor={data.primary_color}
          className="max-w-[180px]"
        />
      </motion.div>

      {/* Live preview */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <label className="text-xs font-mono text-white/30 uppercase tracking-widest">Vista previa en vivo</label>
        <MiniPreview data={data} />
      </motion.div>

      {/* Palette presets */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Paleta de colores</label>
        <div className="grid grid-cols-3 gap-2">
          {palettes.map((p) => {
            const isActive = data.primary_color === p.primary && data.secondary_color === p.secondary
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => onChange({ primary_color: p.primary, secondary_color: p.secondary })}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200"
                style={{
                  borderColor:       isActive ? p.primary : 'rgba(255,255,255,0.1)',
                  backgroundColor:   isActive ? p.primary + '12' : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Dual swatch */}
                <div className="flex rounded-lg overflow-hidden" style={{ width: '36px', height: '20px', border: `1px solid rgba(255,255,255,0.1)` }}>
                  <div className="flex-1" style={{ background: p.primary }} />
                  <div className="flex-1" style={{ background: p.secondary }} />
                </div>
                <span className="text-[10px] font-mono" style={{ color: isActive ? p.primary : 'rgba(255,255,255,0.4)' }}>
                  {p.label}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Custom color pickers */}
      <motion.div variants={fadeUpItem} className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Color principal</label>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <input
              type="color"
              value={data.primary_color}
              onChange={e => onChange({ primary_color: e.target.value })}
              className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
            <div>
              <p className="text-xs font-mono text-white">{data.primary_color.toUpperCase()}</p>
              <p className="text-[10px] text-white/30">Acento</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono text-white/40 uppercase tracking-wider">Color secundario</label>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/5">
            <input
              type="color"
              value={data.secondary_color}
              onChange={e => onChange({ secondary_color: e.target.value })}
              className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
            <div>
              <p className="text-xs font-mono text-white">{data.secondary_color.toUpperCase()}</p>
              <p className="text-[10px] text-white/30">Glow</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Dark / Light */}
      <motion.div variants={fadeUpItem} className="grid grid-cols-2 gap-3">
        {[
          { dark: true,  icon: Moon, label: 'Oscuro',  desc: 'Negro profundo' },
          { dark: false, icon: Sun,  label: 'Claro',   desc: 'Blanco brillante' },
        ].map(({ dark, icon: Icon, label, desc }) => (
          <button
            key={String(dark)}
            type="button"
            onClick={() => onChange({ bg_dark: dark })}
            className="relative flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200"
            style={{
              borderColor:     data.bg_dark === dark ? data.primary_color : 'rgba(255,255,255,0.1)',
              backgroundColor: data.bg_dark === dark ? data.primary_color + '12' : 'rgba(255,255,255,0.02)',
            }}
          >
            {data.bg_dark === dark && (
              <motion.div
                layoutId="bgToggleMd"
                className="absolute inset-0 rounded-2xl"
                style={{ border: `1px solid ${data.primary_color}` }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon className="w-5 h-5 relative" style={{ color: data.bg_dark === dark ? data.primary_color : 'rgba(255,255,255,0.3)' }} />
            <div className="text-left relative">
              <p className="font-semibold text-sm text-white">{label}</p>
              <p className="text-[11px] text-white/30">{desc}</p>
            </div>
          </button>
        ))}
      </motion.div>
    </motion.div>
  )
}
