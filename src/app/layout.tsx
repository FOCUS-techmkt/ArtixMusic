import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import { Toaster } from 'sonner'
import { getAllFontVariables } from '@/lib/fonts'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700'] })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], variable: '--font-serif', weight: ['400'], style: ['normal', 'italic'] })

export const metadata: Metadata = {
  title: 'Artist Pulse — AI-powered software for electronic artists',
  description: 'Crea tu press kit profesional, gestiona tus fans y crece tu carrera con IA. Diseñado para DJs y productores musicales.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'Artist Pulse',
    description: 'AI-powered software for electronic artists',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${instrumentSerif.variable} ${getAllFontVariables()}`}>
      <body>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: { background: '#141418', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' },
          }}
        />
      </body>
    </html>
  )
}
