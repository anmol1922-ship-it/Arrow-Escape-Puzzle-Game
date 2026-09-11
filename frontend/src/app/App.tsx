import { BrowserRouter } from "react-router-dom";
import { GameProvider } from "./providers";
import { AppRoutes } from "./routes";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";

export function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </GameProvider>
    </BrowserRouter>
  );
}
