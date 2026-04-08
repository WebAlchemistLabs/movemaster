import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0f1720',
        surface: '#182330',
        'surface-light': '#f8f6f1',
        primary: '#c58b2a',
        'primary-hover': '#a8741f',
        secondary: '#3f6ea8',
        'text-primary': '#f5f2ea',
        'text-muted': '#9ba7b5',
        success: '#2f8f6b',
        border: '#2c3a49',
      },
      fontFamily: {
        heading: ['var(--font-oswald)', 'Playfair Display', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'Space Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { '0%': { transform: 'translateX(20px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
