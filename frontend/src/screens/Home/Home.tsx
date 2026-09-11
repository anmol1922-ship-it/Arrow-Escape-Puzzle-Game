import { useNavigate } from "react-router-dom";
import { GameButton } from "../../components/GameButton/GameButton";
import { useGame } from "../../app/useGame";
import { useBranding } from "../../branding/branding";
import { BrandLogo } from "../../components/BrandLogo/BrandLogo";

export function Home() {
  const navigate = useNavigate();
  const { progress } = useGame();
  const { brand } = useBranding();
  const activeLevelId = progress.activeAttempt?.levelId;
  const primaryLabel = activeLevelId ? "Continue" : "Play now";
  return (
    <main className="home-screen screen-shell">
      <header className="topbar">
        <div className="wordmark">
          <span className="wordmark-symbol">↗</span>
          <span>
            ARROW
            <br />
            <b>ESCAPE</b>
          </span>
        </div>
        <span className="progress-chip">
          {progress.completedLevelIds.length}/32 cleared
        </span>
      </header>
      <section className="home-hero">
        <div className="hero-copy">
          <span className="eyebrow">A POCKET-SIZED PUZZLE</span>
          <BrandLogo className="home-hero-logo" />
          <h1>
            Every arrow
            <br />
            <em>has a way out.</em>
          </h1>
          <p>Read the board. Find the opening. Let the arrows fly.</p>
          <GameButton
            className="button-primary"
            data-primary-action="play-now"
            onClick={() =>
              navigate(activeLevelId ? `/game/${activeLevelId}` : "/levels")
            }
          >
            {primaryLabel} <span aria-hidden="true">↗</span>
          </GameButton>
        </div>
        <div className="hero-board" aria-hidden="true">
          <span className="hero-arrow h1">→</span>
          <span className="hero-arrow h2">↓</span>
          <span className="hero-arrow h3">↑</span>
          <span className="hero-arrow h4">←</span>
          <span className="hero-arrow h5">→</span>
          <span className="hero-ring" />
        </div>
      </section>
      <nav className="home-nav" aria-label="Main navigation">
        <button onClick={() => navigate("/levels")}>
          <span>01</span>Levels<i>↗</i>
        </button>
        <button onClick={() => navigate("/daily")}>
          <span>02</span>Daily challenge<i>↗</i>
        </button>
        <button onClick={() => navigate("/settings")}>
          <span>03</span>Settings<i>↗</i>
        </button>
      </nav>
      <footer className="home-footer">
        <span>BUILT FOR SHORT BREAKS</span>
        <a
          className="home-footer-brand"
          href={brand.website}
          target="_blank"
          rel="noreferrer"
        >
          <BrandLogo className="home-footer-logo" />
          <span>{brand.slogan}</span>
        </a>
        <span>NO SIGNAL NEEDED</span>
        <span>32 HAND-CRAFTED LEVELS</span>
      </footer>
    </main>
  );
}
