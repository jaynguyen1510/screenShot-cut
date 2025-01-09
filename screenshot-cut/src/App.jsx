import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/common/Header";
import ScreenshotComponent from "./Components/ScreenshotComponent/ScreenshotComponent";

export default function App() {
  return (
    <BrowserRouter>
      <Header /> {/* Component Header sẽ luôn xuất hiện */}
      <Routes>
        <Route path="/" element={<ScreenshotComponent />} />
        {/* Route chính */}
      </Routes>
    </BrowserRouter>
  );
}
