import { expect } from "vitest";

export function expectAccessibleAnnouncement(text: string | null): void {
  expect(text?.trim().length).toBeGreaterThan(0);
}
