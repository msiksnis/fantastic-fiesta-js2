/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "accent-yellow": "#FEFD00",
        bg: "#F4F4F5",
        card: "#FFFEFE",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
