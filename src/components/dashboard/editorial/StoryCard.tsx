import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryCardProps {
  title: string
  subtitle: string
  icon: LucideIcon
  href: string
  accentColor?: string
  className?: string
}

export function StoryCard({
  title,
  subtitle,
  icon: Icon,
  href,
  accentColor = '#C026D3',
  className,
}: StoryCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col gap-3 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02]',
        'hover:bg-white/[0.04] hover:border-white/[0.10] transition-all duration-150',
        className
      )}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${accentColor}18` }}
      >
        <Icon className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/75 group-hover:text-white transition-colors">
          {title}
        </p>
        <p className="text-[11px] text-white/30 font-mono mt-0.5">{subtitle}</p>
      </div>
    </Link>
  )
}
