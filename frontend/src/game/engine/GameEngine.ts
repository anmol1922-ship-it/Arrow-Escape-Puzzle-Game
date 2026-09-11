import type {
  GameAttempt,
  Level,
  MoveResult,
  ScoringProfile,
} from "../../types/game";
import { isMoveLegal } from "./moveValidator";
import {
  abandonAttempt,
  createAttempt,
  pauseAttempt,
  resumeAttempt,
  tickAttempt,
  withUpdatedTime,
} from "./gameState";
import { scoreCompletedAttempt } from "../scoring/scoreCalculator";

export function startGame(level: Level, now = new Date()): GameAttempt {
  return createAttempt(level, now);
}

export function restartGame(level: Level, now = new Date()): GameAttempt {
  return createAttempt(level, now);
}

export function makeMove(
  level: Level,
  attempt: GameAttempt,
  arrowId: string,
  profile: ScoringProfile,
  now = new Date(),
): MoveResult {
  if (
    attempt.status !== "active" ||
    !attempt.activeArrowIds.includes(arrowId)
  ) {
    return { kind: "ignored", arrowId, attempt, announcement: "" };
  }
  if (!isMoveLegal(level, attempt.activeArrowIds, arrowId)) {
    return {
      kind: "blocked",
      arrowId,
      attempt: withUpdatedTime(
        { ...attempt, mistakes: attempt.mistakes + 1, hintedArrowId: null },
        now,
      ),
      announcement: "This arrow is blocked.",
    };
  }

  const activeArrowIds = attempt.activeArrowIds.filter(
    (candidate) => candidate !== arrowId,
  );
  const next = withUpdatedTime(
    {
      ...attempt,
      activeArrowIds,
      moves: attempt.moves + 1,
      hintedArrowId: null,
    },
    now,
  );
  if (activeArrowIds.length > 0) {
    return {
      kind: "escaped",
      arrowId,
      attempt: next,
      announcement: "Arrow cleared successfully.",
    };
  }
  const score = scoreCompletedAttempt(level, next, profile);
  return {
    kind: "completed",
    arrowId,
    attempt: { ...next, status: "completed", ...score },
    announcement: "Level complete.",
  };
}

export { pauseAttempt, resumeAttempt, tickAttempt, abandonAttempt };
