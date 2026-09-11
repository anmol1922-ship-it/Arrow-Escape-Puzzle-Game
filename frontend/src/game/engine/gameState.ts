import type { GameAttempt, Level } from "../../types/game";

export const GAME_SCHEMA_VERSION = 1;

export function createAttempt(level: Level, now = new Date()): GameAttempt {
  const timestamp = now.toISOString();
  return {
    levelId: level.id,
    activeArrowIds: level.arrows.map((arrow) => arrow.id),
    moves: 0,
    mistakes: 0,
    elapsedSeconds: 0,
    status: "active",
    score: null,
    stars: null,
    hintedArrowId: null,
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function withUpdatedTime(
  attempt: GameAttempt,
  now = new Date(),
): GameAttempt {
  return { ...attempt, updatedAt: now.toISOString() };
}

export function tickAttempt(
  attempt: GameAttempt,
  seconds = 1,
  now = new Date(),
): GameAttempt {
  if (attempt.status !== "active" || seconds <= 0) return attempt;
  return withUpdatedTime(
    { ...attempt, elapsedSeconds: attempt.elapsedSeconds + seconds },
    now,
  );
}

export function pauseAttempt(
  attempt: GameAttempt,
  now = new Date(),
): GameAttempt {
  if (attempt.status !== "active") return attempt;
  return withUpdatedTime({ ...attempt, status: "paused" }, now);
}

export function resumeAttempt(
  attempt: GameAttempt,
  now = new Date(),
): GameAttempt {
  if (attempt.status !== "paused") return attempt;
  return withUpdatedTime({ ...attempt, status: "active" }, now);
}

export function abandonAttempt(
  attempt: GameAttempt,
  now = new Date(),
): GameAttempt {
  return withUpdatedTime({ ...attempt, status: "abandoned" }, now);
}
