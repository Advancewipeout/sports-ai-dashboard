import React, { useState } from 'react';
import { DollarSign, RefreshCw, Lock, Unlock, Trash2, CheckCircle2, AlertTriangle, KeyRound, User, RotateCcw } from 'lucide-react';

interface SidebarProps {
  bankroll: number;
  setBankroll: (val: number) => void;
  liveUpdates: boolean;
  setLiveUpdates: (val: boolean) => void;
  autoPredict: boolean;
  setAutoPredict: (val: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (val: number) => void;
  authenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  onWipeLedger: () => void;
  onResetData: () => void;
  onForceSync: () => void;
  isSyncing: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  bankroll,
  setBankroll,
  liveUpdates,
  setLiveUpdates,
  autoPredict,
  setAutoPredict,
  refreshInterval,
  setRefreshInterval,
  authenticated,
  setAuthenticated,
  onWipeLedger,
  onResetData,
  onForceSync,
  isSyncing,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim().toLowerCase() === 'smitty' && passwordInput.trim() === '8501') {
      setAuthenticated(true);
      setAuthMessage({ type: 'success', text: 'Access Granted! Subscriber Desk unlocked.' });
      setTimeout(() => setAuthMessage(null), 4000);
    } else {
      setAuthMessage({ type: 'error', text: 'Invalid credentials block. (Hint: smitty / 8501)' });
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    setAuthMessage({ type: 'success', text: 'Logged out. Subscriber blueprint encrypted.' });
    setTimeout(() => setAuthMessage(null), 3000);
  };

  return (
    <aside className="w-full lg:w-80 bg-[#0d1117] border-b lg:border-b-0 lg:border-r border-[#1f2937] p-5 flex flex-col gap-6 text-sm shrink-0">
      {/* 1. Bankroll Management */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1f2937]/80">
          <DollarSign className="w-4 h-4 text-[#00ff66]" />
          <h2 className="font-bold text-white text-base tracking-wide flex items-center gap-1.5">
            ⚙️ Bankroll Management Desk
          </h2>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1">
            Total Trading Bankroll ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500 font-mono text-sm">$</span>
            <input
              type="number"
              min={10}
              step={50}
              value={bankroll}
              onChange={(e) => setBankroll(Math.max(10, parseFloat(e.target.value) || 10))}
              className="w-full bg-[#161b22] border border-[#30363d] focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] text-white rounded-md pl-7 pr-3 py-2 text-sm font-mono transition-all outline-none"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 font-mono">
            <span>Base: $1,000.00</span>
            <span>Alloc. Cap: 20.0%</span>
          </div>
        </div>
      </section>

      {/* 2. Live & Predict Controls */}
      <section className="space-y-3 pt-2 border-t border-[#1f2937]">
        <div className="flex items-center gap-2 pb-2 border-b border-[#1f2937]/80">
          <RefreshCw className={`w-4 h-4 text-blue-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <h2 className="font-bold text-white text-base tracking-wide">
            🔁 Live &amp; Predict Controls
          </h2>
        </div>

        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={liveUpdates}
              onChange={(e) => setLiveUpdates(e.target.checked)}
              className="w-4 h-4 rounded bg-[#161b22] border-[#30363d] text-[#00ff66] focus:ring-0 focus:ring-offset-0 transition-colors accent-[#00ff66]"
            />
            <span className="text-xs text-gray-300 group-hover:text-white font-medium">
              Enable live UI refresh
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={autoPredict}
              onChange={(e) => setAutoPredict(e.target.checked)}
              className="w-4 h-4 rounded bg-[#161b22] border-[#30363d] text-[#00ff66] focus:ring-0 focus:ring-offset-0 transition-colors accent-[#00ff66]"
            />
            <span className="text-xs text-gray-300 group-hover:text-white font-medium">
              Auto-predict when CSV changes (calls GROQ)
            </span>
          </label>

          <div className="pt-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Refresh interval</span>
              <span className="font-mono text-[#00ff66] font-semibold">{refreshInterval}s</span>
            </div>
            <input
              type="range"
              min={2}
              max={60}
              step={1}
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-[#00ff66]"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-0.5">
              <span>2s</span>
              <span>30s</span>
              <span>60s</span>
            </div>
          </div>

          <button
            onClick={onForceSync}
            disabled={isSyncing}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-gray-200 border border-[#30363d] hover:border-gray-500 py-1.5 px-3 rounded text-xs font-semibold font-mono transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#00ff66]' : ''}`} />
            {isSyncing ? 'SYNCHRONIZING...' : 'FORCE RESYNC MATRIX'}
          </button>
        </div>
      </section>

      {/* 3. Subscriber Portal Login */}
      <section className="space-y-3 pt-2 border-t border-[#1f2937]">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]/80">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="font-bold text-white text-base tracking-wide">
              🔐 Subscriber Portal Login
            </h2>
          </div>
          {authenticated && (
            <span className="text-[10px] font-mono bg-emerald-950 text-[#00ff66] border border-emerald-600/40 px-1.5 py-0.5 rounded">
              ACTIVE
            </span>
          )}
        </div>

        {authMessage && (
          <div
            className={`p-2.5 rounded text-xs font-mono flex items-start gap-2 ${
              authMessage.type === 'success'
                ? 'bg-emerald-950/70 border border-emerald-600 text-emerald-300'
                : 'bg-red-950/70 border border-red-700 text-red-300'
            }`}
          >
            {authMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00ff66]" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{authMessage.text}</span>
          </div>
        )}

        {!authenticated ? (
          <form onSubmit={handleAuthenticate} className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">User Name Label</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="e.g. smitty"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] focus:border-[#00ff66] text-white rounded pl-8 pr-3 py-1.5 text-xs font-mono transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Security Access Key Pin (4-Digit)
              </label>
              <div className="relative">
                <KeyRound className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="password"
                  maxLength={6}
                  placeholder="••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#161b22] border border-[#30363d] focus:border-[#00ff66] text-white rounded pl-8 pr-3 py-1.5 text-xs font-mono tracking-widest transition-all outline-none"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">Demo Pin: smitty / 8501</p>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded text-xs tracking-wide transition-all shadow-md shadow-emerald-950/40"
            >
              <Unlock className="w-3.5 h-3.5" />
              🔓 Authenticate Premium Pass
            </button>
          </form>
        ) : (
          <div className="space-y-2.5">
            <div className="bg-[#161b22] border border-emerald-600/30 p-2.5 rounded text-xs space-y-1">
              <div className="flex items-center justify-between text-gray-300 font-mono">
                <span>Account:</span>
                <span className="text-[#00ff66] font-bold">smitty (VIP)</span>
              </div>
              <div className="flex items-center justify-between text-gray-300 font-mono">
                <span>Pass Level:</span>
                <span className="text-amber-400 font-semibold">Ontario AI Desk</span>
              </div>
              <div className="flex items-center justify-between text-gray-300 font-mono">
                <span>Directives:</span>
                <span className="text-blue-400">Decrypted &amp; Live</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] py-1.5 px-3 rounded text-xs font-semibold transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              🔒 Secure Lock Logs Out
            </button>
          </div>
        )}
      </section>

      {/* 4. Ledger Utilities & Reset */}
      <section className="space-y-2 pt-2 border-t border-[#1f2937] mt-auto">
        {!showWipeConfirm ? (
          <button
            type="button"
            onClick={() => setShowWipeConfirm(true)}
            className="w-full flex items-center justify-center gap-1.5 bg-red-950/40 hover:bg-red-950/80 text-red-300 hover:text-red-200 border border-red-800/40 py-1.5 px-3 rounded text-xs font-semibold font-mono transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            🧹 Wipe Graded Bet Ledger History
          </button>
        ) : (
          <div className="bg-red-950/60 border border-red-700 p-2 rounded text-xs space-y-2">
            <p className="text-red-200 font-mono text-[11px]">
              Confirm wiping all settled ledger logs?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onWipeLedger();
                  setShowWipeConfirm(false);
                }}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded text-[11px] font-mono"
              >
                Yes, Wipe
              </button>
              <button
                onClick={() => setShowWipeConfirm(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-1 px-2 rounded text-[11px] font-mono"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onResetData}
          className="w-full flex items-center justify-center gap-1.5 bg-[#161b22] hover:bg-[#21262d] text-gray-400 hover:text-gray-200 border border-[#30363d] py-1 px-3 rounded text-[11px] font-mono transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Demo Fixtures &amp; Ledger
        </button>
      </section>
    </aside>
  );
};
