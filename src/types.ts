export interface GameRecord {
  id: string;
  sport: string;
  league: string;
  matchup: string;
  engineLayer: '🔴 LAYER 2: LIVE' | '⏳ LAYER 1: UPCOMING';
  timeMetric: string;
  scoreTicker: string;
  tonyBetOntario: string;
  betMgmOntario: string;
  edgeMarginPct: number;
  aiActionDirective: string;
  pickTeam: string;
  periodOrClock?: string;
  status?: 'in_progress' | 'scheduled' | 'finished';
}

export interface SettledBet {
  timestamp: string;
  matchup: string;
  sport: string;
  league?: string;
  aiPickSelection: string;
  finalScoreLine: string;
  outcomeLabel: string;
  profitOrLoss: number;
  runningBankroll: number;
}

export interface PredictionResult {
  matchup: string;
  sport: string;
  league?: string;
  predictedWinner: string;
  winProbabilityPct: number;
  confidenceScore: number;
  aiRationale: string;
  recommendedWager: number;
}
