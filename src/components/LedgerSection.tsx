import React, { useState } from 'react';
import { SettledBet } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { Trophy, TrendingUp, Search, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface LedgerSectionProps {
  ledger: SettledBet[];
  initialBankroll: number;
}

export const LedgerSection: React.FC<LedgerSectionProps> = ({ ledger, initialBankroll }) => {
  const [filterSport, setFilterSport] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Prepare chart data
  const chartData = ledger.map((b, idx) => ({
    index: idx + 1,
    time: b.timestamp.split(' ')[1] || b.timestamp,
    fullTime: b.timestamp,
    bankroll: b.runningBankroll,
    pnl: b.tradeOutcomeProfitLoss,
    matchup: b.matchup,
    outcome: b.outcomeLabel,
  }));

  const sportsList = ['ALL', ...Array.from(new Set(ledger.map((b) => b.sport)))];

  const filteredLedger = ledger.filter((b) => {
    const matchesSport = filterSport === 'ALL' || b.sport === filterSport;
    const matchesSearch =
      !searchTerm ||
      b.matchup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.aiPickSelection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.outcomeLabel.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'Timestamp',
      'Matchup',
      'Sport',
      'AI Pick Selection',
      'Final Score Line',
      'Outcome Label',
      'Trade Outcome Profit/Loss',
      'Running Bankroll',
    ];
    const rows = ledger.map((b) => [
      `"${b.timestamp}"`,
      `"${b.matchup}"`,
      `"${b.sport}"`,
      `"${b.aiPickSelection}"`,
      `"${b.finalScoreLine}"`,
      `"${b.outcomeLabel}"`,
      b.tradeOutcomeProfitLoss,
      b.runningBankroll,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'settled_bets_ledger.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="mb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-2 border-b border-[#1f2937]">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            🏆 Historical Performance Settlement Archive (Graded Bet Ledger)
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Audit-grade performance logging across all algorithmic trade positions
          </p>
        </div>

        <button
          onClick={exportCSV}
          disabled={ledger.length === 0}
          className="self-start sm:self-auto flex items-center gap-1.5 bg-[#161b22] hover:bg-[#21262d] text-gray-300 hover:text-white border border-[#30363d] px-3 py-1.5 rounded text-xs font-mono transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          Export Ledger CSV
        </button>
      </div>

      {ledger.length === 0 ? (
        <div className="bg-[#0e141e] border border-[#1f2937] p-8 rounded-lg text-center font-mono text-xs text-gray-400">
          No ledger entries found. Wiped clean or waiting for live fixtures to grade!
        </div>
      ) : (
        <div className="space-y-6">
          {/* Chart Section */}
          <div className="bg-[#0e141e] border border-[#1f2937] p-4 sm:p-5 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00ff66]" />
                <h3 className="text-sm font-bold text-white font-mono">
                  📊 Cumulative Capital Return Growth Chart (ROI Performance)
                </h3>
              </div>
              <span className="text-xs font-mono text-gray-400">
                {ledger.length} total settled trades
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis
                    dataKey="index"
                    stroke="#4b5563"
                    tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickLine={{ stroke: '#374151' }}
                  />
                  <YAxis
                    stroke="#4b5563"
                    domain={['auto', 'auto']}
                    tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    tickLine={{ stroke: '#374151' }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <ReferenceLine
                    y={initialBankroll}
                    stroke="#4b5563"
                    strokeDasharray="4 4"
                    label={{
                      value: `Baseline $${initialBankroll}`,
                      fill: '#6b7280',
                      fontSize: 10,
                      fontFamily: 'JetBrains Mono',
                      position: 'top',
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0c1017',
                      borderColor: '#30363d',
                      borderRadius: '6px',
                      color: '#e5e7eb',
                      fontFamily: 'JetBrains Mono',
                      fontSize: '12px',
                    }}
                    formatter={(val: number) => [`$${Number(val).toFixed(2)}`, 'Running Bankroll']}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        const item = payload[0].payload;
                        return `${item.fullTime} • ${item.matchup} (${item.outcome.includes('WIN') ? 'WIN' : 'LOSS'})`;
                      }
                      return `Trade #${label}`;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bankroll"
                    stroke="#00ff66"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#00ff66', stroke: '#0c1017', strokeWidth: 1 }}
                    activeDot={{ r: 6, fill: '#00ff66' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Audit Log Statements Table */}
          <div className="bg-[#0e141e] border border-[#1f2937] rounded-lg overflow-hidden">
            <div className="p-3.5 border-b border-[#1f2937] flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <span>📋</span> Detailed Settlement Audit Log Statements
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#161b22] border border-[#30363d] rounded pl-8 pr-2.5 py-1 text-xs font-mono text-white placeholder:text-gray-600 outline-none focus:border-gray-500"
                  />
                </div>

                <select
                  value={filterSport}
                  onChange={(e) => setFilterSport(e.target.value)}
                  className="bg-[#161b22] border border-[#30363d] rounded px-2.5 py-1 text-xs font-mono text-gray-300 outline-none focus:border-gray-500"
                >
                  {sportsList.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#161b22] text-gray-400 text-[11px] uppercase tracking-wider sticky top-0 border-b border-[#1f2937] z-10">
                  <tr>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Matchup</th>
                    <th className="py-2.5 px-3">Sport</th>
                    <th className="py-2.5 px-3">AI Pick Selection</th>
                    <th className="py-2.5 px-3">Final Score Line</th>
                    <th className="py-2.5 px-3">Outcome Label</th>
                    <th className="py-2.5 px-3 text-right">P/L ($)</th>
                    <th className="py-2.5 px-3 text-right">Running Bankroll</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1f2937]/70">
                  {filteredLedger.map((bet) => {
                    const isWin = bet.outcomeLabel.includes('WIN') || bet.tradeOutcomeProfitLoss > 0;
                    return (
                      <tr key={bet.id} className="hover:bg-[#161f2e] transition-colors">
                        <td className="py-2 px-3 text-gray-400 whitespace-nowrap">
                          {bet.timestamp}
                        </td>
                        <td className="py-2 px-3 font-sans font-semibold text-gray-200 whitespace-nowrap">
                          {bet.matchup}
                        </td>
                        <td className="py-2 px-3 text-gray-400 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px]">
                            {bet.sport}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-emerald-400 font-semibold whitespace-nowrap">
                          {bet.aiPickSelection}
                        </td>
                        <td className="py-2 px-3 text-amber-300 whitespace-nowrap">
                          {bet.finalScoreLine}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                              isWin
                                ? 'bg-emerald-950 text-[#00ff66] border border-emerald-700/60'
                                : 'bg-red-950 text-red-300 border border-red-700/60'
                            }`}
                          >
                            {isWin ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {bet.outcomeLabel}
                          </span>
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-bold whitespace-nowrap ${
                            bet.tradeOutcomeProfitLoss >= 0 ? 'text-[#00ff66]' : 'text-red-400'
                          }`}
                        >
                          {bet.tradeOutcomeProfitLoss >= 0 ? '+' : ''}$
                          {Math.abs(bet.tradeOutcomeProfitLoss).toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right text-white font-bold whitespace-nowrap">
                          ${bet.runningBankroll.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
