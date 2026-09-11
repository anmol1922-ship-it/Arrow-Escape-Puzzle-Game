import { useNavigate } from "react-router-dom";
import { levels } from "../../data/levels/levelCatalog";
import { useGame } from "../../app/useGame";
import { useLevel } from "../../hooks/useLevel";
import { GameButton } from "../../components/GameButton/GameButton";
import { StarRating } from "../../components/StarRating/StarRating";

export function LevelSelect() {
  const navigate = useNavigate();
  const { progress, startLevel } = useGame();
  const { isUnlocked } = useLevel(progress);
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
          const unlocked = isUnlocked(level.id);
          const result = progress.bestByLevel[level.id];
          const state = !unlocked
            ? "locked"
            : result?.bestStars === 3
              ? "perfect"
              : result
                ? "completed"
                : level.unlockOrder === 1
                  ? "current"
                  : "unlocked";
          const stateId = `level-state-${level.id}`;
          return (
            <div className="level-node" key={level.id}>
              <span id={stateId} className="visually-hidden">
                {state === "locked"
                  ? "Locked"
                  : state === "perfect"
                    ? "Perfect completion"
                    : state === "completed"
                      ? "Completed"
                      : state === "current"
                        ? "Current level"
                        : "Unlocked"}
              </span>
              <button
                className={`level-tile ${unlocked ? "" : "is-locked"} ${result ? "is-complete" : ""}`}
                key={level.id}
                disabled={!unlocked}
                data-level-state={state}
                aria-describedby={stateId}
                onClick={() => {
                  startLevel(level.id);
                  navigate(`/game/${level.id}`);
                }}
                aria-label={
                  state === "locked"
                    ? `${level.title}, locked`
                    : `${level.title}, ${level.difficulty}, level ${level.unlockOrder}, ${state}`
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
                  <span className="lock-mark" aria-hidden="true">
                    ⌁
                  </span>
                )}
              </button>
            </div>
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
