// ScreenshotCellPhoneComponent.jsx
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
      <div className="screenshots-list">
        {screenshots.length > 0 &&
          screenshots.map((screenshot, index) => (
            <img key={index} src={screenshot} alt={`Screenshot ${index + 1}`} />
          ))}
      </div>
      {isError && (
        <p style={{ color: "red" }}>Có lỗi xảy ra: {error.message}</p>
      )}
    </div>
  );
};

export default ScreenshotCellPhoneComponent;
