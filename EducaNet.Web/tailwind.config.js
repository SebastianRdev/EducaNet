/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#2513ec",
        "background-light": "#f6f6f8",
        "background-dark": "#121022",
        "card-dark": "#1e1b3a",
        "input-dark": "#121022", // Also used as #262348 in some contexts, sticking to base for now or adding variants
        "surface-dark": "#1b1933",
        "surface-light": "#ffffff",
        "border-dark": "#373267",
        "border-light": "#e5e7eb",
        "text-secondary": "#9692c9",
      },
      fontFamily: {
        "display": ["Lexend", "sans-serif"],
        "body": ["Noto Sans", "sans-serif"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}
