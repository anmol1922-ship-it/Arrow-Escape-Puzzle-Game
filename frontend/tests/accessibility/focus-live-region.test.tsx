import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { useFocusReturn } from "../../src/hooks/useFocusReturn";
import { useLiveAnnouncement } from "../../src/hooks/useLiveAnnouncement";
import { useReducedMotion } from "../../src/hooks/useReducedMotion";

function Harness({ open }: { open: boolean }) {
  const dialogRef = useFocusReturn<HTMLDivElement>(open);
  const live = useLiveAnnouncement();
  const reduced = useReducedMotion("on");
  return (
    <>
      <button type="button">Open</button>
      {open && (
        <div ref={dialogRef} tabIndex={-1} role="dialog">
          <button type="button" onClick={() => live.announce("Path blocked.")}>
            Announce
          </button>
          <span role="status">{live.announcement}</span>
          <span data-testid="reduced-motion">{String(reduced)}</span>
        </div>
      )}
    </>
  );
}

describe("shared accessibility hooks", () => {
  it("focuses the first control and restores focus after a transient view closes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Harness open={false} />);
    const open = screen.getByRole("button", { name: "Open" });
    open.focus();
    rerender(<Harness open />);
    expect(screen.getByRole("button", { name: "Announce" })).toHaveFocus();
    rerender(<Harness open={false} />);
    expect(open).toHaveFocus();
    await user.tab();
    expect(document.activeElement).not.toBe(open);
  });

  it("publishes concise status text and honors explicit reduced motion", async () => {
    const user = userEvent.setup();
    render(<Harness open />);
    await user.click(screen.getByRole("button", { name: "Announce" }));
    expect(screen.getByRole("status")).toHaveTextContent("Path blocked.");
    expect(screen.getByTestId("reduced-motion")).toHaveTextContent("true");
  });
});
