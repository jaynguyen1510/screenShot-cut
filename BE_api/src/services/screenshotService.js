import puppeteer from "puppeteer";

export const takeScreenshotsCellPhoneS = async (url) => {
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
        // tìm giá trị của thẻ div
        const productPrice = await page.evaluate((element) => {
          const priceElement = element.querySelector(".product__price--show");
          if (!priceElement) return null;

          // Lấy nội dung của giá
          const priceText = priceElement.innerText.trim();

          // Nếu giá là chuỗi (ví dụ "Đang chờ cập nhật giá"), lấy giá trị chuỗi đó
          if (priceText) {
            return priceText; // Trả về giá trị của chuỗi, kể cả khi nó không phải số
          }

          // Nếu không có giá, trả về giá trị mặc định
          return "Giá không có sẵn";
        }, productDiv);

        if (productPrice === null) {
          console.log("Không có giá cho sản phẩm, nhưng vẫn tiếp tục...");
          continue; // Tiếp tục nếu không có giá
        }
        // Tiến hành chụp ảnh hoặc xử lý sản phẩm

        const productName = await page.evaluate((element) => {
          const nameElement = element.querySelector(".product__name");
          if (!nameElement) return null;
          const h3Element = nameElement.querySelector("h3");
          if (!h3Element) return null;

          return h3Element.innerText.trim();
        }, productDiv);

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
        allScreenshots.push({
          screenshot: dataURL,
          productPrice: productPrice,
          productName: productName,
        });
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

export const takeScreenshotsDiDongViet = async (url) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const allScreenshots = [];
  try {
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: "networkidle2" });

    // Function to click "Load More" button until no more buttons
    const clickLoadMoreLinks = async () => {
      while (true) {
        const loadMoreButton = await page.$(
          "button.border-1.flex.items-center.justify-center.rounded-lg.border-black.bg-white.px-4.py-2.drop-shadow-lg.hover\\:border-ddv"
        );

        if (loadMoreButton) {
          console.log("Clicked on 'Show More' button.");
          await loadMoreButton.click();
          await delay(2000); // Wait for new products to load
        } else {
          console.log("No more 'Show More' buttons found.");
          break;
        }
      }
    };

    // Function to capture product images and details
    const captureProductImages = async () => {
      const pageHolder = await page.$(
        ".grid.grid-cols-2.md\\:grid-cols-5.gap-2.md\\:gap-4"
      );

      if (!pageHolder) return [];

      // Find all <a> elements with the specific class
      const aElements = await page.$$(
        "a.item-slider-mobile.md\\:item-slider.\\!border.\\!border-borderprod.col-span-1.h-full.flex-col.gap-1.items-start.justify-start.rounded.p-2.hover\\:border-white.hover\\:drop-shadow-xl.max-md\\:border-0"
      );

      if (!aElements || aElements.length === 0) return [];

      const allScreenshots = [];

      // Iterate through each <a> element
      for (const aElement of aElements) {
        const isElementStillInDOM = await page.evaluate((element) => {
          return document.body.contains(element);
        }, aElement);

        if (!isElementStillInDOM) continue;

        // Change the width and height of <a> element
        await page.evaluate((element) => {
          element.style.width = "226px"; // Set width to 226px
          element.style.height = "410px"; // Set height to 410px
        }, aElement);

        // Scroll the <a> element into view to ensure it is visible
        await page.evaluate((element) => {
          element.style.position = "absolute";
          element.style.zIndex = "9999";
          element.style.backgroundColor = "white";
          element.scrollIntoView({ behavior: "auto", block: "start" });
        }, aElement);

        // Check if the <a> element is visible
        const isVisible = await page.evaluate((element) => {
          return (
            element.offsetWidth > 0 &&
            element.offsetHeight > 0 &&
            window.getComputedStyle(element).visibility !== "hidden"
          );
        }, aElement);

        if (!isVisible) continue;

        // Get the product price
        const productPrice = await page.evaluate((element) => {
          const priceElement = element.querySelector(
            "div.text-left.text-ddv.flex.flex-row.items-center.gap-2"
          );
          const pElement = priceElement
            ? priceElement.querySelector("p")
            : null;
          return pElement ? pElement.innerText.trim() : null;
        }, aElement);

        if (!productPrice) {
          console.log("No price found for product, but continuing...");
        }

        // Get the product name
        const productName = await page.evaluate((element) => {
          const nameElement = element.querySelector(
            "h3.truncate-multiline.\\!line-clamp-2.\\!text-14"
          );
          return nameElement ? nameElement.innerText.trim() : null;
        }, aElement);

        if (!productName) {
          console.log("No product name found, but continuing...");
        }

        // Take a screenshot of the resized <a> element
        const screenshot = await aElement.screenshot({
          encoding: "base64",
          clip: {
            x: 0, // Start from the left edge
            y: 0, // Start from the top edge
            width: 226, // Fixed width
            height: 410, // Fixed height
          },
        });

        const dataURL = `data:image/png;base64,${screenshot}`;
        allScreenshots.push({
          screenshot: dataURL,
          productPrice: productPrice,
          productName: productName,
        });
      }

      return allScreenshots;
    };

    // Click "Load More" until there are no more buttons
    await clickLoadMoreLinks();

    // After no more buttons, start capturing product images
    const allProductImages = await captureProductImages();

    return allProductImages;
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await browser.close();
  }
};
