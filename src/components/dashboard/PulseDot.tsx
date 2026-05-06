export function PulseDot({ className = '', color }: { className?: string; color?: string }) {
  const bg = color ?? '#10B981'
  return (
    <span
      className={`relative inline-flex h-2 w-2 shrink-0 ${className}`}
      aria-label="En vivo"
      role="img"
    >
      <span
        className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: bg }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ background: bg }}
      />
    </span>
  )
}
