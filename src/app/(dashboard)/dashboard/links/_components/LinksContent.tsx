'use client'
import { useState, useTransition } from 'react'
import { Check, Plus, Trash2, ExternalLink, Save } from 'lucide-react'
import { motion } from 'framer-motion'

const STREAMING_PLATFORMS = [
  { id: 'spotify',    name: 'Spotify',       color: '#1DB954', emoji: '🎵', placeholder: 'https://open.spotify.com/artist/...' },
  { id: 'soundcloud', name: 'SoundCloud',    color: '#FF5500', emoji: '☁️', placeholder: 'https://soundcloud.com/...' },
  { id: 'apple',      name: 'Apple Music',   color: '#FB2D3F', emoji: '🍎', placeholder: 'https://music.apple.com/artist/...' },
  { id: 'beatport',   name: 'Beatport',      color: '#00C469', emoji: '🎧', placeholder: 'https://www.beatport.com/artist/...' },
  { id: 'bandcamp',   name: 'Bandcamp',      color: '#1DA0C3', emoji: '🎸', placeholder: 'https://yourname.bandcamp.com' },
  { id: 'youtube',    name: 'YouTube Music', color: '#FF0000', emoji: '▶️', placeholder: 'https://music.youtube.com/channel/...' },
]

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram',       color: '#E1306C', emoji: '📸', placeholder: '@yourhandle' },
  { id: 'tiktok',    name: 'TikTok',          color: '#69C9D0', emoji: '🎶', placeholder: '@yourhandle' },
  { id: 'twitter',   name: 'Twitter / X',     color: '#1DA1F2', emoji: '🐦', placeholder: '@yourhandle' },
  { id: 'facebook',  name: 'Facebook',        color: '#1877F2', emoji: '👤', placeholder: 'https://facebook.com/yourpage' },
  { id: 'ra',        name: 'Resident Advisor',color: '#FFFFFF', emoji: '🏷️', placeholder: 'https://ra.co/dj/...' },
  { id: 'mixcloud',  name: 'Mixcloud',        color: '#52AAD8', emoji: '🌊', placeholder: 'https://www.mixcloud.com/...' },
]

interface CustomLink { id: string; title: string; url: string }

export interface LinksInitialData {
  streaming: Record<string, string>
  social:    Record<string, string>
  custom:    CustomLink[]
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${value ? 'bg-[#C026D3]' : 'bg-white/10'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

function PlatformRow({
  platform, value, active, onValueChange, onToggle,
}: {
  platform: typeof STREAMING_PLATFORMS[0]
  value: string
  active: boolean
  onValueChange: (v: string) => void
  onToggle: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] transition-colors hover:border-white/[0.1]" style={{ background: 'rgba(255,255,255,0.015)' }}>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
        style={{ background: `${platform.color}18`, border: `1px solid ${platform.color}30` }}
      >
        {platform.emoji}
      </div>
      <p className="w-28 shrink-0 text-[13px] font-semibold text-white">{platform.name}</p>
      {active && (
        <div className="flex items-center gap-1 shrink-0">
          <Check className="w-2.5 h-2.5 text-emerald-400" />
          <span className="font-mono text-[9px] text-emerald-400">Activo</span>
        </div>
      )}
      <input
        value={value}
        onChange={e => onValueChange(e.target.value)}
        placeholder={platform.placeholder}
        className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-white text-[12px] placeholder-white/15 focus:outline-none focus:border-[#C026D3]/40 transition-colors font-mono"
      />
      <Toggle value={active} onChange={onToggle} />
    </div>
  )
}

export default function LinksContent({
  initialData,
  saveAction,
}: {
  initialData: LinksInitialData
  saveAction: (streaming: Record<string, string>, social: Record<string, string>, custom: CustomLink[]) => Promise<void>
}) {
  const [streaming, setStreaming] = useState(initialData.streaming)
  const [streamingOn, setStreamingOn] = useState<Record<string, boolean>>(
    Object.fromEntries(STREAMING_PLATFORMS.map(p => [p.id, !!initialData.streaming[p.id]]))
  )
  const [social, setSocial] = useState(initialData.social)
  const [socialOn, setSocialOn] = useState<Record<string, boolean>>(
    Object.fromEntries(SOCIAL_PLATFORMS.map(p => [p.id, !!initialData.social[p.id]]))
  )
  const [custom, setCustom] = useState<CustomLink[]>(initialData.custom)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      await saveAction(streaming, social, custom)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/[0.04]">
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em] mb-1">Panel</p>
        <h1 className="font-display font-semibold text-[28px] tracking-[-0.03em]">
          Links{' '}
          <span className="font-serif italic font-normal text-white/35">& redes</span>
        </h1>
        <p className="font-mono text-[11px] text-white/30 mt-1.5">Solo los links activos aparecen en tu presskit.</p>
      </div>

      <div className="px-8 py-7 flex flex-col gap-8 max-w-3xl pb-16">

        {/* Streaming */}
        <motion.section
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">Música & Streaming</h2>
            <span className="font-mono text-[9px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              {Object.values(streamingOn).filter(Boolean).length} activos
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {STREAMING_PLATFORMS.map(p => (
              <PlatformRow
                key={p.id}
                platform={p}
                value={streaming[p.id] ?? ''}
                active={streamingOn[p.id] ?? false}
                onValueChange={v => setStreaming(prev => ({ ...prev, [p.id]: v }))}
                onToggle={v => setStreamingOn(prev => ({ ...prev, [p.id]: v }))}
              />
            ))}
          </div>
        </motion.section>

        {/* Social */}
        <motion.section
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">Redes sociales</h2>
            <span className="font-mono text-[9px] text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              {Object.values(socialOn).filter(Boolean).length} activos
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {SOCIAL_PLATFORMS.map(p => (
              <PlatformRow
                key={p.id}
                platform={p as typeof STREAMING_PLATFORMS[0]}
                value={social[p.id] ?? ''}
                active={socialOn[p.id] ?? false}
                onValueChange={v => setSocial(prev => ({ ...prev, [p.id]: v }))}
                onToggle={v => setSocialOn(prev => ({ ...prev, [p.id]: v }))}
              />
            ))}
          </div>
        </motion.section>

        {/* Custom links */}
        <motion.section
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-[18px] tracking-[-0.02em]">Links personalizados</h2>
            <button
              onClick={() => setCustom(prev => [...prev, { id: Date.now().toString(), title: '', url: '' }])}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold transition-colors"
              style={{ background: 'rgba(192,38,211,0.10)', border: '1px solid rgba(192,38,211,0.20)', color: '#E879F9' }}
            >
              <Plus className="w-3.5 h-3.5" /> Añadir link
            </button>
          </div>
          {custom.length === 0 ? (
            <div className="text-center py-8 rounded-2xl font-mono text-[11px] text-white/20" style={{ border: '1px dashed rgba(255,255,255,0.08)' }}>
              Sin links personalizados
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {custom.map(link => (
                <div
                  key={link.id}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.06]"
                  style={{ background: 'rgba(255,255,255,0.015)' }}
                >
                  <div className="w-9 h-9 rounded-xl border border-white/[0.08] flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <ExternalLink className="w-4 h-4 text-white/30" />
                  </div>
                  <input
                    value={link.title}
                    onChange={e => setCustom(prev => prev.map(l => l.id === link.id ? { ...l, title: e.target.value } : l))}
                    placeholder="Título"
                    className="w-32 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-white text-[12px] placeholder-white/15 focus:outline-none focus:border-[#C026D3]/40 transition-colors"
                  />
                  <input
                    value={link.url}
                    onChange={e => setCustom(prev => prev.map(l => l.id === link.id ? { ...l, url: e.target.value } : l))}
                    placeholder="https://..."
                    className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-white text-[12px] placeholder-white/15 focus:outline-none focus:border-[#C026D3]/40 transition-colors font-mono"
                  />
                  <button
                    onClick={() => setCustom(prev => prev.filter(l => l.id !== link.id))}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white/20 hover:text-rose-400 hover:bg-rose-400/10 transition-colors shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="self-start flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all"
          style={{
            background: saved ? '#10B981' : '#C026D3',
            opacity: isPending ? 0.7 : 1,
          }}
        >
          {saved ? (
            <><Check className="w-4 h-4" /> Guardado</>
          ) : isPending ? (
            'Guardando...'
          ) : (
            <><Save className="w-4 h-4" /> Guardar cambios</>
          )}
        </button>
      </div>
    </div>
  )
}
