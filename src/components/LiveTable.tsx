import React from 'react';
import { GameRecord } from '../types';
import { Radio, Zap, Sparkles } from 'lucide-react';

interface LiveTableProps {
  games: GameRecord[];
  onOpenPrediction: (game: GameRecord) => void;
  tickFlash?: boolean;
}

export const LiveTable: React.FC<LiveTableProps> = ({ games, onOpenPrediction, tickFlash }) => {
  return (
    <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-red-500/10 border border-red-500/30 rounded-md text-red-500">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              🔴 LAYER 2: LIVE IN-PLAY SYSTEMS
              <span className="text-xs font-mono font-normal text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                Active Ontario Books Scrape
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Continuous live game telemetry, score line tracking, and dynamic in-game arbitrage divergence.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400 bg-[#141d2c] px-2.5 py-1 rounded border border-gray-800">
          {games.length} Active Games
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider bg-[#0a0e17]">
              <th className="py-3 px-3">Sport / League</th>
              <th className="py-3 px-4">Matchup</th>
              <th className="py-3 px-3">Clock / Status</th>
              <th className="py-3 px-3">Live Score</th>
              <th className="py-3 px-3 text-cyan-400">TonyBet (ON)</th>
              <th className="py-3 px-3 text-amber-400">BetMGM (ON)</th>
              <th className="py-3 px-3 text-[#00ff66]">Edge %</th>
              <th className="py-3 px-3">AI Decision</th>
              <th className="py-3 px-3 text-right">Reasoning</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {games.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  No active in-play matches match your filter criteria.
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id} className="hover:bg-[#141c2b] transition group">
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-200 font-bold text-[10px] border border-gray-700">
                        {game.sport}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-mono text-[10px] border border-cyan-800/40">
                        {game.league}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white">
                    {game.matchup}
                  </td>
                  <td className="py-3.5 px-3 text-gray-300">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      {game.timeMetric}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-white bg-[#101724]">
                    {game.scoreTicker}
                  </td>
                  <td className="py-3.5 px-3 text-cyan-400 font-bold">
                    {game.tonyBetOntario}
                  </td>
                  <td className="py-3.5 px-3 text-amber-400 font-bold">
                    {game.betMgmOntario}
                  </td>
                  <td className={`py-3.5 px-3 font-bold transition-colors duration-300 ${
                    tickFlash ? 'text-white bg-[#00ff66]/20 rounded' : 'text-[#00ff66]'
                  }`}>
                    +{game.edgeMarginPct}%
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 rounded font-bold text-[11px] flex items-center gap-1 w-fit ${
                        game.aiActionDirective.includes('BUY')
                          ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        <Zap className="w-3 h-3" />
                        {game.aiActionDirective}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Target: <strong className="text-gray-200">{game.pickTeam}</strong>
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onOpenPrediction(game)}
                      className="px-2.5 py-1 bg-[#1e293b] hover:bg-[#2c3d59] text-gray-200 hover:text-white rounded border border-gray-700 transition cursor-pointer flex items-center gap-1.5 text-[11px] ml-auto"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      AI Breakdown
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
