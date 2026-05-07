/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Add paths to your content files here
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        montserrat: ['var(--font-montserrat)'],
        poppins: ['var(--font-poppins)'],
        playfair: ['var(--font-playfair)', 'serif'],
        manufacturing: ['var(--font-manufacturing)', 'serif'],
        playwrite: ['var(--font-playwrite)', 'cursive'],
      },
      colors: {
        primary: '#C8553A',
      },
    },
  },
  plugins: [],
};
