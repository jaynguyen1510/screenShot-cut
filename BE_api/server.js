import express from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";
import apiRouter from "./src/routes/api.js"; // Import apiRouter
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js"; // Import middleware lỗi

const app = express();
const port = process.env.PORT || 3000;

// Lấy __dirname trong ES module
const __dirname = new URL(".", import.meta.url).pathname;

// Middleware
app.use(cors());
app.use(express.json());

// Dịch vụ API
app.use("/api", apiRouter);

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Cấu hình static files
app.use(express.static(path.join(__dirname, "client", "dist")));

// Dịch vụ route cho các trang React (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Khởi động server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
