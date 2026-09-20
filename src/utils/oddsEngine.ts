export function parseAmericanOdds(oddsStr: string): number {
  if (!oddsStr) return 0;
  const clean = oddsStr.replace('+', '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export function impliedProbabilityFromAmerican(americanOdds: number): number {
  if (americanOdds === 0) return 0.5;
  if (americanOdds > 0) {
    return 100 / (americanOdds + 100);
  } else {
    const pos = Math.abs(americanOdds);
    return pos / (pos + 100);
  }
}

export function calculateEdge(tonyOdds: string, mgmOdds: string): number {
  const t = parseAmericanOdds(tonyOdds);
  const m = parseAmericanOdds(mgmOdds);
  const probT = impliedProbabilityFromAmerican(t);
  const probM = impliedProbabilityFromAmerican(m);
  const edge = Math.abs(probT - probM) * 100;
  return parseFloat(edge.toFixed(2));
}

export function calculateKellyRisk(edgePct: number, bankroll: number): number {
  // Fractional Kelly: edge * 0.5 clamped between 1% and 20% of bankroll
  const edgeDecimal = edgePct / 100;
  const fraction = Math.max(0.01, Math.min(edgeDecimal * 0.5, 0.20));
  const suggestedStake = Math.max(25, Math.round(bankroll * fraction));
  return suggestedStake;
}
