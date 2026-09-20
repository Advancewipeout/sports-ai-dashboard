import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_GAMES, INITIAL_LEDGER } from './initialData';
import { GameCard, SettledBet, PredictionSummary } from './types';
import { tickInPlayGame } from './utils/oddsEngine';
import { HeaderBanner } from './components/HeaderBanner';
import { Sidebar } from './components/Sidebar';
import { MetricsCards } from './components/MetricsCards';
import { FiltersBar } from './components/FiltersBar';
import { LiveTable } from './components/LiveTable';
import { UpcomingTable } from './components/UpcomingTable';
import { SubscriberBlueprint } from './components/SubscriberBlueprint';
import { LedgerSection } from './components/LedgerSection';
import { PredictModal } from './components/PredictModal';

export const App: React.FC = () => {
  // 1. Persistent State
  const [games, setGames] = useState<GameCard[]>(() => {
    try {
      const saved = localStorage.getItem('smitty_games');
      return saved ? JSON.parse(saved) : INITIAL_GAMES;
    } catch {
      return INITIAL_GAMES;
    }
  });

  const [ledger, setLedger] = useState<SettledBet[]>(() => {
    try {
      const saved = localStorage.getItem('smitty_ledger');
      return saved ? JSON.parse(saved) : INITIAL_LEDGER;
    } catch {
      return INITIAL_LEDGER;
    }
  });

  const [bankroll, setBankroll] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('smitty_bankroll');
      return saved ? parseFloat(saved) : 1000.0;
    } catch {
      return 1000.0;
    }
  });

  const [liveUpdates, setLiveUpdates] = useState<boolean>(false);
  const [autoPredict, setAutoPredict] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(5);
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // 2. Filters
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [strictnessTrigger, setStrictnessTrigger] = useState<number>(0.0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 3. Modal State
  const [predictModalOpen, setPredictModalOpen] = useState<boolean>(false);
  const [gamesToPredict, setGamesToPredict] = useState<GameCard[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('smitty_games', JSON.stringify(games));
    } catch (e) {
      console.error(e);
    }
  }, [games]);

  useEffect(() => {
    try {
      localStorage.setItem('smitty_ledger', JSON.stringify(ledger));
    } catch (e) {
      console.error(e);
    }
  }, [ledger]);

  useEffect(() => {
    try {
      localStorage.setItem('smitty_bankroll', String(bankroll));
    } catch (e) {
      console.error(e);
    }
  }, [bankroll]);

  // Real-time live update loop
  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      setGames((prevGames) => {
        let newCompletedBets: SettledBet[] = [];
        const nextGames = prevGames.map((g) => {
          if (g.engineLayer.includes('LIVE')) {
            const { updatedGame, completedBet } = tickInPlayGame(g, ledger, bankroll);
            if (completedBet) {
              newCompletedBets.push(completedBet);
            }
            return updatedGame;
          }
          return g;
        });

        if (newCompletedBets.length > 0) {
          setLedger((prevLedger) => [...prevLedger, ...newCompletedBets]);
        }
        return nextGames;
      });
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [liveUpdates, refreshInterval, ledger, bankroll]);

  // Extract unique sports for dropdown
  const sportsList = useMemo(() => {
    const list = Array.from(new Set(games.map((g) => g.sport).filter(Boolean)));
    return ['ALL', ...list];
  }, [games]);

  // Filter games based on sport, edge, search
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const matchSport = selectedSport === 'ALL' || g.sport.toUpperCase() === selectedSport.toUpperCase();
      const matchEdge = (Number(g.edgeMarginPct) || 0) >= strictnessTrigger;
      const matchSearch =
        !searchQuery ||
        g.matchup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.pickTeam.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSport && matchEdge && matchSearch;
    });
  }, [games, selectedSport, strictnessTrigger, searchQuery]);

  // Partition into Layer 2 (Live) and Layer 1 (Upcoming)
  const liveGames = useMemo(() => {
    return filteredGames.filter((g) => g.engineLayer.toUpperCase().includes('LIVE'));
  }, [filteredGames]);

  const upcomingGames = useMemo(() => {
    return filteredGames.filter((g) => g.engineLayer.toUpperCase().includes('UPCOMING'));
  }, [filteredGames]);

  // Max edge
  const maxEdge = useMemo(() => {
    if (games.length === 0) return 0;
    return Math.max(0, ...games.map((g) => Number(g.edgeMarginPct) || 0));
  }, [games]);

  // Active orders for subscriber blueprint
  const activeOrders = useMemo(() => {
    return filteredGames.filter((g) => {
      const directive = (g.aiActionDirective || '').toUpperCase();
      return !['❌ NO VALUE', '🛑 PULL OUT DEPOSIT', 'PASS', '❌ PASS LINE'].includes(directive);
    });
  }, [filteredGames]);

  // Ledger stats
  const currentBankroll = useMemo(() => {
    if (ledger.length > 0) {
      return ledger[ledger.length - 1].runningBankroll;
    }
    return bankroll;
  }, [ledger, bankroll]);

  const winRate = useMemo(() => {
    if (ledger.length === 0) return 0;
    const wins = ledger.filter((b) => b.outcomeLabel.includes('WIN') || b.tradeOutcomeProfitLoss > 0).length;
    return (wins / ledger.length) * 100;
  }, [ledger]);

  // Handlers
  const handleWipeLedger = useCallback(() => {
    setLedger([]);
    try {
      localStorage.removeItem('smitty_ledger');
    } catch {}
  }, []);

  const handleResetData = useCallback(() => {
    setGames(INITIAL_GAMES);
    setLedger(INITIAL_LEDGER);
    setBankroll(1000.0);
    setSelectedSport('ALL');
    setStrictnessTrigger(0.0);
    setSearchQuery('');
  }, []);

  const handleForceSync = useCallback(() => {
    setIsSyncing(true);
    setTimeout(() => {
      setGames((prev) =>
        prev.map((g) => {
          if (g.engineLayer.includes('LIVE')) {
            const { updatedGame } = tickInPlayGame(g, ledger, bankroll);
            return updatedGame;
          }
          return g;
        })
      );
      setIsSyncing(false);
    }, 600);
  }, [ledger, bankroll]);

  const handleOpenPredictModal = useCallback((singleGame?: GameCard) => {
    if (singleGame) {
      setGamesToPredict([singleGame]);
    } else {
      setGamesToPredict(activeOrders.length > 0 ? activeOrders : games);
    }
    setPredictModalOpen(true);
  }, [activeOrders, games]);

  const handleAppendPredictions = useCallback((predictions: PredictionSummary[]) => {
    const newSummaryGames: GameCard[] = predictions.map((p, idx) => ({
      id: `pred-${Date.now()}-${idx}`,
      engineLayer: '⏳ LAYER 1: UPCOMING',
      sport: p.sport,
      matchup: p.matchup,
      timeMetric: 'PREDICTED MODEL RUN',
      scoreTicker: `PROB ${(p.modelHomeWinProb * 100).toFixed(0)}%`,
      tonyBet: p.tonyBet,
      tonyBetRaw: 1.85,
      betMgm: 'BetMGM Calibrated',
      betMgmRaw: 1.85,
      edgeMarginPct: p.modelEdgePct,
      aiActionDirective: '🔥 MODEL BUY',
      pickTeam: p.pickTeam,
    }));

    setGames((prev) => [...prev, ...newSummaryGames]);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c1017] text-[#e5e7eb] flex flex-col lg:flex-row">
      {/* Sidebar Controls */}
      <Sidebar
        bankroll={bankroll}
        setBankroll={setBankroll}
        liveUpdates={liveUpdates}
        setLiveUpdates={setLiveUpdates}
        autoPredict={autoPredict}
        setAutoPredict={setAutoPredict}
        refreshInterval={refreshInterval}
        setRefreshInterval={setRefreshInterval}
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
        onWipeLedger={handleWipeLedger}
        onResetData={handleResetData}
        onForceSync={handleForceSync}
        isSyncing={isSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] mx-auto w-full">
        {/* Top Ticker & Header */}
        <HeaderBanner liveUpdates={liveUpdates} authenticated={authenticated} />

        {/* Top 4 Metrics Cards */}
        <MetricsCards
          liveCount={liveGames.length}
          upcomingCount={upcomingGames.length}
          maxEdge={maxEdge}
          currentBankroll={currentBankroll}
          initialBankroll={bankroll}
          winRate={winRate}
        />

        {/* Sport & Edge Filter Bar */}
        <FiltersBar
          sports={sportsList}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          strictnessTrigger={strictnessTrigger}
          setStrictnessTrigger={setStrictnessTrigger}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Layer 2: Live In-Play Systems */}
        <LiveTable games={liveGames} onSelectGame={(g) => handleOpenPredictModal(g)} />

        {/* Layer 1: Upcoming Pre-Match Models */}
        <UpcomingTable games={upcomingGames} onSelectGame={(g) => handleOpenPredictModal(g)} />

        {/* Subscriber Blueprint (Scaled Cash Risks) */}
        <SubscriberBlueprint
          authenticated={authenticated}
          bankroll={bankroll}
          activeOrders={activeOrders}
          onOpenPredictModal={handleOpenPredictModal}
          onQuickUnlock={() => setAuthenticated(true)}
        />

        {/* Graded Bet Ledger & ROI Growth Line Chart */}
        <LedgerSection ledger={ledger} initialBankroll={bankroll} />
      </main>

      {/* Predict Modal */}
      <PredictModal
        isOpen={predictModalOpen}
        onClose={() => setPredictModalOpen(false)}
        gamesToPredict={gamesToPredict}
        onAppendPredictions={handleAppendPredictions}
      />
    </div>
  );
};
