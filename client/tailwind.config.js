/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7f4',
          100: '#f6ede7',
          500: '#9b6b43',
          900: '#2b1b12',
        }
      }
    },
  },
  plugins: [],
}
