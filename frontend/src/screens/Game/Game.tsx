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
import { playFeedback } from "../../audio/audioService";

export function Game() {
  const { levelId = "" } = useParams();
  const navigate = useNavigate();
  const level = getLevel(levelId);
  const session = useGame();
  const { attempt, recoveryCandidate, startLevel } = session;

  useEffect(() => {
    if (attempt?.levelId === levelId && attempt.status === "completed")
      navigate(`/complete/${levelId}`, { replace: true });
  }, [attempt, levelId, navigate]);
  useEffect(() => {
    if (!attempt && !recoveryCandidate && level) startLevel(level.id);
  }, [attempt, level, recoveryCandidate, startLevel]);
  useEffect(() => {
    if (!attempt || attempt.status !== "active") return undefined;
    const timer = window.setInterval(session.tick, 1000);
    return () => window.clearInterval(timer);
  }, [attempt, session.tick]);
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
    session.feedback.kind === "blocked" || session.feedback.kind === "escaped"
      ? session.feedback.kind
      : null;
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
        feedback={{ ...session.feedback, kind: feedbackKind }}
        onActivate={(arrowId) => {
          session.moveArrow(arrowId);
          if (session.feedback.kind)
            playFeedback(
              session.feedback.kind === "blocked" ? "blocked" : "success",
              session.settings.soundEnabled,
              session.settings.vibrationEnabled,
            );
        }}
      />
      <div className="game-bottom">
        <HintButton
          hint={session.hint}
          onRequest={session.requestHint}
          onAiRequest={() => {
            void session.requestAiHint("coach");
          }}
        />
        <p className="board-status" role="status">
          {session.announcement}
        </p>
      </div>
      <ParticleEffect active={session.feedback.kind === "completed"} />
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
