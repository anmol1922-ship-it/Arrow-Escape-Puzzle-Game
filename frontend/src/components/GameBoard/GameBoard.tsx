import type {
  ArrowDefinition,
  GameAttempt,
  Level,
  MoveKind,
} from "../../types/game";
import type { CSSProperties, RefObject } from "react";
import { Arrow } from "../Arrow/Arrow";

interface GameBoardProps {
  level: Level;
  attempt: GameAttempt;
  feedback: { kind: MoveKind | null; arrowId: string | null };
  onActivate: (arrowId: string) => void;
  style?: CSSProperties;
  containerRef?: RefObject<HTMLDivElement | null>;
}

export function GameBoard({
  level,
  attempt,
  feedback,
  onActivate,
  style,
  containerRef,
}: GameBoardProps) {
  const active = new Set(attempt.activeArrowIds);
  return (
    <div
      className={`game-board board-size-${level.boardSize} ${attempt.status !== "active" ? "is-paused" : ""}`}
      role="group"
      aria-label={`${level.title}, ${level.boardSize} by ${level.boardSize} arrow puzzle`}
      ref={containerRef}
      style={{
        ...style,
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
            disabled={attempt.status !== "active"}
            onActivate={onActivate}
          />
        ) : feedback.kind === "escaped" && feedback.arrowId === arrow.id ? (
          <div
            key={arrow.id}
            className={`arrow-departure direction-${arrow.direction.toLowerCase()} arrow-state-escaping`}
            data-testid={`departure-${arrow.id}`}
            aria-hidden="true"
            style={{ gridRow: arrow.row + 1, gridColumn: arrow.column + 1 }}
          >
            <svg
              aria-hidden="true"
              data-direction={arrow.direction}
              viewBox="0 0 100 100"
              focusable="false"
            >
              <path d="M 10 42 H 57 V 23 L 90 50 L 57 77 V 58 H 10 Z" />
            </svg>
          </div>
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
