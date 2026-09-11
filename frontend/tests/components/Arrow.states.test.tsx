import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ArrowDefinition } from "../../src/types/game";
import { Arrow } from "../../src/components/Arrow/Arrow";

const arrow: ArrowDefinition = {
  id: "arrow-right",
  row: 1,
  column: 2,
  direction: "RIGHT",
};

describe("Arrow visual states", () => {
  it.each([
    ["default", null, false],
    ["hinted", null, true],
    ["blocked", "blocked", false],
    ["escaping", "escaped", false],
  ])(
    "renders the %s state with a directional SVG",
    (state, feedback, hinted) => {
      render(
        <Arrow
          arrow={arrow}
          hinted={hinted}
          feedback={feedback as "blocked" | "escaped" | null}
          onActivate={vi.fn()}
        />,
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass(`arrow-state-${state}`);
      expect(button.querySelector("svg")).toHaveAttribute(
        "data-direction",
        "RIGHT",
      );
    },
  );

  it("supports a disabled state without dispatching activation", async () => {
    const user = userEvent.setup();
    const onActivate = vi.fn();
    render(
      <Arrow
        arrow={arrow}
        hinted={false}
        feedback={null}
        disabled
        onActivate={onActivate}
      />,
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onActivate).not.toHaveBeenCalled();
  });
});
