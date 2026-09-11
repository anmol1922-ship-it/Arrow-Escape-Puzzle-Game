export function playFeedback(
  kind: "success" | "blocked" | "complete",
  enabled: boolean,
  vibrationEnabled: boolean,
): void {
  if (
    vibrationEnabled &&
    typeof navigator !== "undefined" &&
    "vibrate" in navigator
  )
    navigator.vibrate(kind === "blocked" ? 35 : 18);
  if (!enabled || typeof window === "undefined") return;
  // Audio remains optional until bundled sound assets are provided.
}
