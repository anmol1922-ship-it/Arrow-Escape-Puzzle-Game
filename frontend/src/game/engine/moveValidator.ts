import type { ArrowDefinition, Direction, Level } from "../../types/game";

const VECTORS: Record<Direction, { row: number; column: number }> = {
  UP: { row: -1, column: 0 },
  DOWN: { row: 1, column: 0 },
  LEFT: { row: 0, column: -1 },
  RIGHT: { row: 0, column: 1 },
};

export interface MoveLegality {
  legal: boolean;
  reason: "clear" | "blocked" | "missing" | "already-removed";
}

export function directionVector(direction: Direction) {
  return VECTORS[direction];
}

export function getArrow(
  level: Level,
  arrowId: string,
): ArrowDefinition | undefined {
  return level.arrows.find((arrow) => arrow.id === arrowId);
}

export function isMoveLegal(
  level: Level,
  activeArrowIds: readonly string[],
  arrowId: string,
): boolean {
  return validateMove(level, activeArrowIds, arrowId).legal;
}

export function validateMove(
  level: Level,
  activeArrowIds: readonly string[],
  arrowId: string,
): MoveLegality {
  const arrow = getArrow(level, arrowId);
  if (!arrow) return { legal: false, reason: "missing" };
  if (!activeArrowIds.includes(arrowId))
    return { legal: false, reason: "already-removed" };

  const occupied = new Set(activeArrowIds);
  const vector = directionVector(arrow.direction);
  let row = arrow.row + vector.row;
  let column = arrow.column + vector.column;

  while (
    row >= 0 &&
    row < level.boardSize &&
    column >= 0 &&
    column < level.boardSize
  ) {
    const occupant = level.arrows.find(
      (candidate) => candidate.row === row && candidate.column === column,
    );
    if (occupant && occupied.has(occupant.id)) {
      return { legal: false, reason: "blocked" };
    }
    row += vector.row;
    column += vector.column;
  }

  return { legal: true, reason: "clear" };
}

export function getLegalMoves(
  level: Level,
  activeArrowIds: readonly string[],
): string[] {
  return [...activeArrowIds]
    .map((arrowId) => getArrow(level, arrowId))
    .filter((arrow): arrow is ArrowDefinition => Boolean(arrow))
    .sort(
      (left, right) =>
        left.row - right.row ||
        left.column - right.column ||
        left.id.localeCompare(right.id),
    )
    .filter((arrow) => isMoveLegal(level, activeArrowIds, arrow.id))
    .map((arrow) => arrow.id);
}
