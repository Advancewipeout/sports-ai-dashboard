import React from 'react';
import { Activity, Clock, TrendingUp, DollarSign } from 'lucide-react';

interface MetricsCardsProps {
  liveCount: number;
  upcomingCount: number;
  maxEdge: number;
  currentBankroll: number;
  netProfit: number;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  liveCount,
  upcomingCount,
  maxEdge,
  currentBankroll,
  netProfit
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {/* Metric 1 */}
      <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
            🔴 Live Matches Tracking
          </p>
          <p className="text-2xl font-bold font-mono text-white">{liveCount}</p>
          <p className="text-[11px] text-[#00ff66] font-mono mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] inline-block animate-ping" />
            Layer 2 In-Play Odds Scraper
          </p>
        </div>
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 2 */}
      <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
            ⏳ Upcoming Models
          </p>
          <p className="text-2xl font-bold font-mono text-white">{upcomingCount}</p>
          <p className="text-[11px] text-cyan-400 font-mono mt-1">
            Layer 1 Scheduled Intelligence
          </p>
        </div>
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 3 */}
      <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
            📈 Max Discovered Edge
          </p>
          <p className="text-2xl font-bold font-mono text-[#00ff66]">+{maxEdge.toFixed(1)}%</p>
          <p className="text-[11px] text-gray-400 font-mono mt-1">
            Over Consensus Implied Probability
          </p>
        </div>
        <div className="p-3 bg-[#00ff66]/10 border border-[#00ff66]/20 rounded-lg text-[#00ff66]">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 4 */}
      <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-4 shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-mono uppercase tracking-wider mb-1">
            💰 Running Bankroll
          </p>
          <p className="text-2xl font-bold font-mono text-white">${currentBankroll.toLocaleString()}</p>
          <p className={`text-[11px] font-mono mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {netProfit >= 0 ? `+$${netProfit.toFixed(2)} Graded Profit` : `-$${Math.abs(netProfit).toFixed(2)} Drawdown`}
          </p>
        </div>
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
