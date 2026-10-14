/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#173f32',
        moss: '#52735c',
        cream: '#f7f6f0',
        sand: '#e8e6da',
        ink: '#1f2d27',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 45px rgba(25, 55, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
