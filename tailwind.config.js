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
        kenya: {
          green: '#006600',
          red: '#990000',
          black: '#000000',
          white: '#FFFFFF',
          gold: '#D4AF37',
        },
        diplomatic: {
          navy: '#0B132B',
          slate: '#1C2541',
          teal: '#3A506B',
          cyan: '#5BC0BE',
          light: '#F8FAFC',
        }
      },
      fontFamily: {
        diplomatic: ['Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
