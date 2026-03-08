/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Pastikan baris ini ada
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#B91C1C",
          600: "#B91C1C",
          700: "#B91C1C",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
