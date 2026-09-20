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

export function App() {
  const [games, setGames] = useState<GameRecord[]>(INITIAL_GAMES);
  const [ledger, setLedger] = useState<SettledBet[]>(INITIAL_LEDGER);
  const [bankroll, setBankroll] = useState<number>(1000);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(3);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [engineLatency, setEngineLatency] = useState<number>(18);
  const [tickFlash, setTickFlash] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Filters
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [selectedLeague, setSelectedLeague] = useState<string>('ALL');
  const [minEdge, setMinEdge] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Prediction Modal
  const [selectedGameForModal, setSelectedGameForModal] = useState<GameRecord | null>(null);

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
            // slightly fluctuate edge margin by +/- 0.1% for realism
            const delta = (Math.random() * 0.4 - 0.2);
            const newEdge = Math.max(1.0, parseFloat((game.edgeMarginPct + delta).toFixed(1)));
            return {
              ...game,
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

  return (
    <div className="min-h-screen bg-[#0c1017] text-[#e5e7eb] p-3 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Bloomberg Header Banner */}
        <HeaderBanner
          lastUpdated={lastUpdated}
          isAutoRefreshing={isAutoRefreshing}
          activeLiveCount={liveGames.length}
          refreshInterval={refreshInterval}
          engineLatency={engineLatency}
          tickFlash={tickFlash}
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
            isAuthenticated={isAuthenticated}
            onAuthenticate={handleAuthenticate}
            onLogout={handleLogout}
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
              tickFlash={tickFlash}
            />

            {/* Layer 1: Upcoming Pre-Match Models Table */}
            <UpcomingTable
              games={upcomingGames}
              onOpenPrediction={(game) => setSelectedGameForModal(game)}
            />

            {/* Automated Execution Order Blueprint (Kelly Sizing) */}
            <SubscriberBlueprint
              games={filteredGames}
              isAuthenticated={isAuthenticated}
              bankroll={bankroll}
            />

            {/* Historical Settled Bet Ledger & Chart */}
            <LedgerSection ledger={ledger} />
          </div>
        </div>

        {/* AI Breakdown Modal */}
        <PredictModal
          game={selectedGameForModal}
          onClose={() => setSelectedGameForModal(null)}
          bankroll={bankroll}
        />
      </div>
    </div>
  );
}

export default App;
