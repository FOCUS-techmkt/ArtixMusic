'use client'
import { useState } from 'react'
import { Check, Plus, Trash2, ExternalLink } from 'lucide-react'

// ─── Platform data ────────────────────────────────────────────────────────────
const STREAMING = [
  { id: 'spotify', name: 'Spotify', color: '#1DB954', emoji: '🎵', placeholder: 'https://open.spotify.com/artist/...' },
  { id: 'soundcloud', name: 'SoundCloud', color: '#FF5500', emoji: '☁️', placeholder: 'https://soundcloud.com/...' },
  { id: 'apple', name: 'Apple Music', color: '#FB2D3F', emoji: '🍎', placeholder: 'https://music.apple.com/artist/...' },
  { id: 'beatport', name: 'Beatport', color: '#00C469', emoji: '🎧', placeholder: 'https://www.beatport.com/artist/...' },
  { id: 'bandcamp', name: 'Bandcamp', color: '#1DA0C3', emoji: '🎸', placeholder: 'https://yourname.bandcamp.com' },
  { id: 'youtube', name: 'YouTube Music', color: '#FF0000', emoji: '▶️', placeholder: 'https://music.youtube.com/channel/...' },
]

const SOCIAL = [
  { id: 'instagram', name: 'Instagram', color: '#E1306C', emoji: '📸', placeholder: '@yourhandle', isHandle: true },
  { id: 'tiktok', name: 'TikTok', color: '#69C9D0', emoji: '🎶', placeholder: '@yourhandle', isHandle: true },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', emoji: '👤', placeholder: 'https://facebook.com/yourpage', isHandle: false },
  { id: 'twitter', name: 'Twitter / X', color: '#1DA1F2', emoji: '🐦', placeholder: '@yourhandle', isHandle: true },
  { id: 'ra', name: 'Resident Advisor', color: '#FFFFFF', emoji: '🏷️', placeholder: 'https://ra.co/dj/...', isHandle: false },
  { id: 'mixcloud', name: 'Mixcloud', color: '#52AAD8', emoji: '🌊', placeholder: 'https://www.mixcloud.com/...', isHandle: false },
  { id: 'twitch', name: 'Twitch', color: '#9146FF', emoji: '🎮', placeholder: '@yourchannel', isHandle: true },
]

// ─── Toggle ──────────────────────────────────────────────────────────────────
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
        value ? 'bg-[#C026D3]' : 'bg-white/10'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

// ─── Platform Row ─────────────────────────────────────────────────────────────
function PlatformRow({
  platform,
  value,
  active,
  onValueChange,
  onToggle,
}: {
  platform: (typeof STREAMING)[0]
  value: string
  active: boolean
  onValueChange: (v: string) => void
  onToggle: (v: boolean) => void
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02] transition-colors">
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ background: `${platform.color}20`, border: `1px solid ${platform.color}30` }}
      >
        {platform.emoji}
      </div>

      {/* Name */}
      <div className="w-32 shrink-0">
        <p className="text-sm font-semibold text-white">{platform.name}</p>
        {active && (
          <div className="flex items-center gap-1 mt-0.5">
            <Check className="w-2.5 h-2.5 text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400">Conectado</span>
          </div>
        )}
      </div>

      {/* Input */}
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={platform.placeholder}
        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-colors font-mono text-xs"
      />

      {/* Toggle */}
      <Toggle value={active} onChange={onToggle} />
    </div>
  )
}

interface CustomLink {
  id: string
  title: string
  url: string
}

export default function LinksPage() {
  const [streamingValues, setStreamingValues] = useState<Record<string, string>>({
    spotify: 'https://open.spotify.com/artist/valentina-m',
    soundcloud: '',
    apple: '',
    beatport: 'https://www.beatport.com/artist/valentina-m',
    bandcamp: '',
    youtube: '',
  })
  const [streamingActive, setStreamingActive] = useState<Record<string, boolean>>({
    spotify: true,
    soundcloud: false,
    apple: false,
    beatport: true,
    bandcamp: false,
    youtube: false,
  })

  const [socialValues, setSocialValues] = useState<Record<string, string>>({
    instagram: '@valentina.dj',
    tiktok: '@valentina.dj',
    facebook: '',
    twitter: '@valentina_dj',
    ra: 'https://ra.co/dj/valentina-m',
    mixcloud: '',
    twitch: '',
  })
  const [socialActive, setSocialActive] = useState<Record<string, boolean>>({
    instagram: true,
    tiktok: true,
    facebook: false,
    twitter: true,
    ra: true,
    mixcloud: false,
    twitch: false,
  })

  const [customLinks, setCustomLinks] = useState<CustomLink[]>([
    { id: '1', title: 'Mi web oficial', url: 'https://valentina-dj.com' },
  ])

  function addCustomLink() {
    setCustomLinks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: '', url: '' },
    ])
  }

  function updateCustomLink(id: string, field: 'title' | 'url', value: string) {
    setCustomLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  function removeCustomLink(id: string) {
    setCustomLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const connectedStreaming = STREAMING.filter((p) => streamingActive[p.id])
  const connectedSocial = SOCIAL.filter((p) => socialActive[p.id])

  return (
    <div className="p-8 max-w-4xl mx-auto flex flex-col gap-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white">Links & Redes</h1>
        <p className="text-white/40 text-sm mt-1 font-mono">
          Conecta tus plataformas y redes sociales. Solo las activas aparecen en tu presskit.
        </p>
      </div>

      {/* Streaming */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-black tracking-tighter text-lg">Música & Streaming</h2>
          <span className="text-xs font-mono text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">
            {Object.values(streamingActive).filter(Boolean).length} activos
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {STREAMING.map((p) => (
            <PlatformRow
              key={p.id}
              platform={p}
              value={streamingValues[p.id] || ''}
              active={streamingActive[p.id] || false}
              onValueChange={(v) =>
                setStreamingValues((prev) => ({ ...prev, [p.id]: v }))
              }
              onToggle={(v) =>
                setStreamingActive((prev) => ({ ...prev, [p.id]: v }))
              }
            />
          ))}
        </div>
      </section>

      {/* Social */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-black tracking-tighter text-lg">Redes sociales</h2>
          <span className="text-xs font-mono text-white/30 bg-white/[0.04] px-2 py-0.5 rounded-full">
            {Object.values(socialActive).filter(Boolean).length} activos
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {SOCIAL.map((p) => (
            <PlatformRow
              key={p.id}
              platform={p as any}
              value={socialValues[p.id] || ''}
              active={socialActive[p.id] || false}
              onValueChange={(v) =>
                setSocialValues((prev) => ({ ...prev, [p.id]: v }))
              }
              onToggle={(v) =>
                setSocialActive((prev) => ({ ...prev, [p.id]: v }))
              }
            />
          ))}
        </div>
      </section>

      {/* Custom links */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-black tracking-tighter text-lg">Links personalizados</h2>
          <button
            onClick={addCustomLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C026D3]/10 border border-[#C026D3]/20 text-[#E879F9] text-sm font-semibold hover:bg-[#C026D3]/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Añadir link
          </button>
        </div>
        {customLinks.length === 0 && (
          <div className="text-center py-10 border border-dashed border-white/[0.08] rounded-2xl text-white/25 text-sm font-mono">
            No hay links personalizados
          </div>
        )}
        <div className="flex flex-col gap-3">
          {customLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-3 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.01]"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4 text-white/30" />
              </div>
              <input
                value={link.title}
                onChange={(e) => updateCustomLink(link.id, 'title', e.target.value)}
                placeholder="Título del link"
                className="w-36 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-colors"
              />
              <input
                value={link.url}
                onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                placeholder="https://..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#C026D3]/50 transition-colors font-mono text-xs"
              />
              <button
                onClick={() => removeCustomLink(link.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Preview of links section */}
      <section className="flex flex-col gap-4">
        <h2 className="font-black tracking-tighter text-lg">Vista previa de tu sección de links</h2>
        <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-4">
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
            Así aparecerá en tu presskit
          </p>

          {/* Connected platforms preview */}
          <div className="flex flex-col gap-2">
            {[...connectedStreaming, ...connectedSocial].length === 0 ? (
              <p className="text-white/20 text-sm font-mono text-center py-6">
                Activa al menos una plataforma para ver la vista previa
              </p>
            ) : (
              <>
                {connectedStreaming.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-mono text-white/30 tracking-widest mb-1">
                      ESCÚCHAME
                    </p>
                    {connectedStreaming.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                        style={{ background: `${p.color}12`, border: `1px solid ${p.color}20` }}
                      >
                        <span className="text-base">{p.emoji}</span>
                        <span className="text-sm font-semibold" style={{ color: p.color }}>
                          {p.name}
                        </span>
                        <ExternalLink
                          className="w-3 h-3 ml-auto"
                          style={{ color: p.color, opacity: 0.5 }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                {connectedSocial.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-[10px] font-mono text-white/30 tracking-widest mb-1">
                      SÍGUEME
                    </p>
                    {connectedSocial.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: `${p.color}12`, border: `1px solid ${p.color}20` }}
                      >
                        <span className="text-base">{p.emoji}</span>
                        <span className="text-sm font-semibold" style={{ color: p.color }}>
                          {p.name}
                        </span>
                        <span className="text-xs font-mono text-white/30 ml-auto">
                          {socialValues[p.id]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {customLinks.filter((l) => l.title && l.url).length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    <p className="text-[10px] font-mono text-white/30 tracking-widest mb-1">
                      MÁS
                    </p>
                    {customLinks
                      .filter((l) => l.title && l.url)
                      .map((l) => (
                        <div
                          key={l.id}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                        >
                          <ExternalLink className="w-4 h-4 text-white/30" />
                          <span className="text-sm text-white/70">{l.title}</span>
                          <span className="text-xs font-mono text-white/25 ml-auto truncate max-w-[140px]">
                            {l.url}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
