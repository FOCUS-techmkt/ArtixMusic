import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Artist name → URL-safe slug */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Large numbers → K / M suffix */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

/** ISO date string → "June 2024" */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text)
}

/** Framer Motion easing presets */
export const EASINGS = {
  spring:       { type: 'spring', stiffness: 300, damping: 30 },
  springBouncy: { type: 'spring', stiffness: 400, damping: 20 },
  easeOut:      { ease: 'easeOut', duration: 0.4 },
  easeOutSlow:  { ease: 'easeOut', duration: 0.7 },
} as const

/** Stagger + fade-up variants for lists */
export const staggerContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

export const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.5 } },
}

/** Hex color → RGB array */
export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const num   = parseInt(clean, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}

/** Check whether a hex color is "light" (to decide text contrast) */
export function isLightColor(hex: string): boolean {
  const [r, g, b] = hexToRgb(hex)
  // Perceived luminance formula
  return (r * 299 + g * 587 + b * 114) / 1000 > 128
}
