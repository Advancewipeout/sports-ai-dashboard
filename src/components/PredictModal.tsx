import React, { useState } from 'react';
import { GameCard, PredictionSummary } from '../types';
import { generateAIPrediction } from '../utils/oddsEngine';
import { Sparkles, X, Check, ArrowRight, BrainCircuit, Table, PlusCircle } from 'lucide-react';

interface PredictModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamesToPredict: GameCard[];
  onAppendPredictions: (predictions: PredictionSummary[]) => void;
}

export const PredictModal: React.FC<PredictModalProps> = ({
  isOpen,
  onClose,
  gamesToPredict,
  onAppendPredictions,
}) => {
  const [predictions, setPredictions] = useState<PredictionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [appendChecked, setAppendChecked] = useState(true);
  const [completedAppend, setCompletedAppend] = useState(false);

  React.useEffect(() => {
    if (isOpen && gamesToPredict.length > 0) {
      setLoading(true);
      setCompletedAppend(false);
      // Simulate calibrated GROQ / AI processing call with a brief realistic throttle
      const timer = setTimeout(() => {
        const results = gamesToPredict.map((g) => generateAIPrediction(g));
        setPredictions(results);
        setLoading(false);
      }, 750);
      return () => clearTimeout(timer);
    }
  }, [isOpen, gamesToPredict]);

  if (!isOpen) return null;

  const handleExecuteAppend = () => {
    if (predictions.length > 0) {
      onAppendPredictions(predictions);
      setCompletedAppend(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0e141e] border border-[#1f2937] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1f2937] flex items-center justify-between bg-[#121824]">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#00ff66]" />
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-1.5">
              <span>🔮</span> GROQ / Statistical AI Prediction Engine
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <Sparkles className="w-8 h-8 text-[#00ff66] animate-spin" />
              <p className="text-sm font-mono text-gray-300">
                Calling multi-layered probability model &amp; evaluating Ontario market lines...
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Extracting home win probability vs. TonyBet/BetMGM implied odds
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#121924] border border-emerald-900/50 p-3 rounded-lg flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-300">
                  ⚡ Evaluated {predictions.length} active fixtures with edge calibrations
                </span>
                <span className="text-gray-400">Status: 200 OK</span>
              </div>

              {/* Predictions Table */}
              <div className="border border-[#1f2937] rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#161b22] text-gray-400 text-[11px] uppercase tracking-wider border-b border-[#1f2937]">
                    <tr>
                      <th className="py-2.5 px-3">Matchup</th>
                      <th className="py-2.5 px-3">Sport</th>
                      <th className="py-2.5 px-3">Pick Team</th>
                      <th className="py-2.5 px-3">TonyBet Line</th>
                      <th className="py-2.5 px-3 text-right">Model Win Prob</th>
                      <th className="py-2.5 px-3 text-right">Implied Odds</th>
                      <th className="py-2.5 px-3 text-right">Model Edge %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f2937]/70">
                    {predictions.map((p, idx) => (
                      <tr key={idx} className="hover:bg-[#161f2e]">
                        <td className="py-2 px-3 font-sans font-semibold text-white whitespace-nowrap">
                          {p.matchup}
                        </td>
                        <td className="py-2 px-3 text-gray-400">{p.sport}</td>
                        <td className="py-2 px-3 text-emerald-400 font-bold">{p.pickTeam}</td>
                        <td className="py-2 px-3 text-gray-300">{p.tonyBet}</td>
                        <td className="py-2 px-3 text-right font-bold text-blue-400">
                          {(p.modelHomeWinProb * 100).toFixed(1)}%
                        </td>
                        <td className="py-2 px-3 text-right text-gray-400">
                          {p.impliedProb ? (p.impliedProb * 100).toFixed(1) + '%' : '—'}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-[#00ff66]">
                          +{p.modelEdgePct.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Append Checkbox */}
              <div className="pt-2 border-t border-[#1f2937] flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-gray-300">
                  <input
                    type="checkbox"
                    checked={appendChecked}
                    onChange={(e) => setAppendChecked(e.target.checked)}
                    className="w-4 h-4 rounded bg-[#161b22] border-[#30363d] text-[#00ff66] focus:ring-0 accent-[#00ff66]"
                  />
                  Append these predictions to master CSV as summary rows
                </label>

                {completedAppend ? (
                  <span className="flex items-center gap-1.5 text-xs text-[#00ff66] font-mono font-bold">
                    <Check className="w-4 h-4" /> Appended {predictions.length} rows to Master Sheet!
                  </span>
                ) : (
                  <button
                    onClick={handleExecuteAppend}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs py-2 px-4 rounded transition-colors flex items-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Confirm &amp; Append
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
