import React from 'react';
import { SettledBet } from '../types';
import { Award, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface LedgerSectionProps {
  ledger: SettledBet[];
}

export const LedgerSection: React.FC<LedgerSectionProps> = ({ ledger }) => {
  const chartData = ledger.map((item, idx) => ({
    name: item.timestamp.split(' ')[1] || `Trade #${idx + 1}`,
    bankroll: item.runningBankroll,
    pnl: item.profitOrLoss,
    matchup: item.matchup,
    pick: item.aiPickSelection
  }));

  const totalWins = ledger.filter((item) => item.outcomeLabel.includes('WIN')).length;
  const winRate = ledger.length > 0 ? ((totalWins / ledger.length) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-md text-emerald-400">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              🏆 HISTORICAL PERFORMANCE SETTLEMENT ARCHIVE
              <span className="text-xs font-mono font-normal text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Graded Bet Ledger
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Transparent, immutable ledger tracking verified AI recommendations and cumulative capital growth.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-[#141d2c] border border-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400">Win Rate: </span>
            <span className="text-[#00ff66] font-bold">{winRate}%</span>
          </div>
          <div className="bg-[#141d2c] border border-gray-800 px-3 py-1.5 rounded-lg">
            <span className="text-gray-400">Graded Volume: </span>
            <span className="text-white font-bold">{ledger.length} Bets</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#0a0e17] border border-gray-800/80 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>Cumulative Bankroll Capital Growth Curve ($)</span>
        </div>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider bg-[#0a0e17]">
              <th className="py-3 px-3">Timestamp</th>
              <th className="py-3 px-4">Matchup</th>
              <th className="py-3 px-3">Sport</th>
              <th className="py-3 px-3 text-[#00ff66]">AI Pick Selection</th>
              <th className="py-3 px-3">Final Score</th>
              <th className="py-3 px-3">Graded Outcome</th>
              <th className="py-3 px-3">Net P/L ($)</th>
              <th className="py-3 px-3 text-right">Running Bankroll</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {ledger.map((bet, idx) => {
              const isWin = bet.outcomeLabel.includes('WIN');
              return (
                <tr key={idx} className="hover:bg-[#141c2b] transition">
                  <td className="py-3 px-3 text-gray-400">{bet.timestamp}</td>
                  <td className="py-3 px-4 font-semibold text-white">{bet.matchup}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-bold border border-gray-700">
                      {bet.sport}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#00ff66] font-bold">{bet.aiPickSelection}</td>
                  <td className="py-3 px-3 text-gray-300">{bet.finalScoreLine}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 w-fit ${
                      isWin
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isWin ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {bet.outcomeLabel}
                    </span>
                  </td>
                  <td className={`py-3 px-3 font-bold ${bet.profitOrLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {bet.profitOrLoss >= 0 ? `+$${bet.profitOrLoss.toFixed(2)}` : `-$${Math.abs(bet.profitOrLoss).toFixed(2)}`}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-white">
                    ${bet.runningBankroll.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
