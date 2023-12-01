const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" }
        }
      },
      animation: {
        wiggle: "wiggle 200ms ease-in-out"
      },
      maxHeight: {
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
        "176": "44rem",
      },
      height: {
        "112": "28rem",
        "128": "32rem",
        "144": "36rem",
        "160": "40rem",
        "176": "44rem",
      },
      colors: {
        "frenchgray": "#D0CCD0",
        "whitesmoke" : "#F5F5F5",
        "wenge": "#605856",
        "cerulean": "#1C6E8C",
        "charcoal": "#274156",
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
