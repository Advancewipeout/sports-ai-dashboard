import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

interface HeaderBannerProps {
  liveUpdates: boolean;
  authenticated: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({ liveUpdates, authenticated }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="mb-6">
      {/* Streamlit Top Banner with neon green styling */}
      <div className="bg-[#0c1017] border border-[#1f2937] px-4 py-2.5 rounded-lg mb-4 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <p className="text-[#00ff66] font-mono text-xs sm:text-sm font-bold tracking-wide m-0">
            ⚡ Smitty's Live AI Desk — Clocks, Scheduled Models &amp; Subscriber Blueprints
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${liveUpdates ? 'bg-[#00ff66] animate-ping' : 'bg-gray-500'}`} />
            <span className={liveUpdates ? 'text-[#00ff66]' : 'text-gray-400'}>
              {liveUpdates ? 'STREAM SYNC ACTIVE' : 'MANUAL TICK'}
            </span>
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="hidden sm:flex items-center gap-1 text-gray-400">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            LATENCY: 38ms
          </span>
          <span className="hidden sm:inline text-gray-600">|</span>
          <span className="text-gray-300 bg-gray-900/80 px-2 py-0.5 rounded border border-gray-800">
            {timeStr}
          </span>
          {authenticated && (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-[#00ff66] border border-emerald-600/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              SUBSCRIBER PASS
            </span>
          )}
        </div>
      </div>

      {/* Main Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-3 border-b border-[#1f2937]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>🧠</span> Smitty's 2-Layer AI News-Intelligence SaaS Desk
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-mono">
            Autonomous Ontario Odds Arbitrage, Live In-Play Model Streams &amp; Scaled Risk Execution Blueprint
          </p>
        </div>
      </div>
    </header>
  );
};
