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
  fanDuelOntario: string;
  theScoreOntario: string;
  bestBook: string;
  edgeMarginPct: number;
  aiActionDirective: string;
  pickTeam: string;
  periodOrClock?: string;
  status?: 'in_progress' | 'scheduled' | 'finished';
  sparkline: number[];
  steamTrend: 'STEAM_UP' | 'STEAM_DOWN' | 'STABLE';
}

export interface SettledBet {
  id?: string;
  timestamp: string;
  matchup: string;
  sport: string;
  league?: string;
  aiPickSelection: string;
  finalScoreLine: string;
  outcomeLabel: string;
  profitOrLoss: number;
  runningBankroll: number;
  stake?: number;
  odds?: string;
  bookmaker?: string;
  edgePct?: number;
  status?: 'PENDING' | 'WON' | 'LOST';
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
