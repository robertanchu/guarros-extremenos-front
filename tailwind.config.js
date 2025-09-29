// Tailwind brand red derived from logo letters
// Base: #C3342E
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Override Tailwind's red scale with our brand
        red: {
          50:  "#F9EBEA",
          100: "#F0CCCB",
          200: "#E4A4A1",
          300: "#DB8582",
          400: "#D26762",
          500: "#CC524D",
          600: "#C3342E",
          700: "#AC2E28",
          800: "#922722",
          900: "#6B1D19",
        },
        brand: {
          DEFAULT: "#C3342E",
          600: "#C3342E",
          700: "#AC2E28",
        }
      }
    }
  },
  plugins: []
};
