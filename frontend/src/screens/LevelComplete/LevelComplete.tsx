import { useNavigate, useParams } from "react-router-dom";
import { getLevel } from "../../data/levels/levelCatalog";
import { useGame } from "../../app/useGame";
import { GameButton } from "../../components/GameButton/GameButton";
import { StarRating } from "../../components/StarRating/StarRating";

export function LevelComplete() {
  const navigate = useNavigate();
  const { levelId = "" } = useParams();
  const level = getLevel(levelId);
  const { progress } = useGame();
  const result = progress.bestByLevel[levelId];
  const nextLevel = levelId
    ? getLevel(
        `level-${String(Number(levelId.split("-")[1]) + 1).padStart(3, "0")}`,
      )
    : undefined;
  return (
    <main className="completion-screen screen-shell">
      <span className="completion-spark" aria-hidden="true">
        ✦
      </span>
      <span className="eyebrow">LEVEL {level?.unlockOrder ?? ""} CLEARED</span>
      <h1>Clean escape.</h1>
      <p className="completion-subtitle">
        You found every opening in <strong>{level?.title}</strong>.
      </p>
      <StarRating stars={result?.bestStars ?? 1} />
      <div className="result-grid">
        <div>
          <span>BEST SCORE</span>
          <strong>{result?.bestScore ?? 0}</strong>
        </div>
        <div>
          <span>BEST TIME</span>
          <strong>{result?.bestTimeSeconds ?? 0}s</strong>
        </div>
        <div>
          <span>BEST STARS</span>
          <strong>{result?.bestStars ?? 0}/3</strong>
        </div>
      </div>
      <div className="completion-actions">
        {nextLevel && (
          <GameButton
            className="button-primary"
            onClick={() => navigate("/levels")}
          >
            Next level <span aria-hidden="true">↗</span>
          </GameButton>
        )}
        <GameButton
          className="button-quiet"
          onClick={() => navigate("/levels")}
        >
          Level select
        </GameButton>
        <GameButton className="button-link" onClick={() => navigate("/home")}>
          Home
        </GameButton>
      </div>
    </main>
  );
}
