'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/onboarding'), 800)
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C026D3]/8 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="p-8 rounded-3xl border border-white/10 bg-[#111111]/80 backdrop-blur-sm">
          <h1 className="font-display font-bold text-3xl mb-2">Bienvenido de vuelta</h1>
          <p className="text-white/40 text-sm mb-8">Accede a tu panel de PRESSKIT.PRO</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-white/40 mb-2 tracking-wider uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/60 focus:bg-white/8 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 mb-2 tracking-wider uppercase">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/60 transition-all"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading || success}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full py-3 rounded-xl bg-[#C026D3] hover:bg-[#A21CAF] disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {success ? (
                <CheckCircle className="w-5 h-5" />
              ) : loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Iniciar sesión'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-white/40 text-sm">
            ¿No tienes cuenta?{' '}
            <Link href="/signup" className="text-[#E879F9] hover:text-[#C026D3] transition-colors">
              Crear kit gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
