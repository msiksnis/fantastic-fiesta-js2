/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "accent-yellow": "#FEFD00",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
