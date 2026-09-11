import { getLocalHint } from "./aiFallback";
import { isMoveLegal } from "../game/engine/moveValidator";
import type { AiMode, GameAttempt, Hint, Level } from "../types/game";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

function responseToHint(
  response: unknown,
  level: Level,
  attempt: GameAttempt,
): Hint | null {
  if (!response || typeof response !== "object") return null;
  const data = response as Record<string, unknown>;
  if (
    typeof data.arrowId !== "string" ||
    typeof data.hint !== "string" ||
    typeof data.reason !== "string"
  )
    return null;
  if (
    !attempt.activeArrowIds.includes(data.arrowId) ||
    !isMoveLegal(level, attempt.activeArrowIds, data.arrowId)
  )
    return null;
  return {
    arrowId: data.arrowId,
    message: data.hint,
    reason: data.reason,
    source: "ai",
    confidence: typeof data.confidence === "number" ? data.confidence : null,
  };
}

export async function requestAiGuidance(
  level: Level,
  attempt: GameAttempt,
  mode: AiMode = "hint",
): Promise<Hint> {
  const payload = {
    puzzle_id: level.id,
    board_size: level.boardSize,
    moves: attempt.moves,
    mistakes: attempt.mistakes,
    mode,
    arrows: level.arrows.filter((arrow) =>
      attempt.activeArrowIds.includes(arrow.id),
    ),
  };
  try {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${API_BASE_URL}/api/v1/ai/hint`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    window.clearTimeout(timeout);
    if (!response.ok) throw new Error("guidance unavailable");
    const candidate = responseToHint(await response.json(), level, attempt);
    if (candidate) return candidate;
    throw new Error("guidance invalid");
  } catch {
    return getLocalHint(level, attempt);
  }
}
