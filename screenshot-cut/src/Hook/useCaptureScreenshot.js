import { useMutation } from "@tanstack/react-query";
import { captureScreenshot } from "../Service/screenService"; // Import hàm API

// Tạo một function riêng biệt để gọi API
const screenService = async (url) => {
  try {
    const result = await captureScreenshot(url); // Gọi API từ Service
    return result; // Trả về dữ liệu sau khi API thành công
  } catch (error) {
    console.log("Failed to capture screenshot", error);
    throw new Error("Lỗi khi gọi API chụp ảnh màn hình");
  }
};

const useCaptureScreenshot = () => {
  // Sử dụng useMutation để thực hiện yêu cầu POST
  const mutation = useMutation({
    mutationFn: screenService, // Dùng function screenService thay vì captureScreenshot trực tiếp
    onSuccess: (data) => {
      console.log("Chụp ảnh màn hình thành công:", data);
    },
    onError: (error) => {
      console.error("Lỗi khi chụp ảnh màn hình:", error);
    },
  });

  return mutation;
};

export default useCaptureScreenshot;
