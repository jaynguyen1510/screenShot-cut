// File: server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./src/routes/api.js"; // Import apiRouter
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js"; // Import middleware lỗi

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Đăng ký API Routes
app.use("/api", apiRouter);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
