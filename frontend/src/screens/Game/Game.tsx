import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getLevel } from "../../data/levels/levelCatalog";
import { useGame } from "../../app/useGame";
import { GameBoard } from "../../components/GameBoard/GameBoard";
import { GameHeader } from "../../components/GameHeader/GameHeader";
import { HintButton } from "../../components/HintButton/HintButton";
import { PauseModal } from "../../components/PauseModal/PauseModal";
import { RecoveryPrompt } from "../../components/RecoveryPrompt/RecoveryPrompt";
import { ParticleEffect } from "../../components/ParticleEffect/ParticleEffect";
import { GameButton } from "../../components/GameButton/GameButton";
import { useEscapeToPause } from "../../accessibility/keyboardNavigation";
import { useNavigationRecovery } from "../../hooks/useNavigationRecovery";
import { useResponsiveGameBoard } from "../../hooks/useResponsiveGameBoard";
import { useSound } from "../../hooks/useSound";
import { useVibration } from "../../hooks/useVibration";

export function Game() {
  const { levelId = "" } = useParams();
  const navigate = useNavigate();
  const level = getLevel(levelId);
  const session = useGame();
  const { attempt, recoveryCandidate, startLevel } = session;
  const sound = useSound(session.settings);
  const vibration = useVibration(session.settings.vibrationEnabled);
  const board = useResponsiveGameBoard(level?.boardSize ?? 1);

  useEffect(() => {
    if (attempt?.levelId === levelId && attempt.status === "completed")
      navigate(`/complete/${levelId}`, { replace: true });
  }, [attempt, levelId, navigate]);
  useEffect(() => {
    if (!attempt && !recoveryCandidate && level) startLevel(level.id);
  }, [attempt, level, recoveryCandidate, startLevel]);
  useEscapeToPause(Boolean(attempt?.status === "active"), session.pause);
  useNavigationRecovery(Boolean(attempt?.status === "active"));

  if (!level)
    return (
      <main className="recovery-screen">
        <h1>That level slipped away.</h1>
        <GameButton onClick={() => navigate("/levels")}>
          Choose another level
        </GameButton>
      </main>
    );
  if (recoveryCandidate?.levelId === levelId)
    return (
      <RecoveryPrompt
        onResume={session.resumeSavedAttempt}
        onStartOver={session.startFreshAttempt}
        onChoose={() => navigate("/levels")}
      />
    );
  if (!attempt || attempt.levelId !== levelId)
    return (
      <main className="recovery-screen">
        <p>Preparing your puzzle…</p>
      </main>
    );

  const feedbackKind =
    session.animation.name === "blocked-arrow"
      ? "blocked"
      : session.animation.name === "arrow-escaping"
        ? "escaped"
        : null;
  const feedbackArrowId =
    feedbackKind === null ? null : session.animation.arrowId;
  return (
    <main className="game-screen screen-shell">
      <GameHeader
        level={level}
        attempt={attempt}
        onPause={session.pause}
        onHint={session.requestHint}
      />
      <div className="game-intro">
        <span>FULL PATH REQUIRED</span>
        <p>Clear the arrows from the outside in.</p>
      </div>
      <GameBoard
        level={level}
        attempt={attempt}
        feedback={{ kind: feedbackKind, arrowId: feedbackArrowId }}
        style={board.boardStyle}
        containerRef={board.containerRef}
        onActivate={(arrowId) => {
          if (session.isAnimationBusy) return;
          const kind = session.moveArrow(arrowId);
          if (kind === "blocked") {
            sound.playBlocked();
            vibration.vibrateBlocked();
          } else if (kind === "escaped") {
            sound.playSuccess();
            vibration.vibrateSuccess();
          } else if (kind === "completed") {
            sound.playComplete();
            vibration.vibrateComplete();
          }
        }}
      />
      <div className="game-bottom">
        <HintButton hint={session.hint} onRequest={session.requestHint} />
        <p className="board-status" role="status">
          {session.announcement}
        </p>
      </div>
      <ParticleEffect active={session.animation.name === "puzzle-completion"} />
      {attempt.status === "paused" && (
        <PauseModal
          onResume={session.resume}
          onRestart={session.restart}
          onHome={() => navigate("/home")}
        />
      )}
    </main>
  );
}
