import React from 'react';
import { Activity, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface HeaderBannerProps {
  lastUpdated: string;
  isAutoRefreshing: boolean;
  onManualRefresh: () => void;
  activeLiveCount: number;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  lastUpdated,
  isAutoRefreshing,
  onManualRefresh,
  activeLiveCount
}) => {
  return (
    <div className="bg-gradient-to-r from-[#0e141f] via-[#111927] to-[#0d1522] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-full bg-[#00ff66]/5 blur-3xl pointer-events-none rounded-full" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-lg text-[#00ff66]">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-wider text-white font-mono flex items-center gap-2">
                SMITTY'S 2-LAYER AI NEWS-INTELLIGENCE SAAS DESK
                <span className="text-xs px-2.5 py-0.5 bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40 rounded-full font-sans font-semibold">
                  v2.4 PRO
                </span>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Dual Engine: Layer 2 In-Play Odds Scraper + Layer 1 Scheduled Intelligence Matrix
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#141d2c] border border-[#233147] rounded-lg text-xs font-mono text-gray-300">
            <span className={`w-2.5 h-2.5 rounded-full ${isAutoRefreshing ? 'bg-[#00ff66] animate-ping' : 'bg-gray-500'}`} />
            <span>{isAutoRefreshing ? 'STREAM: ACTIVE' : 'STREAM: PAUSED'}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400">{lastUpdated}</span>
          </div>

          <button
            onClick={onManualRefresh}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1e293b] hover:bg-[#2e3e57] text-white text-xs font-semibold rounded-lg border border-gray-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Force Resync Matrix
          </button>
        </div>
      </div>

      {/* Live in-play ticker bar */}
      <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono text-gray-400 overflow-x-auto gap-6 whitespace-nowrap">
        <div className="flex items-center gap-2 text-[#00ff66]">
          <Activity className="w-3.5 h-3.5" />
          <span>IN-PLAY REALTIME FEED:</span>
        </div>
        <div className="flex items-center gap-6 text-gray-300">
          <span>⚾ LAD 5 - 4 SD (Inning 7 - Active)</span>
          <span className="text-gray-600">•</span>
          <span>⚽ ARS 2 - 1 CHE (68:51 Live Ticker)</span>
          <span className="text-gray-600">•</span>
          <span>🏀 BOS 88 - 82 MIA (Q3 04:12)</span>
          <span className="text-gray-600">•</span>
          <span className="text-emerald-400">⚡ TONYBET & BETMGM ONTARIO BOOKMAKER SYNC: 100%</span>
        </div>
      </div>
    </div>
  );
};
