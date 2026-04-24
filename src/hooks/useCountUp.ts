'use client'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseCountUpOptions {
  end: number
  duration?: number
  start?: number
  decimals?: number
}

export function useCountUp({ end, duration = 2000, start = 0, decimals = 0 }: UseCountUpOptions) {
  const [count, setCount] = useState(start)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const rafRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const hasStarted = useRef(false)

  useEffect(() => {
    if (!inView || hasStarted.current) return
    hasStarted.current = true

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const current = start + (end - start) * easedProgress
      setCount(parseFloat(current.toFixed(decimals)))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [inView, end, start, duration, decimals])

  return { count, ref }
}
