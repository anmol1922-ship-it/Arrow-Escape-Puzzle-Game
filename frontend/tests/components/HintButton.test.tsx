import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { HintButton } from "../../src/components/HintButton/HintButton";

describe("hint controls", () => {
  it("shows the local explanation without exposing unavailable coach controls", async () => {
    const user = userEvent.setup();
    const local = vi.fn();
    render(
      <HintButton
        onRequest={local}
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
    expect(local).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("button", { name: /Ask coach/ }),
    ).not.toBeInTheDocument();
  });
});
