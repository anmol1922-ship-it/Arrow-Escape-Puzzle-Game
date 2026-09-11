import type {
  ArrowDefinition,
  GameAttempt,
  Level,
  MoveKind,
} from "../../types/game";
import { Arrow } from "../Arrow/Arrow";

interface GameBoardProps {
  level: Level;
  attempt: GameAttempt;
  feedback: { kind: MoveKind | null; arrowId: string | null };
  onActivate: (arrowId: string) => void;
}

export function GameBoard({
  level,
  attempt,
  feedback,
  onActivate,
}: GameBoardProps) {
  const active = new Set(attempt.activeArrowIds);
  return (
    <div
      className={`game-board board-size-${level.boardSize} ${attempt.status !== "active" ? "is-paused" : ""}`}
      role="group"
      aria-label={`${level.title}, ${level.boardSize} by ${level.boardSize} arrow puzzle`}
      style={{
        gridTemplateColumns: `repeat(${level.boardSize}, minmax(0, 1fr))`,
      }}
    >
      {level.arrows.map((arrow: ArrowDefinition) =>
        active.has(arrow.id) ? (
          <Arrow
            key={arrow.id}
            arrow={arrow}
            hinted={attempt.hintedArrowId === arrow.id}
            feedback={
              feedback.arrowId === arrow.id
                ? (feedback.kind as "escaped" | "blocked")
                : null
            }
            onActivate={onActivate}
          />
        ) : (
          <div
            key={arrow.id}
            className="escaped-slot"
            style={{ gridRow: arrow.row + 1, gridColumn: arrow.column + 1 }}
            aria-hidden="true"
          />
        ),
      )}
    </div>
  );
}
