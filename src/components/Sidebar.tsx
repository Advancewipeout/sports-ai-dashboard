import React, { useState } from 'react';
import { DollarSign, Shield, Lock, Unlock, Sliders, Radio, KeyRound } from 'lucide-react';

interface SidebarProps {
  bankroll: number;
  onBankrollChange: (val: number) => void;
  isAutoRefreshing: boolean;
  onToggleAutoRefresh: () => void;
  refreshInterval: number;
  onIntervalChange: (sec: number) => void;
  isAuthenticated: boolean;
  onAuthenticate: (pin: string) => boolean;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  bankroll,
  onBankrollChange,
  isAutoRefreshing,
  onToggleAutoRefresh,
  refreshInterval,
  onIntervalChange,
  isAuthenticated,
  onAuthenticate,
  onLogout
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
          <label className="text-xs text-gray-400 block mb-1 font-medium">
            Active Total Bankroll ($)
          </label>
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

          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Poll Interval:</span>
              <span className="font-mono text-cyan-400">{refreshInterval}s</span>
            </div>
            <input
              type="range"
              min="2"
              max="30"
              step="1"
              value={refreshInterval}
              onChange={(e) => onIntervalChange(parseInt(e.target.value, 10))}
              className="w-full accent-[#00ff66] cursor-pointer"
            />
          </div>
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
