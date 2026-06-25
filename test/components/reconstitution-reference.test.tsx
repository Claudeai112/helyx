// @vitest-environment jsdom
import { render, screen, fireEvent } from "@testing-library/react";
import { it, expect } from "vitest";
import { ReconstitutionReference } from "@/components/commerce/reconstitution-reference";

it("computes concentration, exposes no dosing inputs", () => {
  render(<ReconstitutionReference mgPerVial={10} />);
  fireEvent.change(screen.getByLabelText(/solvent/i), { target: { value: "2" } });
  expect(screen.getByText(/5\s*mg\/mL/i)).toBeTruthy();
  expect(screen.queryByLabelText(/dose|units|frequency|reorder|injection/i)).toBeNull();
});
