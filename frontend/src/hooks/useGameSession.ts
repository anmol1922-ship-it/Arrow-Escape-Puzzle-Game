import { useCallback, useEffect, useState } from "react";
import { getLocalHint } from "../ai/aiFallback";
import { requestAiGuidance } from "../ai/aiService";
import { getScoringProfile } from "../data/scoringProfiles";
import { getLevel } from "../data/levels/levelCatalog";
import {
  makeMove,
  pauseAttempt,
  restartGame,
  resumeAttempt,
  startGame,
  tickAttempt,
} from "../game/engine/GameEngine";
import type {
  GameAttempt,
  Hint,
  MoveKind,
  PlayerSettings,
  ProgressRecord,
} from "../types/game";
import {
  loadProgress,
  mergeBestResult,
  saveProgress,
  saveActiveAttempt,
} from "../storage/gameStorage";
import { saveDailyResult } from "../storage/dailyStorage";
import { createBrowserStorageAdapter } from "../storage/storageAdapter";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
} from "../storage/settingsStorage";

export interface GameSession {
  progress: ProgressRecord;
  settings: PlayerSettings;
  attempt: GameAttempt | null;
  recoveryCandidate: GameAttempt | null;
  hint: Hint | null;
  announcement: string;
  feedback: { kind: MoveKind | null; arrowId: string | null };
  startLevel: (levelId: string) => void;
  startDailyLevel: (levelId: string, dateKey: string) => void;
  resumeSavedAttempt: () => void;
  startFreshAttempt: () => void;
  moveArrow: (arrowId: string) => void;
  requestHint: () => void;
  requestAiHint: (mode?: "hint" | "explanation" | "coach") => Promise<void>;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  tick: () => void;
  updateSettings: (settings: PlayerSettings) => void;
}

const browserStorage = createBrowserStorageAdapter();

export function useGameSession(): GameSession {
  const storage = browserStorage;
  const [progress, setProgress] = useState(() => loadProgress(storage));
  const [settings, setSettings] = useState(() => loadSettings(storage));
  const [attempt, setAttempt] = useState<GameAttempt | null>(null);
  const [recoveryCandidate, setRecoveryCandidate] =
    useState<GameAttempt | null>(null);
  const [hint, setHint] = useState<Hint | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [feedback, setFeedback] = useState<{
    kind: MoveKind | null;
    arrowId: string | null;
  }>({ kind: null, arrowId: null });
  const [activeChallengeDate, setActiveChallengeDate] = useState<string | null>(
    null,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.reduceMotion = settings.reduceMotion;
  }, [settings]);

  const currentLevel = attempt ? getLevel(attempt.levelId) : null;
  const persistAttempt = useCallback(
    (nextAttempt: GameAttempt | null, nextProgress = progress) => {
      const next = saveActiveAttempt(nextProgress, nextAttempt);
      setProgress(next);
      saveProgress(next, storage);
    },
    [progress, storage],
  );

  const startLevel = useCallback(
    (levelId: string) => {
      const level = getLevel(levelId);
      if (!level) return;
      const saved =
        progress.activeAttempt?.levelId === levelId &&
        ["active", "paused"].includes(progress.activeAttempt.status)
          ? progress.activeAttempt
          : null;
      setHint(null);
      setActiveChallengeDate(null);
      setFeedback({ kind: null, arrowId: null });
      if (saved) {
        setAttempt(null);
        setRecoveryCandidate(saved);
        return;
      }
      const next = startGame(level);
      setRecoveryCandidate(null);
      setAttempt(next);
      persistAttempt(next);
    },
    [persistAttempt, progress.activeAttempt],
  );

  const startDailyLevel = useCallback(
    (levelId: string, dateKey: string) => {
      const level = getLevel(levelId);
      if (!level) return;
      const next = startGame(level);
      setActiveChallengeDate(dateKey);
      setRecoveryCandidate(null);
      setHint(null);
      setAttempt(next);
      persistAttempt(next);
    },
    [persistAttempt],
  );

  const resumeSavedAttempt = useCallback(() => {
    if (!recoveryCandidate) return;
    setAttempt(recoveryCandidate);
    setRecoveryCandidate(null);
    setAnnouncement("Your saved game is ready to resume.");
  }, [recoveryCandidate]);

  const startFreshAttempt = useCallback(() => {
    const levelId = recoveryCandidate?.levelId;
    const level = levelId ? getLevel(levelId) : null;
    if (!level) return;
    const next = startGame(level);
    setAttempt(next);
    setRecoveryCandidate(null);
    persistAttempt(next);
  }, [persistAttempt, recoveryCandidate]);

  const moveArrow = useCallback(
    (arrowId: string) => {
      if (!attempt || !currentLevel) return;
      const result = makeMove(
        currentLevel,
        attempt,
        arrowId,
        getScoringProfile(currentLevel.difficulty),
      );
      setAttempt(result.attempt);
      setFeedback({ kind: result.kind, arrowId });
      setAnnouncement(result.announcement);
      setHint(null);
      if (
        result.kind === "completed" &&
        result.attempt.score !== null &&
        result.attempt.stars !== null &&
        activeChallengeDate
      ) {
        const nextProgress = saveDailyResult(
          progress,
          activeChallengeDate,
          {
            bestScore: result.attempt.score,
            bestTimeSeconds: result.attempt.elapsedSeconds,
            bestStars: result.attempt.stars,
            lastCompletedAt: result.attempt.updatedAt,
          },
          storage,
        );
        persistAttempt(null, nextProgress);
        setActiveChallengeDate(null);
      } else if (
        result.kind === "completed" &&
        result.attempt.score !== null &&
        result.attempt.stars !== null
      ) {
        const nextProgress = mergeBestResult(progress, currentLevel.id, {
          bestScore: result.attempt.score,
          bestTimeSeconds: result.attempt.elapsedSeconds,
          bestStars: result.attempt.stars,
          lastCompletedAt: result.attempt.updatedAt,
        });
        persistAttempt(null, nextProgress);
      } else {
        persistAttempt(result.attempt);
      }
    },
    [
      activeChallengeDate,
      attempt,
      currentLevel,
      persistAttempt,
      progress,
      storage,
    ],
  );

  const requestHint = useCallback(() => {
    if (!attempt || !currentLevel || attempt.status !== "active") return;
    const nextHint = getLocalHint(currentLevel, attempt);
    setHint(nextHint);
    setAttempt((current) =>
      current ? { ...current, hintedArrowId: nextHint.arrowId } : current,
    );
    setAnnouncement(
      nextHint.arrowId
        ? `${nextHint.message} ${nextHint.reason}`
        : nextHint.reason,
    );
  }, [attempt, currentLevel]);

  const requestAiHint = useCallback(
    async (mode: "hint" | "explanation" | "coach" = "hint") => {
      if (!attempt || !currentLevel || attempt.status !== "active") return;
      const nextHint = await requestAiGuidance(currentLevel, attempt, mode);
      setHint(nextHint);
      setAttempt((current) =>
        current ? { ...current, hintedArrowId: nextHint.arrowId } : current,
      );
      setAnnouncement(`${nextHint.message} ${nextHint.reason}`);
    },
    [attempt, currentLevel],
  );

  const pause = useCallback(() => {
    setAttempt((current) => {
      if (!current) return current;
      const next = pauseAttempt(current);
      persistAttempt(next);
      setAnnouncement("Game paused.");
      return next;
    });
  }, [persistAttempt]);

  const resume = useCallback(() => {
    setAttempt((current) => {
      if (!current) return current;
      const next = resumeAttempt(current);
      persistAttempt(next);
      setAnnouncement("Game resumed.");
      return next;
    });
  }, [persistAttempt]);

  const restart = useCallback(() => {
    if (!currentLevel) return;
    const next = restartGame(currentLevel);
    setAttempt(next);
    setHint(null);
    persistAttempt(next);
    setAnnouncement("Level restarted.");
  }, [currentLevel, persistAttempt]);

  const tick = useCallback(() => {
    setAttempt((current) => {
      if (!current || current.status !== "active") return current;
      const next = tickAttempt(current);
      persistAttempt(next);
      return next;
    });
  }, [persistAttempt]);

  const updateSettings = useCallback(
    (next: PlayerSettings) => {
      setSettings(next);
      saveSettings(next, storage);
    },
    [storage],
  );

  return {
    progress,
    settings: settings ?? DEFAULT_SETTINGS,
    attempt,
    recoveryCandidate,
    hint,
    announcement,
    feedback,
    startLevel,
    startDailyLevel,
    resumeSavedAttempt,
    startFreshAttempt,
    moveArrow,
    requestHint,
    requestAiHint,
    pause,
    resume,
    restart,
    tick,
    updateSettings,
  };
}
