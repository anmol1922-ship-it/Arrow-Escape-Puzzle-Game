import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const tokenSource = readFileSync(
  path.resolve(process.cwd(), "src/styles/tokens.css"),
  "utf8",
);

describe("Arrow Escape design tokens", () => {
  it("defines the semantic roles required by the game visual system", () => {
    for (const token of [
      "--ae-color-background",
      "--ae-color-focus",
      "--ae-color-arrow-highlight",
      "--ae-space-4",
      "--ae-radius-board",
      "--ae-shadow-board",
      "--ae-duration-feedback",
      "--ae-breakpoint-tablet",
      "--ae-z-modal",
      "--ae-touch-target",
      "--ae-board-max",
    ]) {
      expect(tokenSource).toContain(token);
    }
  });

  it("defines a dark-theme semantic override without duplicating component rules", () => {
    expect(tokenSource).toContain('[data-theme="dark"]');
    expect(tokenSource).toContain("--ae-color-background: #004040");
    expect(tokenSource).not.toContain(".game-board");
  });
});
