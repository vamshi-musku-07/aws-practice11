/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          50: "#f4f6f5",
          100: "#e4e9e6",
          200: "#c8d2cc",
          700: "#2f3d38",
          800: "#1e2a26",
          900: "#121a17",
        },
        moss: {
          400: "#6b9b7a",
          500: "#4a7c59",
          600: "#3a6347",
        },
        sand: {
          50: "#f7f3eb",
          100: "#efe6d6",
          200: "#e0d0b4",
        },
      },
      boxShadow: {
        soft: "0 12px 40px -12px rgba(18, 26, 23, 0.18)",
      },
    },
  },
  plugins: [],
};
