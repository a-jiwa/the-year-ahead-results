/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        neueHaas: ['"Neue Haas Display"', 'sans-serif'],
      }
    }, // Extend Tailwind's default theme if needed
  },
  plugins: [], // Add plugins here if needed
};
