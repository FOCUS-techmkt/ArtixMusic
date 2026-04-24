'use client'
import { useState } from 'react'
import { Copy, Check, Monitor, Smartphone } from 'lucide-react'

const LAYOUTS = [
  { id: 'centrado', label: 'Centrado' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'split', label: 'Split' },
  { id: 'raw', label: 'Raw' },
]

// Fake QR code pattern
function QRCode({ size = 120 }: { size?: number }) {
  const cells = 17
  // Deterministic pseudo-random pattern for fake QR
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
    <div
      className="bg-white p-2 rounded-lg"
      style={{ width: size + 16, height: size + 16 }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cells}, ${cellSize}px)`,
          gap: 0,
        }}
      >
        {pattern.flat().map((cell, i) => (
          <div
            key={i}
            style={{
              width: cellSize,
              height: cellSize,
              background: cell ? '#07070B' : 'white',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// Mini presskit content depending on layout
function PressKitContent({
  layout,
  dark,
  accent,
}: {
  layout: string
  dark: boolean
  accent: string
}) {
  const bg = dark ? '#0D0D12' : '#F8FAFC'
  const text = dark ? '#FFFFFF' : '#0D0D12'
  const muted = dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'
  const border = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'

  if (layout === 'centrado') {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-6" style={{ color: text }}>
        <div className="w-16 h-16 rounded-full" style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }} />
        <div className="text-center">
          <p className="font-black tracking-tighter text-sm">VALENTINA M.</p>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: accent }}>HOUSE DJ · BUENOS AIRES</p>
        </div>
        <p className="text-[9px] text-center leading-relaxed" style={{ color: muted }}>
          Productora y DJ radicada en Buenos Aires. 10 años de trayectoria en la escena electrónica latinoamericana.
        </p>
        <div className="flex gap-2 mt-1">
          {['SP', 'IG', 'RA'].map((s) => (
            <div key={s} className="w-6 h-6 rounded-lg text-[7px] font-bold flex items-center justify-center" style={{ background: `${accent}20`, color: accent }}>
              {s}
            </div>
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
            <p className="font-black tracking-tighter text-xs">VALENTINA M.</p>
            <p className="text-[8px] font-mono" style={{ color: accent }}>HOUSE DJ</p>
          </div>
        </div>
        <div className="p-4 flex gap-3">
          <div className="w-12 h-12 rounded-xl shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }} />
          <p className="text-[8px] leading-relaxed" style={{ color: muted }}>
            Productora y DJ radicada en Buenos Aires. 10 años de trayectoria en la escena electrónica latinoamericana.
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
          <p className="font-black tracking-tighter text-[9px] text-center">VALENTINA M.</p>
          <p className="text-[7px] font-mono" style={{ color: accent }}>HOUSE DJ</p>
        </div>
        <div className="w-1/2 flex flex-col justify-center gap-1.5 p-3">
          <p className="text-[8px] leading-relaxed" style={{ color: muted }}>
            Productora y DJ radicada en Buenos Aires con 10 años de trayectoria.
          </p>
          <div className="w-12 h-4 rounded-lg mt-1 text-[7px] font-mono flex items-center justify-center" style={{ background: accent, color: '#fff' }}>
            BOOKING
          </div>
        </div>
      </div>
    )
  }

  // raw
  return (
    <div className="p-4 flex flex-col gap-2" style={{ color: text }}>
      <p className="text-[8px] font-mono tracking-widest" style={{ color: muted }}>PRESSKIT</p>
      <p className="font-black tracking-tighter text-sm">VALENTINA M.</p>
      <p className="text-[8px] font-mono" style={{ color: accent }}>HOUSE DJ · BUENOS AIRES, AR</p>
      <div className="h-px my-1" style={{ background: border }} />
      <p className="text-[7px] leading-relaxed" style={{ color: muted }}>
        Productora y DJ con 10 años de trayectoria. Residente en Club Niceto.
      </p>
      <div className="flex gap-1.5 mt-1">
        {['BOOKING', 'EPK'].map((s) => (
          <div key={s} className="px-2 py-0.5 text-[6px] font-mono border rounded" style={{ borderColor: `${accent}50`, color: accent }}>
            {s}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PreviewPage() {
  const [layout, setLayout] = useState('centrado')
  const [dark, setDark] = useState(true)
  const [viewport, setViewport] = useState<'mobile' | 'desktop'>('mobile')
  const [copied, setCopied] = useState(false)

  const accent = '#C026D3'
  const url = 'presskit.pro/valentina-m'

  function handleCopy() {
    navigator.clipboard.writeText('https://' + url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const bgColor = dark ? '#0D0D12' : '#F8FAFC'

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white">Vista previa</h1>
        <p className="text-white/40 text-sm mt-1 font-mono">
          Previsualiza tu presskit antes de publicarlo.
        </p>
      </div>

      <div className="grid grid-cols-5 gap-8">
        {/* Left: device frame */}
        <div className="col-span-3 flex flex-col items-center gap-6">
          {/* Viewport toggle */}
          <div className="flex gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <button
              onClick={() => setViewport('mobile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                viewport === 'mobile' ? 'bg-[#C026D3] text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Versión móvil
            </button>
            <button
              onClick={() => setViewport('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
                viewport === 'desktop' ? 'bg-[#C026D3] text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Versión escritorio
            </button>
          </div>

          {/* Device frame */}
          {viewport === 'mobile' ? (
            <div
              className="relative"
              style={{
                perspective: '1200px',
              }}
            >
              <div
                style={{
                  transform: 'rotateY(-8deg) rotateX(3deg)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Phone shell */}
                <div
                  className="relative rounded-[40px] border-[6px] border-white/10 overflow-hidden"
                  style={{
                    width: 240,
                    height: 480,
                    background: '#111',
                    boxShadow: `
                      0 50px 80px rgba(0,0,0,0.6),
                      0 0 0 1px rgba(255,255,255,0.05),
                      inset 0 0 0 1px rgba(255,255,255,0.05),
                      0 0 60px ${accent}30
                    `,
                  }}
                >
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20" />
                  {/* Status bar */}
                  <div className="absolute top-0 left-0 right-0 h-6 z-10 flex items-center justify-between px-6 mt-0.5">
                    <span className="text-[7px] font-mono text-white/40">9:41</span>
                    <span className="text-[7px] font-mono text-white/40">●●●</span>
                  </div>
                  {/* Screen */}
                  <div
                    className="absolute inset-0 overflow-y-auto"
                    style={{ background: bgColor, marginTop: 24 }}
                  >
                    <PressKitContent layout={layout} dark={dark} accent={accent} />
                    {/* Waveform bars */}
                    <div className="flex items-end gap-0.5 px-4 h-10 mt-2">
                      {[4,7,12,8,15,10,6,14,9,11,7,13,5,8,12,10,6,9,14,8].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm transition-all"
                          style={{
                            height: h,
                            background: i < 10 ? accent : 'rgba(255,255,255,0.12)',
                          }}
                        />
                      ))}
                    </div>
                    {/* Music tracks */}
                    <div className="px-4 mt-3 flex flex-col gap-1.5">
                      <p className="text-[8px] font-mono tracking-widest" style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                        MÚSICA
                      </p>
                      {['Nocturna EP', 'Pulso', 'Deriva'].map((t) => (
                        <div
                          key={t}
                          className="flex items-center gap-2 p-2 rounded-lg"
                          style={{ background: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                        >
                          <div className="w-6 h-6 rounded-md shrink-0" style={{ background: `${accent}40` }} />
                          <p className="text-[8px] font-semibold" style={{ color: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>{t}</p>
                          <div className="ml-auto w-4 h-4 rounded-full flex items-center justify-center" style={{ background: accent }}>
                            <div className="w-0 h-0" style={{ borderTop: '3px solid transparent', borderBottom: '3px solid transparent', borderLeft: '5px solid white', marginLeft: '1px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Spacer */}
                    <div className="h-10" />
                  </div>
                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          ) : (
            /* Desktop frame */
            <div
              className="relative rounded-2xl border-4 border-white/10 overflow-hidden"
              style={{
                width: '100%',
                maxWidth: 480,
                height: 300,
                background: bgColor,
                boxShadow: `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${accent}20`,
              }}
            >
              {/* Browser chrome */}
              <div className="h-8 border-b border-white/[0.06] flex items-center gap-2 px-3" style={{ background: dark ? '#111' : '#E5E7EB' }}>
                <div className="flex gap-1">
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div
                  className="flex-1 mx-3 h-5 rounded-md flex items-center px-3"
                  style={{ background: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}
                >
                  <span className="text-[8px] font-mono" style={{ color: dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                    presskit.pro/valentina-m
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-full">
                <PressKitContent layout={layout} dark={dark} accent={accent} />
              </div>
            </div>
          )}
        </div>

        {/* Right: controls */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Layout selector */}
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-black tracking-tighter">Layout</h3>
            <div className="grid grid-cols-2 gap-2">
              {LAYOUTS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setLayout(id)}
                  className={`py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all ${
                    layout === id
                      ? 'bg-[#C026D3] text-white'
                      : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60'
                  }`}
                >
                  {label.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Theme toggle */}
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-black tracking-tighter">Tema</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setDark(true)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                  dark
                    ? 'bg-[#C026D3] text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60'
                }`}
              >
                🌙 Oscuro
              </button>
              <button
                onClick={() => setDark(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm transition-all ${
                  !dark
                    ? 'bg-[#C026D3] text-white'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/60'
                }`}
              >
                ☀️ Claro
              </button>
            </div>
          </div>

          {/* Share link */}
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-4">
            <h3 className="font-black tracking-tighter">Compartir link</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5">
                <p className="text-xs font-mono text-white/50 truncate">{url}</p>
              </div>
              <button
                onClick={handleCopy}
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  copied ? 'bg-emerald-500' : 'bg-[#C026D3] hover:bg-[#A21CAF]'
                }`}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-xs text-emerald-400 font-mono text-center">
                ¡Link copiado al portapapeles!
              </p>
            )}
          </div>

          {/* QR code */}
          <div className="border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-4 items-center">
            <h3 className="font-black tracking-tighter self-start">Código QR</h3>
            <QRCode size={120} />
            <p className="text-[10px] font-mono text-white/25 text-center">
              Escanea para abrir tu presskit
            </p>
            <button className="w-full py-2.5 rounded-xl text-xs font-mono border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-colors">
              DESCARGAR QR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
