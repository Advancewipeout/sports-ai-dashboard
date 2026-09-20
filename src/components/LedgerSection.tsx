import React, { useState, useMemo } from 'react';
import { SettledBet } from '../types';
import { Award, TrendingUp, CheckCircle, XCircle, Clock, BarChart3, PieChart, ShieldAlert, ArrowUpRight } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface LedgerSectionProps {
  ledger: SettledBet[];
  onSettleBet?: (betId: string, outcome: 'WON' | 'LOST', scoreLine?: string) => void;
}

export const LedgerSection: React.FC<LedgerSectionProps> = ({ ledger, onSettleBet }) => {
  const [activeTab, setActiveTab] = useState<'GROWTH' | 'SPORTS_ROI'>('GROWTH');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'WON' | 'LOST' | 'PENDING'>('ALL');

  // Chart data for Capital Growth
  const growthChartData = useMemo(() => {
    return ledger.map((item, idx) => ({
      name: item.timestamp.split(' ')[1] || `#${idx + 1}`,
      bankroll: item.runningBankroll,
      pnl: item.profitOrLoss,
      matchup: item.matchup,
      pick: item.aiPickSelection
    }));
  }, [ledger]);

  // Analytics by Sport
  const sportsAnalytics = useMemo(() => {
    const map: Record<string, { total: number; wins: number; pnl: number }> = {};
    ledger.forEach(bet => {
      const sp = bet.sport.toUpperCase();
      if (!map[sp]) map[sp] = { total: 0, wins: 0, pnl: 0 };
      map[sp].total += 1;
      if (bet.outcomeLabel.includes('WIN') || bet.status === 'WON') {
        map[sp].wins += 1;
      }
      map[sp].pnl += bet.profitOrLoss;
    });

    return Object.entries(map).map(([sport, data]) => ({
      sport,
      winRate: parseFloat(((data.wins / (data.total || 1)) * 100).toFixed(1)),
      pnl: parseFloat(data.pnl.toFixed(2)),
      total: data.total
    }));
  }, [ledger]);

  // KPIs
  const completedBets = ledger.filter(b => b.status !== 'PENDING');
  const totalWins = completedBets.filter((item) => item.outcomeLabel.includes('WIN') || item.status === 'WON').length;
  const winRate = completedBets.length > 0 ? ((totalWins / completedBets.length) * 100).toFixed(1) : '0.0';

  const totalWon = completedBets.reduce((acc, b) => b.profitOrLoss > 0 ? acc + b.profitOrLoss : acc, 0);
  const totalLost = completedBets.reduce((acc, b) => b.profitOrLoss < 0 ? acc + Math.abs(b.profitOrLoss) : acc, 0);
  const profitFactor = totalLost === 0 ? (totalWon > 0 ? '∞' : '1.00') : (totalWon / totalLost).toFixed(2);

  const avgEdge = useMemo(() => {
    const withEdge = ledger.filter(b => b.edgePct !== undefined);
    if (withEdge.length === 0) return '5.4';
    const sum = withEdge.reduce((acc, b) => acc + (b.edgePct || 0), 0);
    return (sum / withEdge.length).toFixed(1);
  }, [ledger]);

  // Filtered rows
  const filteredLedger = useMemo(() => {
    return ledger.filter(bet => {
      if (statusFilter === 'ALL') return true;
      if (statusFilter === 'WON') return bet.outcomeLabel.includes('WIN') || bet.status === 'WON';
      if (statusFilter === 'LOST') return bet.outcomeLabel.includes('LOSS') || bet.status === 'LOST';
      if (statusFilter === 'PENDING') return bet.status === 'PENDING' || bet.outcomeLabel.includes('PENDING');
      return true;
    });
  }, [ledger, statusFilter]);

  return (
    <div id="performance-ledger" className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl font-mono scroll-mt-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              🏆 PERFORMANCE ANALYTICS & SETTLED LEDGER
              <span className="text-xs font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Institutional Grade
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Auditable tracking of real-time paper wagers, capital yield, and sports model ROI.
            </p>
          </div>
        </div>

        {/* Top KPIs Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-[#141d2c] border border-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 text-[10px] block">WIN RATE</span>
            <span className="text-[#00ff66] font-bold text-sm">{winRate}%</span>
          </div>
          <div className="bg-[#141d2c] border border-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 text-[10px] block">PROFIT FACTOR</span>
            <span className="text-cyan-300 font-bold text-sm">{profitFactor}x</span>
          </div>
          <div className="bg-[#141d2c] border border-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 text-[10px] block">AVG EDGE CAPTURED</span>
            <span className="text-[#00ff66] font-bold text-sm">+{avgEdge}%</span>
          </div>
          <div className="bg-[#141d2c] border border-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400 text-[10px] block">TOTAL TRADES</span>
            <span className="text-white font-bold text-sm">{ledger.length} Bets</span>
          </div>
        </div>
      </div>

      {/* Analytics Visualization Tabs */}
      <div className="bg-[#0a0e17] border border-gray-800/80 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('GROWTH')}
              className={`px-3 py-1.5 text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'GROWTH'
                  ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/40 font-bold'
                  : 'bg-[#121927] text-gray-400 border-gray-800 hover:text-gray-200'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Bankroll Capital Curve ($)
            </button>
            <button
              onClick={() => setActiveTab('SPORTS_ROI')}
              className={`px-3 py-1.5 text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 border ${
                activeTab === 'SPORTS_ROI'
                  ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40 font-bold'
                  : 'bg-[#121927] text-gray-400 border-gray-800 hover:text-gray-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              P/L & Win Rate by Sport
            </button>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00ff66]" />
            Dynamic Recharts Telemetry
          </div>
        </div>

        {/* Tab 1: Bankroll Growth Curve */}
        {activeTab === 'GROWTH' && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis domain={['auto', 'auto']} stroke="#6b7280" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="bankroll"
                  stroke="#00ff66"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#00ff66' }}
                  activeDot={{ r: 6, fill: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Tab 2: P/L & Win Rate by Sport */}
        {activeTab === 'SPORTS_ROI' && (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sportsAnalytics} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="sport" stroke="#6b7280" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  formatter={(value: any, name: string) => [
                    name === 'pnl' ? `$${value}` : `${value}%`,
                    name === 'pnl' ? 'Net P/L ($)' : 'Win Rate (%)'
                  ]}
                  contentStyle={{
                    backgroundColor: '#111827',
                    borderColor: '#374151',
                    borderRadius: '8px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="pnl" name="pnl" radius={[4, 4, 0, 0]}>
                  {sportsAnalytics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#00ff66' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Filter and Table Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-gray-400 mr-1">STATUS:</span>
          {(['ALL', 'WON', 'LOST', 'PENDING'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-2.5 py-0.5 rounded-lg border transition cursor-pointer text-xs ${
                statusFilter === filter
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold'
                  : 'bg-[#121927] text-gray-400 border-gray-800 hover:text-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400">
          Showing {filteredLedger.length} of {ledger.length} logged records
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider bg-[#0a0e17]">
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Matchup</th>
              <th className="py-2.5 px-2">Sport</th>
              <th className="py-2.5 px-3 text-[#00ff66]">AI Pick Selection</th>
              <th className="py-2.5 px-2.5">Book / Line</th>
              <th className="py-2.5 px-2.5">Stake</th>
              <th className="py-2.5 px-3">Outcome</th>
              <th className="py-2.5 px-3 text-right">Net P/L ($)</th>
              <th className="py-2.5 px-3 text-right">Bankroll</th>
              {onSettleBet && <th className="py-2.5 px-3 text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {filteredLedger.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-6 text-center text-gray-500">
                  No trade records found matching status &quot;{statusFilter}&quot;.
                </td>
              </tr>
            ) : (
              filteredLedger.map((bet, idx) => {
                const isWin = bet.outcomeLabel.includes('WIN') || bet.status === 'WON';
                const isLost = bet.outcomeLabel.includes('LOSS') || bet.status === 'LOST';
                const isPending = bet.status === 'PENDING' || bet.outcomeLabel.includes('PENDING');

                return (
                  <tr key={bet.id || idx} className="hover:bg-[#141c2b] transition">
                    <td className="py-3 px-3 text-gray-400 whitespace-nowrap text-[11px]">{bet.timestamp}</td>
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="max-w-[170px] truncate" title={bet.matchup}>
                        {bet.matchup}
                      </div>
                      {bet.league && <span className="text-[10px] text-cyan-400 font-normal">{bet.league}</span>}
                    </td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-bold border border-gray-700 text-[10px]">
                        {bet.sport}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#00ff66] font-bold">{bet.aiPickSelection}</td>
                    <td className="py-3 px-2.5 text-gray-300 whitespace-nowrap">
                      {bet.bookmaker || 'TonyBet'} <span className="text-cyan-300 font-bold">{bet.odds || '+120'}</span>
                    </td>
                    <td className="py-3 px-2.5 text-gray-300">
                      ${bet.stake?.toFixed(2) || '50.00'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 w-fit ${
                        isWin
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isLost
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {isWin ? <CheckCircle className="w-3 h-3" /> : isLost ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {bet.outcomeLabel}
                      </span>
                    </td>
                    <td className={`py-3 px-3 text-right font-bold ${
                      isPending ? 'text-gray-400' : bet.profitOrLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPending ? '--' : bet.profitOrLoss >= 0 ? `+$${bet.profitOrLoss.toFixed(2)}` : `-$${Math.abs(bet.profitOrLoss).toFixed(2)}`}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white">
                      ${bet.runningBankroll.toFixed(2)}
                    </td>

                    {/* Settle Action for Pending bets */}
                    {onSettleBet && (
                      <td className="py-3 px-3 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onSettleBet(bet.id || `trade-${idx}`, 'WON')}
                              title="Grade as Won"
                              className="p-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded border border-emerald-500/40 text-[10px] font-bold cursor-pointer"
                            >
                              ✓ Win
                            </button>
                            <button
                              onClick={() => onSettleBet(bet.id || `trade-${idx}`, 'LOST')}
                              title="Grade as Lost"
                              className="p-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded border border-rose-500/40 text-[10px] font-bold cursor-pointer"
                            >
                              ✗ Loss
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500">Settled</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
