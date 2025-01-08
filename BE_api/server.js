import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url"; // Thêm import này để sử dụng fileURLToPath
import apiRouter from "./src/routes/api.js"; // Import apiRouter
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js"; // Import middleware lỗi

const app = express();
const port = process.env.PORT || 3000;

// Dùng fileURLToPath để lấy đường dẫn thư mục hiện tại trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app's build folder
app.use(express.static(path.join(__dirname, "build")));

// API Routes
app.use("/api", apiRouter);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Catch-all handler to return the React app for any route not found
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Khởi động server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
