'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Check } from 'lucide-react'

interface Props {
  email: string
}

export default function BookingCTA({ email }: Props) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5, ease: 'easeOut' }}
      className="fixed bottom-6 right-6 z-40"
    >
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="cta-pulse flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm shadow-2xl transition-colors"
        style={{
          backgroundColor: 'var(--color-accent)',
          color: '#fff',
          boxShadow: '0 4px 24px color-mix(in srgb, var(--color-accent) 50%, transparent)',
        }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="copied"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Copiado
            </motion.span>
          ) : (
            <motion.span
              key="booking"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Booking
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}
