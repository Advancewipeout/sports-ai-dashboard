import React from 'react';
import { GameRecord } from '../types';
import { Lock, Unlock, DollarSign, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { calculateKellyRisk } from '../utils/oddsEngine';

interface SubscriberBlueprintProps {
  games: GameRecord[];
  isAuthenticated: boolean;
  bankroll: number;
}

export const SubscriberBlueprint: React.FC<SubscriberBlueprintProps> = ({
  games,
  isAuthenticated,
  bankroll
}) => {
  const buyPositions = games.filter((g) => g.aiActionDirective.includes('BUY'));

  return (
    <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-5 mb-6 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400">
            {isAuthenticated ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
          </div>
          <div>
            <h2 className="text-base font-bold font-mono text-white flex items-center gap-2">
              📋 AUTOMATED EXECUTION ORDER BLUEPRINT
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                isAuthenticated
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {isAuthenticated ? 'PORTAL UNLOCKED (smitty)' : 'ENCRYPTED PASSKEY REQUIRED'}
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Precise unit wager sizing, scaled dollar exposure, and target sportsbooks for optimal Kelly growth.
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-gray-400 bg-[#141d2c] px-2.5 py-1 rounded border border-gray-800">
          {buyPositions.length} Qualified Positions
        </span>
      </div>

      {!isAuthenticated ? (
        <div className="bg-[#121926] border border-amber-500/20 rounded-xl p-6 text-center flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-1">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold font-mono text-white">
            SUBSCRIBER ORDERS ENCRYPTED
          </h3>
          <p className="text-xs text-gray-400 max-w-md">
            Live order execution directives, fractional Kelly risk-dollar assignments, and target book allocations are locked. Enter passkey PIN <code className="text-amber-400 bg-black/40 px-1 py-0.5 rounded">8501</code> in the sidebar desk to unlock.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buyPositions.map((game) => {
            const stake = calculateKellyRisk(game.edgeMarginPct, bankroll);
            const isLive = game.engineLayer.includes('LIVE');

            return (
              <div
                key={game.id}
                className="bg-[#111827] border border-[#1f2937] hover:border-[#00ff66]/40 rounded-xl p-4 transition shadow-lg flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2 font-mono">
                    <span className="text-gray-400">{game.sport}</span>
                    <span className={isLive ? 'text-rose-400 font-bold' : 'text-cyan-400 font-bold'}>
                      {isLive ? '🔴 LIVE IN-PLAY' : '⏳ SCHEDULED'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {game.matchup}
                  </h4>

                  <div className="p-2.5 bg-[#0a0e17] rounded-lg border border-gray-800 mt-2 flex flex-col gap-1 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Selection:</span>
                      <span className="text-[#00ff66] font-bold">{game.pickTeam}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Target Odds:</span>
                      <span className="text-cyan-400 font-bold">{game.tonyBetOntario} (TonyBet)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model Edge:</span>
                      <span className="text-[#00ff66] font-bold">+{game.edgeMarginPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-gray-400 block">
                      Recommended Risk
                    </span>
                    <span className="text-lg font-bold font-mono text-emerald-400 flex items-center">
                      <DollarSign className="w-4 h-4" />
                      {stake.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66] text-xs font-mono font-bold rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    AUTHORIZED
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
