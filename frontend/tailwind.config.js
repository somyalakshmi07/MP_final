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
          50: '#EFECE3',
          100: '#EFECE3',
          200: '#EFECE3',
          300: '#8FABD4',
          400: '#8FABD4',
          500: '#4A70A9',
          600: '#4A70A9',
          700: '#4A70A9',
          800: '#4A70A9',
          900: '#000000',
        },
        cream: '#EFECE3',
        'light-blue': '#8FABD4',
        'dark-blue': '#4A70A9',
        black: '#000000',
      },
    },
  },
  plugins: [],
}
