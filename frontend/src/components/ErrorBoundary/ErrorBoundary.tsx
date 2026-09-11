import { Component, type PropsWithChildren, type ReactNode } from "react";
import { GameButton } from "../GameButton/GameButton";

interface State {
  failed: boolean;
}
export class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { failed: false };
  static getDerivedStateFromError(): State {
    return { failed: true };
  }
  componentDidCatch() {
    /* Keep player-facing output friendly. */
  }
  render(): ReactNode {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="recovery-screen">
        <span className="eyebrow">A SMALL DETOUR</span>
        <h1>Something went wrong.</h1>
        <p>Your game progress is safe.</p>
        <div className="modal-actions">
          <GameButton onClick={() => window.location.reload()}>
            Try again
          </GameButton>
          <GameButton
            className="button-quiet"
            onClick={() => {
              window.location.href = "/home";
            }}
          >
            Return home
          </GameButton>
        </div>
      </main>
    );
  }
}
