export function concentrationMgPerMl(mgPerVial: number, solventMl: number): number {
  if (solventMl <= 0) return 0;
  return mgPerVial / solventMl;
}

export function vialsRequired(totalMgNeeded: number, mgPerVial: number): number {
  if (mgPerVial <= 0) return 0;
  return Math.ceil(totalMgNeeded / mgPerVial);
}
