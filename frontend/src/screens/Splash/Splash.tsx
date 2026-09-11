import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = window.setTimeout(
      () => navigate("/home", { replace: true }),
      850,
    );
    return () => window.clearTimeout(timer);
  }, [navigate]);
  return (
    <main className="splash-screen">
      <div className="splash-mark" aria-hidden="true">
        <span>↑</span>
        <span>→</span>
        <span>↓</span>
        <span>←</span>
      </div>
      <p className="brand-kicker">ARROW ESCAPE</p>
      <h1>Find the clear path.</h1>
      <div className="loading-line" aria-label="Loading game" />
    </main>
  );
}
