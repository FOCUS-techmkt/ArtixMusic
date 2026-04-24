'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Loader2, CheckCircle, Mail } from 'lucide-react'
import { slugify } from '@/lib/utils'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [artistName, setArtistName] = useState('')
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)
  const [needsConfirm, setNeedsConfirm] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const slug = slugify(artistName)

    // Create auth user — store artist name in metadata so onboarding can read it
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { artist_name: artistName, slug },
      },
    })

    if (authError || !authData.user) {
      setError(authError?.message ?? 'Error al crear cuenta')
      setLoading(false)
      return
    }

    // If Supabase returned a session immediately (email confirmation off) → go straight to onboarding
    if (authData.session) {
      // Try to create artist row now (will succeed since we have a session)
      await supabase.from('artists').insert({
        user_id: authData.user.id,
        slug,
        artist_name: artistName,
      }).then(({ error: e }) => {
        if (e && e.code !== '23505') {
          // slug collision — append suffix
          supabase.from('artists').insert({
            user_id: authData.user.id,
            slug: `${slug}-${Math.random().toString(36).slice(2, 6)}`,
            artist_name: artistName,
          })
        }
      })
      router.push('/onboarding')
      return
    }

    // Email confirmation required — tell user to check their inbox
    setNeedsConfirm(true)
    setLoading(false)
  }

  if (needsConfirm) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <div className="p-8 rounded-3xl border border-white/10 bg-[#111111]/80 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-[#C026D3]/15 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-[#E879F9]" />
            </div>
            <h1 className="font-bold text-2xl mb-3">Revisa tu email</h1>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Enviamos un enlace de confirmación a <span className="text-white/80">{email}</span>.<br />
              Haz clic en el enlace y luego inicia sesión.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C026D3] hover:bg-[#A21CAF] text-white font-semibold text-sm transition-colors"
            >
              Ir a iniciar sesión →
            </Link>
          </div>
        </motion.div>
      </div>
    )
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
          <h1 className="font-display font-bold text-3xl mb-2">Crea tu press kit</h1>
          <p className="text-white/40 text-sm mb-8">Gratis · Sin tarjeta · Listo en 5 min</p>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-white/40 mb-2 tracking-wider uppercase">Nombre artístico</label>
              <input
                type="text"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                placeholder="NXGHT"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/60 transition-all"
              />
              {artistName && (
                <p className="mt-1.5 text-xs text-white/30 font-mono">
                  presskit.pro/<span className="text-[#E879F9]">{slugify(artistName)}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 mb-2 tracking-wider uppercase">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#C026D3]/60 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/40 mb-2 tracking-wider uppercase">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mín. 8 caracteres"
                minLength={8}
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
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full py-3 rounded-xl bg-[#C026D3] hover:bg-[#A21CAF] disabled:opacity-60 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Crear mi press kit →'
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-white/40 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-[#E879F9] hover:text-[#C026D3] transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
