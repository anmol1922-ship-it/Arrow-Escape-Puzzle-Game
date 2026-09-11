import { useNavigate } from "react-router-dom";
import { levels, isLevelUnlocked } from "../../data/levels/levelCatalog";
import { useGame } from "../../app/useGame";
import { GameButton } from "../../components/GameButton/GameButton";
import { StarRating } from "../../components/StarRating/StarRating";

export function LevelSelect() {
  const navigate = useNavigate();
  const { progress, startLevel } = useGame();
  return (
    <main className="screen-shell level-screen">
      <header className="screen-heading">
        <button
          className="back-button"
          onClick={() => navigate("/home")}
          aria-label="Back to home"
        >
          ←
        </button>
        <div>
          <span className="eyebrow">THE COLLECTION</span>
          <h1>Choose your path.</h1>
        </div>
        <span className="progress-chip">
          {progress.completedLevelIds.length}/32
        </span>
      </header>
      <div className="level-summary">
        <span>Four chapters</span>
        <span>•</span>
        <span>Easy to expert</span>
        <span>•</span>
        <span>Best score saved locally</span>
      </div>
      <section className="level-grid" aria-label="Levels">
        {levels.map((level) => {
          const unlocked = isLevelUnlocked(level, progress.completedLevelIds);
          const result = progress.bestByLevel[level.id];
          return (
            <button
              className={`level-tile ${unlocked ? "" : "is-locked"} ${result ? "is-complete" : ""}`}
              key={level.id}
              disabled={!unlocked}
              onClick={() => {
                startLevel(level.id);
                navigate(`/game/${level.id}`);
              }}
              aria-label={
                unlocked
                  ? `${level.title}, ${level.difficulty}, level ${level.unlockOrder}`
                  : `${level.title}, locked`
              }
            >
              <span className="level-number">
                {String(level.unlockOrder).padStart(2, "0")}
              </span>
              <span className="level-name">{level.title}</span>
              <span className="level-difficulty">{level.difficulty}</span>
              {unlocked ? (
                <StarRating stars={result?.bestStars ?? 0} />
              ) : (
                <span className="lock-mark">⌁</span>
              )}
            </button>
          );
        })}
      </section>
      <GameButton
        className="button-quiet level-home-action"
        onClick={() => navigate("/home")}
      >
        Return home
      </GameButton>
    </main>
  );
}
