'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Palette, Link2, BarChart3, Eye, Settings, Zap } from 'lucide-react'

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#C026D3" />
      <path d="M9 8h8.5C20.5 8 23 10.2 23 13.2c0 3-2.5 5.2-5.5 5.2H13v5.6H9V8zm4 8.2h4c1.4 0 2.5-.9 2.5-2.2 0-1.3-1.1-2.2-2.5-2.2h-4v4.4z" fill="white" />
    </svg>
  )
}

const NAV = [
  { href: '/dashboard',           icon: LayoutDashboard, label: 'Dashboard'     },
  { href: '/panel',               icon: Palette,         label: 'Personalizar'  },
  { href: '/dashboard/links',     icon: Link2,           label: 'Links & Redes' },
  { href: '/dashboard/analytics', icon: BarChart3,       label: 'Analíticas'    },
  { href: '/dashboard/preview',   icon: Eye,             label: 'Vista previa'  },
  { href: '/dashboard/settings',  icon: Settings,        label: 'Configuración' },
]

interface Props {
  artistName: string
  genre: string
  initials: string
  photoUrl: string | null
  planDaysLeft: number
}

export default function Sidebar({ artistName, genre, initials, photoUrl, planDaysLeft }: Props) {
  const path = usePathname()

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-[240px] flex flex-col z-50"
      style={{ background: '#08080C', borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Logo */}
      <div className="px-[18px] py-[22px] flex items-center gap-2.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <LogoMark size={26} />
        <div className="flex flex-col leading-none">
          <span className="font-display font-semibold text-[14px] tracking-[0.04em]">
            PRESSKIT<span className="text-[#C026D3]">.PRO</span>
          </span>
          <span className="font-mono text-[9px] text-white/25 tracking-[0.18em] mt-1">EDITORIAL · v2</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active =
            href === '/panel'
              ? path.startsWith('/panel')
              : path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-150"
              style={{
                background:  active ? 'rgba(192,38,211,0.10)' : 'transparent',
                color:       active ? '#E879F9' : 'rgba(255,255,255,0.45)',
                borderLeft:  active ? '2px solid #C026D3' : '2px solid transparent',
                paddingLeft: active ? '10px' : '12px',
              }}
            >
              <Icon className="w-[15px] h-[15px] shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 flex flex-col gap-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Plan chip */}
        <div className="px-3 py-2.5 rounded-[10px]" style={{ background: 'rgba(192,38,211,0.08)', border: '1px solid rgba(192,38,211,0.18)' }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-3 h-3 text-[#C026D3]" />
            <span className="font-mono text-[9px] text-[#E879F9] tracking-[0.18em]">PLAN PRO</span>
          </div>
          <p className="text-[11px] text-white/40">{planDaysLeft} días restantes</p>
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          {photoUrl ? (
            <img src={photoUrl} alt={artistName} className="w-8 h-8 rounded-full object-cover shrink-0" />
          ) : (
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #C026D3, #7C3AED)' }}
            >
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
  )
}
