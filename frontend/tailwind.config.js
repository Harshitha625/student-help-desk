/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#07110F',
        'brand-teal-dark': '#123F36',
        'brand-teal': '#2A6B5C',
        'brand-teal-soft': '#4F8F7D',
        'brand-gold': '#C49A45',
        'brand-gold-hover': '#B08838',
        'brand-biscuit': '#E8DCC4',
        'brand-biscuit-light': '#F5EFE3',
        'brand-cream': '#FAF9F6',
        'brand-muted': '#7A8581',
        'brand-border': '#DDE5E1',
        'brand-dark-border': '#23443C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card-soft': '0 4px 20px -2px rgba(7, 17, 15, 0.05)',
        'card-hover': '0 10px 30px -4px rgba(42, 107, 92, 0.12)',
        'teal-glow': '0 0 25px rgba(42, 107, 92, 0.25)',
        'gold-glow': '0 0 25px rgba(196, 154, 69, 0.25)',
      }
    },
  },
  plugins: [],
}
