import React from 'react';
import { GameCard } from '../types';
import { Radio, AlertCircle, ArrowUpRight } from 'lucide-react';

interface LiveTableProps {
  games: GameCard[];
  onSelectGame?: (game: GameCard) => void;
}

export const LiveTable: React.FC<LiveTableProps> = ({ games, onSelectGame }) => {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
            🔴 LAYER 2: Live In-Play Systems (Active Scores, Clocks &amp; Ontario Odds Boards)
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-400 hidden sm:inline">
          {games.length} active fixtures
        </span>
      </div>

      {games.length === 0 ? (
        <div className="bg-[#0e141e] border border-[#1f2937] p-6 rounded-lg text-center">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2 opacity-80" />
          <p className="text-sm text-gray-300 font-mono">
            No active live matches match your sidebar filter settings.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Try adjusting the Sport filter or lowering the AI Minimum Value Edge Cutoff slider.
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
                  <th className="py-3 px-3.5">Score Ticker</th>
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
                      <span className="inline-block px-2 py-0.5 rounded bg-gray-800/80 text-gray-300 border border-gray-700 text-[10px]">
                        {g.sport}
                      </span>
                    </td>

                    {/* Matchup */}
                    <td className="py-3 px-3.5 font-sans font-semibold text-white whitespace-nowrap">
                      {g.matchup}
                    </td>

                    {/* Time Metric */}
                    <td className="py-3 px-3.5 whitespace-nowrap text-red-400 font-bold flex items-center gap-1.5 pt-3.5">
                      <Radio className="w-3 h-3 animate-pulse" />
                      {g.timeMetric}
                    </td>

                    {/* Score Ticker */}
                    <td className="py-3 px-3.5 whitespace-nowrap font-bold text-amber-300 bg-black/20">
                      {g.scoreTicker}
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
                      <span className="inline-flex items-center gap-1 bg-red-950/80 text-red-300 border border-red-700/60 font-bold px-2 py-0.5 rounded text-[11px] tracking-wide">
                        {g.aiActionDirective}
                        <ArrowUpRight className="w-3 h-3 text-[#00ff66]" />
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
