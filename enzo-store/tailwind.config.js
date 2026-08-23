/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ---- ENZO brand tokens ----
        // Black / white / gold, per brand direction. `error` is kept
        // separate on purpose — it's a semantic color for destructive
        // actions and validation messages (universally understood as
        // "stop/danger"), not part of the decorative brand palette.
        enzo: {
          black: "#0A0A0A",   // page background
          panel: "#151515",   // card / panel background
          line: "#2A2A2A",    // hairline borders/dividers
          white: "#F5F5F2",   // primary text on black
          muted: "#9A9A94",   // secondary text
          gold: "#C9A227",    // primary accent
          goldLight: "#E9C46A", // gradient highlight / hover
          goldDark: "#8A6D1F",  // pressed states / borders on gold
          error: "#E5484D",    // destructive actions, validation only
        },
      },
      fontFamily: {
        // English display face: bold, condensed, streetwear energy.
        display: ["'Anton'", "sans-serif"],
        // English body face.
        sans: ["'Inter'", "sans-serif"],
        // Arabic: modern geometric, highly readable, pairs cleanly with Anton/Inter.
        arabic: ["'IBM Plex Sans Arabic'", "sans-serif"],
      },
      backgroundImage: {
        "enzo-gradient": "linear-gradient(135deg, #C9A227 0%, #E9C46A 100%)",
      },
    },
  },
  plugins: [],
};
