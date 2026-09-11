import type { ArrowDefinition } from "../../types/game";
import {
  arrowLabel,
  directionGlyph,
} from "../../accessibility/accessibilityUtils";

interface ArrowProps {
  arrow: ArrowDefinition;
  hinted: boolean;
  feedback: "escaped" | "blocked" | null;
  onActivate: (arrowId: string) => void;
}

export function Arrow({ arrow, hinted, feedback, onActivate }: ArrowProps) {
  return (
    <button
      className={`arrow-tile direction-${arrow.direction.toLowerCase()} ${hinted ? "is-hinted" : ""} ${feedback ? `feedback-${feedback}` : ""}`}
      style={{ gridRow: arrow.row + 1, gridColumn: arrow.column + 1 }}
      aria-label={arrowLabel(arrow.row, arrow.column, arrow.direction)}
      data-testid={`arrow-${arrow.id}`}
      onClick={() => onActivate(arrow.id)}
    >
      <span aria-hidden="true">{directionGlyph[arrow.direction]}</span>
    </button>
  );
}
