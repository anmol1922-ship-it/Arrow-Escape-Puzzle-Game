import { useCallback, useSyncExternalStore } from "react";
import type { PlayerSettings } from "../types/game";

export type ReducedMotionPreference = PlayerSettings["reduceMotion"] | boolean;

function readPreference(preference: ReducedMotionPreference): boolean {
  if (typeof preference === "boolean") return preference;
  if (preference === "on") return true;
  if (preference === "off") return false;
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useReducedMotion(
  preference: ReducedMotionPreference = "system",
): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (
        preference !== "system" ||
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
      )
        return () => undefined;

      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handleChange = () => onStoreChange();
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
      } else {
        mediaQuery.addListener?.(handleChange);
      }
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleChange);
        } else {
          mediaQuery.removeListener?.(handleChange);
        }
      };
    },
    [preference],
  );
  const getSnapshot = useCallback(
    () => readPreference(preference),
    [preference],
  );
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
