export interface GameCard {
  id: string;
  engineLayer: string; // '🔴 LAYER 2: IN-PLAY LIVE' | '⏳ LAYER 1: UPCOMING'
  sport: string;
  matchup: string;
  timeMetric: string;
  scoreTicker: string;
  tonyBet: string;
  tonyBetRaw: number;
  betMgm: string;
  betMgmRaw: number;
  edgeMarginPct: number;
  aiActionDirective: string;
  pickTeam: string;
  elapsedSec?: number;
  durationSec?: number;
  homeScore?: number;
  awayScore?: number;
  homeTeam?: string;
  awayTeam?: string;
}

export interface SettledBet {
  id: string;
  timestamp: string;
  matchup: string;
  sport: string;
  aiPickSelection: string;
  finalScoreLine: string;
  outcomeLabel: string;
  tradeOutcomeProfitLoss: number;
  runningBankroll: number;
}

export interface PredictionSummary {
  timestamp: string;
  matchup: string;
  sport: string;
  pickTeam: string;
  tonyBet: string;
  modelHomeWinProb: number;
  modelEdgePct: number;
  impliedProb?: number;
  marketAmericanOdds?: number;
  notes?: string;
}
