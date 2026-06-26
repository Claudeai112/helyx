"use client";
import { useState } from "react";
import { concentrationMgPerMl, vialsRequired } from "@/lib/reconstitution";

interface ReconstitutionReferenceProps {
  mgOptions: number[]; // selectable vial strengths (mg) for this product
}

export function ReconstitutionReference({ mgOptions }: ReconstitutionReferenceProps) {
  const [mgPerVial, setMgPerVial] = useState<number>(mgOptions[0] ?? 0);
  const [solventMl, setSolventMl] = useState<string>("");
  const [totalMg, setTotalMg] = useState<string>("");

  const parsedSolvent = parseFloat(solventMl);
  const parsedTotal = parseFloat(totalMg);

  const concentration =
    Number.isFinite(parsedSolvent) && parsedSolvent > 0
      ? concentrationMgPerMl(mgPerVial, parsedSolvent)
      : null;

  const vials =
    Number.isFinite(parsedTotal) && parsedTotal > 0
      ? vialsRequired(parsedTotal, mgPerVial)
      : null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-foreground">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Reconstitution Reference
      </h3>

      <div className="space-y-3">
        {/* Vial strength — selectable from the product's available strengths */}
        <div className="flex flex-col gap-1">
          <label htmlFor="vial-strength" className="text-xs font-medium text-muted-foreground">
            Vial strength (mg)
          </label>
          <select
            id="vial-strength"
            value={mgPerVial}
            onChange={(e) => setMgPerVial(Number(e.target.value))}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          >
            {mgOptions.map((mg) => (
              <option key={mg} value={mg}>
                {mg} mg
              </option>
            ))}
          </select>
        </div>

        {/* Solvent volume input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="solvent-volume" className="text-xs font-medium text-muted-foreground">
            Solvent volume (mL)
          </label>
          <input
            id="solvent-volume"
            type="number"
            min="0"
            step="0.1"
            value={solventMl}
            onChange={(e) => setSolventMl(e.target.value)}
            placeholder="e.g. 2"
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          />
        </div>

        {/* Total research quantity input (a total, NOT an intake/dose) */}
        <div className="flex flex-col gap-1">
          <label htmlFor="total-quantity" className="text-xs font-medium text-muted-foreground">
            Total quantity needed (mg)
          </label>
          <input
            id="total-quantity"
            type="number"
            min="0"
            step="0.1"
            value={totalMg}
            onChange={(e) => setTotalMg(e.target.value)}
            placeholder="e.g. 30"
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          />
          <p className="text-[11px] text-muted-foreground">
            Total milligrams for your research run — used to estimate how many vials you need.
          </p>
        </div>
      </div>

      {/* Computed outputs */}
      <div className="mt-4 space-y-2 rounded-md border border-border bg-secondary/40 p-3">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Concentration</span>
          <span className="font-mono font-semibold text-foreground">
            {concentration !== null ? `${Number(concentration.toFixed(2))} mg/mL` : "—"}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Vials required</span>
          <span className="font-mono font-semibold text-foreground">
            {vials !== null ? vials : "—"}
          </span>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        For laboratory research use only. Not for human consumption.
      </p>
    </div>
  );
}
