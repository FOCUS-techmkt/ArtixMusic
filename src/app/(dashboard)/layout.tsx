'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Palette, Link2, BarChart3, Eye, Settings, Zap } from 'lucide-react'

function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="7" fill="#C026D3" />
      <path
        d="M9 8h8.5C20.5 8 23 10.2 23 13.2c0 3-2.5 5.2-5.5 5.2H13v5.6H9V8zm4 8.2h4c1.4 0 2.5-.9 2.5-2.2 0-1.3-1.1-2.2-2.5-2.2h-4v4.4z"
        fill="white"
      />
    </svg>
  )
}

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/customize', icon: Palette, label: 'Personalizar' },
  { href: '/dashboard/links', icon: Link2, label: 'Links & Redes' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analíticas' },
  { href: '/dashboard/preview', icon: Eye, label: 'Vista previa' },
  { href: '/dashboard/settings', icon: Settings, label: 'Configuración' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  return (
    <div className="min-h-screen bg-[#07070B] text-white flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[260px] border-r border-white/[0.06] flex flex-col z-50 bg-[#07070B]">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-center gap-2.5">
          <LogoMark size={26} />
          <span className="font-bold text-base tracking-widest">
            PRESSKIT<span className="text-[#C026D3]">.PRO</span>
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active =
              path === href || (href !== '/dashboard' && path.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                  active
                    ? 'bg-[#C026D3]/10 text-[#E879F9] border-l-2 border-[#C026D3] pl-[10px]'
                    : 'text-white/45 hover:text-white/80 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: plan badge + avatar */}
        <div className="p-3 border-t border-white/[0.06] flex flex-col gap-3">
          {/* Plan badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#C026D3]/10 border border-[#C026D3]/20">
            <Zap className="w-3.5 h-3.5 text-[#C026D3] shrink-0" />
            <div>
              <p className="text-[10px] font-mono text-[#C026D3] tracking-widest">
                PRO · 14 días gratis
              </p>
              <p className="text-[9px] text-white/30 font-mono">Expira en 12 días</p>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C026D3] to-[#7C3AED] flex items-center justify-center text-xs font-bold shrink-0">
              VM
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">Valentina M.</p>
              <p className="text-[10px] text-white/30 font-mono truncate">DJ · Buenos Aires</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-[260px] flex-1 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
