import ReactDOM from "react-dom/client";
import './css/tailwind.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

// Tạo một instance của QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
