import React from 'react';
import { GameRecord } from '../types';
import { Clock, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { Sparkline } from './Sparkline';

interface UpcomingTableProps {
  games: GameRecord[];
  onOpenPrediction: (game: GameRecord) => void;
  onOpenHedge: (game: GameRecord) => void;
  onOpenPaperBet: (game: GameRecord) => void;
}

export const UpcomingTable: React.FC<UpcomingTableProps> = ({
  games,
  onOpenPrediction,
  onOpenHedge,
  onOpenPaperBet
}) => {
  return (
    <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-md text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              ⏳ LAYER 1: UPCOMING PRE-MATCH MODELS
              <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Ontario 4-Book Matrices
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Pre-game odds comparison across TonyBet, BetMGM, FanDuel, and theScore Bet before game start.
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
              <th className="py-3 px-3 min-w-[210px]">Matchup & Actions</th>
              <th className="py-3 px-3">Scheduled</th>
              <th className="py-3 px-2.5 text-cyan-400 bg-cyan-950/20">TonyBet (ON)</th>
              <th className="py-3 px-2.5 text-amber-400 bg-amber-950/20">BetMGM (ON)</th>
              <th className="py-3 px-2.5 text-blue-400 bg-blue-950/20">FanDuel (ON)</th>
              <th className="py-3 px-2.5 text-purple-400 bg-purple-950/20">theScore (ON)</th>
              <th className="py-3 px-3">Steam / Trend</th>
              <th className="py-3 px-3 text-[#00ff66]">Edge / Best</th>
              <th className="py-3 px-3">AI Directive</th>
              <th className="py-3 px-3 text-right">Tools</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {games.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-6 text-center text-gray-500">
                  No upcoming games match your filter criteria.
                </td>
              </tr>
            ) : (
              games.map((game) => (
                <tr key={game.id} className="hover:bg-[#141c2b] transition group">
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-200 font-bold text-[10px] border border-gray-700">
                        {game.sport}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 font-mono text-[10px] border border-cyan-800/40">
                        {game.league}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-white">
                    <div className="font-bold text-white text-xs" title={game.matchup}>
                      {game.matchup}
                    </div>
                    {/* High-visibility inline action buttons */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <button
                        onClick={() => onOpenPaperBet(game)}
                        title="1-Click Paper Bet Tracker"
                        className="px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/50 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Target className="w-2.5 h-2.5" /> Bet
                      </button>
                      <button
                        onClick={() => onOpenHedge(game)}
                        title="Guaranteed Arb & Dual Hedge Calculator"
                        className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <ShieldCheck className="w-2.5 h-2.5" /> Arb
                      </button>
                      <button
                        onClick={() => onOpenPrediction(game)}
                        title="AI Analysis Rationale"
                        className="px-2 py-0.5 bg-[#1e293b] hover:bg-[#2c3d59] text-gray-300 rounded border border-gray-700 transition cursor-pointer flex items-center gap-1 text-[10px]"
                      >
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" /> AI
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-300 whitespace-nowrap">
                    {game.timeMetric}
                  </td>
                  
                  {/* Ontario 4-Book Odds Columns */}
                  <td className={`py-3 px-2.5 font-bold ${game.bestBook === 'TonyBet' ? 'text-[#00ff66] bg-[#00ff66]/10 rounded border border-[#00ff66]/40' : 'text-cyan-300'}`}>
                    {game.tonyBetOntario}
                  </td>
                  <td className={`py-3 px-2.5 font-bold ${game.bestBook === 'BetMGM' ? 'text-[#00ff66] bg-[#00ff66]/10 rounded border border-[#00ff66]/40' : 'text-amber-300'}`}>
                    {game.betMgmOntario}
                  </td>
                  <td className={`py-3 px-2.5 font-bold ${game.bestBook === 'FanDuel' ? 'text-[#00ff66] bg-[#00ff66]/10 rounded border border-[#00ff66]/40' : 'text-blue-300'}`}>
                    {game.fanDuelOntario || '-110'}
                  </td>
                  <td className={`py-3 px-2.5 font-bold ${game.bestBook === 'theScore Bet' ? 'text-[#00ff66] bg-[#00ff66]/10 rounded border border-[#00ff66]/40' : 'text-purple-300'}`}>
                    {game.theScoreOntario || '-112'}
                  </td>

                  {/* Odds Trend Sparkline */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <Sparkline data={game.sparkline} trend={game.steamTrend} />
                  </td>

                  {/* Edge & Best Book */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex flex-col items-start">
                      <span className="font-bold text-[#00ff66]">
                        +{game.edgeMarginPct}%
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono">
                        Best: <strong className="text-white">{game.bestBook}</strong>
                      </span>
                    </div>
                  </td>

                  {/* AI Decision Directive */}
                  <td className="py-3 px-3">
                    <div className="flex flex-col gap-1 items-start">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] border w-fit flex items-center gap-1 whitespace-nowrap ${
                        game.aiActionDirective.includes('BUY')
                          ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        <ShieldCheck className="w-3 h-3" />
                        {game.aiActionDirective}
                      </span>
                      <span className="text-[10px] text-gray-300 font-mono truncate max-w-[130px]">
                        Target: <strong className="text-white">{game.pickTeam}</strong>
                      </span>
                    </div>
                  </td>

                  {/* Interactive Action Bar */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenPaperBet(game)}
                        title="1-Click Paper Bet Tracker"
                        className="px-2 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Target className="w-3 h-3" />
                        Bet
                      </button>
                      <button
                        onClick={() => onOpenHedge(game)}
                        title="Guaranteed Arb & Dual Hedge Calculator"
                        className="px-2 py-1 bg-[#101b2b] hover:bg-[#18273d] text-emerald-300 border border-emerald-500/30 rounded text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        Arb
                      </button>
                      <button
                        onClick={() => onOpenPrediction(game)}
                        title="AI Analysis Rationale"
                        className="px-2 py-1 bg-[#1e293b] hover:bg-[#2c3d59] text-gray-300 hover:text-white rounded border border-gray-700 transition cursor-pointer flex items-center gap-1 text-[11px]"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        AI
                      </button>
                    </div>
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
