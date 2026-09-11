import { describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  resolveReducedMotion,
  saveSettings,
} from "./settingsStorage";
import type { StorageAdapter } from "./storageAdapter";

const storage: StorageAdapter = (() => {
  const values = new Map<string, unknown>();
  return {
    read: <T>(key: string) => (values.get(key) as T) ?? null,
    write: (key, value) => values.set(key, value),
    remove: (key) => values.delete(key),
  };
})();

describe("settings persistence", () => {
  it("round trips settings and defaults safely", () => {
    saveSettings(
      { ...DEFAULT_SETTINGS, soundEnabled: false, reduceMotion: "on" },
      storage,
    );
    expect(loadSettings(storage).soundEnabled).toBe(false);
    expect(resolveReducedMotion(loadSettings(storage))).toBe(true);
  });
});
