import { useCallback, useEffect, useRef, useState } from "react";
import type { MoveKind } from "../types/game";

export type GameAnimationName =
  | "idle"
  | "arrow-selected"
  | "arrow-escaping"
  | "blocked-arrow"
  | "board-update"
  | "puzzle-completion"
  | "star-reveal"
  | "score-reveal"
  | "celebration";

export interface GameAnimationState {
  name: GameAnimationName;
  arrowId: string | null;
}

export interface GameAnimationController {
  animation: GameAnimationState;
  animationState: GameAnimationState;
  isBusy: boolean;
  trigger: (name: Exclude<GameAnimationName, "idle">, arrowId?: string) => void;
  playMove: (kind: MoveKind, arrowId: string) => void;
  clear: () => void;
}

const IDLE_ANIMATION: GameAnimationState = { name: "idle", arrowId: null };
const ANIMATION_DURATIONS: Record<
  Exclude<GameAnimationName, "idle">,
  number
> = {
  "arrow-selected": 180,
  "arrow-escaping": 320,
  "blocked-arrow": 260,
  "board-update": 180,
  "puzzle-completion": 520,
  "star-reveal": 520,
  "score-reveal": 520,
  celebration: 700,
};

export function useGameAnimation(
  reducedMotion = false,
): GameAnimationController {
  const [animation, setAnimation] =
    useState<GameAnimationState>(IDLE_ANIMATION);
  const timeoutRef = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setAnimation(IDLE_ANIMATION);
  }, []);

  const trigger = useCallback(
    (name: Exclude<GameAnimationName, "idle">, arrowId?: string) => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      const duration = reducedMotion
        ? Math.min(120, ANIMATION_DURATIONS[name])
        : ANIMATION_DURATIONS[name];
      setAnimation({ name, arrowId: arrowId ?? null });
      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        setAnimation(IDLE_ANIMATION);
      }, duration);
    },
    [reducedMotion],
  );

  const playMove = useCallback(
    (kind: MoveKind, arrowId: string) => {
      if (kind === "blocked") trigger("blocked-arrow", arrowId);
      else if (kind === "escaped") trigger("arrow-escaping", arrowId);
      else if (kind === "completed") trigger("puzzle-completion", arrowId);
      else clear();
    },
    [clear, trigger],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  return {
    animation,
    animationState: animation,
    isBusy: animation.name !== "idle",
    trigger,
    playMove,
    clear,
  };
}
