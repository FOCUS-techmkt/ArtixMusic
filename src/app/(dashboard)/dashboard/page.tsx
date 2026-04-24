'use client'
import { useState } from 'react'
import {
  TrendingUp,
  MousePointerClick,
  Download,
  Share2,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Music,
  Image,
  FileText,
  User,
  Link2,
  Zap,
  ChevronRight,
} from 'lucide-react'

const STATS = [
  {
    label: 'Visitas totales',
    value: '1,247',
    change: '+12%',
    positive: true,
    icon: TrendingUp,
    color: '#C026D3',
  },
  {
    label: 'Clics booking',
    value: '38',
    change: '+34%',
    positive: true,
    icon: MousePointerClick,
    color: '#7C3AED',
  },
  {
    label: 'Descargas EPK',
    value: '12',
    change: '+8%',
    positive: true,
    icon: Download,
    color: '#0EA5E9',
  },
  {
    label: 'Links compartidos',
    value: '5',
    change: '0%',
    positive: false,
    icon: Share2,
    color: '#10B981',
  },
]

const CHECKLIST = [
  { label: 'Añade tu foto de perfil', done: true, icon: User },
  { label: 'Escribe tu biografía', done: true, icon: FileText },
  { label: 'Conecta tus plataformas de música', done: true, icon: Music },
  { label: 'Sube fotos a tu galería', done: false, icon: Image },
  { label: 'Configura tu link de booking', done: false, icon: Link2 },
]

const QUICK_ACCESS = [
  { label: 'Subir música', icon: Music, color: '#C026D3', href: '/dashboard/customize' },
  { label: 'Editar bio', icon: FileText, color: '#7C3AED', href: '/dashboard/customize' },
  { label: 'Ver analytics', icon: TrendingUp, color: '#0EA5E9', href: '/dashboard/analytics' },
]

function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
  color,
}: (typeof STATS)[0]) {
  return (
    <div className="flex-1 min-w-0 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{label}</span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black tracking-tighter text-white">{value}</p>
        <p
          className={`text-xs font-mono mt-1 ${
            positive ? 'text-emerald-400' : 'text-white/30'
          }`}
        >
          {change} vs. periodo anterior
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [copied, setCopied] = useState(false)
  const url = 'presskit.pro/valentina-m'

  function handleCopy() {
    navigator.clipboard.writeText('https://' + url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const doneCount = CHECKLIST.filter((i) => i.done).length

  return (
    <div className="p-8 max-w-6xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tighter text-white">
          Hola, Valentina 👋
        </h1>
        <p className="text-white/40 text-sm mt-1 font-mono">
          Tu presskit está activo y recibiendo visitas. Aquí tu resumen del día.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Presskit card + checklist row */}
      <div className="grid grid-cols-5 gap-6">
        {/* Presskit preview card */}
        <div className="col-span-3 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-black tracking-tighter text-lg">Tu presskit</h2>
              <p className="text-white/40 text-xs font-mono mt-0.5">{url}</p>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              ACTIVO
            </span>
          </div>

          {/* Mini iPhone */}
          <div className="flex justify-center">
            <div
              className="relative rounded-[28px] border-2 border-white/10 overflow-hidden"
              style={{
                width: 160,
                height: 280,
                background: '#0D0D12',
                boxShadow: '0 0 60px #C026D330',
              }}
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-b-xl z-10" />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col">
                {/* Hero */}
                <div
                  className="flex-1 flex flex-col items-center justify-center gap-1"
                  style={{
                    background: 'linear-gradient(180deg, #2D003A 0%, #07070B 100%)',
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C026D3] to-[#7C3AED] mt-5" />
                  <p className="text-white text-[10px] font-black tracking-tight mt-1">
                    VALENTINA M.
                  </p>
                  <p className="text-[#C026D3] text-[7px] font-mono tracking-widest">
                    HOUSE DJ
                  </p>
                </div>
                {/* Bottom nav mock */}
                <div className="h-8 border-t border-white/10 flex items-center justify-around px-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-4 h-1 rounded-full bg-white/20" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <a
              href={`https://${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C026D3] text-white text-sm font-semibold hover:bg-[#A21CAF] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Ver en vivo
            </a>
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] text-white/70 text-sm font-semibold hover:bg-white/[0.06] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Compartir URL
                </>
              )}
            </button>
          </div>
        </div>

        {/* Checklist */}
        <div className="col-span-2 border border-white/[0.06] bg-white/[0.02] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-black tracking-tighter text-lg">Completa tu perfil</h2>
            <span className="text-xs font-mono text-white/40">
              {doneCount}/{CHECKLIST.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#C026D3] to-[#7C3AED] transition-all"
              style={{ width: `${(doneCount / CHECKLIST.length) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-2">
            {CHECKLIST.map(({ label, done, icon: Icon }) => (
              <div
                key={label}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                  done ? 'opacity-50' : 'bg-white/[0.02] border border-white/[0.04]'
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-[#C026D3] shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-white/20 shrink-0" />
                )}
                <Icon className="w-3.5 h-3.5 text-white/30 shrink-0" />
                <span
                  className={`text-sm ${
                    done ? 'line-through text-white/30' : 'text-white/70'
                  }`}
                >
                  {label}
                </span>
                {!done && (
                  <ChevronRight className="w-3.5 h-3.5 text-white/20 ml-auto shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="font-black tracking-tighter text-lg mb-4">Accesos rápidos</h2>
        <div className="grid grid-cols-3 gap-4">
          {QUICK_ACCESS.map(({ label, icon: Icon, color, href }) => (
            <a
              key={label}
              href={href}
              className="group border border-white/[0.06] bg-white/[0.02] rounded-2xl p-5 flex items-center gap-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-150"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-xs text-white/30 font-mono mt-0.5">Ir ahora →</p>
              </div>
            </a>
          ))}

          {/* Upgrade nudge */}
          <div className="border border-[#C026D3]/20 bg-[#C026D3]/[0.04] rounded-2xl p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#C026D3]/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-[#C026D3]" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[#E879F9] text-sm">Plan PRO activo</p>
              <p className="text-xs text-white/30 font-mono mt-0.5">12 días restantes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
