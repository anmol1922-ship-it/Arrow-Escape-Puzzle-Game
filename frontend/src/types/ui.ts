export type ScreenPhase =
  | "loading"
  | "playing"
  | "paused"
  | "arrow-selected"
  | "arrow-escaping"
  | "blocked-arrow"
  | "board-update"
  | "puzzle-completion"
  | "star-reveal"
  | "score-reveal"
  | "celebration"
  | "empty"
  | "offline"
  | "error";

export type ArrowPresentationState =
  | "default"
  | "hover"
  | "pressed"
  | "focused"
  | "hinted"
  | "blocked"
  | "escaping"
  | "disabled";

export type GuidanceRequestState =
  | "idle"
  | "thinking"
  | "accepted"
  | "stale"
  | "failed"
  | "fallback"
  | "unavailable";

export type FocusTarget =
  | "pause-trigger"
  | "pause-dialog"
  | "recovery-dialog"
  | "completion-primary"
  | "screen-heading";
