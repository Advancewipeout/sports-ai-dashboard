import React from 'react';
import { GameCard } from '../types';
import { CalendarClock, AlertCircle, Sparkles } from 'lucide-react';

interface UpcomingTableProps {
  games: GameCard[];
  onSelectGame?: (game: GameCard) => void;
}

export const UpcomingTable: React.FC<UpcomingTableProps> = ({ games, onSelectGame }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-blue-400" />
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            ⏳ LAYER 1: Upcoming Pre-Match Models (Scheduled Selections)
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-400 hidden sm:inline">
          {games.length} scheduled fixtures
        </span>
      </div>

      {games.length === 0 ? (
        <div className="bg-[#0e141e] border border-[#1f2937] p-6 rounded-lg text-center">
          <AlertCircle className="w-8 h-8 text-blue-400/80 mx-auto mb-2" />
          <p className="text-sm text-gray-300 font-mono">No upcoming models computed.</p>
          <p className="text-xs text-gray-500 mt-1">
            Check back closer to kick-off or adjust the AI Value Edge Cutoff filter.
          </p>
        </div>
      ) : (
        <div className="bg-[#0e141e] border border-[#1f2937] rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#161b22] text-gray-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#1f2937]">
                <tr>
                  <th className="py-3 px-3.5">Sport</th>
                  <th className="py-3 px-3.5">Matchup</th>
                  <th className="py-3 px-3.5">Time Metric</th>
                  <th className="py-3 px-3.5">TonyBet Ontario</th>
                  <th className="py-3 px-3.5">BetMGM Ontario</th>
                  <th className="py-3 px-3.5 text-right">Edge Margin %</th>
                  <th className="py-3 px-3.5 text-center">AI Action Directive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2937]/70 font-mono">
                {games.map((g) => (
                  <tr
                    key={g.id}
                    onClick={() => onSelectGame && onSelectGame(g)}
                    className="hover:bg-[#161f2e] transition-colors group cursor-pointer"
                  >
                    {/* Sport */}
                    <td className="py-3 px-3.5 font-semibold text-gray-300">
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40 text-[10px]">
                        {g.sport}
                      </span>
                    </td>

                    {/* Matchup */}
                    <td className="py-3 px-3.5 font-sans font-semibold text-white whitespace-nowrap">
                      {g.matchup}
                    </td>

                    {/* Time Metric */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-gray-300 font-medium">
                      {g.timeMetric}
                    </td>

                    {/* TonyBet Ontario */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-gray-300">
                      <span className="bg-[#121924] px-2 py-1 rounded border border-gray-700/60 font-semibold">
                        {g.tonyBet}
                      </span>
                    </td>

                    {/* BetMGM Ontario */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-gray-300">
                      <span className="bg-[#121924] px-2 py-1 rounded border border-gray-700/60">
                        {g.betMgm}
                      </span>
                    </td>

                    {/* Edge Margin % */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-right font-bold text-[#00ff66]">
                      <span className="bg-emerald-950/70 border border-emerald-600/40 px-2 py-0.5 rounded inline-block">
                        +{Number(g.edgeMarginPct).toFixed(1)}%
                      </span>
                    </td>

                    {/* AI Action Directive */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-center">
                      <span className="inline-flex items-center gap-1 bg-amber-950/80 text-amber-300 border border-amber-700/60 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">
                        {g.aiActionDirective}
                        <Sparkles className="w-3 h-3 text-[#00ff66]" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
