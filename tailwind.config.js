/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: '#0a0a0c',
          900: '#121215',
          800: '#1a1a1f',
          700: '#26262c',
          600: '#39393f',
        },
        violet: {
          950: '#1a0e2e',
          900: '#2c1654',
          700: '#4b2596',
          500: '#7c3aed',
          400: '#a78bfa',
        },
        amber: {
          500: '#d4a24c',
          400: '#e8c179',
        },
        emerald: {
          600: '#146356',
          500: '#1f8a73',
          400: '#3dba9c',
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
