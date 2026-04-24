import type { Metadata } from 'next'
import { Inter, Syne, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400', '500', '600', '700', '800'] })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', weight: ['400', '500'] })

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
    <html lang="es" className={`${inter.variable} ${syne.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
