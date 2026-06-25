"use client";
import { useState } from "react";
import { concentrationMgPerMl, vialsRequired } from "@/lib/reconstitution";

interface ReconstitutionReferenceProps {
  mgPerVial: number;
}

export function ReconstitutionReference({ mgPerVial }: ReconstitutionReferenceProps) {
  const [solventMl, setSolventMl] = useState<string>("");
  const [targetMg, setTargetMg] = useState<string>("");

  const parsedSolvent = parseFloat(solventMl);
  const parsedTarget = parseFloat(targetMg);

  const concentration =
    Number.isFinite(parsedSolvent) && parsedSolvent > 0
      ? concentrationMgPerMl(mgPerVial, parsedSolvent)
      : null;

  const vials =
    Number.isFinite(parsedTarget) && parsedTarget > 0
      ? vialsRequired(parsedTarget, mgPerVial)
      : null;

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-foreground">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Reconstitution Reference
      </h3>

      <div className="space-y-3">
        {/* Vial strength — read-only, prefilled from product */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Vial strength (mg)
          </label>
          <input
            type="number"
            readOnly
            value={mgPerVial}
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground opacity-60"
          />
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

        {/* Target research quantity input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="target-quantity" className="text-xs font-medium text-muted-foreground">
            Target quantity (mg)
          </label>
          <input
            id="target-quantity"
            type="number"
            min="0"
            step="0.1"
            value={targetMg}
            onChange={(e) => setTargetMg(e.target.value)}
            placeholder="e.g. 10"
            className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground"
          />
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
