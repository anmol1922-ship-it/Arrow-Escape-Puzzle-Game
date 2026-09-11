import { render, screen } from "@testing-library/react";
import { Component } from "react";
import { describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "../../src/components/ErrorBoundary/ErrorBoundary";

class Broken extends Component {
  render(): never {
    throw new Error("internal test detail");
  }
}

describe("ErrorBoundary", () => {
  it("renders friendly recovery without exposing implementation errors", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    render(
      <ErrorBoundary>
        <Broken />
      </ErrorBoundary>,
    );
    expect(
      screen.getByRole("heading", { name: "Something went wrong." }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Return home" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/internal test detail|traceback|stack trace/i),
    ).not.toBeInTheDocument();
    consoleError.mockRestore();
  });
});
