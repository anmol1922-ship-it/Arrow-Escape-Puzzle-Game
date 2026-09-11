import type { Hint } from "../../types/game";
import { GameButton } from "../GameButton/GameButton";

export function HintButton({
  hint,
  onRequest,
  onAiRequest,
}: {
  hint: Hint | null;
  onRequest: () => void;
  onAiRequest: () => void;
}) {
  return (
    <div className="hint-area">
      <div className="hint-actions">
        <GameButton className="button-quiet" onClick={onRequest}>
          ✦ Local hint
        </GameButton>
        <GameButton className="button-quiet" onClick={onAiRequest}>
          Ask coach
        </GameButton>
      </div>
      {hint && (
        <div className="hint-message" role="status">
          <strong>{hint.message}</strong>
          <span>{hint.reason}</span>
        </div>
      )}
    </div>
  );
}
