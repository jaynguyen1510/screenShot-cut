import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import useCaptureScreenshot from "../../Hook/useCaptureScreenshot";
import "./ScreenshotCellPhoneComponent.scss";

const ScreenshotCellPhoneComponent = () => {
  const { mutate, isLoading, isError, data, error } = useCaptureScreenshot();
  const [screenshots, setScreenshots] = useState([]);
  const [url, setUrl] = useState("");
  const [visibleScreenshots, setVisibleScreenshots] = useState(6); // Đặt ban đầu là 6 ảnh

  useEffect(() => {
    console.log(screenshots.length);
  }, [screenshots]);

  useEffect(() => {
    if (data && data.length > 0) {
      setScreenshots(data);
    }
  }, [data]);

  const handleCaptureScreenshot = () => {
    if (url) {
      mutate(url);
    }
  };

  const handleDownloadAllImage = async () => {
    if (screenshots.length === 0) {
      alert("Chưa có ảnh nào để tải xuống");
      return;
    }
    // Chỉ lấy 6 ảnh đầu tiên
    const screenshotsToDownload = screenshots.slice(0, 6);
    const zip = new JSZip();
    const folder = zip.folder("screenshots");
    screenshotsToDownload.forEach((screenshot, index) => {
      const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");
      folder.file(`screenshot-${index + 1}.png`, base64Data, { base64: true });
    });
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

      {/* Bảng hiển thị các ảnh đã chụp */}
      <table className="screenshot-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Ảnh sản phẩm</th>
            <th>Đường link</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {screenshots.length > 0 &&
            screenshots
              .slice(0, visibleScreenshots)
              .map((screenshot, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      width="100"
                    />
                  </td>
                  <td>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </td>
                  <td>
                    <span className="status">
                      {isLoading ? (
                        <span>Đang chụp...</span>
                      ) : (
                        <span className="tick">&#x2714;</span> // Dấu tick xanh
                      )}
                    </span>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {isError && (
        <p style={{ color: "red" }}>Có lỗi xảy ra: {error.message}</p>
      )}

      {/* Chỉ hiển thị nút "Xem thêm" nếu số lượng ảnh > 6 */}
      {screenshots.length > 6 && visibleScreenshots < screenshots.length && (
        <button onClick={handleLoadMore}>Xem thêm</button>
      )}
    </div>
  );
};

export default ScreenshotCellPhoneComponent;
