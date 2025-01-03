// File: services/screenshotService.js
// import puppeteer from "puppeteer";

// let capturedCount = 0; // Biến theo dõi số lượng ảnh đã chụp

// export const takeScreenshots = async (url) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.setViewport({ width: 1280, height: 720 });
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Lấy phần tử chứa các sản phẩm
//     const pageHolder = await page.$(
//       ".product-list-filter.is-flex.is-flex-wrap-wrap"
//     );

//     if (pageHolder) {
//       // Lấy tất cả các div chứa sản phẩm
//       const productDivs = await pageHolder.$$(
//         ".product-info-container.product-item"
//       );

//       if (productDivs.length > capturedCount) {
//         const screenshots = [];

//         // Lấy tối đa 6 ảnh tiếp theo
//         const end = Math.min(capturedCount + 6, productDivs.length);

//         for (let i = capturedCount; i < end; i++) {
//           const productDiv = productDivs[i];

//           // Đảm bảo phần tử được hiển thị trong viewport
//           await page.evaluate((element) => {
//             element.style.position = "absolute";
//             element.style.zIndex = "9999";
//             element.style.backgroundColor = "white";
//             element.scrollIntoView({ behavior: "auto", block: "start" });
//           }, productDiv);

//           // Kiểm tra xem phần tử có hiển thị không
//           const isVisible = await page.evaluate((element) => {
//             return (
//               element.offsetWidth > 0 &&
//               element.offsetHeight > 0 &&
//               window.getComputedStyle(element).visibility !== "hidden"
//             );
//           }, productDiv);

//           if (!isVisible) continue;

//           // Chụp ảnh phần tử nếu nó hiển thị
//           const screenshot = await productDiv.screenshot({
//             encoding: "base64",
//             fullPage: false,
//           });

//           const dataURL = `data:image/png;base64,${screenshot}`;
//           screenshots.push(dataURL);
//         }

//         capturedCount = end; // Cập nhật số lượng ảnh đã chụp
//         return screenshots; // Trả về mảng ảnh đã chụp
//       }
//     }
//   } catch (error) {
//     console.error("Error during screenshot capture:", error);
//   } finally {
//     await browser.close();
//   }

//   return []; // Trả về mảng rỗng nếu không có ảnh nào được chụp
// };

import puppeteer from "puppeteer";

export const takeScreenshots = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: "networkidle2" });

    // Đặt nền trang thành màu trắng
    await page.evaluate(() => {
      document.body.style.backgroundColor = "white";
    });

    // Đảm bảo phần tử có class .product-list-filter.is-flex.is-flex-wrap-wrap đã hiển thị
    const pageHolder = await page.waitForSelector(
      ".product-list-filter.is-flex.is-flex-wrap-wrap",
      { visible: true } // Đảm bảo phần tử đã hiển thị và có chiều cao/chiều rộng hợp lệ
    );

    if (pageHolder) {
      // Đưa phần tử lên trên cùng
      await page.evaluate(() => {
        const pageHolderElement = document.querySelector(
          ".product-list-filter.is-flex.is-flex-wrap-wrap"
        );

        if (pageHolderElement) {
          // Sử dụng position: absolute để đưa phần tử lên trên, không gây ảnh hưởng đến layout của các phần tử khác
          pageHolderElement.style.position = "absolute";
          pageHolderElement.style.top = "0"; // Đưa phần tử lên đầu trang
          pageHolderElement.style.left = "0"; // Đảm bảo phần tử bắt đầu từ bên trái
          pageHolderElement.style.zIndex = "9999"; // Đảm bảo phần tử này nằm trên các phần tử khác
        }
      });

      // Chụp lại phần tử đã được điều chỉnh
      const screenshot = await pageHolder.screenshot({
        encoding: "base64",
        fullPage: false, // Chỉ chụp phần tử đã được điều chỉnh
      });

      // Sửa lại cách tạo chuỗi dataURL
      const dataURL = `data:image/png;base64,${screenshot}`;

      return [dataURL]; // Trả về mảng với 1 tấm ảnh chứa phần tử ưu tiên
    }
  } catch (error) {
    console.error("Error:", error); // In lỗi nếu có
  } finally {
    await browser.close();
  }

  return [];
};
