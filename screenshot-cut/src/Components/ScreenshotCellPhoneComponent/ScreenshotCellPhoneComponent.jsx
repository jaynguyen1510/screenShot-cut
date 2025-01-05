import JSZip from "jszip";
import useCaptureScreenshot from "../../Hook/useCaptureScreenshot";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import { Button } from "flowbite-react";

const ScreenshotCellPhoneComponent = () => {
  const { mutate, isLoading, isError, data, error } = useCaptureScreenshot();
  const [url, setUrl] = useState("");
  const [screenShots, setScreenShots] = useState([]);
  const [visibleScreenshots, setVisibleScreenshots] = useState(6); // Đặt ban đầu là 6 ảnh

  useEffect(() => {
    if (data && data.length > 0) {
      handleCombineScreenshots(data); // Gọi ghép ảnh ngay khi có dữ liệu
    }
  }, [data]);

  const handleCaptureScreenshot = () => {
    if (url) {
      mutate(url);
    }
  };

  // Hàm ghép ảnh trước khi hiển thị
  const handleCombineScreenshots = async (screenshotsData) => {
    const chunkSize = 6;
    const chunks = splitIntoChunks(screenshotsData, chunkSize);
    const zip = new JSZip();
    const newScreenShots = [];

    for (let i = 0; i < chunks.length; i++) {
      const group = chunks[i];
      const canvas = createCanvas(group.length);
      await drawImagesOnCanvas(canvas, group);
      const imgUrl = await createBlobFromCanvas(canvas, zip, i);
      newScreenShots.push(imgUrl);
    }

    setScreenShots(newScreenShots);
  };

  // 1. Hàm chia nhóm
  const splitIntoChunks = (data, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      chunks.push(data.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // 2. Hàm tạo canvas
  const createCanvas = (numberOfImages) => {
    const canvas = document.createElement("canvas");
    canvas.width = 400 * numberOfImages; // Chiều rộng canvas
    canvas.height = 800; // Chiều cao canvas
    return canvas;
  };

  // 3. Hàm vẽ ảnh lên canvas
  const drawImagesOnCanvas = async (canvas, group) => {
    const ctx = canvas.getContext("2d");
    const imgWidth = 400;
    const imgHeight = 800;

    const loadImagePromises = group.map((screenshot, index) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, index * imgWidth, 0, imgWidth, imgHeight);
          resolve();
        };
        img.onerror = (err) => reject(err);
        img.src = screenshot;
      });
    });

    await Promise.all(loadImagePromises);
  };

  // 4. Hàm tạo blob từ canvas
  const createBlobFromCanvas = (canvas, zip, index) => {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imgUrl = URL.createObjectURL(blob);
          zip.file(`combined_screenshot_group_${index + 1}.png`, blob);
          resolve(imgUrl);
        } else {
          reject(new Error("Không thể tạo blob từ canvas"));
        }
      });
    });
  };

  const handleDownloadAllImage = async () => {
    if (screenShots.length === 0) {
      alert("Chưa có ảnh nào để tải xuống");
      return;
    }

    const zip = new JSZip();

    // Tạo tệp zip và tải xuống sau khi tất cả ảnh đã được ghép
    for (let i = 0; i < screenShots.length; i++) {
      const screenshot = screenShots[i];
      const response = await fetch(screenshot);
      const blob = await response.blob();
      zip.file(`combined_screenshot_group_${i + 1}.png`, blob);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "screenshots.zip");
  };

  const handleLoadMore = () => {
    setVisibleScreenshots((prev) => prev + 6); // Mỗi lần load thêm 6 ảnh
  };

  // Thêm các lớp Tailwind trực tiếp vào JSX
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">ScreenShot</h1>
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Nhập URL"
            className="w-full md:flex-1 px-6 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleCaptureScreenshot}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {isLoading ? "Đang chụp..." : "Chụp ảnh màn hình"}
          </Button>
          <Button
            onClick={handleDownloadAllImage}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Tải tất cả ảnh
          </Button>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  STT
                </th>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Ảnh đã chụp
                </th>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Đường dẫn web
                </th>
                <th className="border border-gray-300 px-6 py-4 text-left text-sm font-medium text-gray-600">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {screenShots.length > 0 &&
                screenShots
                  .slice(0, visibleScreenshots)
                  .map((screenshot, index) => (
                    <tr
                      key={index}
                      className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                    >
                      <td className="border border-gray-300 px-6 py-4 text-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <img
                          src={screenshot}
                          alt={`Combined Screenshot ${index + 1}`}
                          className="w-40 mx-auto rounded-lg shadow-md hover:scale-105 transition-transform"
                        />
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-sm text-blue-500 underline">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </td>
                      <td className="border border-gray-300 px-6 py-4 text-center">
                        <span className="inline-block text-green-600 font-bold">
                          &#x2714;
                        </span>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {isError && (
          <p className="mt-4 text-red-500 font-semibold">
            Có lỗi xảy ra: {error.message}
          </p>
        )}

        {screenShots.length > 6 && visibleScreenshots < screenShots.length && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleLoadMore}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition"
            >
              Xem thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenshotCellPhoneComponent;
