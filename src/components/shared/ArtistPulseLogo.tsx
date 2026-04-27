import React from 'react'

// Dot-matrix pyramid logo — replicates the Artist Pulse brand mark
const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9]
const DOT_R   = 2.6
const DOT_GAP = 7.2

function Isotipo({ color = '#AAFF00', size = 56 }: { color?: string; size?: number }) {
  const maxDots = ROWS[ROWS.length - 1]
  const w = (maxDots - 1) * DOT_GAP + DOT_R * 2
  const h = (ROWS.length - 1) * DOT_GAP + DOT_R * 2
  const scale = size / Math.max(w, h)

  const dots: React.ReactNode[] = []
  ROWS.forEach((count, row) => {
    const offsetX = ((maxDots - count) / 2) * DOT_GAP
    for (let col = 0; col < count; col++) {
      const x = offsetX + col * DOT_GAP + DOT_R
      const y = row * DOT_GAP + DOT_R
      // Dim outer dots slightly for depth
      const dist = Math.abs(col - (count - 1) / 2) / ((count - 1) / 2 || 1)
      const opacity = 1 - dist * 0.35
      dots.push(
        <circle key={`${row}-${col}`} cx={x} cy={y} r={DOT_R} fill={color} fillOpacity={opacity} />
      )
    }
  })

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size * (h / w)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Artist Pulse isotipo">
      {dots}
    </svg>
  )
}

interface LogoProps {
  variant?: 'full' | 'icon' | 'horizontal'
  color?:   string
  size?:    number
  className?: string
}

export default function ArtistPulseLogo({ variant = 'full', color = '#AAFF00', size = 40, className = '' }: LogoProps) {
  if (variant === 'icon') {
    return <Isotipo color={color} size={size} />
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Isotipo color={color} size={size * 0.9} />
        <div className="flex flex-col leading-none">
          <span className="font-display font-black tracking-[0.15em] uppercase text-white"
            style={{ fontSize: size * 0.38, letterSpacing: '0.15em' }}>
            Artist Pulse
          </span>
          <span className="font-mono uppercase tracking-[0.2em]"
            style={{ fontSize: size * 0.14, color, marginTop: 2 }}>
            AI-Powered for Artists
          </span>
        </div>
      </div>
    )
  }

  // Full (stacked)
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Isotipo color={color} size={size} />
      <div className="text-center">
        <p className="font-display font-black tracking-[0.2em] uppercase text-white"
          style={{ fontSize: size * 0.22 }}>
          Artist Pulse
        </p>
        <p className="font-mono tracking-[0.18em] uppercase"
          style={{ fontSize: size * 0.1, color, marginTop: 2 }}>
          AI-Powered Software
        </p>
      </div>
    </div>
  )
}

// Standalone isotipo export
export { Isotipo as ArtistPulseIcon }
