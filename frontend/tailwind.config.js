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
        graphite: {
          950: '#060b18', // Deepest midnight navy
          900: '#0b132b', // Dark navy surface
          850: '#111c3d', // Elevated navy container
          800: '#17254e', // Border navy
          750: '#1e3264', // Focused border navy
          700: '#2b4280', // Active stroke blue
          600: '#3e5c9e', // Slate blue
          500: '#5b7bbf', // Muted steel blue
          400: '#8ea7de', // Ice blue text
          300: '#b8c9ee', // Bright ice blue
          200: '#dee7f8', // High-contrast text
          100: '#f1f5fd', // Pure contrast
        },
        violet: {
          glow: '#60a5fa', // Deep blue glow
          neon: '#3b82f6', // Electric royal blue
          deep: '#1d4ed8', // Dark sapphire
        },
        mint: {
          glow: '#38bdf8', // Cyber ice cyan
          neon: '#0ea5e9', // Royal ocean blue
          deep: '#0369a1', // Deep ocean navy
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'neural-glow': 'neuralGlow 4s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        neuralGlow: {
          '0%': { filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 16px rgba(0, 245, 160, 0.4))' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'violet-glow': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'mint-glow': '0 0 25px -5px rgba(0, 245, 160, 0.35)',
      },
    },
  },
  plugins: [],
}
