export const arrowPresentationStates = [
  "default",
  "hover",
  "pressed",
  "focused",
  "hinted",
  "blocked",
  "escaping",
  "disabled",
] as const;

export const screenPhases = [
  "loading",
  "playing",
  "paused",
  "arrow-selected",
  "arrow-escaping",
  "blocked-arrow",
  "board-update",
  "puzzle-completion",
  "star-reveal",
  "score-reveal",
  "celebration",
  "empty",
  "offline",
  "error",
] as const;

export const authoritativeMoveKinds = [
  "ignored",
  "blocked",
  "escaped",
  "completed",
] as const;
