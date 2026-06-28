// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// The accept button calls a server action (next/headers cookies), which can't
// run in jsdom — mock it. The under-21 path is pure client state.
vi.mock("@/app/actions/age", () => ({ confirmAge: vi.fn() }));

import { AgeGate } from "@/components/age-gate";

describe("AgeGate", () => {
  it("prompts for 21+ confirmation with both choices", () => {
    render(<AgeGate />);
    expect(screen.getByText("Age Verification")).toBeTruthy();
    expect(screen.getByRole("button", { name: /i am 21 or older/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /i am under 21/i })).toBeTruthy();
  });

  it("shows a blocking message when the visitor selects under 21", () => {
    render(<AgeGate />);
    fireEvent.click(screen.getByRole("button", { name: /i am under 21/i }));
    expect(screen.getByText(/must be 21 or older/i)).toBeTruthy();
    // and offers a way back to the prompt
    expect(screen.getByRole("button", { name: /go back/i })).toBeTruthy();
  });
});
