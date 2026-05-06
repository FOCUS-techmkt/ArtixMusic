'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Monitor, Smartphone, ExternalLink } from 'lucide-react'

const LAYOUTS = [
  { id: 'centrado',  label: 'Centrado' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'split',     label: 'Split' },
  { id: 'raw',       label: 'Raw' },
]

function QRCode({ size = 120 }: { size?: number }) {
  const cells = 17
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,0,1,1,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,1,1,0,1,0,1,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,1,0,0,1],
    [1,1,1,0,1,1,1,0,0,1,0,0,1,1,0,1,0],
    [0,0,0,1,0,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,0],
    [1,1,1,1,1,1,1,0,0,1,0,0,0,1,0,1,0],
    [1,0,0,0,0,0,1,1,1,0,1,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,0,1,0],
  ]
  const cellSize = size / cells
  return (
    <div className="bg-white p-2 rounded-lg" style={{ width: size + 16, height: size + 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cells}, ${cellSize}px)`, gap: 0 }}>
        {pattern.flat().map((cell, i) => (
          <div key={i} style={{ width: cellSize, height: cellSize, background: cell ? '#07070B' : 'white' }} />
        ))}
      </div>
    </div>
  )
}

function MiniPresskit({
  layout, dark, accent, artistName, genre, photoUrl, bio,
}: {
  layout: string; dark: boolean; accent: string
  artistName: string; genre: string; photoUrl: string | null; bio: string
}) {
  const text  = dark ? '#FFFFFF' : '#0D0D12'
  const muted = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'

  const avatar = photoUrl ? (
    <img src={photoUrl} alt={artistName} className="w-16 h-16 rounded-full object-cover" />
  ) : (
    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black" style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
      {artistName.split(' ').map(w => w[0]).join('').slice(0, 2)}
    </div>
  )

  if (layout === 'centrado') {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-6" style={{ color: text }}>
        {avatar}
        <div className="text-center">
          <p className="font-black tracking-tighter text-sm">{artistName.toUpperCase()}</p>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: accent }}>{genre.toUpperCase()}</p>
        </div>
        <p className="text-[9px] text-center leading-relaxed" style={{ color: muted }}>
          {bio.slice(0, 120) || 'Sin bio aún.'}
        </p>
        <div className="flex gap-2 mt-1">
          {['SP', 'IG', 'RA'].map(s => (
            <div key={s} className="w-6 h-6 rounded-lg text-[7px] font-bold flex items-center justify-center" style={{ background: `${accent}20`, color: accent }}>{s}</div>
          ))}
        </div>
      </div>
    )
  }

  if (layout === 'editorial') {
    return (
      <div className="flex flex-col" style={{ color: text }}>
        <div className="w-full h-20 relative" style={{ background: `linear-gradient(135deg, ${accent}40, transparent)` }}>
          <div className="absolute bottom-3 left-4">
            <p className="font-black tracking-tighter text-xs">{artistName.toUpperCase()}</p>
            <p className="text-[8px] font-mono" style={{ color: accent }}>{genre.toUpperCase()}</p>
          </div>
        </div>
        <div className="p-4 flex gap-3">
          <div className="w-12 h-12 rounded-xl shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }} />
          <p className="text-[8px] leading-relaxed" style={{ color: muted }}>
            {bio.slice(0, 100) || 'Sin bio.'}
          </p>
        </div>
      </div>
    )
  }

  if (layout === 'split') {
    return (
      <div className="flex h-full" style={{ color: text }}>
        <div className="w-1/2 flex flex-col items-center justify-center gap-2 p-3" style={{ background: `${accent}15` }}>
          <div className="w-14 h-14 rounded-full" style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }} />
          <p className="font-black tracking-tighter text-[9px] text-center">{artistName.toUpperCase()}</p>
          <p className="text-[7px] font-mono" style={{ color: accent }}>{genre.toUpperCase()}</p>
        </div>
        <div className="w-1/2 flex flex-col justify-center gap-1.5 p-3">
          <p className="text-[8px] leading-relaxed" style={{ color: muted }}>{bio.slice(0, 80) || 'Sin bio.'}</p>
          <div className="w-12 h-4 rounded-lg mt-1 text-[7px] font-mono flex items-center justify-center" style={{ background: accent, color: '#fff' }}>
            BOOKING
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-2" style={{ color: text }}>
      <p className="text-[8px] font-mono tracking-widest" style={{ color: muted }}>PRESSKIT</p>
      <p className="font-black tracking-tighter text-sm">{artistName.toUpperCase()}</p>
      <p className="text-[8px] font-mono" style={{ color: accent }}>{genre.toUpperCase()}</p>
      <div className="h-px my-1" style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
      <p className="text-[7px] leading-relaxed" style={{ color: muted }}>{bio.slice(0, 80) || 'Sin bio.'}</p>
      <div className="flex gap-1.5 mt-1">
        {['BOOKING', 'EPK'].map(s => (
          <div key={s} className="px-2 py-0.5 text-[6px] font-mono border rounded" style={{ borderColor: `${accent}50`, color: accent }}>{s}</div>
        ))}
      </div>
    </div>
  )
}

export default function PreviewContent({
  slug, artistName, genre, photoUrl, primaryColor, bio,
}: {
  slug: string
  artistName: string
  genre: string
  photoUrl: string | null
  primaryColor: string
  bio: string
}) {
  const [layout, setLayout] = useState('centrado')
  const [dark, setDark] = useState(true)
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile')
  const [copied, setCopied] = useState(false)

  const url     = `presskit.pro/${slug}`
  const fullUrl = `https://${url}`
  const accent  = primaryColor || '#C026D3'
  const bgColor = dark ? '#0D0D12' : '#F8FAFC'

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-white/[0.04]">
        <p className="font-mono text-[10px] text-white/25 uppercase tracking-[0.2em] mb-1">Panel</p>
        <h1 className="font-display font-semibold text-[28px] tracking-[-0.03em]">
          Vista previa{' '}
          <span className="font-serif italic font-normal text-white/35">de tu presskit</span>
        </h1>
      </div>

      <div className="px-8 py-7 pb-16">
        <div className="grid gap-8" style={{ gridTemplateColumns: '1.5fr 1fr' }}>

          {/* Device frame */}
          <div className="flex flex-col items-center gap-6">
            {/* Viewport toggle */}
            <div className="flex gap-1 p-1 rounded-2xl self-start" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { id: 'mobile',  label: 'Móvil',     Icon: Smartphone },
                { id: 'desktop', label: 'Escritorio', Icon: Monitor },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setViewport(id as 'mobile' | 'desktop')}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] transition-all"
                  style={viewport === id
                    ? { background: '#C026D3', color: '#fff' }
                    : { color: 'rgba(255,255,255,0.40)' }
                  }
                >
                  <Icon className="w-3.5 h-3.5" /> {label}
                </button>
              ))}
            </div>

            <motion.div
              key={viewport}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {viewport === 'mobile' ? (
                <div style={{ perspective: 1200 }}>
                  <div style={{ transform: 'rotateY(-6deg) rotateX(2deg)', transformStyle: 'preserve-3d' }}>
                    <div
                      className="relative rounded-[40px] overflow-hidden"
                      style={{
                        width: 240, height: 480,
                        border: '6px solid rgba(255,255,255,0.08)',
                        background: '#111',
                        boxShadow: `0 50px 80px rgba(0,0,0,0.6), 0 0 60px ${accent}25`,
                      }}
                    >
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />
                      <div className="absolute top-0 left-0 right-0 h-6 z-10 flex items-center justify-between px-6">
                        <span className="text-[7px] font-mono text-white/30">9:41</span>
                        <span className="text-[7px] font-mono text-white/30">●●●</span>
                      </div>
                      <div className="absolute inset-0 overflow-y-auto" style={{ background: bgColor, marginTop: 24 }}>
                        <MiniPresskit layout={layout} dark={dark} accent={accent} artistName={artistName} genre={genre} photoUrl={photoUrl} bio={bio} />
                        <div className="h-10" />
                      </div>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/20" />
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    width: 480, height: 300,
                    border: '4px solid rgba(255,255,255,0.08)',
                    background: bgColor,
                    boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${accent}20`,
                  }}
                >
                  <div className="h-8 flex items-center gap-2 px-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: dark ? '#111' : '#E5E7EB' }}>
                    <div className="flex gap-1">
                      {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
                        <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="flex-1 mx-3 h-5 rounded-md flex items-center px-3" style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                      <span className="text-[8px] font-mono" style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>{url}</span>
                    </div>
                  </div>
                  <div className="overflow-hidden" style={{ height: 'calc(100% - 32px)' }}>
                    <MiniPresskit layout={layout} dark={dark} accent={accent} artistName={artistName} genre={genre} photoUrl={photoUrl} bio={bio} />
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5">
            {/* Layout */}
            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <h3 className="font-display font-semibold text-[16px] tracking-[-0.02em]">Layout</h3>
              <div className="grid grid-cols-2 gap-2">
                {LAYOUTS.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setLayout(id)}
                    className="py-2.5 rounded-xl font-mono text-[10px] tracking-[0.12em] uppercase transition-all"
                    style={layout === id
                      ? { background: '#C026D3', color: '#fff' }
                      : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)' }
                    }
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <h3 className="font-display font-semibold text-[16px] tracking-[-0.02em]">Tema</h3>
              <div className="flex gap-2">
                <button onClick={() => setDark(true)} className="flex-1 py-2.5 rounded-xl text-[13px] transition-all" style={dark ? { background: '#C026D3', color: '#fff' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)' }}>
                  🌙 Oscuro
                </button>
                <button onClick={() => setDark(false)} className="flex-1 py-2.5 rounded-xl text-[13px] transition-all" style={!dark ? { background: '#C026D3', color: '#fff' } : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.40)' }}>
                  ☀️ Claro
                </button>
              </div>
            </div>

            {/* Share */}
            <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <h3 className="font-display font-semibold text-[16px] tracking-[-0.02em]">Compartir</h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="font-mono text-[11px] text-white/50 truncate">{url}</p>
                </div>
                <button
                  onClick={handleCopy}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: copied ? '#10B981' : '#C026D3' }}
                >
                  {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4 text-white" />}
                </button>
              </div>
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-mono text-[11px] uppercase tracking-[0.12em] text-white/50 hover:text-white/80 transition-colors"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Abrir presskit
              </a>
            </div>

            {/* QR */}
            <div className="rounded-2xl p-5 flex flex-col items-center gap-4" style={{ border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.015)' }}>
              <h3 className="font-display font-semibold text-[16px] tracking-[-0.02em] self-start">Código QR</h3>
              <QRCode size={100} />
              <p className="font-mono text-[10px] text-white/20 text-center">Escanea para abrir tu presskit</p>
              <button className="w-full py-2.5 rounded-xl font-mono text-[10px] uppercase tracking-[0.12em] text-white/30 hover:text-white/60 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                Descargar QR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
