/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#080604',
        saffron: '#FF6B00',
        gold: '#FFB300',
        cream: '#FFF5E0',
        'deep-red': '#8B1A1A',
      },
      fontFamily: {
        cinzel: ['"Cinzel Decorative"', 'serif'],
        tiro: ['"Tiro Devanagari Hindi"', 'serif'],
      },
      backgroundImage: {
        'saffron-gradient': 'linear-gradient(135deg, #FF6B00, #FFB300)',
        'gold-gradient': 'linear-gradient(135deg, #FFB300, #FFD700, #FF6B00)',
      },
    },
  },
  plugins: [],
}
