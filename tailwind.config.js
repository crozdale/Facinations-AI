/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        facinations: {
          blue: "#1F4DFF"
        }
      }
    }
  },
  plugins: []
};
