/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        spin: 'spin 1s ease-in-out',
        expand: 'expand 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        expand: {
          '0%': { transform: 'scale(0.5)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      fontFamily: {
        neueHaas: ['"Neue Haas Display"', 'sans-serif'],
      }
    }, // Extend Tailwind's default theme if needed
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};
