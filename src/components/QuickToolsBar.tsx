import React from 'react';
import { GameRecord } from '../types';
import { Calculator, Target, BarChart3, ShieldCheck, Zap, ArrowDown } from 'lucide-react';

interface QuickToolsBarProps {
  topArbGame: GameRecord | null;
  onOpenHedge: (game: GameRecord) => void;
  onOpenPaperBet: (game: GameRecord) => void;
  onScrollToLedger: () => void;
  totalPaperBets: number;
}

export const QuickToolsBar: React.FC<QuickToolsBarProps> = ({
  topArbGame,
  onOpenHedge,
  onOpenPaperBet,
  onScrollToLedger,
  totalPaperBets
}) => {
  return (
    <div className="bg-[#0e141f] border border-cyan-500/30 rounded-xl p-4 mb-6 shadow-xl relative overflow-hidden font-mono">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Left: Summary Title & Ontario Books */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 text-xs font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> QUANTITATIVE EXECUTION SUITE
            </span>
            <span className="text-xs text-gray-400">
              Institutional Feed Synchronized
            </span>
          </div>
          <div className="text-xs text-gray-300 flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-gray-400">🏛️ Ontario 4-Book Feed:</span>
            <span className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 rounded border border-cyan-800/40 text-[11px] font-bold">TonyBet</span>
            <span className="px-2 py-0.5 bg-amber-950/60 text-amber-300 rounded border border-amber-800/40 text-[11px] font-bold">BetMGM</span>
            <span className="px-2 py-0.5 bg-blue-950/60 text-blue-300 rounded border border-blue-800/40 text-[11px] font-bold">FanDuel</span>
            <span className="px-2 py-0.5 bg-purple-950/60 text-purple-300 rounded border border-purple-800/40 text-[11px] font-bold">theScore Bet</span>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          {/* Quick Arbitrage Launcher */}
          {topArbGame && (
            <button
              onClick={() => onOpenHedge(topArbGame)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              <Calculator className="w-4 h-4 text-[#00ff66]" />
              <span>Launch Arb Calculator</span>
              <span className="px-1.5 py-0.2 bg-[#00ff66] text-black text-[10px] rounded font-black">
                +{topArbGame.edgeMarginPct}% Edge
              </span>
            </button>
          )}

          {/* Quick Paper Bet Launcher */}
          {topArbGame && (
            <button
              onClick={() => onOpenPaperBet(topArbGame)}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-cyan-950/50"
            >
              <Target className="w-4 h-4 text-cyan-400" />
              <span>1-Click Paper Bet</span>
            </button>
          )}

          {/* Jump to Analytics / Ledger */}
          <button
            onClick={onScrollToLedger}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-[#172133] hover:bg-[#1e2c44] text-gray-200 border border-gray-700 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Recharts Analytics & Ledger</span>
            <span className="text-[10px] text-gray-400">({totalPaperBets})</span>
            <ArrowDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
