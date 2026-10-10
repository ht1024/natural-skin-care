/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Every token resolves to the CSS variables defined in src/index.css.
        // The light palette lives under :root; the dark palette under .dark.
        // rgb(var(--x) / <alpha>) lets opacity modifiers like bg-gold-500/80 work.
        sage: {
          50: 'rgb(var(--sage-50) / <alpha-value>)',
          100: 'rgb(var(--sage-100) / <alpha-value>)',
          200: 'rgb(var(--sage-200) / <alpha-value>)',
          300: 'rgb(var(--sage-300) / <alpha-value>)',
          400: 'rgb(var(--sage-400) / <alpha-value>)',
          500: 'rgb(var(--sage-500) / <alpha-value>)',
          600: 'rgb(var(--sage-600) / <alpha-value>)',
          700: 'rgb(var(--sage-700) / <alpha-value>)',
          800: 'rgb(var(--sage-800) / <alpha-value>)',
          900: 'rgb(var(--sage-900) / <alpha-value>)',
        },
        gold: {
          50: 'rgb(var(--gold-50) / <alpha-value>)',
          100: 'rgb(var(--gold-100) / <alpha-value>)',
          200: 'rgb(var(--gold-200) / <alpha-value>)',
          300: 'rgb(var(--gold-300) / <alpha-value>)',
          400: 'rgb(var(--gold-400) / <alpha-value>)',
          500: 'rgb(var(--gold-500) / <alpha-value>)',
          600: 'rgb(var(--gold-600) / <alpha-value>)',
          700: 'rgb(var(--gold-700) / <alpha-value>)',
          800: 'rgb(var(--gold-800) / <alpha-value>)',
          900: 'rgb(var(--gold-900) / <alpha-value>)',
        },
        cream: {
          50: 'rgb(var(--cream-50) / <alpha-value>)',
          100: 'rgb(var(--cream-100) / <alpha-value>)',
          200: 'rgb(var(--cream-200) / <alpha-value>)',
          300: 'rgb(var(--cream-300) / <alpha-value>)',
        },
        charcoal: 'rgb(var(--charcoal) / <alpha-value>)',
        error: {
          50: 'rgb(var(--error-50) / <alpha-value>)',
          100: 'rgb(var(--error-100) / <alpha-value>)',
          200: 'rgb(var(--error-200) / <alpha-value>)',
          300: 'rgb(var(--error-300) / <alpha-value>)',
          400: 'rgb(var(--error-400) / <alpha-value>)',
          500: 'rgb(var(--error-500) / <alpha-value>)',
          600: 'rgb(var(--error-600) / <alpha-value>)',
          700: 'rgb(var(--error-700) / <alpha-value>)',
          800: 'rgb(var(--error-800) / <alpha-value>)',
          900: 'rgb(var(--error-900) / <alpha-value>)',
        },
        success: {
          50: 'rgb(var(--success-50) / <alpha-value>)',
          100: 'rgb(var(--success-100) / <alpha-value>)',
          200: 'rgb(var(--success-200) / <alpha-value>)',
          300: 'rgb(var(--success-300) / <alpha-value>)',
          400: 'rgb(var(--success-400) / <alpha-value>)',
          500: 'rgb(var(--success-500) / <alpha-value>)',
          600: 'rgb(var(--success-600) / <alpha-value>)',
          700: 'rgb(var(--success-700) / <alpha-value>)',
          800: 'rgb(var(--success-800) / <alpha-value>)',
          900: 'rgb(var(--success-900) / <alpha-value>)',
        },
        warning: {
          50: 'rgb(var(--warning-50) / <alpha-value>)',
          100: 'rgb(var(--warning-100) / <alpha-value>)',
          200: 'rgb(var(--warning-200) / <alpha-value>)',
          300: 'rgb(var(--warning-300) / <alpha-value>)',
          400: 'rgb(var(--warning-400) / <alpha-value>)',
          500: 'rgb(var(--warning-500) / <alpha-value>)',
          600: 'rgb(var(--warning-600) / <alpha-value>)',
          700: 'rgb(var(--warning-700) / <alpha-value>)',
          800: 'rgb(var(--warning-800) / <alpha-value>)',
          900: 'rgb(var(--warning-900) / <alpha-value>)',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
    },
  },
  plugins: [],
};
