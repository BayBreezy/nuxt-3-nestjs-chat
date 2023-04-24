const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      // Set custom font family
      fontFamily: { sans: ["Inter", ...defaultTheme.fontFamily.sans] },
      // Set custom colors
      colors: {
        primary: {
          DEFAULT: colors.violet[600],
          ...colors.violet,
        },
      },
    },
  },
  plugins: [],
};
