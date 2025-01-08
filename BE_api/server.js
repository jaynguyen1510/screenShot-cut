import express from "express";
import path from "path";
import cors from "cors";
import "dotenv/config";
import apiRouter from "./src/routes/api.js"; // Import apiRouter
import { errorMiddleware } from "./src/middlewares/errorMiddleware.js"; // Import middleware lỗi

const app = express();
const port = process.env.PORT || 3000;

// Lấy __dirname trong ES module
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());

// Dịch vụ API
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "/screenshot-cut/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "screenshot-cut", "dist", "index.html"));
});

// Middleware xử lý lỗi
app.use(errorMiddleware);

// Khởi động server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
