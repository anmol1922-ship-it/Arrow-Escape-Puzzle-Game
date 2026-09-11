import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrandLogo } from "../../components/BrandLogo/BrandLogo";
import { useBranding } from "../../branding/branding";

export function Splash() {
  const navigate = useNavigate();
  const { brand } = useBranding();
  useEffect(() => {
    const timer = window.setTimeout(
      () => navigate("/home", { replace: true }),
      850,
    );
    return () => window.clearTimeout(timer);
  }, [navigate]);
  return (
    <main className="splash-screen" aria-busy="true">
      <div className="splash-mark" aria-hidden="true">
        <span>↑</span>
        <span>→</span>
        <span>↓</span>
        <span>←</span>
      </div>
      <p className="brand-kicker">ARROW ESCAPE</p>
      <BrandLogo className="splash-hero-logo" />
      <h1>Find the clear path.</h1>
      <div className="loading-line" aria-label="Loading game" />
      <a
        className="splash-brand"
        href={brand.website}
        target="_blank"
        rel="noreferrer"
      >
        <BrandLogo className="splash-brand-logo" />
        <span>{brand.slogan}</span>
      </a>
    </main>
  );
}
