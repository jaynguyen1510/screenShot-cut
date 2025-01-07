// File: src/controllers/screenshotController.js
import {
  takeScreenshotsCellPhoneS,
  takeScreenshotsDiDongViet,
} from "../services/screenshotService.js"; // Đường dẫn cần có .js

export const screenShotCellPhoneS = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL là bắt buộc" });
  }

  try {
    const screenshots = await takeScreenshotsCellPhoneS(url);
    if (screenshots.length > 0) {
      return res.status(200).json({
        screenshots,
        message: "Đã chụp tất cả sản phẩm.",
      });
    }
    return res
      .status(404)
      .json({ message: "Không tìm thấy sản phẩm nào để chụp ảnh." });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi chụp ảnh màn hình" });
  }
};
export const screenShotDiDongViet = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL là bắt buộc" });
  }
  try {
    const screenshots = await takeScreenshotsDiDongViet(url);
    if (screenshots.length > 0) {
      return res.status(200).json({
        screenshots,
        message: "Đã chụp tất cả sản phẩm.",
      });
    }
    return res
      .status(404)
      .json({ message: "Không tìm thấy sản phẩm nào để chụp ảnh." });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi chụp ảnh màn hình" });
  }
};
