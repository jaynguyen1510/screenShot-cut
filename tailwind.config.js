/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Quét tất cả file React trong src
  ],
  theme: {
    extend: {}, // Thêm các custom styles tại đây nếu cần
  },
  plugins: [],
};
