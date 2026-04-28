import {
  Bebas_Neue, Syne, Oxanium, Orbitron, Audiowide, Exo_2,
  Rajdhani, Barlow_Condensed, Chakra_Petch, Russo_One,
  Big_Shoulders_Display, Teko, DM_Mono, Michroma, Darker_Grotesque,
} from 'next/font/google'

// ── New font instances ────────────────────────────────────────────
export const fontBebasNeue         = Bebas_Neue({ weight: '400',                   subsets: ['latin'], variable: '--font-bebas-neue',         display: 'swap' })
export const fontSyne              = Syne({       weight: ['400','600','700','800'], subsets: ['latin'], variable: '--font-syne',              display: 'swap' })
export const fontOxanium           = Oxanium({    weight: ['400','600','700'],       subsets: ['latin'], variable: '--font-oxanium',           display: 'swap' })
export const fontOrbitron          = Orbitron({   weight: ['400','600','700','900'], subsets: ['latin'], variable: '--font-orbitron',          display: 'swap' })
export const fontAudiowide         = Audiowide({  weight: '400',                    subsets: ['latin'], variable: '--font-audiowide',         display: 'swap' })
export const fontExo2              = Exo_2({      weight: ['400','600','700'],       subsets: ['latin'], variable: '--font-exo2',              display: 'swap' })
export const fontRajdhani          = Rajdhani({   weight: ['400','500','600','700'], subsets: ['latin'], variable: '--font-rajdhani',          display: 'swap' })
export const fontBarlowCondensed   = Barlow_Condensed({ weight: ['400','600','700'], subsets: ['latin'], variable: '--font-barlow-condensed', display: 'swap' })
export const fontChakraPetch       = Chakra_Petch({ weight: ['400','500','600','700'], subsets: ['latin'], variable: '--font-chakra-petch',   display: 'swap' })
export const fontRussoOne          = Russo_One({  weight: '400',                    subsets: ['latin'], variable: '--font-russo-one',         display: 'swap' })
export const fontBigShoulders      = Big_Shoulders_Display({ weight: ['400','700','900'], subsets: ['latin'], variable: '--font-big-shoulders', display: 'swap' })
export const fontTeko              = Teko({       weight: ['400','500','600','700'], subsets: ['latin'], variable: '--font-teko',              display: 'swap' })
export const fontDmMono            = DM_Mono({    weight: ['400','500'],             subsets: ['latin'], variable: '--font-dm-mono',           display: 'swap' })
export const fontMichroma          = Michroma({   weight: '400',                    subsets: ['latin'], variable: '--font-michroma',          display: 'swap' })
export const fontDarkerGrotesque   = Darker_Grotesque({ weight: ['400','600','700','900'], subsets: ['latin'], variable: '--font-darker-grotesque', display: 'swap' })

// ── All font variables as a single className string for <html> ───
export function getAllFontVariables() {
  return [
    fontBebasNeue.variable,
    fontSyne.variable,
    fontOxanium.variable,
    fontOrbitron.variable,
    fontAudiowide.variable,
    fontExo2.variable,
    fontRajdhani.variable,
    fontBarlowCondensed.variable,
    fontChakraPetch.variable,
    fontRussoOne.variable,
    fontBigShoulders.variable,
    fontTeko.variable,
    fontDmMono.variable,
    fontMichroma.variable,
    fontDarkerGrotesque.variable,
  ].join(' ')
}

// ── Catalog (shown in editor, consumed by public page) ───────────
export interface FontEntry {
  id:       string
  label:    string
  cssVar:   string   // e.g. '--font-bebas-neue'
  category: string
  preview:  string   // short text to preview the font
}

export const FONTS_CATALOG: FontEntry[] = [
  // Pre-loaded (existing vars)
  { id: 'space-grotesk',      label: 'Space Grotesk',       cssVar: '--font-display',           category: 'Moderno',   preview: 'ARTIST'  },
  { id: 'inter',              label: 'Inter',                cssVar: '--font-inter',             category: 'Clean',     preview: 'Artist'  },
  // New – Electronic / Display
  { id: 'bebas-neue',         label: 'Bebas Neue',          cssVar: '--font-bebas-neue',        category: 'Display',   preview: 'ARTIST'  },
  { id: 'russo-one',          label: 'Russo One',           cssVar: '--font-russo-one',         category: 'Display',   preview: 'ARTIST'  },
  { id: 'big-shoulders',      label: 'Big Shoulders',       cssVar: '--font-big-shoulders',     category: 'Display',   preview: 'ARTIST'  },
  { id: 'barlow-condensed',   label: 'Barlow Condensed',    cssVar: '--font-barlow-condensed',  category: 'Display',   preview: 'ARTIST'  },
  { id: 'teko',               label: 'Teko',                cssVar: '--font-teko',              category: 'Display',   preview: 'ARTIST'  },
  // Futuristic / Sci-Fi
  { id: 'orbitron',           label: 'Orbitron',            cssVar: '--font-orbitron',          category: 'Futurista', preview: 'ARTIST'  },
  { id: 'audiowide',          label: 'Audiowide',           cssVar: '--font-audiowide',         category: 'Futurista', preview: 'ARTIST'  },
  { id: 'oxanium',            label: 'Oxanium',             cssVar: '--font-oxanium',           category: 'Futurista', preview: 'Artist'  },
  { id: 'michroma',           label: 'Michroma',            cssVar: '--font-michroma',          category: 'Futurista', preview: 'ARTIST'  },
  { id: 'chakra-petch',       label: 'Chakra Petch',        cssVar: '--font-chakra-petch',      category: 'Futurista', preview: 'Artist'  },
  // Artístico / Editorial
  { id: 'syne',               label: 'Syne',                cssVar: '--font-syne',              category: 'Artístico', preview: 'Artist'  },
  { id: 'darker-grotesque',   label: 'Darker Grotesque',    cssVar: '--font-darker-grotesque',  category: 'Artístico', preview: 'Artist'  },
  { id: 'exo-2',              label: 'Exo 2',               cssVar: '--font-exo2',              category: 'Artístico', preview: 'Artist'  },
  { id: 'rajdhani',           label: 'Rajdhani',            cssVar: '--font-rajdhani',          category: 'Artístico', preview: 'Artist'  },
  // Mono
  { id: 'dm-mono',            label: 'DM Mono',             cssVar: '--font-dm-mono',           category: 'Mono',      preview: 'Artist'  },
  { id: 'jetbrains-mono',     label: 'JetBrains Mono',      cssVar: '--font-mono',              category: 'Mono',      preview: 'Artist'  },
]
