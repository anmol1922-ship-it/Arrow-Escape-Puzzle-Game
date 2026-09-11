import type { GameAttempt, Level, ScoringProfile } from "../../types/game";

export function calculateScore(
  level: Level,
  attempt: GameAttempt,
  profile: ScoringProfile,
): number {
  const movePenalty =
    Math.max(0, attempt.moves - level.targetMoves) * profile.movePenalty;
  const timePenalty =
    Math.max(0, attempt.elapsedSeconds - level.targetTimeSeconds) *
    profile.timePenalty;
  const mistakePenalty = attempt.mistakes * profile.mistakePenalty;
  return Math.max(
    0,
    profile.baseScore - movePenalty - timePenalty - mistakePenalty,
  );
}

export function calculateStars(score: number, profile: ScoringProfile): number {
  if (score >= profile.threeStarMinScore) return 3;
  if (score >= profile.twoStarMinScore) return 2;
  return 1;
}

export function scoreCompletedAttempt(
  level: Level,
  attempt: GameAttempt,
  profile: ScoringProfile,
): Pick<GameAttempt, "score" | "stars"> {
  const score = calculateScore(level, attempt, profile);
  return { score, stars: calculateStars(score, profile) };
}
