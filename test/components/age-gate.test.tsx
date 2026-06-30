// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// The confirm button calls a server action (next/headers cookies), which can't
// run in jsdom — mock it. The "do not qualify" path is pure client state.
vi.mock("@/app/actions/age", () => ({ confirmAge: vi.fn() }));

import { AgeGate } from "@/components/age-gate";

describe("AgeGate", () => {
  it("prompts for the research-use attestation with both choices", () => {
    render(<AgeGate />);
    expect(screen.getByText("Research-Use Confirmation")).toBeTruthy();
    expect(screen.getByRole("button", { name: /i confirm/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /i do not qualify/i })).toBeTruthy();
  });

  it("shows a blocking message when the visitor does not qualify", () => {
    render(<AgeGate />);
    fireEvent.click(screen.getByRole("button", { name: /i do not qualify/i }));
    expect(screen.getByText(/for qualified researchers/i)).toBeTruthy();
    // and offers a way back to the prompt
    expect(screen.getByRole("button", { name: /go back/i })).toBeTruthy();
  });
});
