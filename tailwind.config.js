/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        brand: "#5B5CE2",
        soft: "#F6F7FB"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(17,24,39,.08)"
      }
    }
  },
  plugins: []
};