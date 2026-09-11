import { GameButton } from "../GameButton/GameButton";

export function PauseModal({
  onResume,
  onRestart,
  onHome,
}: {
  onResume: () => void;
  onRestart: () => void;
  onHome: () => void;
}) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pause-title"
    >
      <div className="modal-panel">
        <span className="eyebrow">TAKE A BREATH</span>
        <h2 id="pause-title">Paused</h2>
        <p>Your puzzle is waiting exactly where you left it.</p>
        <div className="modal-actions">
          <GameButton onClick={onResume}>Resume</GameButton>
          <GameButton className="button-quiet" onClick={onRestart}>
            Restart level
          </GameButton>
          <GameButton className="button-link" onClick={onHome}>
            Return home
          </GameButton>
        </div>
      </div>
    </div>
  );
}
