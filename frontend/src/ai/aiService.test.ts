import { beforeEach, describe, expect, it, vi } from "vitest";
import { createAttempt } from "../game/engine/gameState";
import type { Level } from "../types/game";
import { requestAiGuidance } from "./aiService";

const level: Level = {
  id: "ai-test",
  title: "AI",
  difficulty: "easy",
  boardSize: 4,
  targetMoves: 2,
  targetTimeSeconds: 30,
  scoringProfileId: "easy",
  unlockOrder: 1,
  arrows: [
    { id: "a1", row: 0, column: 0, direction: "RIGHT" },
    { id: "a2", row: 0, column: 1, direction: "RIGHT" },
  ],
};

beforeEach(() => vi.restoreAllMocks());

describe("AI client safety", () => {
  it("falls back when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const hint = await requestAiGuidance(level, createAttempt(level));
    expect(hint.source).toBe("local");
    expect(hint.arrowId).toBe("a2");
  });
  it("rejects an AI response that points to a blocked arrow", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              arrowId: "a1",
              hint: "bad",
              reason: "bad",
              confidence: 0.9,
            }),
            { status: 200 },
          ),
        ),
    );
    const hint = await requestAiGuidance(level, createAttempt(level));
    expect(hint.source).toBe("local");
    expect(hint.arrowId).toBe("a2");
  });
  it("accepts a legal validated response", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response(
            JSON.stringify({
              arrowId: "a2",
              hint: "Clear this one.",
              reason: "The path is clear.",
              confidence: 0.9,
            }),
            { status: 200 },
          ),
        ),
    );
    const hint = await requestAiGuidance(level, createAttempt(level));
    expect(hint.source).toBe("ai");
    expect(hint.arrowId).toBe("a2");
  });
});
