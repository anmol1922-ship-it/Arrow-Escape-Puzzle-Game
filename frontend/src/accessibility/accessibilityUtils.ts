import type { Direction, MoveKind } from "../types/game";

export const directionGlyph: Record<Direction, string> = {
  UP: "↑",
  DOWN: "↓",
  LEFT: "←",
  RIGHT: "→",
};

export function arrowLabel(
  row: number,
  column: number,
  direction: Direction,
): string {
  return `Arrow at row ${row + 1}, column ${column + 1}, pointing ${direction.toLowerCase()}`;
}

export function moveAnnouncement(kind: MoveKind): string {
  if (kind === "blocked") return "This arrow is blocked.";
  if (kind === "escaped") return "Arrow cleared successfully.";
  if (kind === "completed") return "Level complete.";
  return "";
}
