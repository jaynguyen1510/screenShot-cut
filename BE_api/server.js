require("dotenv").config(); // Import dotenv để sử dụng biến môi trường
const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000; // Lấy PORT từ .env hoặc mặc định là 3000

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint để chụp ảnh màn hình
app.post("/api/user/screenshot", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL là bắt buộc" });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: "networkidle2" });

    // Tìm div cha
    const pageHolder = await page.$(
      ".product-list-filter.is-flex.is-flex-wrap-wrap"
    );

    if (pageHolder) {
      // Tìm tất cả các div sản phẩm con
      const productDivs = await pageHolder.$$(
        ".product-info-container.product-item"
      );

      if (productDivs.length > 0) {
        const screenshots = [];

        // Chụp ảnh tất cả các sản phẩm
        for (let i = 0; i < productDivs.length; i++) {
          const productDiv = productDivs[i];

          // Nâng `z-index` và đảm bảo phần tử không bị che khuất
          await page.evaluate((element) => {
            element.style.position = "absolute";
            element.style.zIndex = "9999";
            element.style.backgroundColor = "white"; // Đảm bảo không trong suốt
            element.scrollIntoView({ behavior: "auto", block: "start" });
          }, productDiv);

          const isVisible = await page.evaluate((element) => {
            return (
              element.offsetWidth > 0 &&
              element.offsetHeight > 0 &&
              window.getComputedStyle(element).visibility !== "hidden"
            );
          }, productDiv);

          if (!isVisible) {
            console.log(`Phần tử ${i} không thể chụp ảnh được.`);
            continue;
          }

          const screenshot = await productDiv.screenshot({
            encoding: "base64",
            fullPage: false,
          });
          const dataURL = `data:image/png;base64,${screenshot}`;
          screenshots.push(dataURL);
        }

        await browser.close();
        return res.status(200).json({
          screenshots,
          message: "Đã chụp tất cả sản phẩm.",
        });
      }
    }

    await browser.close();
    return res
      .status(404)
      .json({ message: "Không tìm thấy sản phẩm nào để chụp ảnh." });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({ message: "Có lỗi xảy ra khi chụp ảnh màn hình" });
  }
});

// Khởi động server
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
