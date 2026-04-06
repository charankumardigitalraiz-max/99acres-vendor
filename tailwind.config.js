/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        dark: {
          DEFAULT: '#2E353A',
          50: '#F1F3F4',
          100: '#D4D8DB',
          200: '#A9B1B7',
          300: '#7E8A93',
          400: '#53636F',
          500: '#2E353A',
          600: '#252B2F',
          700: '#1C2124',
          800: '#131719',
          900: '#0A0D0E',
        },
        surface: '#F8FAFC',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 8px -1px rgba(0,0,0,0.08), 0 1px 4px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
        sidebar: '4px 0 12px 0 rgba(0,0,0,0.06)',
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      keyframes: {
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'scale-in': 'scale-in 0.2s ease-out forwards',
      },
    },
  },
  plugins: [],
}
