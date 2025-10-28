import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-azure': {
          DEFAULT: '#003558',
          50: '#e6f0f5',
          100: '#cce1eb',
          200: '#99c3d7',
          300: '#66a5c3',
          400: '#3387af',
          500: '#003558',
          600: '#002a46',
          700: '#002035',
          800: '#001523',
          900: '#000a12',
        },
        'bright-blue': {
          DEFAULT: '#00b4ff',
          50: '#e6f7ff',
          100: '#ccefff',
          200: '#99dfff',
          300: '#66cfff',
          400: '#33bfff',
          500: '#00b4ff',
          600: '#0090cc',
          700: '#006c99',
          800: '#004866',
          900: '#002433',
        },
        'off-white': {
          DEFAULT: '#f8fbff',
          dark: '#e8f0f7',
        },
        'glass': {
          light: 'rgba(248, 251, 255, 0.05)',
          medium: 'rgba(248, 251, 255, 0.1)',
          dark: 'rgba(0, 53, 88, 0.9)',
          darker: 'rgba(0, 53, 88, 0.95)',
        }
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
        'glass-heavy': '24px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 53, 88, 0.37)',
        'glass-heavy': '0 12px 48px 0 rgba(0, 53, 88, 0.5)',
        'header': '0 4px 16px rgba(0, 180, 255, 0.2)',
        'card-hover': '0 16px 64px rgba(0, 180, 255, 0.3)',
        'glow': '0 0 20px rgba(0, 180, 255, 0.5)',
      },
      animation: {
        'accent-line': 'accentLine 2.5s linear infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        accentLine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(400%)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'holographic': 'linear-gradient(135deg, rgba(0, 180, 255, 0.1) 0%, rgba(0, 53, 88, 0.05) 50%, rgba(0, 180, 255, 0.1) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(248, 251, 255, 0.1) 0%, rgba(248, 251, 255, 0.05) 100%)',
      },
    },
  },
  plugins: [],
} satisfies Config
