/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "Avenir Next", "Segoe UI", "sans-serif"],
        fraunces: ["Fraunces", "Georgia", "serif"]
      }
    }
  },
  plugins: []
};
