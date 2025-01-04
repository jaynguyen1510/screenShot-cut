// File: src/routes/screenshotRouter.js
import express from "express";
import { captureScreenshots } from "../controllers/screenshotController.js"; // Đường dẫn cần có .js

const router = express.Router();

router.post("/", captureScreenshots);

export default router;
