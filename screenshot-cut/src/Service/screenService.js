import axios from "axios";

// Lấy URL API từ biến môi trường
const apiUrl = import.meta.env.VITE_API_URL;

// Hàm gọi API để chụp ảnh màn hình
export const captureScreenshot = async (url) => {
  try {
    const response = await axios.post(`${apiUrl}/screenshot`, {
      url,
    });
    return response.data.screenshots; // Trả về dữ liệu ảnh chụp màn hình
  } catch (error) {
    console.error("Lỗi khi chụp ảnh màn hình:", error);
    throw error; // Ném lại lỗi để có thể xử lý ở nơi gọi hàm
  }
};
