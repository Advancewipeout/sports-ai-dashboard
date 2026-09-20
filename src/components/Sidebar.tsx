import React, { useState } from 'react';
import { DollarSign, Shield, Lock, Unlock, Sliders, Radio, KeyRound, Calculator, Target, BarChart3, Zap } from 'lucide-react';

interface SidebarProps {
  bankroll: number;
  onBankrollChange: (val: number) => void;
  isAutoRefreshing: boolean;
  onToggleAutoRefresh: () => void;
  refreshInterval: number;
  onIntervalChange: (sec: number) => void;
  autoSettlementEnabled?: boolean;
  onToggleAutoSettlement?: () => void;
  isAuthenticated: boolean;
  onAuthenticate: (pin: string) => boolean;
  onLogout: () => void;
  onOpenHedge?: () => void;
  onOpenPaperBet?: () => void;
  onScrollToLedger?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  bankroll,
  onBankrollChange,
  isAutoRefreshing,
  onToggleAutoRefresh,
  refreshInterval,
  onIntervalChange,
  autoSettlementEnabled = true,
  onToggleAutoSettlement,
  isAuthenticated,
  onAuthenticate,
  onLogout,
  onOpenHedge,
  onOpenPaperBet,
  onScrollToLedger
}) => {
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onAuthenticate(pinInput);
    if (!ok) {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 2500);
    } else {
      setPinInput('');
      setAuthError(false);
    }
  };

  return (
    <div className="w-full lg:w-80 bg-[#0e141f] border border-[#1f2937] rounded-xl p-5 flex flex-col gap-6 shadow-xl h-fit">
      {/* Bankroll Management Section */}
      <div>
        <div className="flex items-center gap-2 text-white font-mono font-bold text-sm mb-3">
          <DollarSign className="w-4 h-4 text-[#00ff66]" />
          <span>BANKROLL MANAGEMENT DESK</span>
        </div>
        
        <div className="bg-[#131b29] border border-gray-800 rounded-lg p-3.5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-400 font-medium">
              Active Total Bankroll ($)
            </label>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Saved in Memory
            </span>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400 font-mono text-sm">$</span>
            <input
              type="number"
              min="50"
              max="1000000"
              step="50"
              value={bankroll}
              onChange={(e) => onBankrollChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-[#0a0e17] border border-gray-700 rounded-md py-2 pl-8 pr-3 text-white font-mono text-base focus:border-[#00ff66] focus:outline-none transition"
            />
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Dynamic fractional Kelly allocation will mathematically scale recommended unit risks against this capital.
          </p>
        </div>
      </div>

      {/* Stream Automation Controls */}
      <div>
        <div className="flex items-center gap-2 text-white font-mono font-bold text-sm mb-3">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>AUTOMATION & POLLING</span>
        </div>

        <div className="bg-[#131b29] border border-gray-800 rounded-lg p-3.5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300">Live In-Play Polling:</span>
            <button
              onClick={onToggleAutoRefresh}
              className={`px-3 py-1 text-xs font-bold font-mono rounded cursor-pointer transition ${
                isAutoRefreshing
                  ? 'bg-[#00ff66] text-black shadow-lg shadow-[#00ff66]/20'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {isAutoRefreshing ? 'ONLINE' : 'PAUSED'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-gray-800/80">
            <span className="text-xs text-gray-300">Auto-Grade Finished:</span>
            {onToggleAutoSettlement ? (
              <button
                onClick={onToggleAutoSettlement}
                className={`px-3 py-1 text-xs font-bold font-mono rounded cursor-pointer transition ${
                  autoSettlementEnabled
                    ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {autoSettlementEnabled ? 'ACTIVE' : 'MANUAL'}
              </button>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded">
                AUTO-ENABLED
              </span>
            )}
          </div>

          {/* Rapid Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => onIntervalChange(2)}
              className={`flex-1 py-1 text-[10px] font-mono font-bold rounded transition cursor-pointer ${
                refreshInterval === 2
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                  : 'bg-[#0e1622] text-gray-400 hover:bg-[#182335] border border-gray-800'
              }`}
            >
              ⚡ 2s TURBO
            </button>
            <button
              type="button"
              onClick={() => onIntervalChange(4)}
              className={`flex-1 py-1 text-[10px] font-mono font-bold rounded transition cursor-pointer ${
                refreshInterval === 4
                  ? 'bg-[#00ff66] text-black shadow-md shadow-[#00ff66]/20'
                  : 'bg-[#0e1622] text-gray-400 hover:bg-[#182335] border border-gray-800'
              }`}
            >
              🔥 4s RAPID
            </button>
            <button
              type="button"
              onClick={() => onIntervalChange(8)}
              className={`flex-1 py-1 text-[10px] font-mono font-bold rounded transition cursor-pointer ${
                refreshInterval === 8
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                  : 'bg-[#0e1622] text-gray-400 hover:bg-[#182335] border border-gray-800'
              }`}
            >
              🎯 8s STD
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Poll Interval:</span>
              <span className="font-mono text-cyan-400 font-bold">{refreshInterval}s {refreshInterval <= 3 ? '(Ultra-Fast)' : ''}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={refreshInterval}
              onChange={(e) => onIntervalChange(parseInt(e.target.value, 10))}
              className="w-full accent-[#00ff66] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Desk Feature Tools */}
      <div>
        <div className="flex items-center gap-2 text-white font-mono font-bold text-sm mb-3">
          <Zap className="w-4 h-4 text-[#00ff66]" />
          <span>PRO TOOLS & CALCULATORS</span>
        </div>

        <div className="bg-[#131b29] border border-gray-800 rounded-lg p-3 flex flex-col gap-2 font-mono">
          {onOpenHedge && (
            <button
              onClick={onOpenHedge}
              className="w-full py-2 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded text-xs font-bold flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-3.5 h-3.5 text-[#00ff66]" />
                Arb / Hedge Calculator
              </span>
              <span className="text-[10px] bg-[#00ff66]/20 text-[#00ff66] px-1.5 py-0.5 rounded">Lock ROI</span>
            </button>
          )}

          {onOpenPaperBet && (
            <button
              onClick={onOpenPaperBet}
              className="w-full py-2 px-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded text-xs font-bold flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                1-Click Paper Bet Log
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Simulate</span>
            </button>
          )}

          {onScrollToLedger && (
            <button
              onClick={onScrollToLedger}
              className="w-full py-2 px-2.5 bg-gray-800/80 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded text-xs font-bold flex items-center justify-between transition cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                Ledger & Performance
              </span>
              <span className="text-[10px] text-gray-400">Charts</span>
            </button>
          )}
        </div>
      </div>

      {/* Subscriber Portal / VIP Gate */}
      <div>
        <div className="flex items-center gap-2 text-white font-mono font-bold text-sm mb-3">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>SUBSCRIBER DESK GATE</span>
        </div>

        <div className="bg-[#131b29] border border-gray-800 rounded-lg p-3.5">
          {!isAuthenticated ? (
            <form onSubmit={handleUnlock} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Encrypted Directives (smitty:8501)</span>
              </div>
              <input
                type="password"
                placeholder="4-Digit Passkey PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-[#0a0e17] border border-gray-700 rounded-md py-1.5 px-3 text-white font-mono text-xs focus:border-amber-400 focus:outline-none transition"
              />
              {authError && (
                <p className="text-[11px] text-rose-400 font-mono">
                  Access Denied: Invalid Passkey
                </p>
              )}
              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold font-mono rounded cursor-pointer transition flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Unlock Subscriber Blueprint
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
                <Unlock className="w-3.5 h-3.5" />
                <span>ACTIVE: VIP SUBSCRIBER DESK</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Full access granted to scaled cash risk assignments, order book directives, and Groq reasoning.
              </p>
              <button
                onClick={onLogout}
                className="w-full py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-mono rounded border border-gray-700 cursor-pointer transition"
              >
                Lock Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
