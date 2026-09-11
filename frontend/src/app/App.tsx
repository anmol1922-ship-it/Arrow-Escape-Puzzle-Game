import { BrowserRouter } from "react-router-dom";
import { GameProvider } from "./providers";
import { AppRoutes } from "./routes";
import { ErrorBoundary } from "../components/ErrorBoundary/ErrorBoundary";

const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <GameProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </GameProvider>
    </BrowserRouter>
  );
}
