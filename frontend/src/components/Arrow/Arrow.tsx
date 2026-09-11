import type { ArrowDefinition } from "../../types/game";
import { arrowLabel } from "../../accessibility/accessibilityUtils";

interface ArrowProps {
  arrow: ArrowDefinition;
  hinted: boolean;
  feedback: "escaped" | "blocked" | null;
  disabled?: boolean;
  onActivate: (arrowId: string) => void;
}

export function Arrow({
  arrow,
  hinted,
  feedback,
  disabled = false,
  onActivate,
}: ArrowProps) {
  const state = disabled
    ? "disabled"
    : feedback === "blocked"
      ? "blocked"
      : feedback === "escaped"
        ? "escaping"
        : hinted
          ? "hinted"
          : "default";
  const accessibleState =
    state === "blocked"
      ? "blocked"
      : state === "disabled"
        ? "disabled"
        : state === "escaping"
          ? "removed"
          : hinted
            ? "clear"
            : undefined;

  return (
    <button
      className={`arrow-tile direction-${arrow.direction.toLowerCase()} arrow-state-${state}`}
      style={{ gridRow: arrow.row + 1, gridColumn: arrow.column + 1 }}
      aria-label={arrowLabel(
        arrow.row,
        arrow.column,
        arrow.direction,
        accessibleState,
      )}
      aria-disabled={disabled || undefined}
      data-direction={arrow.direction}
      data-testid={`arrow-${arrow.id}`}
      disabled={disabled}
      onClick={() => onActivate(arrow.id)}
    >
      <svg
        aria-hidden="true"
        data-direction={arrow.direction}
        viewBox="0 0 100 100"
        focusable="false"
      >
        <path d="M 10 42 H 57 V 23 L 90 50 L 57 77 V 58 H 10 Z" />
      </svg>
    </button>
  );
}
