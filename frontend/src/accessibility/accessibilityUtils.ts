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
  state?: "clear" | "blocked" | "disabled" | "removed",
): string {
  const base = `Arrow at row ${row + 1}, column ${column + 1}, pointing ${direction.toLowerCase()}`;
  if (state === "blocked") return `${base}. Path blocked.`;
  if (state === "clear") return `${base}. Path clear.`;
  if (state === "disabled") return `${base}. Disabled.`;
  if (state === "removed") return `${base}. Removed.`;
  return base;
}

export function moveAnnouncement(kind: MoveKind): string {
  if (kind === "blocked") return "This arrow is blocked.";
  if (kind === "escaped") return "Arrow cleared successfully.";
  if (kind === "completed") return "Level complete.";
  return "";
}
