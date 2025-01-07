import { BrowserRouter, Routes, Route } from "react-router-dom";
import HeaderComponents from "./Components/HeaderComponents/HeaderComponents";
import ScreenshotComponent from "./Components/ScreenshotComponent/ScreenshotComponent";

export default function App() {
  return (
    <BrowserRouter>
      <HeaderComponents /> {/* Component Header sẽ luôn xuất hiện */}
      <Routes>
        <Route path="/" element={<ScreenshotComponent />} />
        {/* Route chính */}
      </Routes>
    </BrowserRouter>
  );
}
