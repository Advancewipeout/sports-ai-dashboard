import React from 'react';
import { Activity, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

interface HeaderBannerProps {
  lastUpdated: string;
  isAutoRefreshing: boolean;
  activeLiveCount: number;
  refreshInterval: number;
  engineLatency: number;
  tickFlash: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  lastUpdated,
  isAutoRefreshing,
  activeLiveCount,
  refreshInterval,
  engineLatency,
  tickFlash
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
                <span className="text-xs px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 rounded-full font-mono font-bold flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" />
                  HIGH-FREQUENCY
                </span>
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Dual Engine: Layer 2 Ultra-Low Latency In-Play Scraper + Layer 1 Scheduled Intelligence Matrix
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Latency badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#101724] border border-[#1e2a3c] rounded-lg text-xs font-mono text-cyan-400">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>LATENCY:</span>
            <span className="font-bold text-white">{engineLatency}ms</span>
          </div>

          <div className={`flex items-center gap-2.5 px-3.5 py-2 bg-[#141d2c] border rounded-lg text-xs font-mono text-gray-300 shadow-inner transition-colors duration-300 ${
            tickFlash ? 'border-[#00ff66] bg-[#142333]' : 'border-[#233147]'
          }`}>
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAutoRefreshing ? 'bg-[#00ff66]' : 'bg-gray-500'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isAutoRefreshing ? 'bg-[#00ff66]' : 'bg-gray-500'}`} />
            </span>
            <span className="font-semibold text-gray-200">
              {isAutoRefreshing ? `AUTONOMOUS RESYNC: ${refreshInterval}s` : 'STREAM: PAUSED'}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-emerald-400">{lastUpdated}</span>
          </div>
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
