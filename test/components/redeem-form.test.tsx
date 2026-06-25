// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
vi.mock("@/app/actions/redeem", () => ({ redeemCode: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
import { RedeemForm } from "@/components/commerce/redeem-form";

describe("RedeemForm", () => {
  it("renders an access-code input and submit", () => {
    render(<RedeemForm />);
    expect(screen.getByLabelText(/access code/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /unlock/i })).toBeTruthy();
  });
});
