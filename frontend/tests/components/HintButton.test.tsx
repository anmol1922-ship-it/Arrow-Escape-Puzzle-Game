import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HintButton } from "../../src/components/HintButton/HintButton";

describe("hint controls", () => {
  it("shows local explanation and routes both hint actions", async () => {
    const user = userEvent.setup();
    const local = vi.fn();
    const ai = vi.fn();
    render(
      <HintButton
        onRequest={local}
        onAiRequest={ai}
        hint={{
          arrowId: "a2",
          message: "Try this arrow.",
          reason: "Its path is clear.",
          source: "local",
          confidence: null,
        }}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Its path is clear.");
    await user.click(screen.getByRole("button", { name: /Local hint/ }));
    await user.click(screen.getByRole("button", { name: /Ask coach/ }));
    expect(local).toHaveBeenCalledOnce();
    expect(ai).toHaveBeenCalledOnce();
  });
});
