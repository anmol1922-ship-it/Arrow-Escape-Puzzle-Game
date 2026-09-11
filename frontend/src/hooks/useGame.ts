import { useCallback, useEffect } from "react";
import { useGameAnimation } from "./useGameAnimation";
import { useGameSession, type GameSession } from "./useGameSession";
import { useGameTimer, type GameTimerState } from "./useGameTimer";
import { useReducedMotion } from "./useReducedMotion";
import type { GameAnimationState } from "./useGameAnimation";
import type { MoveKind } from "../types/game";

export interface GameController extends GameSession {
  timer: GameTimerState;
  animation: GameAnimationState;
  isAnimationBusy: boolean;
}

export function useGame(): GameController {
  const session = useGameSession();
  const reducedMotion = useReducedMotion(session.settings.reduceMotion);
  const animationController = useGameAnimation(reducedMotion);
  const { attempt, moveArrow: moveSessionArrow, tick } = session;
  const { animation, playMove } = animationController;
  const timer = useGameTimer({
    initialElapsedSeconds: attempt?.elapsedSeconds ?? 0,
    isRunning: attempt?.status === "active",
  });

  useEffect(() => {
    const currentElapsedSeconds = attempt?.elapsedSeconds ?? 0;
    const elapsedDelta = timer.elapsedSeconds - currentElapsedSeconds;
    if (elapsedDelta > 0) tick(elapsedDelta);
  }, [attempt, tick, timer.elapsedSeconds]);

  const moveArrow = useCallback(
    (arrowId: string): MoveKind => {
      const kind = moveSessionArrow(arrowId);
      playMove(kind, arrowId);
      return kind;
    },
    [moveSessionArrow, playMove],
  );

  return {
    ...session,
    timer,
    animation,
    isAnimationBusy: animationController.isBusy,
    moveArrow,
  };
}
