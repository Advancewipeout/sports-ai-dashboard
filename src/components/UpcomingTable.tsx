import React from 'react';
import { GameRecord } from '../types';
import { Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface UpcomingTableProps {
  games: GameRecord[];
  onOpenPrediction: (game: GameRecord) => void;
}

export const UpcomingTable: React.FC<UpcomingTableProps> = ({ games, onOpenPrediction }) => {
  return (
    <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              ⏳ LAYER 1: UPCOMING PRE-MATCH MODELS
              <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Scheduled Matrices
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Statistical model projections and pre-game value discrepancy detection before opening tip/kickoff.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400 bg-[#141d2c] px-2.5 py-1 rounded border border-gray-800">
          {games.length} Models Ready
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-wider bg-[#0a0e17]">
              <th className="py-3 px-3">Sport / League</th>
              <th className="py-3 px-4">Matchup</th>
              <th className="py-3 px-3">Scheduled Time</th>
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
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No upcoming games match your filter criteria.
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
                    {game.timeMetric}
                  </td>
                  <td className="py-3.5 px-3 text-cyan-400 font-bold">
                    {game.tonyBetOntario}
                  </td>
                  <td className="py-3.5 px-3 text-amber-400 font-bold">
                    {game.betMgmOntario}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-[#00ff66]">
                    +{game.edgeMarginPct}%
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 rounded font-bold text-[11px] border w-fit flex items-center gap-1 ${
                        game.aiActionDirective.includes('BUY')
                          ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {game.aiActionDirective.includes('BUY') ? <ShieldCheck className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3 text-rose-400" />}
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
