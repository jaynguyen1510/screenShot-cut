import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import scrollbar from "tailwind-scrollbar"; // Sử dụng import thay vì require
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
      },
    },
  },
  plugins: [
    react(),
    scrollbar, // Thêm plugin scrollbar
  ],
});
