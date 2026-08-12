/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#ffffff",
        ink: "#202122",
        pine: "#0645ad",
        marigold: "#72777d",
        rust: "#d33",
        box: "#f8f9fa",
        boxhead: "#eaecf0",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};