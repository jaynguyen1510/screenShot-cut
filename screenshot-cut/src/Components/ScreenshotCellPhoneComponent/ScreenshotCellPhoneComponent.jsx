import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import useCaptureScreenshot from "../../Hook/useCaptureScreenshot";
import "./ScreenshotCellPhoneComponent.scss";

const ScreenshotCellPhoneComponent = () => {
  const { mutate, isLoading, isError, data, error } = useCaptureScreenshot();
  const [screenshots, setScreenshots] = useState([]);
  const [url, setUrl] = useState("");

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
    const zip = new JSZip();
    const folder = zip.folder("screenshots");
    screenshots.forEach((screenshot, index) => {
      const base64Data = screenshot.replace(/^data:image\/png;base64,/, "");
      folder.file(`screenshot-${index + 1}.png`, base64Data, { base64: true });
    });
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "screenshots.zip");
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
            screenshots.map((screenshot, index) => (
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
    </div>
  );
};

export default ScreenshotCellPhoneComponent;
