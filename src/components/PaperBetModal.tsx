import React, { useState } from 'react';
import { GameRecord, SettledBet } from '../types';
import { americanToDecimal, calculateKellyRisk } from '../utils/oddsEngine';
import { Target, X, Check, DollarSign, Zap, TrendingUp, AlertCircle } from 'lucide-react';

interface PaperBetModalProps {
  game: GameRecord;
  currentBankroll: number;
  onClose: () => void;
  onBetPlaced: (bet: SettledBet) => void;
}

export const PaperBetModal: React.FC<PaperBetModalProps> = ({
  game,
  currentBankroll,
  onClose,
  onBetPlaced
}) => {
  const booksMap: Record<string, string> = {
    'TonyBet': game.tonyBetOntario,
    'BetMGM': game.betMgmOntario,
    'FanDuel': game.fanDuelOntario,
    'theScore Bet': game.theScoreOntario
  };

  const defaultBook = game.bestBook.includes('Tony')
    ? 'TonyBet'
    : game.bestBook.includes('MGM')
    ? 'BetMGM'
    : game.bestBook.includes('FanDuel')
    ? 'FanDuel'
    : 'theScore Bet';

  const [selectedBook, setSelectedBook] = useState<string>(defaultBook);
  const currentOdds = booksMap[selectedBook] || game.tonyBetOntario;

  const kellyRec = calculateKellyRisk(game.edgeMarginPct, currentBankroll);
  const [stake, setStake] = useState<number>(kellyRec);
  const [simulatedOutcome, setSimulatedOutcome] = useState<'PENDING' | 'WIN' | 'LOSS'>('PENDING');

  const decimalOdds = americanToDecimal(currentOdds);
  const potentialProfit = parseFloat(((decimalOdds - 1) * stake).toFixed(2));
  const totalReturn = parseFloat((stake * decimalOdds).toFixed(2));

  const handleConfirm = () => {
    const now = new Date();
    const timestampStr = now.toISOString().replace('T', ' ').substring(0, 19);

    let profitOrLoss = 0;
    let outcomeLabel = 'PENDING (IN PLAY)';
    let status: 'PENDING' | 'WON' | 'LOST' = 'PENDING';
    let runningBankroll = currentBankroll;

    if (simulatedOutcome === 'WIN') {
      profitOrLoss = potentialProfit;
      outcomeLabel = 'WIN (COVERED)';
      status = 'WON';
      runningBankroll = currentBankroll + profitOrLoss;
    } else if (simulatedOutcome === 'LOSS') {
      profitOrLoss = -stake;
      outcomeLabel = 'LOSS (MISSED)';
      status = 'LOST';
      runningBankroll = currentBankroll - stake;
    }

    const newBet: SettledBet = {
      id: `paper-${Date.now()}`,
      timestamp: timestampStr,
      matchup: game.matchup,
      sport: game.sport,
      league: game.league,
      aiPickSelection: game.pickTeam,
      finalScoreLine: game.scoreTicker !== 'Scheduled' ? game.scoreTicker : 'In Play',
      outcomeLabel,
      profitOrLoss,
      runningBankroll,
      stake,
      odds: currentOdds,
      bookmaker: selectedBook,
      edgePct: game.edgeMarginPct,
      status
    };

    onBetPlaced(newBet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-[#0e141f] border border-gray-700/80 rounded-2xl w-full max-w-lg p-5 sm:p-6 shadow-2xl relative text-gray-200 font-mono">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                1-CLICK PAPER TRADING TRACKER
              </h3>
              <p className="text-xs text-gray-400">
                Log and benchmark live simulated wagers with zero capital risk.
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

        {/* Target Pick Information */}
        <div className="my-4 p-3 bg-[#0a0e17] rounded-xl border border-gray-800">
          <div className="flex items-center justify-between mb-1.5">
            <span className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 text-[10px] border border-cyan-800/40 font-bold">
              {game.league}
            </span>
            <span className="text-xs text-emerald-400 font-bold">+{game.edgeMarginPct}% Edge</span>
          </div>
          <div className="text-white font-bold text-sm mb-1">{game.matchup}</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-400">AI Directive:</span>
            <span className="text-[#00ff66] font-bold">{game.aiActionDirective}</span>
            <span className="text-gray-400">• Pick:</span>
            <span className="text-white font-bold bg-gray-800 px-1.5 py-0.5 rounded">{game.pickTeam}</span>
          </div>
        </div>

        {/* Bookmaker & Price Selection */}
        <div className="mb-4">
          <label className="text-xs text-gray-400 mb-1.5 block">SELECT ONTARIO REGULATED BOOKMAKER:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(booksMap).map(([book, odds]) => {
              const isSelected = selectedBook === book;
              const isBest = game.bestBook.includes(book.split(' ')[0]);
              return (
                <button
                  key={book}
                  onClick={() => setSelectedBook(book)}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white'
                      : 'bg-[#121927] border-gray-800 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{book}</span>
                    {isBest && <span className="text-[9px] text-[#00ff66]">BEST</span>}
                  </div>
                  <div className={`text-sm font-bold ${isSelected ? 'text-[#00ff66]' : 'text-gray-200'}`}>
                    {odds}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stake Size & Presets */}
        <div className="bg-[#121927] p-3.5 rounded-xl border border-gray-800 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#00ff66]" />
              WAGER STAKE:
            </span>
            <span className="text-white font-bold text-sm">${stake.toFixed(2)}</span>
          </div>

          <input
            type="range"
            min="10"
            max={Math.min(500, Math.round(currentBankroll * 0.25))}
            step="5"
            value={stake}
            onChange={(e) => setStake(parseFloat(e.target.value))}
            className="w-full accent-[#00ff66] cursor-pointer mb-2.5"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setStake(kellyRec)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                stake === kellyRec
                  ? 'bg-[#00ff66] text-black font-bold border-[#00ff66]'
                  : 'bg-[#0a0e17] text-[#00ff66] border-[#00ff66]/40 hover:bg-[#00ff66]/10'
              }`}
            >
              Kelly Rec (${kellyRec})
            </button>
            {[25, 50, 100, 150].map((amt) => (
              <button
                key={amt}
                onClick={() => setStake(amt)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition cursor-pointer ${
                  stake === amt
                    ? 'bg-cyan-500 text-black font-bold border-cyan-500'
                    : 'bg-[#0a0e17] text-gray-300 border-gray-700 hover:border-gray-500'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Expected Return Breakdown */}
        <div className="grid grid-cols-2 gap-3 bg-[#0a0e17] p-3 rounded-xl border border-gray-800 mb-4">
          <div>
            <div className="text-[11px] text-gray-400">Potential Net Profit</div>
            <div className="text-base font-bold text-[#00ff66]">
              +${potentialProfit.toFixed(2)}
            </div>
          </div>
          <div>
            <div className="text-[11px] text-gray-400">Total Return Payout</div>
            <div className="text-base font-bold text-white">
              ${totalReturn.toFixed(2)} <span className="text-xs text-gray-400 font-normal">({decimalOdds}x)</span>
            </div>
          </div>
        </div>

        {/* Mode Simulation Selector */}
        <div className="mb-5">
          <label className="text-xs text-gray-400 mb-1.5 block">TRACKING MODE:</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => setSimulatedOutcome('PENDING')}
              className={`py-2 px-2 rounded-xl border font-bold transition cursor-pointer ${
                simulatedOutcome === 'PENDING'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                  : 'bg-[#121927] border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              ⏳ Log Open Bet
            </button>
            <button
              onClick={() => setSimulatedOutcome('WIN')}
              className={`py-2 px-2 rounded-xl border font-bold transition cursor-pointer ${
                simulatedOutcome === 'WIN'
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                  : 'bg-[#121927] border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              ✅ Simulate Win
            </button>
            <button
              onClick={() => setSimulatedOutcome('LOSS')}
              className={`py-2 px-2 rounded-xl border font-bold transition cursor-pointer ${
                simulatedOutcome === 'LOSS'
                  ? 'bg-rose-500/20 border-rose-400 text-rose-400'
                  : 'bg-[#121927] border-gray-800 text-gray-400 hover:text-gray-200'
              }`}
            >
              ❌ Simulate Loss
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 bg-[#00ff66] hover:bg-[#00e65c] text-black rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-lg shadow-[#00ff66]/20"
          >
            <Zap className="w-4 h-4" />
            Confirm Paper Trade
          </button>
        </div>
      </div>
    </div>
  );
};
