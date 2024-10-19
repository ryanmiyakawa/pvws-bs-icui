/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: { height: {
      '128': '32rem', // 512px
      '160': '40rem', // 640px
    },},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};