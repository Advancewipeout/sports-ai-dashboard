import React, { useState, useEffect, useMemo } from 'react';
import { GameRecord, SettledBet } from './types';
import { INITIAL_GAMES, INITIAL_LEDGER } from './initialData';
import { HeaderBanner } from './components/HeaderBanner';
import { Sidebar } from './components/Sidebar';
import { MetricsCards } from './components/MetricsCards';
import { FiltersBar } from './components/FiltersBar';
import { LiveTable } from './components/LiveTable';
import { UpcomingTable } from './components/UpcomingTable';
import { SubscriberBlueprint } from './components/SubscriberBlueprint';
import { LedgerSection } from './components/LedgerSection';
import { PredictModal } from './components/PredictModal';
import { HedgeCalculatorModal } from './components/HedgeCalculatorModal';
import { PaperBetModal } from './components/PaperBetModal';
import { QuickToolsBar } from './components/QuickToolsBar';
import { CheckCircle2, X } from 'lucide-react';
import { americanToDecimal } from './utils/oddsEngine';

// LocalStorage Persistence Keys
const STORAGE_KEYS = {
  BANKROLL: 'sports_desk_active_bankroll',
  AUTO_REFRESH: 'sports_desk_auto_refresh',
  REFRESH_INTERVAL: 'sports_desk_refresh_interval',
  AUTO_SETTLEMENT: 'sports_desk_auto_settlement',
  LEDGER: 'sports_desk_settled_ledger'
};

export function App() {
  const [games, setGames] = useState<GameRecord[]>(INITIAL_GAMES);
  
  // Initialize persistent states from localStorage with safe fallbacks
  const [ledger, setLedger] = useState<SettledBet[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEDGER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_LEDGER;
  });

  const [bankroll, setBankroll] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANKROLL);
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return 1000;
  });

  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTO_REFRESH);
      if (saved !== null) return saved === 'true';
    } catch {
      // Fallback
    }
    return true;
  });

  const [refreshInterval, setRefreshInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFRESH_INTERVAL);
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 60) return parsed;
      }
    } catch {
      // Fallback
    }
    return 3;
  });

  const [autoSettlementEnabled, setAutoSettlementEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTO_SETTLEMENT);
      if (saved !== null) return saved === 'true';
    } catch {
      // Fallback
    }
    return true;
  });

  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [engineLatency, setEngineLatency] = useState<number>(18);
  const [tickFlash, setTickFlash] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Sync memory states to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANKROLL, bankroll.toString());
    } catch {
      // Storage full or restricted
    }
  }, [bankroll]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_REFRESH, isAutoRefreshing.toString());
    } catch {
      // Storage full or restricted
    }
  }, [isAutoRefreshing]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFRESH_INTERVAL, refreshInterval.toString());
    } catch {
      // Storage full or restricted
    }
  }, [refreshInterval]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTO_SETTLEMENT, autoSettlementEnabled.toString());
    } catch {
      // Storage full or restricted
    }
  }, [autoSettlementEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEDGER, JSON.stringify(ledger));
    } catch {
      // Storage full or restricted
    }
  }, [ledger]);

  // Filters
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [minEdge, setMinEdge] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedGameForModal, setSelectedGameForModal] = useState<GameRecord | null>(null);
  const [hedgeGame, setHedgeGame] = useState<GameRecord | null>(null);
  const [paperBetGame, setPaperBetGame] = useState<GameRecord | null>(null);

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; sub?: string } | null>(null);

  const showToast = (message: string, sub?: string) => {
    setToast({ message, sub });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3500);
  };

  // Auto Refresh timer simulation for live scores and subtle in-play odds movement
  useEffect(() => {
    if (!isAutoRefreshing) return;

    const interval = setInterval(() => {
      const startTime = performance.now();
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setTickFlash(true);
      setTimeout(() => setTickFlash(false), 600);
      
      // Simulate live jitter on in-play game scores and minute clocks
      setGames((prev) =>
        prev.map((game) => {
          if (game.engineLayer.includes('LIVE')) {
            const delta = (Math.random() * 0.4 - 0.2);
            const newEdge = Math.max(1.0, parseFloat((game.edgeMarginPct + delta).toFixed(1)));

            // Occasional live score tick (e.g. baseball run or basketball bucket)
            let updatedScore = game.scoreTicker;
            if (Math.random() < 0.12) {
              if (game.sport === 'MLB') {
                const parts = game.scoreTicker.match(/([A-Z]+)\s*(\d+)\s*-\s*(\d+)\s*([A-Z]+)/);
                if (parts) {
                  const s1 = parseInt(parts[2], 10) + (Math.random() > 0.5 ? 1 : 0);
                  const s2 = parseInt(parts[3], 10) + (s1 === parseInt(parts[2], 10) ? 1 : 0);
                  updatedScore = `${parts[1]} ${s1} - ${s2} ${parts[4]}`;
                }
              } else if (game.sport === 'NBA') {
                const parts = game.scoreTicker.match(/([A-Z]+)\s*(\d+)\s*-\s*(\d+)\s*([A-Z]+)/);
                if (parts) {
                  const pts = Math.random() > 0.4 ? 2 : 3;
                  const s1 = parseInt(parts[2], 10) + (Math.random() > 0.5 ? pts : 0);
                  const s2 = parseInt(parts[3], 10) + (s1 === parseInt(parts[2], 10) ? pts : 0);
                  updatedScore = `${parts[1]} ${s1} - ${s2} ${parts[4]}`;
                }
              }
            }

            return {
              ...game,
              scoreTicker: updatedScore,
              edgeMarginPct: newEdge
            };
          }
          return game;
        })
      );

      const latencyMs = Math.round(performance.now() - startTime + 12 + Math.random() * 8);
      setEngineLatency(latencyMs);
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [isAutoRefreshing, refreshInterval]);

  const handleAuthenticate = (pin: string): boolean => {
    if (pin.trim() === '8501') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const sportsList = ['ALL', 'MLB', 'NFL', 'NBA', 'NHL', 'SOCCER', 'UFC', 'TENNIS'];

  const leagueList = useMemo(() => {
    const list = Array.from(new Set(games.map((g) => g.league)));
    return ['ALL', ...list];
  }, [games]);

  // Filtered games with deep search across teams, leagues, and AI decisions
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchSport = selectedSport === 'ALL' || game.sport.toUpperCase() === selectedSport.toUpperCase();
      const matchLeague = selectedLeague === 'ALL' || game.league.toUpperCase() === selectedLeague.toUpperCase();
      const matchEdge = game.edgeMarginPct >= minEdge;
      
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        q === '' ||
        game.matchup.toLowerCase().includes(q) ||
        game.sport.toLowerCase().includes(q) ||
        game.league.toLowerCase().includes(q) ||
        game.pickTeam.toLowerCase().includes(q) ||
        game.aiActionDirective.toLowerCase().includes(q) ||
        game.scoreTicker.toLowerCase().includes(q) ||
        (game.periodOrClock ? game.periodOrClock.toLowerCase().includes(q) : false) ||
        game.timeMetric.toLowerCase().includes(q);

      return matchSport && matchLeague && matchEdge && matchSearch;
    });
  }, [games, selectedSport, selectedLeague, minEdge, searchQuery]);

  const aiDecisionsCount = useMemo(() => {
    const buy = filteredGames.filter((g) => g.aiActionDirective.includes('BUY')).length;
    const pass = filteredGames.filter((g) => g.aiActionDirective.includes('NO VALUE') || g.pickTeam.toLowerCase() === 'pass').length;
    return { buy, pass };
  }, [filteredGames]);

  const liveGames = useMemo(() => {
    return filteredGames.filter((g) => g.engineLayer.includes('LIVE'));
  }, [filteredGames]);

  const upcomingGames = useMemo(() => {
    return filteredGames.filter((g) => g.engineLayer.includes('UPCOMING'));
  }, [filteredGames]);

  // Derived metrics
  const maxDiscoveredEdge = useMemo(() => {
    if (filteredGames.length === 0) return 0;
    return Math.max(...filteredGames.map((g) => g.edgeMarginPct));
  }, [filteredGames]);

  const netProfit = useMemo(() => {
    const totalPnl = ledger.reduce((acc, item) => acc + item.profitOrLoss, 0);
    return totalPnl;
  }, [ledger]);

  // Top game for quick tools launcher
  const topArbGame = useMemo(() => {
    if (games.length === 0) return null;
    const sorted = [...games].sort((a, b) => b.edgeMarginPct - a.edgeMarginPct);
    return sorted[0];
  }, [games]);

  const scrollToLedger = () => {
    const el = document.getElementById('performance-ledger');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 1-Click Paper Bet handler
  const handleBetPlaced = (newBet: SettledBet) => {
    setLedger((prev) => [newBet, ...prev]);
    showToast(
      `🎯 Paper Trade Logged: $${newBet.stake?.toFixed(2)} on ${newBet.aiPickSelection}`,
      `${newBet.bookmaker} (${newBet.odds}) • Status: ${newBet.status}`
    );
  };

  // Settlement simulator handler
  const handleSettleBet = (betId: string, outcome: 'WON' | 'LOST') => {
    setLedger((prev) =>
      prev.map((bet) => {
        if (bet.id === betId) {
          const stake = bet.stake || 50;
          const decimal = americanToDecimal(bet.odds || '+100');
          const pnl = outcome === 'WON' ? parseFloat(((decimal - 1) * stake).toFixed(2)) : -stake;
          const running = bet.runningBankroll + pnl;

          return {
            ...bet,
            status: outcome,
            outcomeLabel: outcome === 'WON' ? 'WIN (COVERED)' : 'LOSS (MISSED)',
            profitOrLoss: pnl,
            runningBankroll: running
          };
        }
        return bet;
      })
    );
    showToast(
      `Graded Bet as ${outcome}`,
      `Ledger and bankroll capital updated in real-time.`
    );
  };

  return (
    <div className="min-h-screen bg-[#0c1017] text-[#e5e7eb] p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Header Banner */}
        <HeaderBanner
          lastUpdated={lastUpdated}
          isAutoRefreshing={isAutoRefreshing}
          activeLiveCount={liveGames.length}
          refreshInterval={refreshInterval}
          engineLatency={engineLatency}
          tickFlash={tickFlash}
        />

        {/* Quick Tools & Feature Access Launchpad */}
        <QuickToolsBar
          topArbGame={topArbGame}
          onOpenHedge={(game) => setHedgeGame(game)}
          onOpenPaperBet={(game) => setPaperBetGame(game)}
          onScrollToLedger={scrollToLedger}
          totalPaperBets={ledger.length}
        />

        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar Desk */}
          <Sidebar
            bankroll={bankroll}
            onBankrollChange={setBankroll}
            isAutoRefreshing={isAutoRefreshing}
            onToggleAutoRefresh={() => setIsAutoRefreshing(!isAutoRefreshing)}
            refreshInterval={refreshInterval}
            onIntervalChange={setRefreshInterval}
            autoSettlementEnabled={autoSettlementEnabled}
            onToggleAutoSettlement={() => setAutoSettlementEnabled(!autoSettlementEnabled)}
            isAuthenticated={isAuthenticated}
            onAuthenticate={handleAuthenticate}
            onLogout={handleLogout}
            onOpenHedge={() => topArbGame && setHedgeGame(topArbGame)}
            onOpenPaperBet={() => topArbGame && setPaperBetGame(topArbGame)}
            onScrollToLedger={scrollToLedger}
          />

          {/* Main Dashboard Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top 4 Metrics Cards */}
            <MetricsCards
              liveCount={liveGames.length}
              upcomingCount={upcomingGames.length}
              maxEdge={maxDiscoveredEdge}
              currentBankroll={bankroll + netProfit}
              netProfit={netProfit}
            />

            {/* Filter and Search Bar */}
            <FiltersBar
              selectedSport={selectedSport}
              onSportChange={setSelectedSport}
              selectedLeague={selectedLeague}
              onLeagueChange={setSelectedLeague}
              leagueList={leagueList}
              minEdge={minEdge}
              onMinEdgeChange={setMinEdge}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sportsList={sportsList}
              totalMatchesCount={filteredGames.length}
              aiDecisionsCount={aiDecisionsCount}
            />

            {/* Layer 2: Live In-Play Table */}
            <LiveTable
              games={liveGames}
              onOpenPrediction={(game) => setSelectedGameForModal(game)}
              onOpenHedge={(game) => setHedgeGame(game)}
              onOpenPaperBet={(game) => setPaperBetGame(game)}
              tickFlash={tickFlash}
            />

            {/* Layer 1: Upcoming Pre-Match Models Table */}
            <UpcomingTable
              games={upcomingGames}
              onOpenPrediction={(game) => setSelectedGameForModal(game)}
              onOpenHedge={(game) => setHedgeGame(game)}
              onOpenPaperBet={(game) => setPaperBetGame(game)}
            />

            {/* Automated Execution Order Blueprint (Kelly Sizing) */}
            <SubscriberBlueprint
              games={filteredGames}
              isAuthenticated={isAuthenticated}
              bankroll={bankroll}
            />

            {/* Historical Settled Bet Ledger & Chart */}
            <LedgerSection
              ledger={ledger}
              onSettleBet={handleSettleBet}
            />
          </div>
        </div>

        {/* AI Breakdown Modal */}
        <PredictModal
          game={selectedGameForModal}
          onClose={() => setSelectedGameForModal(null)}
          bankroll={bankroll}
        />

        {/* Guaranteed Arbitrage & Hedging Calculator Modal */}
        {hedgeGame && (
          <HedgeCalculatorModal
            game={hedgeGame}
            onClose={() => setHedgeGame(null)}
          />
        )}

        {/* 1-Click Paper Trading Modal */}
        {paperBetGame && (
          <PaperBetModal
            game={paperBetGame}
            currentBankroll={bankroll + netProfit}
            onClose={() => setPaperBetGame(null)}
            onBetPlaced={handleBetPlaced}
          />
        )}

        {/* Floating Notification Toast */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 bg-[#0e141f] border border-[#00ff66]/50 rounded-xl p-3.5 shadow-2xl shadow-black/80 flex items-center gap-3 animate-fade-in font-mono text-xs">
            <div className="p-1.5 bg-[#00ff66]/20 rounded-lg text-[#00ff66]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-bold">{toast.message}</div>
              {toast.sub && <div className="text-gray-400 text-[11px]">{toast.sub}</div>}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-white p-1 ml-2 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
