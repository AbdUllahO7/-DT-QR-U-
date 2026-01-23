/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#eb796e',
          600: '#ed3494',
          700: '#c7276e',
          800: '#9f1d54',
          900: '#7f1d47',
          950: '#450a21',
        },
        accent: {
          orange: '#f28830',
          pink: '#ed3494',
          coral: '#eb796e',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    // RTL support utilities and scrollbar hide
    function ({ addUtilities }) {
      const newUtilities = {
        // Hide scrollbar utility
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          /* Chrome, Safari and Opera */
          'display': 'none',
        },
        '.rtl-space-x-reverse': {
          '--tw-space-x-reverse': '1',
        },
        '.rtl-space-x-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-space-x-reverse': '1',
          'margin-right': 'calc(0.5rem * var(--tw-space-x-reverse))',
          'margin-left': 'calc(0.5rem * calc(1 - var(--tw-space-x-reverse)))',
        },
        '.rtl-divide-x-reverse': {
          '--tw-divide-x-reverse': '1',
        },
        '.rtl-divide-x-reverse > :not([hidden]) ~ :not([hidden])': {
          '--tw-divide-x-reverse': '1',
          'border-right-width': 'calc(1px * var(--tw-divide-x-reverse))',
          'border-left-width': 'calc(1px * calc(1 - var(--tw-divide-x-reverse)))',
        },
        // RTL-aware flexbox utilities
        '.rtl-flex-row-reverse': {
          'flex-direction': 'row-reverse',
        },
        '.rtl-justify-start': {
          'justify-content': 'flex-start',
        },
        '.rtl-justify-end': {
          'justify-content': 'flex-end',
        },
        // RTL-aware text alignment
        '.rtl-text-left': {
          'text-align': 'left',
        },
        '.rtl-text-right': {
          'text-align': 'right',
        },
        // RTL-aware positioning
        '.rtl-left-0': {
          'left': '0',
        },
        '.rtl-right-0': {
          'right': '0',
        },
      }

      addUtilities(newUtilities)
    },
  ],
} 