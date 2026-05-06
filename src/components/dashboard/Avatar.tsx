interface AvatarProps {
  src?: string | null
  initials: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
}

export function Avatar({ src, initials, size = 'md', className = '' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className={`rounded-full object-cover shrink-0 ${SIZE[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-gradient-to-br from-magenta-500 to-violet-600 flex items-center justify-center font-bold text-white shrink-0 ${SIZE[size]} ${className}`}
    >
      {initials}
    </div>
  )
}
