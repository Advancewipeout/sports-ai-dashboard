import React from 'react';
import { Radio, CalendarClock, TrendingUp, Trophy } from 'lucide-react';

interface MetricsCardsProps {
  liveCount: number;
  upcomingCount: number;
  maxEdge: number;
  currentBankroll: number;
  initialBankroll: number;
  winRate: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  liveCount,
  upcomingCount,
  maxEdge,
  currentBankroll,
  initialBankroll,
  winRate,
}) => {
  const pnl = currentBankroll - initialBankroll;
  const pnlPct = initialBankroll > 0 ? (pnl / initialBankroll) * 100 : 0;
  const isProfitable = pnl >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Metric 1: Live In-play Matches */}
      <div className="bg-[#0e141e] border border-[#1f2937] hover:border-red-900/60 p-4 rounded-lg shadow-sm transition-all relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Live Matches Tracking Now
          </span>
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
            {liveCount}
          </span>
          <span className="text-xs text-red-400 font-mono font-medium flex items-center gap-1">
            <Radio className="w-3 h-3" />
            Layer 2 In-Play
          </span>
        </div>
      </div>

      {/* Metric 2: Upcoming Pre-Match Models */}
      <div className="bg-[#0e141e] border border-[#1f2937] hover:border-blue-900/60 p-4 rounded-lg shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Upcoming Systems Calculated
          </span>
          <CalendarClock className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
            {upcomingCount}
          </span>
          <span className="text-xs text-blue-400 font-mono font-medium">
            Layer 1 Scheduled
          </span>
        </div>
      </div>

      {/* Metric 3: Max Discovered Statistical Edge */}
      <div className="bg-[#0e141e] border border-[#1f2937] hover:border-emerald-800/60 p-4 rounded-lg shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Max Discovered Statistical Edge
          </span>
          <TrendingUp className="w-4 h-4 text-[#00ff66]" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#00ff66]">
            +{maxEdge.toFixed(2)}%
          </span>
          <span className="text-xs text-emerald-400 font-mono">
            Over Implied
          </span>
        </div>
      </div>

      {/* Metric 4: Ledger Bankroll & Win Rate */}
      <div className="bg-[#0e141e] border border-[#1f2937] hover:border-amber-800/60 p-4 rounded-lg shadow-sm transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Running Bankroll &amp; ROI
          </span>
          <Trophy className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-mono font-extrabold text-white">
            ${currentBankroll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span
            className={`text-xs font-mono font-semibold ${
              isProfitable ? 'text-[#00ff66]' : 'text-red-400'
            }`}
          >
            {isProfitable ? '+' : ''}{pnlPct.toFixed(1)}% ({winRate.toFixed(0)}% WR)
          </span>
        </div>
      </div>
    </div>
  );
};
