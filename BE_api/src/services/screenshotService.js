// File: services / screenshotService.js;
// import puppeteer from "puppeteer";
// let capturedCount = 0; // Biến theo dõi số lượng ảnh đã chụp
// export const takeScreenshots = async (url) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.setViewport({ width: 1280, height: 720 });
//     await page.goto(url, { waitUntil: "networkidle2" });

//     const captureProductImages = async () => {
//       const pageHolder = await page.$(
//         ".product-list-filter.is-flex.is-flex-wrap-wrap"
//       );

//       if (!pageHolder) return [];

//       const productDivs = await pageHolder.$$(
//         ".product-info-container.product-item"
//       );

//       if (!productDivs || productDivs.length === 0) return []; // Không có sản phẩm

//       const productScreenshots = [];
//       if (productDivs.length > capturedCount) {
//         const end = Math.min(capturedCount + 6, productDivs.length);

//         for (let i = capturedCount; i < end; i++) {
//           const productDiv = productDivs[i];

//           const isElementStillInDOM = await page.evaluate((element) => {
//             return document.body.contains(element);
//           }, productDiv);

//           if (!isElementStillInDOM) continue;

//           await page.evaluate((element) => {
//             element.style.position = "absolute";
//             element.style.zIndex = "9999";
//             element.style.backgroundColor = "white";
//             element.scrollIntoView({ behavior: "auto", block: "start" });
//           }, productDiv);

//           const isVisible = await page.evaluate((element) => {
//             return (
//               element.offsetWidth > 0 &&
//               element.offsetHeight > 0 &&
//               window.getComputedStyle(element).visibility !== "hidden"
//             );
//           }, productDiv);

//           if (!isVisible) continue;

//           const screenshot = await productDiv.screenshot({
//             encoding: "base64",
//             fullPage: false,
//           });

//           const dataURL = `data:image/png;base64,${screenshot}`;
//           productScreenshots.push(dataURL);
//         }

//         capturedCount = end; // Cập nhật số lượng ảnh đã chụp
//       }

//       return productScreenshots;
//     };

//     let allScreenshots = [];
//     let attempts = 0;
//     let reloadAttempts = 0;

//     while (allScreenshots.length < 6 && attempts < 10) {
//       attempts++;
//       const screenshots = await captureProductImages();

//       allScreenshots = [
//         ...allScreenshots,
//         ...screenshots.slice(0, 6 - allScreenshots.length),
//       ];

//       if (allScreenshots.length >= 6) {
//         break;
//       }

//       const showMoreButtonExists = await page.$(
//         ".button.btn-show-more.button__show-more-product"
//       );

//       if (showMoreButtonExists) {
//         await showMoreButtonExists.click();
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//       } else {
//         reloadAttempts++;
//         if (reloadAttempts >= 3) {
//           console.log("No more products to capture. Ending process.");
//           break;
//         }

//         console.log("Reloading page...");
//         await page.reload({ waitUntil: "networkidle2" });
//         capturedCount = 0; // Reset captured count to start fresh
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//       }
//     }

//     return allScreenshots.length >= 6 ? allScreenshots : [];
//   } catch (error) {
//     console.error("Error during screenshot capture:", error);
//   } finally {
//     await browser.close();
//   }

//   return [];
// };

// import puppeteer from "puppeteer";
// export const takeScreenshots = async (url) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   try {
//     await page.setViewport({ width: 1280, height: 720 });
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Đặt nền trang thành màu trắng
//     await page.evaluate(() => {
//       document.body.style.backgroundColor = "white";
//     });

//     // Đảm bảo phần tử có class .product-list-filter.is-flex.is-flex-wrap-wrap đã hiển thị
//     const pageHolder = await page.waitForSelector(
//       ".product-list-filter.is-flex.is-flex-wrap-wrap",
//       { visible: true } // Đảm bảo phần tử đã hiển thị và có chiều cao/chiều rộng hợp lệ
//     );

//     if (pageHolder) {
//       // Đưa phần tử lên trên cùng
//       await page.evaluate(() => {
//         const pageHolderElement = document.querySelector(
//           ".product-list-filter.is-flex.is-flex-wrap-wrap"
//         );

//         if (pageHolderElement) {
//           // Sử dụng position: absolute để đưa phần tử lên trên, không gây ảnh hưởng đến layout của các phần tử khác
//           pageHolderElement.style.position = "absolute";
//           pageHolderElement.style.top = "0"; // Đưa phần tử lên đầu trang
//           pageHolderElement.style.left = "0"; // Đảm bảo phần tử bắt đầu từ bên trái
//           pageHolderElement.style.zIndex = "9999"; // Đảm bảo phần tử này nằm trên các phần tử khác
//         }
//       });

//       // Chụp lại phần tử đã được điều chỉnh
//       const screenshot = await pageHolder.screenshot({
//         encoding: "base64",
//         fullPage: false, // Chỉ chụp phần tử đã được điều chỉnh
//       });

//       // Sửa lại cách tạo chuỗi dataURL
//       const dataURL = `data:image/png;base64,${screenshot}`;

//       return [dataURL]; // Trả về mảng với 1 tấm ảnh chứa phần tử ưu tiên
//     }
//   } catch (error) {
//     console.error("Error:", error); // In lỗi nếu có
//   } finally {
//     await browser.close();
//   }

//   return [];
// };

// Import puppeteer
// import puppeteer from "puppeteer";
// let capturedCount = 0; // Biến theo dõi số lượng ảnh đã chụp
// export const takeScreenshots = async (url) => {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();

//   const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   try {
//     await page.setViewport({ width: 1280, height: 720 });
//     await page.goto(url, { waitUntil: "networkidle2" });

//     // Hàm nhấn vào các nút "Show More"
//     const clickLoadMoreLinks = async () => {
//       while (true) {
//         const loadMoreButton = await page.$(
//           ".button.btn-show-more.button__show-more-product"
//         );

//         if (loadMoreButton) {
//           await loadMoreButton.click();
//           console.log("Clicked on 'Show More' button.");
//           await delay(2000); // Đợi nội dung tải xong
//         } else {
//           console.log("No more 'Show More' buttons found.");
//           break;
//         }
//       }
//     };

//     // Hàm chụp ảnh các sản phẩm
//     const captureProductImages = async () => {
//       const pageHolder = await page.$(
//         ".product-list-filter.is-flex.is-flex-wrap-wrap"
//       );

//       if (!pageHolder) return [];

//       const productDivs = await pageHolder.$$(
//         ".product-info-container.product-item"
//       );

//       if (!productDivs || productDivs.length === 0) return []; // Không có sản phẩm

//       const productScreenshots = [];
//       const end = Math.min(capturedCount + 6, productDivs.length);

//       for (let i = capturedCount; i < end; i++) {
//         const productDiv = productDivs[i];

//         const isElementStillInDOM = await page.evaluate((element) => {
//           return document.body.contains(element);
//         }, productDiv);

//         if (!isElementStillInDOM) continue;

//         await page.evaluate((element) => {
//           element.style.position = "absolute";
//           element.style.zIndex = "9999";
//           element.style.backgroundColor = "white";
//           element.scrollIntoView({ behavior: "auto", block: "start" });
//         }, productDiv);

//         const isVisible = await page.evaluate((element) => {
//           return (
//             element.offsetWidth > 0 &&
//             element.offsetHeight > 0 &&
//             window.getComputedStyle(element).visibility !== "hidden"
//           );
//         }, productDiv);

//         if (!isVisible) continue;

//         const screenshot = await productDiv.screenshot({
//           encoding: "base64",
//           fullPage: false,
//         });

//         const dataURL = `data:image/png;base64,${screenshot}`;
//         productScreenshots.push(dataURL);
//       }

//       capturedCount = end; // Cập nhật số lượng ảnh đã chụp
//       return productScreenshots;
//     };

//     // Nhấn vào tất cả các nút "Show More"
//     await clickLoadMoreLinks();

//     // Chụp ảnh các sản phẩm sau khi tất cả đã tải
//     const screenshots = await captureProductImages();

//     return screenshots.length >= 6 ? screenshots : [];
//   } catch (error) {
//     console.error("Error during screenshot capture:", error);
//   } finally {
//     await browser.close();
//   }

//   return [];
// };

import puppeteer from "puppeteer";

export const takeScreenshots = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const allScreenshots = []; // Mảng lưu trữ tất cả các ảnh đã chụp

  try {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: "networkidle2" });

    const clickLoadMoreLinks = async () => {
      while (true) {
        const loadMoreButton = await page.$(
          ".button.btn-show-more.button__show-more-product"
        );

        if (loadMoreButton) {
          console.log("Clicked on 'Show More' button.");
          await loadMoreButton.click();
          await delay(2000); // Đợi nội dung tải xong
        } else {
          console.log("No more 'Show More' buttons found.");
          break;
        }
      }
    };

    const captureProductImages = async () => {
      const pageHolder = await page.$(
        ".product-list-filter.is-flex.is-flex-wrap-wrap"
      );

      if (!pageHolder) return [];

      const productDivs = await pageHolder.$$(
        ".product-info-container.product-item"
      );

      if (!productDivs || productDivs.length === 0) return [];

      for (const productDiv of productDivs) {
        const isElementStillInDOM = await page.evaluate((element) => {
          return document.body.contains(element);
        }, productDiv);

        if (!isElementStillInDOM) continue;

        await page.evaluate((element) => {
          element.style.position = "absolute";
          element.style.zIndex = "9999";
          element.style.backgroundColor = "white";
          element.scrollIntoView({ behavior: "auto", block: "start" });
        }, productDiv);

        const isVisible = await page.evaluate((element) => {
          return (
            element.offsetWidth > 0 &&
            element.offsetHeight > 0 &&
            window.getComputedStyle(element).visibility !== "hidden"
          );
        }, productDiv);

        if (!isVisible) continue;

        const screenshot = await productDiv.screenshot({
          encoding: "base64",
          fullPage: false,
        });

        const dataURL = `data:image/png;base64,${screenshot}`;
        allScreenshots.push(dataURL);
      }
    };

    // Nhấn vào tất cả các nút "Show More"
    await clickLoadMoreLinks();

    // Chụp ảnh các sản phẩm sau khi tất cả đã tải
    await captureProductImages();

    return allScreenshots;
  } catch (error) {
    console.error("Error during screenshot capture:", error);
  } finally {
    await browser.close();
  }

  return [];
};
