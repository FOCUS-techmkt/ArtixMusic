import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono, Instrument_Serif } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', weight: ['400', '500', '600', '700'] })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500'] })
const instrumentSerif = Instrument_Serif({ subsets: ['latin'], variable: '--font-serif', weight: ['400'], style: ['normal', 'italic'] })

export const metadata: Metadata = {
  title: 'PRESSKIT.PRO — Press kits animados para DJs y productores',
  description: 'Crea tu press kit profesional y animado en menos de 5 minutos. Plataforma diseñada para DJs y productores musicales.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    title: 'PRESSKIT.PRO',
    description: 'Press kits animados para DJs y productores',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrains.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
