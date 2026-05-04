/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'prime-bg': '#020e28',
        'prime-bg-secondary': '#1A1F2E',
        'prime-card': '#2A2F3E',
        'prime-green': '#1DB954',
        'prime-coral': '#FF6B6B',
        'prime-text': '#FFFFFF',
        'prime-text-secondary': '#A0A0A0',
      },
      fontSize: {
        '2xs': '12px',
      },
    },
  },
  plugins: [],
}
