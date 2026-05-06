'use client'
import { useState, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'
import { usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutDashboard, Palette, BarChart2, FileText,
  Users, Mail, Briefcase, Sparkles, Settings,
} from 'lucide-react'

const BRAND = '#FF2DFF'

function ArtistPulseIsotipo({ size = 28 }: { size?: number }) {
  const h = size
  const w = Math.round(size * 1.2)
  return (
    <svg width={w} height={h} viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="apGrad" x1="30" y1="0" x2="30" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#FF2DFF"/>
          <stop offset="50%"  stopColor="#BA2BFF"/>
          <stop offset="100%" stopColor="#3B0EDB"/>
        </linearGradient>
      </defs>
      {/* Row 1 — 1 dot */}
      <circle cx="30" cy="3.5"  r="3" fill="url(#apGrad)"/>
      {/* Row 2 — 2 dots */}
      <circle cx="23" cy="12"   r="3" fill="url(#apGrad)"/>
      <circle cx="37" cy="12"   r="3" fill="url(#apGrad)"/>
      {/* Row 3 — 3 dots */}
      <circle cx="16" cy="20.5" r="3" fill="url(#apGrad)"/>
      <circle cx="30" cy="20.5" r="3" fill="url(#apGrad)"/>
      <circle cx="44" cy="20.5" r="3" fill="url(#apGrad)"/>
      {/* Row 4 — 3 dots (same width, shift) */}
      <circle cx="16" cy="29"   r="3" fill="url(#apGrad)"/>
      <circle cx="30" cy="29"   r="3" fill="url(#apGrad)"/>
      <circle cx="44" cy="29"   r="3" fill="url(#apGrad)"/>
      {/* Row 5 — 5 dots */}
      <circle cx="5"  cy="37.5" r="3" fill="url(#apGrad)"/>
      <circle cx="16" cy="37.5" r="3" fill="url(#apGrad)"/>
      <circle cx="30" cy="37.5" r="3" fill="url(#apGrad)"/>
      <circle cx="44" cy="37.5" r="3" fill="url(#apGrad)"/>
      <circle cx="55" cy="37.5" r="3" fill="url(#apGrad)"/>
      {/* Row 6 — 7 dots */}
      <circle cx="1"  cy="46"   r="3" fill="url(#apGrad)"/>
      <circle cx="10" cy="46"   r="3" fill="url(#apGrad)"/>
      <circle cx="21" cy="46"   r="3" fill="url(#apGrad)"/>
      <circle cx="30" cy="46"   r="3" fill="url(#apGrad)"/>
      <circle cx="39" cy="46"   r="3" fill="url(#apGrad)"/>
      <circle cx="50" cy="46"   r="3" fill="url(#apGrad)"/>
      <circle cx="59" cy="46"   r="3" fill="url(#apGrad)"/>
    </svg>
  )
}

const NAV = [
  { href: '/dashboard',               tab: null,        icon: LayoutDashboard, label: 'Resumen'    },
  { href: '/dashboard?tab=editor',    tab: 'editor',    icon: Palette,         label: 'Mi Sitio'   },
  { href: '/dashboard?tab=analytics', tab: 'analytics', icon: BarChart2,       label: 'Analíticas' },
  { href: '/dashboard?tab=content',   tab: 'content',   icon: FileText,        label: 'Contenido'  },
  { href: '/dashboard?tab=fans',      tab: 'fans',      icon: Users,           label: 'Fans'       },
  { href: '/dashboard?tab=email',     tab: 'email',     icon: Mail,            label: 'Email',      badge: 'PRONTO' },
  { href: '/dashboard?tab=booker',    tab: 'booker',    icon: Briefcase,       label: 'Booker',     badge: 'NUEVO'  },
  { href: '/dashboard?tab=ai',        tab: 'ai',        icon: Sparkles,        label: 'AI',         badge: 'IA'     },
  { href: '/dashboard/settings',      tab: null,        icon: Settings,        label: 'Configuración' },
]

const BOTTOM_NAV = NAV.slice(0, 5)

// Inner nav that reads search params (needs Suspense boundary)
function NavLinks({ onClose }: { onClose: () => void }) {
  const path = usePathname()
  const sp   = useSearchParams()
  const tab  = sp.get('tab')

  return (
    <>
      {NAV.map(({ href, tab: navTab, icon: Icon, label, badge }) => {
        const active = navTab
          ? path === '/dashboard' && tab === navTab
          : navTab === null && href === '/dashboard/settings'
            ? path.startsWith('/dashboard/settings')
            : path === '/dashboard' && !tab && href === '/dashboard'
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-[10px] text-[13px] font-medium transition-all duration-150"
            style={{
              padding:     '10px 12px',
              paddingLeft: active ? '10px' : '12px',
              background:  active ? `${BRAND}15` : 'transparent',
              color:       active ? '#FF8BFF' : 'rgba(255,255,255,0.45)',
              borderLeft:  active ? `2px solid ${BRAND}` : '2px solid transparent',
            }}
          >
            <Icon className="w-[15px] h-[15px] shrink-0" />
            <span className="flex-1">{label}</span>
            {badge && (
              <span className="font-mono text-[8px] px-1.5 py-0.5 rounded-full"
                style={{ background: `${BRAND}20`, color: '#FF8BFF' }}>
                {badge}
              </span>
            )}
          </Link>
        )
      })}
    </>
  )
}

function BottomNavLinks() {
  const path = usePathname()
  const sp   = useSearchParams()
  const tab  = sp.get('tab')

  return (
    <>
      {BOTTOM_NAV.map(({ href, tab: navTab, icon: Icon, label }) => {
        const active = navTab
          ? path === '/dashboard' && tab === navTab
          : path === '/dashboard' && !tab
        return (
          <Link
            key={href}
            href={href}
            className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
            style={{ color: active ? BRAND : 'rgba(255,255,255,0.30)' }}
          >
            <Icon className="w-5 h-5" />
            <span className="font-mono text-[8px] uppercase tracking-[0.08em]">{label.split(' ')[0]}</span>
          </Link>
        )
      })}
    </>
  )
}

interface ShellProps {
  children:    React.ReactNode
  artistName:  string
  genre:       string
  initials:    string
  photoUrl:    string | null
  planDaysLeft: number
  editorMode?: boolean
}

export default function DashboardShell({
  children, artistName, genre, initials, photoUrl, planDaysLeft, editorMode = false,
}: ShellProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen text-white flex" style={{ background: '#0A0A0F' }}>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[240px] flex flex-col z-50
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ background: '#08080C', borderRight: '1px solid rgba(255,255,255,0.05)' }}
      >
        {/* Logo */}
        <div className="px-[18px] py-[20px] flex items-center gap-3 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <ArtistPulseIsotipo size={22} />
          <div className="flex flex-col leading-none min-w-0">
            <span className="font-display font-black text-[13px] tracking-[0.08em] text-white">
              ARTIST<span style={{ color: BRAND }}> PULSE</span>
            </span>
            <span className="font-mono text-[8px] text-white/25 tracking-[0.18em] mt-0.5">AI-POWERED</span>
          </div>
          <button onClick={() => setOpen(false)} className="ml-auto lg:hidden text-white/30 hover:text-white/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          <Suspense fallback={null}>
            <NavLinks onClose={() => setOpen(false)} />
          </Suspense>
        </nav>

        {/* Bottom */}
        <div className="p-3 flex flex-col gap-2.5 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {(() => {
            const urgentColor = planDaysLeft <= 7 ? '#EF4444' : planDaysLeft <= 15 ? '#F59E0B' : BRAND
            const pct = Math.max(0, Math.min(100, Math.round((planDaysLeft / 30) * 100)))
            return (
              <div className="px-3 py-2.5 rounded-[10px] flex flex-col gap-2"
                style={{ background: `${urgentColor}10`, border: `1px solid ${urgentColor}25` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3 h-3" style={{ color: urgentColor }} />
                    <span className="font-mono text-[9px] tracking-[0.18em]" style={{ color: urgentColor === BRAND ? '#FF8BFF' : urgentColor }}>PLAN PRO</span>
                  </div>
                  <span className="font-mono text-[9px]" style={{ color: urgentColor === BRAND ? 'rgba(255,255,255,0.3)' : urgentColor }}>
                    {planDaysLeft}d
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: urgentColor }} />
                </div>
                {planDaysLeft <= 15 && (
                  <a href="/dashboard/settings?section=plan"
                    className="text-center text-[9px] font-mono font-semibold py-1 rounded-md transition-opacity hover:opacity-80"
                    style={{ background: urgentColor, color: '#fff' }}>
                    Renovar plan →
                  </a>
                )}
              </div>
            )
          })()}
          <div className="flex items-center gap-2.5 px-1 py-1">
            {photoUrl ? (
              <img src={photoUrl} alt={artistName} className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${BRAND}, #7C3AED)` }}>
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">{artistName}</p>
              <p className="font-mono text-[9px] text-white/25 tracking-[0.1em] truncate uppercase">{genre}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[240px]">
        {/* Mobile top bar */}
        <div className="flex lg:hidden items-center justify-between px-4 h-14 shrink-0 sticky top-0 z-30"
          style={{ background: '#08080C', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => setOpen(true)} className="p-2 -ml-2 text-white/40 hover:text-white transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <ArtistPulseIsotipo size={18} />
            <span className="font-display font-black text-[12px] tracking-[0.08em]">
              ARTIST<span style={{ color: BRAND }}> PULSE</span>
            </span>
          </div>
          <div className="w-9" />
        </div>

        <main className={`flex-1 ${editorMode ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="flex lg:hidden items-center border-t sticky bottom-0 z-30"
          style={{ background: '#08080C', borderColor: 'rgba(255,255,255,0.06)' }}>
          <Suspense fallback={null}>
            <BottomNavLinks />
          </Suspense>
        </nav>
      </div>
    </div>
  )
}
