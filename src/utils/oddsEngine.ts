export function parseAmericanOdds(oddsStr: string): number {
  if (!oddsStr) return 0;
  const clean = oddsStr.replace('+', '').trim();
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

export function americanToDecimal(oddsStr: string): number {
  const am = parseAmericanOdds(oddsStr);
  if (am === 0) return 2.0;
  if (am > 0) {
    return parseFloat((1 + am / 100).toFixed(3));
  } else {
    return parseFloat((1 + 100 / Math.abs(am)).toFixed(3));
  }
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

export interface HedgeResult {
  oddsA: string;
  oddsB: string;
  decimalA: number;
  decimalB: number;
  impliedProbA: number;
  impliedProbB: number;
  totalMarketProb: number;
  isSurebet: boolean;
  arbMarginPct: number;
  stakeA: number;
  stakeB: number;
  totalOutlay: number;
  payoutA: number;
  payoutB: number;
  netProfitA: number;
  netProfitB: number;
  guaranteedNetProfit: number;
  roiPct: number;
}

export function calculateHedgeBreakdown(
  oddsA: string,
  oddsB: string,
  totalOutlay: number
): HedgeResult {
  const decA = americanToDecimal(oddsA);
  const decB = americanToDecimal(oddsB);

  const probA = 1 / decA;
  const probB = 1 / decB;
  const totalMarketProb = probA + probB;

  const isSurebet = totalMarketProb < 1.0;
  const arbMarginPct = parseFloat(((1 - totalMarketProb) * 100).toFixed(2));

  // Balanced hedge staking
  const stakeA = parseFloat(((totalOutlay * (probA / totalMarketProb))).toFixed(2));
  const stakeB = parseFloat((totalOutlay - stakeA).toFixed(2));

  const payoutA = parseFloat((stakeA * decA).toFixed(2));
  const payoutB = parseFloat((stakeB * decB).toFixed(2));

  const netProfitA = parseFloat((payoutA - totalOutlay).toFixed(2));
  const netProfitB = parseFloat((payoutB - totalOutlay).toFixed(2));
  const guaranteedNetProfit = Math.min(netProfitA, netProfitB);
  const roiPct = parseFloat(((guaranteedNetProfit / totalOutlay) * 100).toFixed(2));

  return {
    oddsA,
    oddsB,
    decimalA: decA,
    decimalB: decB,
    impliedProbA: parseFloat((probA * 100).toFixed(1)),
    impliedProbB: parseFloat((probB * 100).toFixed(1)),
    totalMarketProb: parseFloat((totalMarketProb * 100).toFixed(1)),
    isSurebet,
    arbMarginPct,
    stakeA,
    stakeB,
    totalOutlay,
    payoutA,
    payoutB,
    netProfitA,
    netProfitB,
    guaranteedNetProfit,
    roiPct
  };
}
