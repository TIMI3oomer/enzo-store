/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // ---- ENZO brand tokens ----
        // Derived from the ENZO Instagram identity: black base, white wordmark,
        // pink -> orange gradient ring used as the recurring accent motif.
        enzo: {
          black: "#0A0A0A",   // page background
          panel: "#151515",   // card / panel background
          line: "#2A2A2A",    // hairline borders/dividers
          white: "#F5F5F2",   // primary text on black
          muted: "#9A9A94",   // secondary text
          pink: "#FF3D68",    // gradient accent - start
          orange: "#FF8A3D",  // gradient accent - end
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
        "enzo-gradient": "linear-gradient(135deg, #FF3D68 0%, #FF8A3D 100%)",
      },
    },
  },
  plugins: [],
};
