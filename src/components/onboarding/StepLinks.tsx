'use client'
import { motion } from 'framer-motion'
import { Music2, Instagram, Youtube, Headphones } from 'lucide-react'
import type { OnboardingData } from '@/types'
import { staggerContainer, fadeUpItem } from '@/lib/utils'
import ImageUpload from '@/components/shared/ImageUpload'

const LINK_FIELDS = [
  { key: 'soundcloud', label: 'SoundCloud', icon: Headphones, placeholder: 'https://soundcloud.com/tu-nombre' },
  { key: 'spotify',    label: 'Spotify',    icon: Music2,     placeholder: 'https://open.spotify.com/artist/...' },
  { key: 'instagram',  label: 'Instagram',  icon: Instagram,  placeholder: 'https://instagram.com/tu_nombre' },
  { key: 'youtube',    label: 'YouTube',    icon: Youtube,    placeholder: 'https://youtube.com/@tu-canal' },
] as const

interface Props {
  data:     OnboardingData
  onChange: (partial: Partial<OnboardingData>) => void
}

export default function StepLinks({ data, onChange }: Props) {
  const updateLink = (key: string, value: string) =>
    onChange({ links: { ...data.links, [key]: value } })

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col gap-8">

      <motion.div variants={fadeUpItem}>
        <h2 className="font-display font-bold text-3xl md:text-4xl mb-2">Tus links y medios</h2>
        <p className="text-white/50">Sube tu foto principal y conecta tus plataformas.</p>
      </motion.div>

      {/* Photo upload */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Foto / Arte principal</label>
        <ImageUpload
          value={data.photo_url ?? null}
          onChange={url => onChange({ photo_url: url })}
          onRemove={() => onChange({ photo_url: null })}
          folder="avatar"
          label="Subir tu foto de artista"
          hint="PNG, JPG, WEBP · Recomendado: cuadrada 1000×1000px"
          aspect="1/1"
          accentColor="#C026D3"
          className="max-w-[200px]"
        />
      </motion.div>

      {/* Links */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-3">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Plataformas</label>
        {LINK_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-white/30 shrink-0" />
            <input
              type="url"
              value={(data.links as Record<string, string>)[key] ?? ''}
              onChange={e => updateLink(key, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
            />
          </div>
        ))}
      </motion.div>

      {/* Booking email */}
      <motion.div variants={fadeUpItem} className="flex flex-col gap-2">
        <label className="text-xs font-mono text-white/40 tracking-wider uppercase">Email de booking</label>
        <input
          type="email"
          value={data.booking_email}
          onChange={e => onChange({ booking_email: e.target.value })}
          placeholder="booking@tumanager.com"
          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/15 focus:outline-none focus:border-[#C026D3]/60 transition-all"
        />
      </motion.div>

    </motion.div>
  )
}
