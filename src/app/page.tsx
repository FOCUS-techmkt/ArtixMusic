'use client'

import { useState, useEffect, useRef } from 'react'
import './artix-styles.css'
import './artix-sections.css'

// ============ CURSOR ============
function Cursor() {
  const haloRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const halo = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf: number

    const move = (e: MouseEvent) => {
      halo.tx = e.clientX
      halo.ty = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
      }
    }

    const loop = () => {
      halo.x += (halo.tx - halo.x) * 0.15
      halo.y += (halo.ty - halo.y) * 0.15
      if (haloRef.current) {
        haloRef.current.style.transform = `translate(${halo.x}px, ${halo.y}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)

    const hoverables = 'a, button, .btn, input, .faq-item, .for-card, .testimonial, .feat-card, .swatch, .opt, .variant-switcher button'
    const onEnter = () => {
      haloRef.current?.classList.add('hover')
      dotRef.current?.classList.add('hover')
    }
    const onLeave = () => {
      haloRef.current?.classList.remove('hover')
      dotRef.current?.classList.remove('hover')
    }
    document.querySelectorAll(hoverables).forEach((el) => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  })

  return (
    <>
      <div ref={haloRef} className="cursor-halo" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  )
}

// ============ REVEAL ON SCROLL ============
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

// ============ LOGO MARK ============
function LogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0" stopColor="#e8ddff" />
          <stop offset="0.5" stopColor="#c084fc" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M12 2 L22 20 L17 20 L12 11 L7 20 L2 20 Z" fill="url(#lg)" />
      <circle cx="12" cy="17" r="1.5" fill="#0a0a12" />
    </svg>
  )
}

// ============ NAV ============
function Nav() {
  return (
    <nav className="top">
      <div className="logo">
        <LogoMark />
        ARTIX
      </div>
      <ul>
        <li><a href="#features">Producto</a></li>
        <li><a href="#social">Artistas</a></li>
        <li><a href="#pricing">Precios</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>
      <div className="nav-cta">
        <a href="#cta" className="btn btn-ghost btn-sm">Iniciar sesión</a>
        <a href="#cta" className="btn btn-primary btn-sm">Early access <span className="arrow">→</span></a>
      </div>
    </nav>
  )
}

// ============ HERO VARIANTS ============
function HeroDashboard() {
  return (
    <div className="hero-visual">
      <div className="hero-site-card">
        <div className="hsc-chrome">
          <span className="dot" /><span className="dot" /><span className="dot" />
          <div className="hsc-url">🔒 solen.fm</div>
          <div className="hsc-actions">⌕ ↗</div>
        </div>
        <div className="hsc-cover">
          <div className="hsc-portrait">
            <div className="hsc-portrait-placeholder">
              <div className="hsc-portrait-tag">[ hi-res photo ]</div>
              <div className="hsc-portrait-noise" />
            </div>
          </div>
          <div className="hsc-cover-text">
            <div className="hsc-badge"><span className="led" />LIVE · Berghain esta noche</div>
            <div className="hsc-name">SOLEN.</div>
            <div className="hsc-sub">Melodic Techno · Berlin / Barcelona</div>
          </div>
          <div className="hsc-nav">
            <span className="on">Música</span><span>Tour</span><span>Press</span><span>Booking</span>
          </div>
        </div>
        <div className="hsc-body">
          <div className="hsc-release">
            <div className="hsc-release-art" />
            <div className="hsc-release-info">
              <div className="hsc-release-tag">LAST RELEASE · AURORA EP</div>
              <div className="hsc-release-title">Midnight Protocol</div>
              <div className="hsc-release-wf">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span key={i} style={{ height: `${20 + Math.abs(Math.sin(i * 0.6)) * 80}%`, animationDelay: `${i * 0.04}s` }} />
                ))}
              </div>
              <div className="hsc-release-meta">02:47 / 07:42</div>
            </div>
          </div>
          <div className="hsc-shows">
            <div className="hsc-show"><div className="hsc-show-d">23<span>MAY</span></div><div className="hsc-show-v">Berghain · Berlin</div><div className="hsc-show-s">Sold out</div></div>
            <div className="hsc-show"><div className="hsc-show-d">07<span>JUN</span></div><div className="hsc-show-v">Hï Ibiza · Ibiza</div><div className="hsc-show-s hot">72% vendido</div></div>
            <div className="hsc-show"><div className="hsc-show-d">14<span>JUN</span></div><div className="hsc-show-v">Sónar · Barcelona</div><div className="hsc-show-s">Tickets →</div></div>
          </div>
        </div>
      </div>
      <div className="float-chip chip-1"><span className="led" />+340 leads · 7d</div>
      <div className="float-chip chip-2"><span className="led" />Booking · Awakenings</div>
      <div className="float-chip chip-3"><span className="led" />IA · Apunta Tokio</div>
    </div>
  )
}

function HeroOrb() {
  return (
    <div className="hero-orb-wrap">
      <div className="orb-rings"><div className="ring" /><div className="ring" /><div className="ring" /></div>
      <div className="orb" />
      <div className="float-chip chip-1"><span className="led" />Frecuencia · 432 Hz</div>
      <div className="float-chip chip-2"><span className="led" />Audiencia · 8.2K</div>
      <div className="float-chip chip-3"><span className="led" />Shows · +14 mes</div>
    </div>
  )
}

function HeroWaveform() {
  return (
    <div className="hero-waveform-full">
      <div className="wf-meta"><span className="rec" />LIVE · ANÁLISIS IA</div>
      <div className="big-wave">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="bar" style={{ animationDelay: `${(i * 0.03) % 1.6}s`, height: `${30 + Math.abs(Math.sin(i * 0.35)) * 70}%` }} />
        ))}
      </div>
      <div className="wf-time">00:02:47 / 04:12</div>
      <div className="wf-track">Track · Midnight Protocol</div>
    </div>
  )
}

function Hero({ variant, setVariant }: { variant: string; setVariant: (v: string) => void }) {
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = heroRef.current?.querySelector('.mouse-grid') as HTMLDivElement | null
    if (!container) return
    container.innerHTML = ''
    const cols = 18, rows = 12
    const dots: HTMLDivElement[] = []
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const d = document.createElement('div')
        d.className = 'mg-dot'
        d.style.left = `${(c / (cols - 1)) * 100}%`
        d.style.top = `${(r / (rows - 1)) * 100}%`
        container.appendChild(d)
        dots.push(d)
      }
    }
    const handler = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      dots.forEach((d) => {
        const dx = d.offsetLeft - mx
        const dy = d.offsetTop - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        const factor = Math.max(0, 1 - dist / 260)
        d.style.opacity = String(0.2 + factor * 0.8)
        d.style.transform = `scale(${1 + factor * 3})`
      })
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-bg">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />
        <div className="grid-overlay" />
        <div className="mouse-grid" />
      </div>
      <div className="wrap">
        <div className="hero-inner">
          <div>
            <div className="eyebrow reveal">Early access · Abril 2026</div>
            <h1 className="reveal delay-1">
              El <span className="serif-italic iridescent">sistema operativo</span> de tu carrera musical.
            </h1>
            <p className="hero-sub reveal delay-2">
              Tu web, tu press kit, tu audiencia y tus datos — unificados en una sola plataforma impulsada por IA. Sin depender de nadie.
            </p>
            <div className="hero-ctas reveal delay-3">
              <a href="#cta" className="btn btn-neon">
                Solicitar early access <span className="arrow">→</span>
              </a>
              <a href="#features" className="btn btn-ghost">
                Ver cómo funciona
              </a>
            </div>
            <div className="hero-stats reveal delay-4">
              <div className="stat">
                <div className="n">3 min</div>
                <div className="l">Configuración</div>
              </div>
              <div className="stat">
                <div className="n">+2,400</div>
                <div className="l">Artistas en lista</div>
              </div>
              <div className="stat">
                <div className="n">0€</div>
                <div className="l">Hasta el lanzamiento</div>
              </div>
            </div>
          </div>
          <div className="reveal delay-2">
            {variant === 'dashboard' && <HeroDashboard />}
            {variant === 'orb' && <HeroOrb />}
            {variant === 'waveform' && <HeroWaveform />}
          </div>
        </div>
      </div>
      <div className="variant-switcher">
        <button className={variant === 'dashboard' ? 'on' : ''} onClick={() => setVariant('dashboard')}>Perfil</button>
        <button className={variant === 'orb' ? 'on' : ''} onClick={() => setVariant('orb')}>Aura</button>
        <button className={variant === 'waveform' ? 'on' : ''} onClick={() => setVariant('waveform')}>Signal</button>
      </div>
    </section>
  )
}

// ============ PROBLEM ============
function Problem() {
  return (
    <section className="problem">
      <div className="wrap">
        <div className="section-head reveal" style={{ textAlign: 'center', margin: '0 auto 80px', maxWidth: 800 }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>01 · El problema</div>
          <h2>Un link de bio no es <span className="serif-italic iridescent">una carrera.</span></h2>
          <p style={{ margin: '24px auto 0' }}>Así se ve hoy la presencia digital de un artista. Así debería verse.</p>
        </div>

        <div className="compare-wrap reveal delay-1">
          <div className="compare-side compare-before">
            <div className="compare-tag">
              <span className="led bad" />ANTES · Linktree / bio en IG
            </div>
            <div className="compare-phone">
              <div className="lt-mock">
                <div className="lt-avatar" />
                <div className="lt-handle">@kora_music</div>
                <div className="lt-bio">DJ / Producer · Bookings DM</div>
                <div className="lt-btn lt-anim" style={{ animationDelay: '0s' }}>🎵 Spotify</div>
                <div className="lt-btn broken lt-anim" style={{ animationDelay: '0.1s' }}>🔗 Press kit (404)</div>
                <div className="lt-btn lt-anim" style={{ animationDelay: '0.2s' }}>📧 kora.music.info@gma...</div>
                <div className="lt-btn lt-anim" style={{ animationDelay: '0.3s' }}>📱 Instagram</div>
                <div className="lt-btn lt-anim" style={{ animationDelay: '0.4s' }}>☁️ Soundcloud</div>
                <div className="lt-btn lt-anim" style={{ animationDelay: '0.5s' }}>📀 Beatport</div>
                <div className="lt-btn lt-anim" style={{ animationDelay: '0.6s' }}>▶️ YouTube</div>
                <div className="lt-btn lt-anim" style={{ animationDelay: '0.7s', opacity: 0.5 }}>💼 Booking form (Drive)</div>
                <div className="lt-watermark">powered by linktree</div>
                <div className="lt-stamp">GENÉRICO</div>
              </div>
            </div>
            <ul className="compare-cons">
              <li><span className="x">×</span>Diseño genérico de plantilla</li>
              <li><span className="x">×</span>Cero datos de quién clickeó</li>
              <li><span className="x">×</span>Audiencia no es tuya</li>
              <li><span className="x">×</span>Bookers no te toman en serio</li>
              <li><span className="x">×</span>Archivos dispersos en Drive</li>
            </ul>
          </div>

          <div className="compare-divider">
            <div className="compare-arrow">→</div>
            <div className="compare-arrow-label">ARTIX</div>
          </div>

          <div className="compare-side compare-after">
            <div className="compare-tag">
              <span className="led good" />AHORA · tu web ARTIX
            </div>
            <div className="compare-site">
              <div className="cs-chrome">
                <span className="dot" /><span className="dot" /><span className="dot" />
                <div className="cs-url">solen.fm</div>
                <div className="cs-ssl">🔒</div>
              </div>
              <div className="cs-hero-photo">
                <div className="cs-photo-placeholder">
                  <span className="cs-photo-tag">[ editorial photo ]</span>
                </div>
                <div className="cs-hero-overlay-text">
                  <div className="cs-hero-name">SOLEN.</div>
                  <div className="cs-hero-role">Melodic Techno · Berlín</div>
                </div>
                <div className="cs-live-badge"><span className="led" />LIVE tonight · Berghain</div>
              </div>
              <div className="cs-hero-nav">
                <span>Música</span><span>Shows</span><span>Press</span><span>Booking</span>
              </div>
              <div className="cs-panels">
                <div className="cs-panel">
                  <div className="cs-panel-l">PRÓXIMO SHOW</div>
                  <div className="cs-panel-v">Berghain · 23.05</div>
                  <div className="cs-panel-wave">
                    {Array.from({ length: 18 }).map((_, i) => (
                      <span key={i} style={{ height: `${30 + Math.abs(Math.sin(i * 0.7)) * 60}%`, animationDelay: `${i * 0.05}s` }} />
                    ))}
                  </div>
                </div>
                <div className="cs-panel">
                  <div className="cs-panel-l">NUEVO EP</div>
                  <div className="cs-panel-v">Aurora · esta semana</div>
                  <div className="cs-panel-lead"><span className="cs-led" />+340 pre-saves hoy</div>
                </div>
              </div>
              <div className="cs-cta-row">
                <div className="cs-cta-primary">Reservar entrada →</div>
                <div className="cs-cta-ghost">Press kit</div>
              </div>
              <div className="cs-stamp">PREMIUM</div>
            </div>
            <ul className="compare-pros">
              <li><span className="ok">✓</span>Diseño único con IA</li>
              <li><span className="ok">✓</span>Cada visita = lead capturado</li>
              <li><span className="ok">✓</span>Audiencia tuya para siempre</li>
              <li><span className="ok">✓</span>Press kit + rider profesional</li>
              <li><span className="ok">✓</span>Vende tickets y drops directo</li>
            </ul>
          </div>
        </div>

        <div className="compare-results reveal delay-2">
          <div className="cr-item">
            <div className="cr-n">×3</div>
            <div className="cr-l">Más bookings<br />en 90 días</div>
          </div>
          <div className="cr-item">
            <div className="cr-n">×7</div>
            <div className="cr-l">Conversión<br />vs Linktree</div>
          </div>
          <div className="cr-item">
            <div className="cr-n">0%</div>
            <div className="cr-l">Dependencia<br />del algoritmo</div>
          </div>
          <div className="cr-item">
            <div className="cr-n">100%</div>
            <div className="cr-l">Datos de<br />tu audiencia</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ TRANSFORMATION ============
const ARTIST_PROFILES = [
  {
    id: 'solen',
    name: 'SOLEN.',
    handle: 'solen.fm',
    role: 'Melodic Techno · DJ / Producer',
    location: 'Berlín · Barcelona',
    since: 'Desde 2018',
    bio: 'Solen construye paisajes sonoros hipnóticos entre el techno melódico y el progressive. Residente en Watergate Berlín y Hï Ibiza, ha actuado en Tomorrowland, Sónar y Awakenings.',
    stats: { plays: '4.2M', monthly: '184K', shows: '87', followers: '312K' },
    tracks: [
      { n: '01', t: 'Midnight Protocol', d: '07:42', ep: 'Aurora EP · 2026' },
      { n: '02', t: 'Chrome Dust', d: '06:18', ep: 'Aurora EP · 2026' },
      { n: '03', t: 'Signal / Noise', d: '08:04', ep: 'Single · 2025' },
      { n: '04', t: 'Solar Drift', d: '07:56', ep: 'Parallel LP · 2025' },
      { n: '05', t: 'Berlin Requiem', d: '09:12', ep: 'Parallel LP · 2025' },
    ],
    shows: [
      { d: '23 MAY', v: 'Berghain · Klubnacht', c: 'Berlín' },
      { d: '07 JUN', v: 'Hï Ibiza · Main Room', c: 'Ibiza' },
      { d: '14 JUN', v: 'Sónar Festival', c: 'Barcelona' },
      { d: '28 JUN', v: 'Awakenings', c: 'Ámsterdam' },
      { d: '12 JUL', v: 'Tomorrowland · Crystal Garden', c: 'Boom' },
    ],
    press: ['Mixmag', 'Resident Advisor', 'DJ Mag Top 100', 'Beatport Charts'],
  },
  {
    id: 'okara',
    name: 'OKARA',
    handle: 'okara.fm',
    role: 'Afrohouse · DJ / Live',
    location: 'Johannesburgo · Londres',
    since: 'Desde 2015',
    bio: 'Okara fusiona raíces sudafricanas con house progresivo. Giras por África, Europa y Norteamérica. Colaboraciones con sellos como Innervisions y Rise Music.',
    stats: { plays: '12.8M', monthly: '620K', shows: '142', followers: '890K' },
    tracks: [
      { n: '01', t: 'Ancestral Code', d: '08:22', ep: 'Roots / Future · 2026' },
      { n: '02', t: 'Black Sun', d: '07:14', ep: 'Roots / Future · 2026' },
      { n: '03', t: 'Umfundisi (Remix)', d: '09:48', ep: 'Single · 2025' },
    ],
    shows: [
      { d: '18 MAY', v: 'Fabric London', c: 'Londres' },
      { d: '01 JUN', v: 'Afrikan Basement', c: 'Nueva York' },
      { d: '21 JUN', v: 'Kappa FuturFestival', c: 'Turín' },
    ],
    press: ['Mixmag', 'DJ Mag África', 'Boiler Room'],
  },
  {
    id: 'vela',
    name: 'VELA DRIFT',
    handle: 'veladrift.fm',
    role: 'Minimal · DJ / Producer',
    location: 'Ámsterdam',
    since: 'Desde 2020',
    bio: 'Sonido minimal con texturas orgánicas. Residente en De School y DGTL. Cinco EPs auto-editados, más de 200K oyentes mensuales en Spotify.',
    stats: { plays: '2.1M', monthly: '214K', shows: '64', followers: '128K' },
    tracks: [
      { n: '01', t: 'Quiet Machines', d: '06:32', ep: 'Grain EP · 2026' },
      { n: '02', t: 'Soft Architecture', d: '07:08', ep: 'Grain EP · 2026' },
      { n: '03', t: 'Static Bloom', d: '08:14', ep: 'Single · 2026' },
    ],
    shows: [
      { d: '30 MAY', v: 'De School', c: 'Ámsterdam' },
      { d: '15 JUN', v: 'DGTL Festival', c: 'Ámsterdam' },
      { d: '05 JUL', v: 'Nitsa Club', c: 'Barcelona' },
    ],
    press: ['Mixmag Holanda', 'Beatport'],
  },
]

function Transformation() {
  const [active, setActive] = useState('solen')
  const artist = ARTIST_PROFILES.find((a) => a.id === active)!

  return (
    <section className="transform-sec">
      <div className="wrap">
        <div className="transform-title reveal" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ marginBottom: 28 }}>02 · Esto es lo que construyes</div>
          <h2>
            Perfiles de <span className="serif-italic iridescent">nivel internacional.</span>
          </h2>
          <p style={{ maxWidth: 620, margin: '28px auto 0', color: 'var(--fg-2)', fontSize: '1.1rem' }}>
            Tres ejemplos reales de lo que los artistas crean en ARTIX. Cámbialos y explora. Todo generado con IA en 3 minutos.
          </p>
        </div>

        <div className="profile-selector reveal delay-1">
          {ARTIST_PROFILES.map((p) => (
            <button
              key={p.id}
              className={`ps-btn ${active === p.id ? 'on' : ''}`}
              onClick={() => setActive(p.id)}
            >
              <span className="ps-dot" />
              {p.name}
              <span className="ps-role">{p.role.split(' · ')[0]}</span>
            </button>
          ))}
        </div>

        <div className="profile-showcase" key={artist.id}>
          <div className="ps-chrome">
            <div className="ps-chrome-dots">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
            <div className="ps-chrome-url">🔒 {artist.handle}</div>
            <div className="ps-chrome-actions">
              <span>⌕</span><span>↗</span>
            </div>
          </div>
          <div className="ps-scroll">
            <div className="ps-hero">
              <div className="ps-hero-img">
                <div className="ps-placeholder">[ foto de artista ]</div>
                <div className="ps-hero-overlay">
                  <div className="ps-hero-name">{artist.name}</div>
                  <div className="ps-hero-meta">
                    <span>{artist.role}</span>
                    <span>·</span>
                    <span>{artist.location}</span>
                    <span>·</span>
                    <span>{artist.since}</span>
                  </div>
                  <div className="ps-hero-ctas">
                    <div className="ps-cta-primary">▶ Reproducir última release</div>
                    <div className="ps-cta-ghost">Booking / Contacto</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="ps-stats-bar">
              <div className="ps-stat"><div className="ps-stat-n">{artist.stats.plays}</div><div className="ps-stat-l">Reproducciones totales</div></div>
              <div className="ps-stat"><div className="ps-stat-n">{artist.stats.monthly}</div><div className="ps-stat-l">Oyentes mensuales</div></div>
              <div className="ps-stat"><div className="ps-stat-n">{artist.stats.shows}</div><div className="ps-stat-l">Shows confirmados</div></div>
              <div className="ps-stat"><div className="ps-stat-n">{artist.stats.followers}</div><div className="ps-stat-l">Seguidores totales</div></div>
            </div>

            <div className="ps-grid">
              <div className="ps-block">
                <div className="ps-block-h">Bio</div>
                <p className="ps-bio">{artist.bio}</p>
                <div className="ps-press">
                  <div className="ps-block-h ps-block-sub">Featured in</div>
                  <div className="ps-press-logos">
                    {artist.press.map((p, i) => <span key={i} className="ps-press-logo">{p}</span>)}
                  </div>
                </div>
              </div>
              <div className="ps-block">
                <div className="ps-block-h">Latest tracks</div>
                <div className="ps-tracks-list">
                  {artist.tracks.map((t) => (
                    <div className="ps-track" key={t.n}>
                      <span className="ps-track-play" />
                      <span className="ps-track-n">{t.n}</span>
                      <div className="ps-track-info">
                        <span className="ps-track-t">{t.t}</span>
                        <span className="ps-track-ep">{t.ep}</span>
                      </div>
                      <span className="ps-track-d">{t.d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ps-shows">
              <div className="ps-block-h">Próximas fechas · World tour</div>
              <div className="ps-shows-list">
                {artist.shows.map((s, i) => (
                  <div className="ps-show" key={i}>
                    <div className="ps-show-date">{s.d}</div>
                    <div className="ps-show-info">
                      <div className="ps-show-v">{s.v}</div>
                      <div className="ps-show-c">{s.c}</div>
                    </div>
                    <div className="ps-show-btn">Tickets →</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ps-kit">
              <div className="ps-block-h">Professional Kit</div>
              <div className="ps-kit-grid">
                <div className="ps-kit-item"><div className="ps-kit-icon">📄</div><div className="ps-kit-label">Press Kit EN/ES</div><div className="ps-kit-sub">PDF · 2.4 MB</div></div>
                <div className="ps-kit-item"><div className="ps-kit-icon">🎛</div><div className="ps-kit-label">Technical Rider</div><div className="ps-kit-sub">v2.1 · actualizado</div></div>
                <div className="ps-kit-item"><div className="ps-kit-icon">📷</div><div className="ps-kit-label">Hi-Res Photos</div><div className="ps-kit-sub">12 fotos · ZIP</div></div>
                <div className="ps-kit-item"><div className="ps-kit-icon">📑</div><div className="ps-kit-label">Hospitality</div><div className="ps-kit-sub">Auto-enviado</div></div>
              </div>
            </div>

            <div className="ps-scrollhint">↓ desliza para explorar el perfil completo</div>
          </div>
        </div>

        <div className="transform-caption reveal delay-3">
          <span>100% personalizable</span>
          <span>Dominio propio</span>
          <span>Generado en 3 min</span>
          <span>Actualizado en vivo</span>
        </div>
      </div>
    </section>
  )
}

// ============ FEATURES ============
const FEATURES = [
  { num: '01', title: 'Web profesional', accent: 'en 3 minutos', desc: 'Describe tu estilo. La IA construye una web única con tu música, tu estética y tu dominio propio. Sin código. Sin plantillas genéricas.', viz: 'prompt' },
  { num: '02', title: 'Press kit y rider,', accent: 'siempre listos', desc: 'Bio, fotos alta resolución, rider técnico, hospitality. Un enlace para mandar a cualquier booker. Siempre actualizado.', viz: 'presskit' },
  { num: '03', title: 'Captura leads', accent: 'que son tuyos', desc: 'Cada visitante es un fan potencial. Emails reales, segmentados y exportables. Tu audiencia no vive en Instagram.', viz: 'leads' },
  { num: '04', title: 'Email marketing', accent: 'sin fricción', desc: 'Campañas para anunciar lanzamientos, shows o drops. Tasas de apertura 3× superiores a redes sociales.', viz: 'email' },
  { num: '05', title: 'Dashboard', accent: 'en tiempo real', desc: 'Visitas, reproducciones, crecimiento, conversión. Todo en una sola vista. Sabes exactamente qué funciona.', viz: 'analytics' },
  { num: '06', title: 'IA que te', accent: 'sugiere la siguiente jugada', desc: 'Analiza tu carrera y te dice qué contenido publicar, a qué ciudades apuntar, con qué artistas colaborar.', viz: 'ai' },
  { num: '07', title: 'Integración', accent: 'con todo', desc: 'Spotify, Apple Music, Beatport, Bandcamp, SoundCloud. Sincronización automática de tu catálogo.', viz: 'music' },
]

function FeatureViz({ kind }: { kind: string }) {
  if (kind === 'prompt') return (
    <div className="feat-viz viz-prompt">
      <div className="prompt-line">DJ techno · minimal · berlín underground</div>
      <div className="prompt-line">paleta: morado iridiscente + chrome</div>
      <div className="prompt-out">Generando web<span className="dots"><span /><span /><span /></span></div>
    </div>
  )
  if (kind === 'presskit') return (
    <div className="feat-viz viz-presskit">
      <div className="pk-row"><span className="l">Bio EN</span><span className="v ok">✓ OK</span></div>
      <div className="pk-row"><span className="l">Bio ES</span><span className="v ok">✓ OK</span></div>
      <div className="pk-row"><span className="l">Rider</span><span className="v ok">v2.1</span></div>
      <div className="pk-row"><span className="l">Fotos HR</span><span className="v">12</span></div>
      <div className="pk-row full"><span className="l">Enlace pública</span><span className="v">artix.fm/solen/press</span></div>
    </div>
  )
  if (kind === 'leads') return (
    <div className="feat-viz viz-leads">
      <div className="leads-count">8,247<span className="d">+340 / 7d</span></div>
      <div className="lead-row"><span className="em">lucas@eu.music</span><span className="tag">BOOKER</span></div>
      <div className="lead-row"><span className="em">mia@razzmatazz.com</span><span className="tag">VENUE</span></div>
      <div className="lead-row"><span className="em">alex@...fan.com</span><span className="tag">FAN</span></div>
    </div>
  )
  if (kind === 'email') return (
    <div className="feat-viz viz-email">
      <div className="em-row"><span className="st" /><span className="subj">Tour 2026 · 14 fechas</span><span className="rate">52% OPEN</span></div>
      <div className="em-row"><span className="st" /><span className="subj">Nuevo EP · Midnight Protocol</span><span className="rate">61% OPEN</span></div>
      <div className="em-row"><span className="st" /><span className="subj">Lista VIP · early access</span><span className="rate">74% OPEN</span></div>
      <div className="em-row"><span className="st pending" /><span className="subj">Borrador · Summer residency</span><span className="rate">—</span></div>
    </div>
  )
  if (kind === 'analytics') return (
    <div className="feat-viz viz-analytics">
      <div className="an-caption">VISITAS · ÚLTIMOS 30D</div>
      <svg viewBox="0 0 400 180" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#a855f7" stopOpacity="0.4" />
            <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0,140 C40,120 80,130 120,100 S200,60 260,70 S340,40 400,30 L400,180 L0,180 Z" fill="url(#gr)" />
        <path d="M0,140 C40,120 80,130 120,100 S200,60 260,70 S340,40 400,30" fill="none" stroke="#c084fc" strokeWidth="2" />
        <circle cx="400" cy="30" r="4" fill="#fff" />
        <circle cx="400" cy="30" r="10" fill="#a855f7" opacity="0.3" />
      </svg>
      <div className="an-val">124,824<span className="d">+38%</span></div>
    </div>
  )
  if (kind === 'ai') return (
    <div className="feat-viz viz-ai">
      <div className="ai-tip"><span className="tag">IA · Crecimiento</span>Tu audiencia crece 2.4× más rápido en Berlín. Considera un show allí en Q2.</div>
      <div className="ai-tip"><span className="tag">IA · Colaboración</span>3 artistas con audiencia afín buscan featurings este mes.</div>
    </div>
  )
  if (kind === 'music') return (
    <div className="feat-viz viz-music">
      <div className="platform-row"><span className="dot" /><span className="name">Spotify</span><span className="n">84.2K</span></div>
      <div className="platform-row"><span className="dot" /><span className="name">Beatport</span><span className="n">12 tracks</span></div>
      <div className="platform-row"><span className="dot" /><span className="name">SoundCloud</span><span className="n">38.1K</span></div>
      <div className="platform-row"><span className="dot" /><span className="name">Bandcamp</span><span className="n">4 albums</span></div>
    </div>
  )
  return null
}

function Features() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    const fill = fillRef.current
    if (!wrap || !track) return
    const onScroll = () => {
      const rect = wrap.getBoundingClientRect()
      const total = wrap.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.max(0, Math.min(1, scrolled / total))
      const scrollWidth = track.scrollWidth - window.innerWidth + 96
      track.style.transform = `translateX(${-progress * scrollWidth}px)`
      if (fill) fill.style.width = `${progress * 100}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="features" id="features">
      <div className="features-sticky" ref={wrapRef}>
        <div className="features-pin">
          <div className="features-head">
            <div className="eyebrow reveal">03 · Producto</div>
            <h2 className="reveal delay-1">Siete herramientas.<br /><span className="serif-italic iridescent">Una sola plataforma.</span></h2>
            <p className="reveal delay-2">Cada pieza diseñada para artistas que toman su carrera en serio. Desplázate para explorar.</p>
          </div>
          <div className="features-track-wrap">
            <div className="features-track" ref={trackRef}>
              {FEATURES.map((f) => (
                <div className="feat-card" key={f.num}>
                  <div className="feat-num">{f.num} / 07</div>
                  <h3>{f.title} <span className="accent">{f.accent}</span></h3>
                  <p>{f.desc}</p>
                  <FeatureViz kind={f.viz} />
                </div>
              ))}
            </div>
            <div className="hscroll-bar"><div className="fill" ref={fillRef} /></div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ MONETIZE ============
function Monetize() {
  const [step, setStep] = useState(0)
  const steps = [
    { k: 'capture', t: 'Captura', d: 'Un visitante deja su email por un unreleased track.' },
    { k: 'segment', t: 'Segmenta', d: 'La IA clasifica: fan, booker, venue, media, VIP.' },
    { k: 'launch', t: 'Lanza', d: 'Envías entradas, drops o música directa a quien importa.' },
    { k: 'convert', t: 'Convierte', d: 'Tickets vendidos, releases en top, data 100% tuya.' },
  ]

  useEffect(() => {
    const iv = setInterval(() => setStep((s) => (s + 1) % 4), 3200)
    return () => clearInterval(iv)
  }, [])

  return (
    <section className="monetize" id="monetize">
      <div className="wrap">
        <div className="section-head reveal" style={{ textAlign: 'center', margin: '0 auto 80px', maxWidth: 840 }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>03 · Monetización directa</div>
          <h2>De un email <span className="serif-italic iridescent">a un sold out.</span></h2>
          <p style={{ margin: '24px auto 0' }}>Los emails que capturas no son lista, son una máquina de ventas. Lanza música, vende entradas y conoce a tu audiencia — todo desde el mismo sitio.</p>
        </div>

        <div className="flow-wrap reveal delay-1">
          <div className="flow-steps">
            {steps.map((s, i) => (
              <div key={s.k} className={`flow-step ${step === i ? 'on' : ''}`} onClick={() => setStep(i)}>
                <div className="flow-step-num">0{i + 1}</div>
                <div className="flow-step-t">{s.t}</div>
                <div className="flow-step-d">{s.d}</div>
              </div>
            ))}
            <div className="flow-line"><div className="flow-line-fill" style={{ width: `${(step / 3) * 100}%` }} /></div>
          </div>

          <div className="flow-demo">
            <div className="flow-demo-panel flow-capture">
              <div className="fd-label">CAPTURA EN TU WEB</div>
              <div className="fd-mock-form">
                <div className="fd-title">Unlock · Aurora EP preview</div>
                <div className="fd-sub">Accede al EP 48h antes del drop oficial.</div>
                <div className="fd-input">tu-email@...</div>
                <div className="fd-btn">Acceder →</div>
                <div className="fd-count"><span className="led" />2,847 ya dentro</div>
              </div>
            </div>
            <div className="flow-demo-panel flow-segment">
              <div className="fd-label">SEGMENTACIÓN IA · AUTOMÁTICA</div>
              <div className="fd-segments">
                <div className="fd-seg"><div className="fd-seg-tag fan">FANS</div><div className="fd-seg-n">6,840</div></div>
                <div className="fd-seg"><div className="fd-seg-tag vip">VIP</div><div className="fd-seg-n">418</div></div>
                <div className="fd-seg"><div className="fd-seg-tag booker">BOOKERS</div><div className="fd-seg-n">127</div></div>
                <div className="fd-seg"><div className="fd-seg-tag media">MEDIA</div><div className="fd-seg-n">64</div></div>
              </div>
              <div className="fd-meta">→ Cada uno recibe mensajes diferentes</div>
            </div>
            <div className="flow-demo-panel flow-launch">
              <div className="fd-label">CAMPAÑAS ACTIVAS</div>
              <div className="fd-campaigns">
                <div className="fd-camp"><div className="fd-camp-ico">🎫</div><div className="fd-camp-info"><div className="fd-camp-t">Berlín · 23.05 · Berghain</div><div className="fd-camp-s">A VIPs + Fans Alemania</div></div><div className="fd-camp-n">740 vendidas</div></div>
                <div className="fd-camp"><div className="fd-camp-ico">💿</div><div className="fd-camp-info"><div className="fd-camp-t">Aurora EP · 48h early access</div><div className="fd-camp-s">A todos los fans</div></div><div className="fd-camp-n">61% open</div></div>
                <div className="fd-camp"><div className="fd-camp-ico">🎛</div><div className="fd-camp-info"><div className="fd-camp-t">Press release · Summer Tour</div><div className="fd-camp-s">A 64 contactos media</div></div><div className="fd-camp-n">18 features</div></div>
              </div>
            </div>
            <div className="flow-demo-panel flow-convert">
              <div className="fd-label">RESULTADOS · ÚLTIMOS 30 DÍAS</div>
              <div className="fd-results">
                <div className="fd-result"><div className="fd-result-n">€18,240</div><div className="fd-result-l">Tickets vendidos directo</div></div>
                <div className="fd-result"><div className="fd-result-n">2,847</div><div className="fd-result-l">Pre-saves EP</div></div>
                <div className="fd-result"><div className="fd-result-n">×4.2</div><div className="fd-result-l">ROI vs Instagram ads</div></div>
                <div className="fd-result"><div className="fd-result-n">100%</div><div className="fd-result-l">Datos tuyos</div></div>
              </div>
            </div>
            <div className="flow-demo-active" style={{ transform: `translateX(-${step * 100}%)` }}>
              <div className="fda-label">{steps[step].t.toUpperCase()}</div>
            </div>
          </div>
        </div>

        <div className="monetize-pillars reveal delay-2">
          <div className="mp-item">
            <div className="mp-viz mp-tickets">
              <div className="mp-ticket">
                <div className="mp-ticket-stub">
                  <div className="mp-ticket-date">23<span>MAY</span></div>
                </div>
                <div className="mp-ticket-body">
                  <div className="mp-ticket-venue">BERGHAIN</div>
                  <div className="mp-ticket-sub">Klubnacht · Berlin</div>
                  <div className="mp-ticket-qr">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <span key={i} style={{ opacity: (i * 7 + 3) % 3 === 0 ? 1 : 0.15 }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mp-ticket mp-ticket-2">
                <div className="mp-ticket-stub"><div className="mp-ticket-date">07<span>JUN</span></div></div>
                <div className="mp-ticket-body">
                  <div className="mp-ticket-venue">HÏ IBIZA</div>
                  <div className="mp-ticket-sub">Main Room</div>
                </div>
              </div>
            </div>
            <div className="mp-t">Vende entradas directo</div>
            <div className="mp-d">Sin comisiones de ticketeras. El 100% de la venta es tuyo. QR automático al comprador.</div>
            <div className="mp-metric"><span className="mp-metric-n">0%</span> comisión · <span className="mp-metric-n">€18K</span> vendidos este mes</div>
          </div>

          <div className="mp-item">
            <div className="mp-viz mp-release">
              <div className="mp-release-art">
                <div className="mp-release-shape" />
                <div className="mp-release-title">AURORA EP</div>
                <div className="mp-release-artist">SOLEN.</div>
              </div>
              <div className="mp-release-bars">
                <div className="mp-release-bar"><span>Pre-saves</span><div className="mp-bar-track"><div className="mp-bar-fill" style={{ width: '84%' }} /></div><span className="mp-bar-n">2,847</span></div>
                <div className="mp-release-bar"><span>Early access</span><div className="mp-bar-track"><div className="mp-bar-fill" style={{ width: '62%' }} /></div><span className="mp-bar-n">1,420</span></div>
                <div className="mp-release-bar"><span>Bundle vinilo</span><div className="mp-bar-track"><div className="mp-bar-fill" style={{ width: '38%' }} /></div><span className="mp-bar-n">180</span></div>
              </div>
            </div>
            <div className="mp-t">Lanza música a tu base</div>
            <div className="mp-d">Pre-saves, early access y bundles físicos. Tus fans escuchan antes que en plataformas.</div>
            <div className="mp-metric"><span className="mp-metric-n">48h</span> antes · <span className="mp-metric-n">61%</span> open rate</div>
          </div>

          <div className="mp-item">
            <div className="mp-viz mp-data">
              <div className="mp-data-file">
                <div className="mp-data-head">
                  <span className="mp-data-ico">⬇</span>
                  <div>
                    <div className="mp-data-name">audience_export.csv</div>
                    <div className="mp-data-size">8,247 rows · 1.2 MB</div>
                  </div>
                </div>
                <div className="mp-data-rows">
                  <div className="mp-data-row"><span>lucas@</span><span className="mp-tag-mini booker">BOOK</span></div>
                  <div className="mp-data-row"><span>mia@razz</span><span className="mp-tag-mini venue">VENUE</span></div>
                  <div className="mp-data-row"><span>alex@fan</span><span className="mp-tag-mini fan">FAN</span></div>
                  <div className="mp-data-row"><span>sara@ed</span><span className="mp-tag-mini media">MEDIA</span></div>
                </div>
                <div className="mp-data-scan" />
              </div>
              <div className="mp-data-badges">
                <span>GDPR</span><span>CSV</span><span>API</span>
              </div>
            </div>
            <div className="mp-t">Tu data, tu propiedad</div>
            <div className="mp-d">Exporta en un click. Cumplimiento GDPR total. Tu lista es tuya — hoy y siempre.</div>
            <div className="mp-metric"><span className="mp-metric-n">100%</span> portable · <span className="mp-metric-n">1 click</span> export</div>
          </div>

          <div className="mp-item">
            <div className="mp-viz mp-reengage">
              <div className="mp-re-chart">
                <svg viewBox="0 0 220 90" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="re-gr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#a855f7" stopOpacity="0.5" />
                      <stop offset="1" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,70 C30,65 50,72 80,60 L80,60 L80,30 C100,28 140,50 170,20 S200,10 220,8" fill="none" stroke="#555" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M0,70 C30,65 50,72 80,60" fill="none" stroke="#888" strokeWidth="2" />
                  <path d="M80,60 C100,28 140,50 170,20 S200,10 220,8" fill="none" stroke="#c084fc" strokeWidth="2.5" />
                  <path d="M80,60 C100,28 140,50 170,20 S200,10 220,8 L220,90 L80,90 Z" fill="url(#re-gr)" />
                  <circle cx="80" cy="60" r="4" fill="#fff" />
                  <circle cx="80" cy="60" r="10" fill="#a855f7" opacity="0.25" />
                </svg>
                <div className="mp-re-label mp-re-before">fríos</div>
                <div className="mp-re-label mp-re-after">re-activados</div>
                <div className="mp-re-trigger">
                  <span className="led" />IA detectó 340 fans inactivos
                </div>
              </div>
              <div className="mp-re-flow">
                <div className="mp-re-step">💤<span>inactivo</span></div>
                <div className="mp-re-arrow">→</div>
                <div className="mp-re-step">✉️<span>mail IA</span></div>
                <div className="mp-re-arrow">→</div>
                <div className="mp-re-step">🔥<span>activo</span></div>
              </div>
            </div>
            <div className="mp-t">Re-engagement automático</div>
            <div className="mp-d">La IA detecta fans fríos y los reactiva con contenido personalizado. Tú no mueves un dedo.</div>
            <div className="mp-metric"><span className="mp-metric-n">24%</span> reactivación · <span className="mp-metric-n">0</span> esfuerzo</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ SOCIAL ============
const ARTISTS_TICKER = [
  'SOLEN.', 'OKARA', 'VELA DRIFT', 'NOVA SIGNAL', 'LUMEN //',
  'KAIRÓS', 'ECHOWAVE', 'NIGHT MODE', 'BRUTAL MIRAGE', 'ZENITH·01',
]
const TESTIMONIALS = [
  { q: 'Pasé de mandar 6 archivos a cada booker a mandar un solo link. Mis bookings se duplicaron en 3 meses.', n: 'SOLEN.', r: 'DJ / Producer · Berlín' },
  { q: 'Vendí 740 entradas de mi show en Berghain directo a mi lista. Sin comisiones. Sin intermediarios.', n: 'OKARA', r: 'Afrohouse · Johannesburgo' },
  { q: 'La IA me sugirió apuntar a México para mi tour. Acerté tres fechas agotadas. No me lo esperaba.', n: 'VELA DRIFT', r: 'Minimal · Ámsterdam' },
]

function Social() {
  return (
    <section className="social" id="social">
      <div className="ticker">
        <div className="ticker-inner">
          {[...ARTISTS_TICKER, ...ARTISTS_TICKER].map((name, i) => (
            <span className="ticker-item" key={i}>{name}</span>
          ))}
        </div>
      </div>
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">04 · Artistas en ARTIX</div>
          <h2>La plataforma donde los <span className="serif-italic iridescent">artistas serios</span> construyen carrera.</h2>
        </div>
        <div className="testimonials">
          {TESTIMONIALS.map((t, i) => (
            <div className={`testimonial reveal delay-${i + 1}`} key={i}>
              <div className="quote-mark">&ldquo;</div>
              <p className="quote">{t.q}</p>
              <div className="meta">
                <div className="av" />
                <div><div className="n">{t.n}</div><div className="r">{t.r}</div></div>
              </div>
            </div>
          ))}
        </div>
        <div className="social-metrics reveal">
          <div className="metric"><div className="n">2,400<span className="u">+</span></div><div className="l">Artistas en waitlist</div></div>
          <div className="metric"><div className="n">3<span className="u">×</span></div><div className="l">Más bookings promedio</div></div>
          <div className="metric"><div className="n">47<span className="u">%</span></div><div className="l">Open rate medio</div></div>
          <div className="metric"><div className="n">€2.4M</div><div className="l">Tickets vendidos directo</div></div>
        </div>
      </div>
    </section>
  )
}

// ============ FOR WHO ============
const WHO = [
  {
    num: '01', t: 'DJs',
    role: 'Para residentes y headliners',
    benefits: ['Press kit siempre actualizado', 'Booking form profesional', 'Rider técnico auto-enviado', 'Calendario de shows integrado'],
    result: { n: '×3', l: 'más bookings en 90 días' },
    quote: 'Los promotores no preguntan dos veces.',
  },
  {
    num: '02', t: 'Productores',
    role: 'Para quien lanza música',
    benefits: ['Lanzamientos a tu base propia', 'Pre-saves automáticos', 'Venta de bundles físicos', 'Integración Bandcamp / Beatport'],
    result: { n: '+61%', l: 'open rate en releases' },
    quote: 'Mis fans escuchan antes que en Spotify.',
  },
  {
    num: '03', t: 'Emergentes',
    role: 'Para los que empiezan en serio',
    benefits: ['Imagen pro desde día uno', 'Sin coste hasta facturar', 'Plantillas de pitch a sellos', 'Comunidad de artistas'],
    result: { n: '3 min', l: 'para estar online' },
    quote: 'Parezco un artista de 5 años de carrera.',
  },
  {
    num: '04', t: 'Profesionales',
    role: 'Para carreras establecidas',
    benefits: ['Analítica avanzada multi-ciudad', 'Sugerencias IA de estrategia', 'Venta directa de tickets', 'Multi-idioma automático'],
    result: { n: '€2M+', l: 'gestionado al año' },
    quote: 'Escalamos sin contratar equipo.',
  },
]

function ForWho() {
  const [active, setActive] = useState(0)
  const who = WHO[active]
  return (
    <section className="for-who" id="for-who">
      <div className="wrap">
        <div className="section-head reveal">
          <div className="eyebrow">05 · Para quién es</div>
          <h2>Si tu carrera depende de <span className="serif-italic iridescent">ti mismo,</span> esto es para ti.</h2>
        </div>
        <div className="who-layout reveal delay-1">
          <div className="who-tabs">
            {WHO.map((w, i) => (
              <button
                key={w.num}
                className={`who-tab ${active === i ? 'on' : ''}`}
                onClick={() => setActive(i)}
              >
                <div className="who-tab-num">{w.num}</div>
                <div className="who-tab-body">
                  <div className="who-tab-t">{w.t}</div>
                  <div className="who-tab-r">{w.role}</div>
                </div>
                <div className="who-tab-arrow">→</div>
              </button>
            ))}
          </div>
          <div className="who-display" key={who.num}>
            <div className="who-display-head">
              <div className="who-display-t">
                {who.t}
                <span className="who-display-sub">· {who.role}</span>
              </div>
            </div>
            <div className="who-display-grid">
              <div className="who-benefits">
                <div className="who-block-h">Lo que consigues</div>
                <ul>
                  {who.benefits.map((b, i) => (
                    <li key={i}><span className="who-check">✓</span>{b}</li>
                  ))}
                </ul>
              </div>
              <div className="who-result">
                <div className="who-result-n">{who.result.n}</div>
                <div className="who-result-l">{who.result.l}</div>
                <div className="who-quote">&ldquo;{who.quote}&rdquo;</div>
              </div>
            </div>
            <div className="who-bg-shape" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ FAQ ============
const FAQ_ITEMS = [
  { q: '¿Necesito saber de diseño o programación?', a: 'No. Describes tu estilo en una frase y la IA genera tu web. Luego puedes editar lo que quieras con clicks.' },
  { q: '¿Cuánto tarda la configuración inicial?', a: 'Unos 3 minutos. Generación con IA, conexión de tus redes y dominio. Luego afinas detalles cuando quieras.' },
  { q: '¿Puedo usar mi propio dominio?', a: 'Sí. Conecta cualquier dominio que ya tengas o compra uno desde la plataforma.' },
  { q: '¿Qué pasa con mis emails si dejo ARTIX?', a: 'Tu lista de leads es tuya. La exportas en CSV cuando quieras, sin restricciones. Cumplimiento GDPR completo.' },
  { q: '¿Cobráis comisión por venta de tickets?', a: '0% de comisión durante el primer año en plan Founder. Después, la más baja del mercado (2% vs 10-15% habitual).' },
  { q: '¿Cuándo está disponible?', a: 'Abrimos en oleadas desde abril 2026. Los primeros 500 artistas reciben plan Pro gratis durante un año.' },
]

function FAQ() {
  const [open, setOpen] = useState(0)
  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="section-head reveal" style={{ textAlign: 'center', margin: '0 auto 70px' }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>06 · Preguntas</div>
          <h2>Todo lo que necesitas <span className="serif-italic iridescent">saber.</span></h2>
        </div>
        <div className="faq-list reveal">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className={`faq-item ${open === i ? 'open' : ''}`} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">{item.q}<div className="faq-plus">+</div></div>
              <div className="faq-a">{item.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ============ PRICING ============
function Pricing() {
  return (
    <section className="pricing-teaser" id="pricing">
      <div className="wrap">
        <div className="section-head reveal" style={{ textAlign: 'center', margin: '0 auto 70px' }}>
          <div className="eyebrow" style={{ marginBottom: 24 }}>07 · Early access</div>
          <h2>Los primeros 500 artistas <br />entran <span className="serif-italic iridescent">gratis.</span></h2>
        </div>
        <div className="pricing-card reveal">
          <div>
            <div className="tier">Plan Pro · Founder access</div>
            <h3>Todo incluido. Un año.</h3>
            <p>Web IA, press kit, rider, emails ilimitados, analítica avanzada, sugerencias IA, dominio personalizado, 0% comisión en tickets.</p>
            <ul className="perks">
              <li>Web con IA ilimitada</li>
              <li>Press kit profesional</li>
              <li>Emails ilimitados</li>
              <li>Dashboard completo</li>
              <li>Sugerencias IA</li>
              <li>Dominio propio</li>
              <li>0% comisión tickets</li>
              <li>Badge Founder perpetuo</li>
            </ul>
          </div>
          <div className="price-col">
            <div className="price">0<span className="ct">€ / año</span></div>
            <div className="price-note">Después · 29€ / mes</div>
            <a href="#cta" className="btn btn-neon">Reclamar mi acceso <span className="arrow">→</span></a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============ CTA ============
function CTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="cta-final" id="cta">
      <div className="wrap">
        <div className="eyebrow reveal">Cupos limitados · Oleada de abril</div>
        <h2 className="reveal delay-1">
          Toma tu carrera <br />
          <span className="serif-italic iridescent">en serio.</span>
        </h2>
        <p className="reveal delay-2">
          Únete a los 2,400 artistas que ya aseguraron su acceso. Los primeros 500 entran gratis durante un año.
        </p>
        {!submitted ? (
          <form className="cta-form reveal delay-3" onSubmit={handle}>
            <input
              type="email"
              placeholder="tu-email@artista.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-neon">
              Reservar <span className="arrow">→</span>
            </button>
          </form>
        ) : (
          <div className="cta-success reveal">
            ✓ Reservado · Revisa tu email en 2 minutos.
          </div>
        )}
        <div className="form-meta reveal delay-4">
          <span><span className="led" />2,847 artistas reservados</span>
          <span>Sin tarjeta</span>
          <span>Cancela cuando quieras</span>
        </div>
      </div>
    </section>
  )
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="foot-logo"><LogoMark />ARTIX</div>
            <p>El sistema operativo de la carrera musical. Para artistas que no esperan a nadie.</p>
          </div>
          <div className="foot-col">
            <h5>Producto</h5>
            <ul>
              <li><a href="#features">Generador web IA</a></li>
              <li><a href="#features">Press kit</a></li>
              <li><a href="#features">Analytics</a></li>
              <li><a href="#features">Email marketing</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Artistas</h5>
            <ul>
              <li><a href="#social">Casos de éxito</a></li>
              <li><a href="#social">Comunidad</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Empresa</h5>
            <ul>
              <li><a href="#">Manifiesto</a></li>
              <li><a href="#">Prensa</a></li>
              <li><a href="#">Carreras</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Términos</a></li>
              <li><a href="#">Privacidad</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="copy">© 2026 ARTIX · Todos los derechos reservados</div>
          <div className="socials">
            <a href="#">IG</a>
            <a href="#">X</a>
            <a href="#">TT</a>
            <a href="#">SC</a>
          </div>
        </div>
      </div>
      <div className="foot-mega"><span>ARTIX.</span></div>
    </footer>
  )
}

// ============ TWEAKS PANEL ============
const ACCENT_PRESETS: Record<string, { a1: string; a2: string; a3: string; chrome: string }> = {
  purple: { a1: '#a855f7', a2: '#c084fc', a3: '#7c3aed', chrome: '#e8ddff' },
  blue:   { a1: '#3b82f6', a2: '#60a5fa', a3: '#1d4ed8', chrome: '#dbeafe' },
  cyan:   { a1: '#06b6d4', a2: '#67e8f9', a3: '#0e7490', chrome: '#cffafe' },
  pink:   { a1: '#ec4899', a2: '#f9a8d4', a3: '#be185d', chrome: '#fce7f3' },
  green:  { a1: '#10b981', a2: '#6ee7b7', a3: '#047857', chrome: '#d1fae5' },
}
const FONT_PRESETS: Record<string, { display: string; body: string }> = {
  grotesk: { display: "'Space Grotesk', sans-serif", body: "'Inter', sans-serif" },
  serif:   { display: "'Instrument Serif', serif", body: "'Inter', sans-serif" },
  anton:   { display: "'Anton', sans-serif", body: "'Inter', sans-serif" },
}

function Tweaks({ values, set, on }: { values: { accent: string; font: string }; set: (p: Partial<{ accent: string; font: string }>) => void; on: boolean }) {
  return (
    <div className={`tweaks-panel ${on ? 'on' : ''}`}>
      <h4>Tweaks <span className="c">ARTIX · LIVE</span></h4>
      <div className="tw-row">
        <div className="tw-label">Acento</div>
        <div className="swatches">
          {Object.entries(ACCENT_PRESETS).map(([k, v]) => (
            <div
              key={k}
              className={`swatch ${values.accent === k ? 'on' : ''}`}
              style={{ background: `linear-gradient(135deg, ${v.a2}, ${v.a1}, ${v.a3})` }}
              onClick={() => set({ accent: k })}
            />
          ))}
        </div>
      </div>
      <div className="tw-row">
        <div className="tw-label">Tipografía display</div>
        <div className="opts">
          {Object.keys(FONT_PRESETS).map((k) => (
            <div
              key={k}
              className={`opt ${values.font === k ? 'on' : ''}`}
              onClick={() => set({ font: k })}
            >
              {k}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============ PAGE ============
const TWEAK_DEFAULTS = { accent: 'purple', font: 'grotesk' }

export default function Page() {
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS)
  const [tweaksOn] = useState(false)
  const [heroVariant, setHeroVariant] = useState('dashboard')

  useReveal()

  useEffect(() => {
    setHeroVariant(localStorage.getItem('artix_hero_variant') || 'dashboard')
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const p = ACCENT_PRESETS[tweaks.accent] || ACCENT_PRESETS.purple
    root.style.setProperty('--a1', p.a1)
    root.style.setProperty('--a2', p.a2)
    root.style.setProperty('--a3', p.a3)
    root.style.setProperty('--chrome', p.chrome)
  }, [tweaks.accent])

  useEffect(() => {
    const root = document.documentElement
    const f = FONT_PRESETS[tweaks.font] || FONT_PRESETS.grotesk
    root.style.setProperty('--font-display', f.display)
    root.style.setProperty('--font-body', f.body)
  }, [tweaks.font])

  useEffect(() => {
    localStorage.setItem('artix_hero_variant', heroVariant)
  }, [heroVariant])

  const updateTweak = (patch: Partial<typeof TWEAK_DEFAULTS>) => {
    setTweaks((prev) => ({ ...prev, ...patch }))
  }

  return (
    <>
      <Cursor />
      <div className="world-bg" />
      <Nav />
      <Hero variant={heroVariant} setVariant={setHeroVariant} />
      <Problem />
      <Transformation />
      <Features />
      <Monetize />
      <Social />
      <ForWho />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
      <Tweaks values={tweaks} set={updateTweak} on={tweaksOn} />
    </>
  )
}
