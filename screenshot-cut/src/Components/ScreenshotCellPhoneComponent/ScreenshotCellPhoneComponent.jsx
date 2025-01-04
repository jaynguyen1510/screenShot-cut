import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import useCaptureScreenshot from "../../Hook/useCaptureScreenshot";
import "./ScreenshotCellPhoneComponent.scss";

const ScreenshotCellPhoneComponent = () => {
  const { mutate, isLoading, isError, data, error } = useCaptureScreenshot();
  const [screenshots, setScreenshots] = useState([]);
  const [url, setUrl] = useState("");
  const [combinedScreenshots, setCombinedScreenshots] = useState([]);
  const [visibleScreenshots, setVisibleScreenshots] = useState(6); // Đặt ban đầu là 6 ảnh

  useEffect(() => {
    console.log(screenshots.length);
  }, [screenshots]);

  useEffect(() => {
    if (data && data.length > 0) {
      setScreenshots(data);
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
    // Chia mảng screenshots thành các nhóm có tối đa 6 ảnh
    const chunkSize = 6;
    const chunks = [];
    for (let i = 0; i < screenshotsData.length; i += chunkSize) {
      chunks.push(screenshotsData.slice(i, i + chunkSize));
    }

    const zip = new JSZip();
    const newCombinedScreenshots = []; // Để lưu trữ các ảnh ghép

    // Ghép từng nhóm ảnh lại với nhau thành 1 ảnh
    for (let i = 0; i < chunks.length; i++) {
      const group = chunks[i];

      // Tạo canvas với kích thước cho phép ghép các ảnh thành 1 ảnh duy nhất
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Kích thước mỗi ảnh
      const imgWidth = 400; // Điều chỉnh kích thước ảnh
      const imgHeight = 800;

      // Tính toán kích thước của canvas (hàng 1 hoặc cột 1, tùy vào cách ghép)
      canvas.width = imgWidth * group.length; // Ghép ảnh theo chiều ngang
      canvas.height = imgHeight;

      const loadImagePromises = group.map((screenshot, index) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, index * imgWidth, 0, imgWidth, imgHeight);
            resolve();
          };
          img.onerror = (err) => reject(err); // Đảm bảo có xử lý lỗi khi tải ảnh
          img.src = screenshot; // Đặt ảnh từ base64
        });
      });

      // Chờ tất cả ảnh trong nhóm được tải và vẽ lên canvas
      await Promise.all(loadImagePromises);

      // Tạo tệp blob từ canvas sau khi vẽ xong
      await new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const imgUrl = URL.createObjectURL(blob);
            newCombinedScreenshots.push(imgUrl); // Thêm ảnh ghép vào mảng
            zip.file(`combined_screenshot_group_${i + 1}.png`, blob);
            resolve();
          } else {
            reject(new Error("Không thể tạo blob từ canvas"));
          }
        });
      });
    }

    // Cập nhật state với các ảnh ghép
    setCombinedScreenshots(newCombinedScreenshots);
  };

  const handleDownloadAllImage = async () => {
    if (combinedScreenshots.length === 0) {
      alert("Chưa có ảnh nào để tải xuống");
      return;
    }

    const zip = new JSZip();

    // Tạo tệp zip và tải xuống sau khi tất cả ảnh đã được ghép
    for (let i = 0; i < combinedScreenshots.length; i++) {
      const screenshot = combinedScreenshots[i];
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

  return (
    <div className="screenshot-container">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Nhập URL"
      />
      <button onClick={handleCaptureScreenshot}>
        {isLoading ? "Đang chụp..." : "Chụp ảnh màn hình"}
      </button>
      <button onClick={handleDownloadAllImage}>Tải tất cả ảnh</button>

      {/* Bảng hiển thị các ảnh đã ghép */}
      <table className="screenshot-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh đã chụp</th>
            <th>Đường dẫn web</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {combinedScreenshots.length > 0 &&
            combinedScreenshots
              .slice(0, visibleScreenshots)
              .map((screenshot, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={screenshot}
                      alt={`Combined Screenshot ${index + 1}`}
                      width="400" // Điều chỉnh kích thước cho phù hợp
                    />
                  </td>
                  <td>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </td>
                  <td>
                    <span className="status">
                      <span className="tick">&#x2714;</span>{" "}
                      {/* Dấu tick xanh */}
                    </span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {isError && (
        <p style={{ color: "red" }}>Có lỗi xảy ra: {error.message}</p>
      )}

      {/* Chỉ hiển thị nút "Xem thêm" nếu số lượng ảnh ghép > 6 */}
      {combinedScreenshots.length > 6 &&
        visibleScreenshots < combinedScreenshots.length && (
          <button onClick={handleLoadMore}>Xem thêm</button>
        )}
    </div>
  );
};

export default ScreenshotCellPhoneComponent;
