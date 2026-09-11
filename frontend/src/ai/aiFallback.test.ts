import { describe, expect, it } from "vitest";
import { createAttempt } from "../game/engine/gameState";
import { blockedFixture } from "../../tests/fixtures/levels";
import { getLocalHint } from "./aiFallback";

describe("local fallback", () => {
  it("selects a legal arrow and does not mutate state", () => {
    const attempt = createAttempt(blockedFixture);
    const hint = getLocalHint(blockedFixture, attempt);
    expect(hint.arrowId).toBe("a2");
    expect(attempt.moves).toBe(0);
  });
});
