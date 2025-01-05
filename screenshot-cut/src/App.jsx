import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponents from "./Components/HeaderComponents/HeaderComponents";
import ScreenshotCellPhoneComponent from "./Components/ScreenshotCellPhoneComponent/ScreenshotCellPhoneComponent";

export default function App() {
  return (
    <BrowserRouter>
      <HeaderComponents /> {/* Component Header sẽ luôn xuất hiện */}
      <Routes>
        <Route path="/" element={<ScreenshotCellPhoneComponent />} />
        {/* Route chính */}
      </Routes>
    </BrowserRouter>
  );
}
