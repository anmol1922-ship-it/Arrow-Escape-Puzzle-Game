import { GameButton } from "../GameButton/GameButton";

export function RecoveryPrompt({
  onResume,
  onStartOver,
  onChoose,
}: {
  onResume: () => void;
  onStartOver: () => void;
  onChoose: () => void;
}) {
  return (
    <main className="screen-shell recovery-screen">
      <span className="eyebrow">WELCOME BACK</span>
      <h1>Pick up where you left off?</h1>
      <p>Your in-progress board is safe on this device.</p>
      <div className="modal-actions">
        <GameButton onClick={onResume}>Resume game</GameButton>
        <GameButton className="button-quiet" onClick={onStartOver}>
          Start over
        </GameButton>
        <GameButton className="button-link" onClick={onChoose}>
          Choose another level
        </GameButton>
      </div>
    </main>
  );
}
