import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-black': '#020202',
        'brand-off': '#080807',
        'brand-white': '#f8f6f2',
        'brand-ivory': '#f5f0e8',
        'brand-charcoal': '#2a2a2a',
        'brand-taupe': '#8b7d6b',
        'brand-gold': '#C9A84C',
        'brand-gold-light': '#E8CC7A',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
