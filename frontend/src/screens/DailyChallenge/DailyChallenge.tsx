import { useNavigate } from "react-router-dom";
import { useDailyChallenge } from "../../hooks/useDailyChallenge";
import { GameButton } from "../../components/GameButton/GameButton";
import { StarRating } from "../../components/StarRating/StarRating";

export function DailyChallenge() {
  const navigate = useNavigate();
  const { challenge, level, completed, result, start } = useDailyChallenge();
  return (
    <main className="screen-shell daily-screen">
      <header className="screen-heading">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Back to home"
        >
          ←
        </button>
        <div>
          <span className="eyebrow">ONE BOARD. TODAY ONLY.</span>
          <h1>Daily challenge</h1>
        </div>
      </header>
      <section className="daily-card">
        <div className="daily-date">
          <span>{challenge.dateKey}</span>
          <strong>{completed ? "CLEARED" : "READY"}</strong>
        </div>
        <span className="eyebrow">
          FEATURED {level?.difficulty.toUpperCase()}
        </span>
        <h2>{level?.title}</h2>
        <p>
          A fresh local puzzle, separate from your collection. Come back
          tomorrow for a new board.
        </p>
        <div className="daily-meta">
          <span>
            Board {level?.boardSize} × {level?.boardSize}
          </span>
          <span>{level?.arrows.length} arrows</span>
        </div>
        {completed && <StarRating stars={result?.bestStars ?? 0} />}
        <GameButton
          className="button-primary"
          onClick={() => {
            if (level) {
              start();
              navigate(`/game/${level.id}`);
            }
          }}
        >
          {completed ? "Play again" : "Start today’s board"}{" "}
          <span aria-hidden="true">↗</span>
        </GameButton>
      </section>
      <p className="daily-note">
        Works offline. No leaderboard, no account, just one good puzzle.
      </p>
    </main>
  );
}
