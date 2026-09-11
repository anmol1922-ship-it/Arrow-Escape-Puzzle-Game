import type { Level, GameAttempt } from "../../types/game";

interface GameHeaderProps {
  level: Level;
  attempt: GameAttempt;
  onPause: () => void;
  onHint: () => void;
}

export function GameHeader({
  level,
  attempt,
  onPause,
  onHint,
}: GameHeaderProps) {
  return (
    <header className="game-header">
      <div className="level-heading">
        <span className="eyebrow">{level.difficulty}</span>
        <h1>{level.title}</h1>
      </div>
      <div className="stat-strip" aria-label="Game status">
        <div>
          <span>TIME</span>
          <strong>{String(attempt.elapsedSeconds).padStart(2, "0")}s</strong>
        </div>
        <div>
          <span>MOVES</span>
          <strong>
            {attempt.moves}/{level.targetMoves}
          </strong>
        </div>
        <div>
          <span>MISTAKES</span>
          <strong>{attempt.mistakes}</strong>
        </div>
      </div>
      <div className="game-actions">
        <button
          className="icon-button"
          onClick={onHint}
          aria-label="Get a local hint"
          title="Get a local hint"
        >
          ?
        </button>
        <button
          className="icon-button"
          onClick={onPause}
          aria-label="Pause game"
          title="Pause game"
        >
          Ⅱ
        </button>
      </div>
    </header>
  );
}
