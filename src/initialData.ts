import { GameRecord, SettledBet } from './types';

export const INITIAL_GAMES: GameRecord[] = [
  {
    id: 'game-1',
    sport: 'MLB',
    matchup: 'Los Angeles Dodgers @ San Diego Padres',
    engineLayer: '🔴 LAYER 2: LIVE',
    timeMetric: 'Inning 7 - Active',
    scoreTicker: 'LAD 5 - 4 SD',
    tonyBetOntario: '+125',
    betMgmOntario: '-105',
    edgeMarginPct: 7.3,
    aiActionDirective: '🔥 LIVE BUY',
    pickTeam: 'Los Angeles Dodgers',
    periodOrClock: 'Top 7th, 2 Outs'
  },
  {
    id: 'game-2',
    sport: 'NFL',
    matchup: 'Kansas City Chiefs @ Buffalo Bills',
    engineLayer: '⏳ LAYER 1: UPCOMING',
    timeMetric: 'Today 16:25 EST',
    scoreTicker: 'Scheduled',
    tonyBetOntario: '-120',
    betMgmOntario: '+110',
    edgeMarginPct: 6.8,
    aiActionDirective: '🔥 FULL BUY',
    pickTeam: 'Kansas City Chiefs'
  },
  {
    id: 'game-3',
    sport: 'NBA',
    matchup: 'Boston Celtics @ Miami Heat',
    engineLayer: '🔴 LAYER 2: LIVE',
    timeMetric: 'Q3 04:12',
    scoreTicker: 'BOS 88 - 82 MIA',
    tonyBetOntario: '-115',
    betMgmOntario: '-102',
    edgeMarginPct: 3.1,
    aiActionDirective: '🔥 LIVE BUY',
    pickTeam: 'Boston Celtics',
    periodOrClock: '3rd Quarter'
  },
  {
    id: 'game-4',
    sport: 'SOCCER',
    matchup: 'Arsenal vs Chelsea',
    engineLayer: '🔴 LAYER 2: LIVE',
    timeMetric: '68:51 Live Ticker',
    scoreTicker: 'ARS 2 - 1 CHE',
    tonyBetOntario: '+140',
    betMgmOntario: '+120',
    edgeMarginPct: 3.8,
    aiActionDirective: '🔥 LIVE BUY',
    pickTeam: 'Arsenal',
    periodOrClock: '2nd Half'
  },
  {
    id: 'game-5',
    sport: 'NHL',
    matchup: 'Toronto Maple Leafs @ Montreal Canadiens',
    engineLayer: '⏳ LAYER 1: UPCOMING',
    timeMetric: 'Tonight 19:00 EST',
    scoreTicker: 'Scheduled',
    tonyBetOntario: '-135',
    betMgmOntario: '-115',
    edgeMarginPct: 4.1,
    aiActionDirective: '🔥 FULL BUY',
    pickTeam: 'Toronto Maple Leafs'
  },
  {
    id: 'game-6',
    sport: 'MLB',
    matchup: 'New York Yankees @ Boston Red Sox',
    engineLayer: '⏳ LAYER 1: UPCOMING',
    timeMetric: 'Tomorrow 13:05 EST',
    scoreTicker: 'Scheduled',
    tonyBetOntario: '+105',
    betMgmOntario: '-110',
    edgeMarginPct: 3.6,
    aiActionDirective: '🔥 FULL BUY',
    pickTeam: 'New York Yankees'
  },
  {
    id: 'game-7',
    sport: 'NBA',
    matchup: 'Los Angeles Lakers @ Golden State Warriors',
    engineLayer: '⏳ LAYER 1: UPCOMING',
    timeMetric: 'Tomorrow 22:00 EST',
    scoreTicker: 'Scheduled',
    tonyBetOntario: '+130',
    betMgmOntario: '+125',
    edgeMarginPct: 0.9,
    aiActionDirective: '❌ NO VALUE',
    pickTeam: 'Pass'
  }
];

export const INITIAL_LEDGER: SettledBet[] = [
  {
    timestamp: '2026-09-19 14:10:22',
    matchup: 'Houston Astros @ Texas Rangers',
    sport: 'MLB',
    aiPickSelection: 'Houston Astros',
    finalScoreLine: 'HOU 6 - 3 TEX',
    outcomeLabel: 'WIN (COVERED)',
    profitOrLoss: 85.00,
    runningBankroll: 1085.00
  },
  {
    timestamp: '2026-09-19 16:45:00',
    matchup: 'Baltimore Ravens @ Pittsburgh Steelers',
    sport: 'NFL',
    aiPickSelection: 'Baltimore Ravens',
    finalScoreLine: 'BAL 24 - 20 PIT',
    outcomeLabel: 'WIN (COVERED)',
    profitOrLoss: 95.50,
    runningBankroll: 1180.50
  },
  {
    timestamp: '2026-09-19 19:20:15',
    matchup: 'Denver Nuggets @ Dallas Mavericks',
    sport: 'NBA',
    aiPickSelection: 'Dallas Mavericks',
    finalScoreLine: 'DEN 112 - 108 DAL',
    outcomeLabel: 'LOSS (MISSED)',
    profitOrLoss: -60.00,
    runningBankroll: 1120.50
  },
  {
    timestamp: '2026-09-19 21:05:40',
    matchup: 'Liverpool vs Manchester City',
    sport: 'SOCCER',
    aiPickSelection: 'Liverpool',
    finalScoreLine: 'LIV 2 - 1 MCI',
    outcomeLabel: 'WIN (COVERED)',
    profitOrLoss: 120.00,
    runningBankroll: 1240.50
  }
];
