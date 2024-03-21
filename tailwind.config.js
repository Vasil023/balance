/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {},
    container: {
      padding: "1rem",
      center: true,

      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1240px",
        "2xl": "1496px",
      },
    },
  },
  plugins: [],
};
