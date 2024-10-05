/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ystu-blue': 'rgb(25, 93, 165)',
      },
    },
  },
  plugins: [],
}