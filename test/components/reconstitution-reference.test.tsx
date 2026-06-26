// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect } from "vitest";
import { ReconstitutionReference } from "@/components/commerce/reconstitution-reference";

it("computes concentration, exposes no dosing inputs", () => {
  render(<ReconstitutionReference mgOptions={[10]} />);
  fireEvent.change(screen.getByLabelText(/solvent/i), { target: { value: "2" } });
  expect(screen.getByText(/5\s*mg\/mL/i)).toBeTruthy();
  expect(screen.queryByLabelText(/dose|units|frequency|reorder|injection/i)).toBeNull();
});

it("updates the concentration when the vial strength is changed", () => {
  render(<ReconstitutionReference mgOptions={[10, 20]} />);
  fireEvent.change(screen.getByLabelText(/solvent/i), { target: { value: "2" } });
  expect(screen.getByText(/5\s*mg\/mL/i)).toBeTruthy(); // 10 / 2
  fireEvent.change(screen.getByLabelText(/vial strength/i), { target: { value: "20" } });
  expect(screen.getByText(/10\s*mg\/mL/i)).toBeTruthy(); // 20 / 2
});
