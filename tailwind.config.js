/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Body
        display: ['Satoshi', 'Inter', 'sans-serif'], // Headings
        mono: ['JetBrains Mono', 'monospace'], // Telemetry
      },
      colors: {
        eko: {
          bg: "#000000",
          deep: "#02140b", // Deep Neutral Green-Black
          emerald: "#10B981", // Core Brand
          neon: "#00ff9c", // Grid Lines / Glow
          lime: "#b7ffdd", // Highlights
          sky: "#3b82f6", // Rim Light
        }
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #00ff9c1a 1px, transparent 1px), linear-gradient(to bottom, #00ff9c1a 1px, transparent 1px)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-slide': 'glow-slide 3s linear infinite',
      },
      keyframes: {
        'glow-slide': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}