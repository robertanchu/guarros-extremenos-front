/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: { negro:"#0a0a0a", rojo:"#a22e24", dorado:"#d4af37" },
      fontFamily: { sans:['"Montserrat"',"ui-sans-serif","system-ui","sans-serif"], stencil:['"Staatliches"',"sans-serif"] },
      boxShadow: { suave:"0 10px 25px rgba(0,0,0,.25)" }
    }
  },
  plugins: []
}