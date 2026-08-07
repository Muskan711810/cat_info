/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#EFE7D3",
        ink: "#20301F",
        pine: "#33513C",
        marigold: "#C9791A",
        rust: "#9C4A2C",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Karla", "sans-serif"],
      },
    },
  },
  plugins: [],
};
