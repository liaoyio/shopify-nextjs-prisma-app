import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1440px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',
        md: '2rem'
      }
    },
    extend: {
      colors: {
        primary: '#00DEB0',
        error: '#ff6d6d',
        warn: '#f4af29',
        'base-01': '#202223',
        icon: '#5c5f62',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace'],
      },
    },
  },
} satisfies Config
