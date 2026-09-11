import type { PlayerSettings } from "../types/game";
import {
  createBrowserStorageAdapter,
  type StorageAdapter,
} from "./storageAdapter";

export const SETTINGS_KEY = "arrow-escape-settings-v1";
export const DEFAULT_SETTINGS: PlayerSettings = {
  schemaVersion: 1,
  soundEnabled: true,
  musicEnabled: true,
  vibrationEnabled: true,
  theme: "system",
  reduceMotion: "system",
};

export function loadSettings(
  storage: StorageAdapter = createBrowserStorageAdapter(),
): PlayerSettings {
  const value = storage.read<Partial<PlayerSettings>>(SETTINGS_KEY);
  if (!value || value.schemaVersion !== 1) return { ...DEFAULT_SETTINGS };
  return {
    ...DEFAULT_SETTINGS,
    ...value,
    theme:
      value.theme === "light" || value.theme === "dark"
        ? value.theme
        : "system",
    reduceMotion:
      value.reduceMotion === "on" || value.reduceMotion === "off"
        ? value.reduceMotion
        : "system",
  };
}

export function saveSettings(
  settings: PlayerSettings,
  storage: StorageAdapter = createBrowserStorageAdapter(),
): void {
  storage.write(SETTINGS_KEY, settings);
}

export function resolveReducedMotion(settings: PlayerSettings): boolean {
  if (settings.reduceMotion === "on") return true;
  if (settings.reduceMotion === "off") return false;
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}
