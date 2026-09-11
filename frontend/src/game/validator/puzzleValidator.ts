import type { Level } from "../../types/game";
import { getScoringProfile } from "../../data/scoringProfiles";
import { solvePuzzle } from "../solver/puzzleSolver";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  solutionLength: number | null;
}

const DIRECTIONS = new Set(["UP", "DOWN", "LEFT", "RIGHT"]);
const DIFFICULTIES = new Set(["easy", "medium", "hard", "expert"]);

export function validateLevel(level: Level): ValidationResult {
  const errors: string[] = [];
  if (!level.id || !level.title) errors.push("missing id or title");
  if (!DIFFICULTIES.has(level.difficulty)) errors.push("invalid difficulty");
  if (
    !Number.isInteger(level.boardSize) ||
    level.boardSize < 4 ||
    level.boardSize > 7
  )
    errors.push("boardSize must be 4 through 7");
  if (!Number.isInteger(level.targetMoves) || level.targetMoves <= 0)
    errors.push("targetMoves must be positive");
  if (
    !Number.isInteger(level.targetTimeSeconds) ||
    level.targetTimeSeconds <= 0
  )
    errors.push("targetTimeSeconds must be positive");
  try {
    getScoringProfile(level.difficulty);
  } catch {
    errors.push("missing scoring profile");
  }

  const ids = new Set<string>();
  const positions = new Set<string>();
  for (const arrow of level.arrows ?? []) {
    if (ids.has(arrow.id)) errors.push(`duplicate arrow id: ${arrow.id}`);
    ids.add(arrow.id);
    const position = `${arrow.row}:${arrow.column}`;
    if (positions.has(position))
      errors.push(`conflicting position: ${position}`);
    positions.add(position);
    if (
      arrow.row < 0 ||
      arrow.row >= level.boardSize ||
      arrow.column < 0 ||
      arrow.column >= level.boardSize
    ) {
      errors.push(`out-of-bounds arrow: ${arrow.id}`);
    }
    if (!DIRECTIONS.has(arrow.direction))
      errors.push(`invalid direction: ${arrow.id}`);
  }
  if (!level.arrows?.length) errors.push("level must contain arrows");
  if (errors.length > 0) return { valid: false, errors, solutionLength: null };

  const solution = solvePuzzle(level);
  if (!solution)
    return {
      valid: false,
      errors: ["level is unsolvable"],
      solutionLength: null,
    };
  if (level.targetMoves < solution.length)
    errors.push(
      `targetMoves ${level.targetMoves} is below optimal ${solution.length}`,
    );
  return {
    valid: errors.length === 0,
    errors,
    solutionLength: solution.length,
  };
}

export function validateCatalog(levels: Level[]): ValidationResult {
  const errors: string[] = [];
  const ids = new Set<string>();
  const unlockOrders = new Set<number>();
  let solutionLength = 0;
  for (const level of levels) {
    if (ids.has(level.id)) errors.push(`duplicate level id: ${level.id}`);
    ids.add(level.id);
    if (unlockOrders.has(level.unlockOrder))
      errors.push(`duplicate unlock order: ${level.unlockOrder}`);
    unlockOrders.add(level.unlockOrder);
    const result = validateLevel(level);
    solutionLength += result.solutionLength ?? 0;
    errors.push(...result.errors.map((error) => `${level.id}: ${error}`));
  }
  if (levels.length < 30)
    errors.push("catalog must contain at least 30 levels");
  return { valid: errors.length === 0, errors, solutionLength };
}
