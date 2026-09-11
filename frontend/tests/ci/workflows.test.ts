import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function workflow(name: string): string {
  return readFileSync(
    resolve(process.cwd(), "../.github/workflows", name),
    "utf8",
  );
}

describe("release workflows", () => {
  it("runs required checks and keeps publishing tag-only", () => {
    const ci = workflow("ci.yml");
    const publish = workflow("publish.yml");
    expect(ci).toContain("npm run build");
    expect(ci).toContain("pytest");
    expect(publish).toContain("tags:");
    expect(publish).toContain("v*");
    expect(publish).not.toContain("deploy");
  });
});
