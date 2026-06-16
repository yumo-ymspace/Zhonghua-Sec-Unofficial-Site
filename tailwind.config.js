/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./about.html",
    "./timetable.html",
    "./cca.html",
    "./achievements.html",
    "./znotes.html",
    "./zportal.html",
    "./404.html",
    "./502.html",
    "./header.html",
    "./footer.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  safelist: [
    "bottom-8",
    "right-8",
  ],
  plugins: [],
};
