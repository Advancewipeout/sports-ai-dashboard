import React from 'react';
import { GameCard } from '../types';
import { calculateSuggestedRiskWager } from '../utils/oddsEngine';
import { ShieldAlert, ShieldCheck, Sparkles, Terminal, Copy, Check } from 'lucide-react';

interface SubscriberBlueprintProps {
  authenticated: boolean;
  bankroll: number;
  activeOrders: GameCard[];
  onOpenPredictModal: (game?: GameCard) => void;
  onQuickUnlock: () => void;
}

export const SubscriberBlueprint: React.FC<SubscriberBlueprintProps> = ({
  authenticated,
  bankroll,
  activeOrders,
  onOpenPredictModal,
  onQuickUnlock,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
          <span>📋</span> Automated Execution Order Blueprint (Scaled Cash Risks)
        </h2>
        {authenticated && (
          <span className="text-xs font-mono text-[#00ff66] bg-emerald-950/80 border border-emerald-600/40 px-2 py-0.5 rounded">
            VIP ALLOCATION ACTIVE
          </span>
        )}
      </div>

      {!authenticated ? (
        /* Encrypted Warning Box matching Streamlit */
        <div className="bg-[#121824] border border-amber-800/40 p-5 rounded-lg text-left shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="text-sm text-amber-200 font-mono font-medium">
                🔒 The AI Decision buy directives and scaled cash allocations are encrypted. Authenticate your 4-digit passkey pin in the subscriber portal sidebar to view.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onQuickUnlock}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-1.5 px-3.5 rounded transition-colors shadow-sm flex items-center gap-1.5 font-mono"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Quick Passkey Unlock (smitty:8501)
                </button>
                <span className="text-xs text-gray-500 font-mono">
                  Default subscriber: smitty • Pass: 8501
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked Subscriber Blueprint matching Streamlit */
        <div className="space-y-4">
          <div className="bg-emerald-950/60 border border-emerald-600/50 p-3.5 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-[#00ff66]" />
              🌟 AI PREMIUM MEMBER POSITIONS UNLOCKED
            </div>
            <button
              onClick={() => onOpenPredictModal()}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-1.5 px-3.5 rounded text-xs transition-colors flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              🔮 Predict with GROQ for active orders (calls API)
            </button>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-[#0e141e] border border-[#1f2937] p-5 rounded-lg text-center font-mono text-xs text-gray-400">
              No high-value selections match your minimum value edge cutoff.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-mono text-gray-400">
                **Active Allocation Blueprint Statements ({activeOrders.length} orders):**
              </div>

              {activeOrders.map((row) => {
                const edgeVal = row.edgeMarginPct || 0;
                const oddsVal = row.tonyBet || 'TonyBet';
                const pickVal = row.pickTeam || 'Target Selection';
                const matchVal = row.matchup || 'Match';
                const sportVal = row.sport || 'Sport';
                const layerVal = row.engineLayer.includes('LIVE') ? 'LAYER 2: LIVE' : 'LAYER 1: UPCOMING';

                const suggestedWager = calculateSuggestedRiskWager(bankroll, edgeVal);
                const blueprintString = `SOURCE ENGINE: [${layerVal}] | EDGE: +${edgeVal.toFixed(1)}% -> ALLOCATION RISK: $${suggestedWager.toFixed(2)} ON: ${pickVal} (${oddsVal})`;

                return (
                  <div
                    key={row.id}
                    className="bg-[#0e141e] border border-[#1f2937] hover:border-gray-700 p-4 rounded-lg space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs sm:text-sm font-bold text-white font-sans flex items-center gap-1.5">
                        <span className="text-emerald-400">📍</span> {matchVal} ({sportVal})
                      </p>
                      <button
                        onClick={() => onOpenPredictModal(row)}
                        className="text-[11px] font-mono text-[#00ff66] hover:text-white bg-[#161b22] hover:bg-emerald-950/70 border border-emerald-800/40 px-2 py-1 rounded transition-colors"
                      >
                        Deep Model Run
                      </button>
                    </div>

                    <div className="relative group">
                      <pre className="bg-[#080b0f] border border-[#1f2937] p-3 rounded text-[11px] sm:text-xs font-mono text-[#00ff66] overflow-x-auto whitespace-pre leading-relaxed">
                        {blueprintString}
                      </pre>
                      <button
                        onClick={() => handleCopy(row.id, blueprintString)}
                        title="Copy blueprint command"
                        className="absolute right-2 top-2 p-1.5 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded text-gray-400 hover:text-white transition-colors"
                      >
                        {copiedId === row.id ? (
                          <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
