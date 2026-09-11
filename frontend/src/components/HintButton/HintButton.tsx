import type { Hint } from "../../types/game";
import { GameButton } from "../GameButton/GameButton";

export function HintButton({
  hint,
  onRequest,
}: {
  hint: Hint | null;
  onRequest: () => void;
}) {
  return (
    <div className="hint-area">
      <div className="hint-actions">
        <GameButton className="button-quiet" onClick={onRequest}>
          ✦ Local hint
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
