/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          50: '#fefdf9',
          100: '#fdf9ed',
          200: '#f9edc8',
          300: '#f4db94',
          400: '#eec45a',
          500: '#e8ad32',
          600: '#d99226',
          700: '#b47121',
          800: '#905a22',
          900: '#754a1f',
        },
      },
      animation: {
        'sway': 'sway 3s ease-in-out infinite',
        'bloom': 'bloom 0.5s ease-out',
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bloom: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
