import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-inter)',    'system-ui', 'sans-serif'],
        display: ['var(--font-display)',  'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)',     'monospace'],
        serif:   ['var(--font-serif)',    'serif'],
      },
      colors: {
        // Dark Rave
        rave: {
          bg: '#080808',
          surface: '#111111',
          accent: '#C026D3',
          glow: '#E879F9',
        },
        // Minimal Pro
        minimal: {
          bg: '#F5F5F4',
          surface: '#FFFFFF',
          accent: '#171717',
          glow: '#525252',
        },
        // Cyber Neon
        cyber: {
          bg: '#020617',
          surface: '#0F172A',
          accent: '#06B6D4',
          glow: '#67E8F9',
        },
        // Editorial Clean
        editorial: {
          bg: '#FAF9F6',
          surface: '#FFFFFF',
          accent: '#78350F',
          glow: '#92400E',
        },
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        pulse_slow: 'pulse 3s ease-in-out infinite',
        'float-up': 'floatUp 0.6s ease-out forwards',
        marquee: 'marquee 28s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        shimmer:
          'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}

export default config
