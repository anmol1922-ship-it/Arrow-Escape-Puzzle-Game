import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RecoveryPrompt } from "../../src/components/RecoveryPrompt/RecoveryPrompt";

describe("RecoveryPrompt", () => {
  it("offers resume, start-over, and level selection choices", async () => {
    const user = userEvent.setup();
    const resume = vi.fn();
    const startOver = vi.fn();
    const choose = vi.fn();
    render(
      <RecoveryPrompt
        onResume={resume}
        onStartOver={startOver}
        onChoose={choose}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Resume game" }));
    await user.click(screen.getByRole("button", { name: "Start over" }));
    await user.click(
      screen.getByRole("button", { name: "Choose another level" }),
    );
    expect(resume).toHaveBeenCalledOnce();
    expect(startOver).toHaveBeenCalledOnce();
    expect(choose).toHaveBeenCalledOnce();
  });
});
