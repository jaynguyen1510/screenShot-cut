// File: src/routes/screenshotRouter.js
import express from "express";
import {
  screenShotCellPhoneS,
  screenShotDiDongViet,
} from "../controllers/screenshotController.js"; // Đường dẫn cần có .js

const router = express.Router();

router.post("/screen-cellphones", screenShotCellPhoneS);
router.post("/screen-di-dong-viet", screenShotDiDongViet);

export default router;
