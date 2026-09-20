import React, { useState, useMemo } from 'react';
import { GameRecord } from '../types';
import { calculateHedgeBreakdown, americanToDecimal } from '../utils/oddsEngine';
import { ShieldCheck, Copy, Check, X, ArrowRight, DollarSign, Calculator, Percent } from 'lucide-react';

interface HedgeCalculatorModalProps {
  game: GameRecord;
  onClose: () => void;
}

export const HedgeCalculatorModal: React.FC<HedgeCalculatorModalProps> = ({ game, onClose }) => {
  const [totalOutlay, setTotalOutlay] = useState<number>(100);
  const [bookA, setBookA] = useState<string>('TonyBet (ON)');
  const [bookB, setBookB] = useState<string>('BetMGM (ON)');
  const [customOddsA, setCustomOddsA] = useState<string>(game.tonyBetOntario);
  const [customOddsB, setCustomOddsB] = useState<string>(game.betMgmOntario);
  const [copied, setCopied] = useState<boolean>(false);

  // Teams from matchup (e.g. "Chiefs @ Bills" or "Chiefs vs Bills")
  const teams = useMemo(() => {
    const parts = game.matchup.split(/[@vs]/i).map(s => s.trim()).filter(Boolean);
    return {
      teamA: parts[0] || game.pickTeam || 'Team A',
      teamB: parts[1] || 'Opponent'
    };
  }, [game]);

  const booksList = [
    { label: 'TonyBet (ON)', odds: game.tonyBetOntario },
    { label: 'BetMGM (ON)', odds: game.betMgmOntario },
    { label: 'FanDuel (ON)', odds: game.fanDuelOntario },
    { label: 'theScore (ON)', odds: game.theScoreOntario },
  ];

  const handleBookAChange = (label: string) => {
    setBookA(label);
    const found = booksList.find(b => b.label === label);
    if (found) setCustomOddsA(found.odds);
  };

  const handleBookBChange = (label: string) => {
    setBookB(label);
    const found = booksList.find(b => b.label === label);
    if (found) setCustomOddsB(found.odds);
  };

  const hedge = useMemo(() => {
    return calculateHedgeBreakdown(customOddsA, customOddsB, totalOutlay);
  }, [customOddsA, customOddsB, totalOutlay]);

  const handleCopyPlan = () => {
    const planText = `[ONTARIO ARB / HEDGE PLAN]\nEvent: ${game.matchup} (${game.league})\n` +
      `Order 1: Bet $${hedge.stakeA.toFixed(2)} on ${teams.teamA} @ ${bookA} (${customOddsA} / ${hedge.decimalA}x)\n` +
      `Order 2: Bet $${hedge.stakeB.toFixed(2)} on ${teams.teamB} @ ${bookB} (${customOddsB} / ${hedge.decimalB}x)\n` +
      `Total Outlay: $${totalOutlay.toFixed(2)}\n` +
      `Guaranteed Payout: $${hedge.payoutA.toFixed(2)} (Net: ${hedge.guaranteedNetProfit >= 0 ? '+' : ''}$${hedge.guaranteedNetProfit.toFixed(2)} | ROI: ${hedge.roiPct}%)`;

    navigator.clipboard.writeText(planText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0e141f] border border-gray-700/80 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative text-gray-200 font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-lg text-[#00ff66]">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                GUARANTEED ARBITRAGE & HEDGING CALCULATOR
              </h3>
              <p className="text-xs text-gray-400">
                Dual-stake cross-sportsbook lock for Ontario regulated books.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Badge */}
        <div className="my-4 p-3 bg-[#0a0e17] rounded-xl border border-gray-800 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 text-[10px] border border-cyan-800/40 mr-2 font-bold">
              {game.league}
            </span>
            <span className="text-white text-xs font-bold">{game.matchup}</span>
          </div>
          <span className="text-xs text-gray-400">{game.timeMetric}</span>
        </div>

        {/* Status Alert Banner */}
        <div className={`p-3.5 rounded-xl border mb-4 flex items-center justify-between gap-3 ${
          hedge.isSurebet
            ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-[#00ff66]'
            : 'bg-cyan-950/30 border-cyan-700/40 text-cyan-300'
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <div>
              <div className="font-bold text-xs uppercase tracking-wide">
                {hedge.isSurebet ? '⚡ 100% Risk-Free Arbitrage Detected' : '⚖️ Optimal Capital Hedge Balance'}
              </div>
              <div className="text-[11px] text-gray-300 font-normal">
                {hedge.isSurebet
                  ? `Combined market probability is ${hedge.totalMarketProb}%. Guaranteed profit locked regardless of match outcome!`
                  : `Market sum is ${hedge.totalMarketProb}%. Minimum variance hedge distributed across sportsbooks.`}
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-gray-400 font-normal">ROI / EDGE</div>
            <div className={`text-base font-bold ${hedge.guaranteedNetProfit >= 0 ? 'text-[#00ff66]' : 'text-cyan-300'}`}>
              {hedge.roiPct >= 0 ? `+${hedge.roiPct}%` : `${hedge.roiPct}%`}
            </div>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Leg A */}
          <div className="bg-[#121927] p-3 rounded-xl border border-gray-800">
            <div className="text-[11px] text-cyan-400 font-bold mb-1.5 flex items-center justify-between">
              <span>LEG 1: {teams.teamA}</span>
              <span className="text-gray-400">Decimal: {hedge.decimalA}x</span>
            </div>
            <div className="flex flex-col gap-2">
              <select
                value={bookA}
                onChange={(e) => handleBookAChange(e.target.value)}
                className="bg-[#0a0e17] border border-gray-700 text-xs rounded-lg p-1.5 text-white focus:border-[#00ff66] focus:outline-none cursor-pointer"
              >
                {booksList.map(b => (
                  <option key={b.label} value={b.label}>{b.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">Line:</span>
                <input
                  type="text"
                  value={customOddsA}
                  onChange={(e) => setCustomOddsA(e.target.value)}
                  className="flex-1 bg-[#0a0e17] border border-gray-700 text-xs rounded-lg p-1 text-center font-bold text-[#00ff66]"
                />
              </div>
            </div>
          </div>

          {/* Leg B */}
          <div className="bg-[#121927] p-3 rounded-xl border border-gray-800">
            <div className="text-[11px] text-amber-400 font-bold mb-1.5 flex items-center justify-between">
              <span>LEG 2: {teams.teamB}</span>
              <span className="text-gray-400">Decimal: {hedge.decimalB}x</span>
            </div>
            <div className="flex flex-col gap-2">
              <select
                value={bookB}
                onChange={(e) => handleBookBChange(e.target.value)}
                className="bg-[#0a0e17] border border-gray-700 text-xs rounded-lg p-1.5 text-white focus:border-[#00ff66] focus:outline-none cursor-pointer"
              >
                {booksList.map(b => (
                  <option key={b.label} value={b.label}>{b.label}</option>
                ))}
              </select>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-gray-400">Line:</span>
                <input
                  type="text"
                  value={customOddsB}
                  onChange={(e) => setCustomOddsB(e.target.value)}
                  className="flex-1 bg-[#0a0e17] border border-gray-700 text-xs rounded-lg p-1 text-center font-bold text-amber-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Outlay Slider / Presets */}
        <div className="bg-[#121927] p-3.5 rounded-xl border border-gray-800 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#00ff66]" />
              TOTAL INVESTMENT OUTLAY:
            </span>
            <div className="flex items-center gap-1">
              <span className="text-white font-bold text-sm">${totalOutlay.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <input
              type="range"
              min="20"
              max="2000"
              step="10"
              value={totalOutlay}
              onChange={(e) => setTotalOutlay(parseFloat(e.target.value))}
              className="w-full accent-[#00ff66] cursor-pointer"
            />
          </div>

          {/* Quick Outlay Presets */}
          <div className="flex items-center gap-2">
            {[50, 100, 250, 500, 1000].map(val => (
              <button
                key={val}
                onClick={() => setTotalOutlay(val)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                  totalOutlay === val
                    ? 'bg-[#00ff66] text-black font-bold border-[#00ff66]'
                    : 'bg-[#0a0e17] text-gray-300 border-gray-700 hover:border-gray-500'
                }`}
              >
                ${val}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Staking Execution Table */}
        <div className="bg-[#0a0e17] rounded-xl border border-gray-800 overflow-hidden mb-5">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 bg-[#0d121c]">
                <th className="py-2.5 px-3">Leg Selection</th>
                <th className="py-2.5 px-3">Sportsbook</th>
                <th className="py-2.5 px-3 text-right">Stake Amount</th>
                <th className="py-2.5 px-3 text-right">Potential Return</th>
                <th className="py-2.5 px-3 text-right">Net P/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              <tr>
                <td className="py-2.5 px-3 text-white font-bold">{teams.teamA}</td>
                <td className="py-2.5 px-3 text-cyan-300">{bookA}</td>
                <td className="py-2.5 px-3 text-right font-bold text-[#00ff66]">
                  ${hedge.stakeA.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right text-gray-200">
                  ${hedge.payoutA.toFixed(2)}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold ${hedge.netProfitA >= 0 ? 'text-[#00ff66]' : 'text-rose-400'}`}>
                  {hedge.netProfitA >= 0 ? `+$${hedge.netProfitA.toFixed(2)}` : `-$${Math.abs(hedge.netProfitA).toFixed(2)}`}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-white font-bold">{teams.teamB}</td>
                <td className="py-2.5 px-3 text-amber-300">{bookB}</td>
                <td className="py-2.5 px-3 text-right font-bold text-amber-300">
                  ${hedge.stakeB.toFixed(2)}
                </td>
                <td className="py-2.5 px-3 text-right text-gray-200">
                  ${hedge.payoutB.toFixed(2)}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold ${hedge.netProfitB >= 0 ? 'text-[#00ff66]' : 'text-rose-400'}`}>
                  {hedge.netProfitB >= 0 ? `+$${hedge.netProfitB.toFixed(2)}` : `-$${Math.abs(hedge.netProfitB).toFixed(2)}`}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-[#121927] border-t border-gray-800 font-bold text-white">
                <td colSpan={2} className="py-3 px-3">
                  GUARANTEED LOCK RESULT:
                </td>
                <td className="py-3 px-3 text-right text-white">
                  ${totalOutlay.toFixed(2)}
                </td>
                <td className="py-3 px-3 text-right text-cyan-300">
                  ${Math.min(hedge.payoutA, hedge.payoutB).toFixed(2)}
                </td>
                <td className={`py-3 px-3 text-right ${hedge.guaranteedNetProfit >= 0 ? 'text-[#00ff66]' : 'text-rose-400'}`}>
                  {hedge.guaranteedNetProfit >= 0 ? `+$${hedge.guaranteedNetProfit.toFixed(2)}` : `-$${Math.abs(hedge.guaranteedNetProfit).toFixed(2)}`}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="text-[11px] text-gray-400">
            * Place wagers simultaneously to prevent line movement slippage.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPlan}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#1b263b] hover:bg-[#253450] text-gray-200 rounded-xl text-xs font-bold border border-gray-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-[#00ff66]" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Dual Order'}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#00ff66] text-black font-bold rounded-xl text-xs hover:bg-[#00e65c] transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
