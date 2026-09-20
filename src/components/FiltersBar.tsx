import React from 'react';
import { Filter, Search, X, CheckCircle, ShieldAlert } from 'lucide-react';

interface FiltersBarProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
  selectedLeague: string;
  onLeagueChange: (league: string) => void;
  leagueList: string[];
  minEdge: number;
  onMinEdgeChange: (val: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sportsList: string[];
  totalMatchesCount: number;
  aiDecisionsCount: { buy: number; pass: number };
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  selectedSport,
  onSportChange,
  selectedLeague,
  onLeagueChange,
  leagueList,
  minEdge,
  onMinEdgeChange,
  searchQuery,
  onSearchChange,
  sportsList,
  totalMatchesCount,
  aiDecisionsCount
}) => {
  const quickSearches = ['BUY', 'PASS', 'Premier League', 'UFC 310', 'MLB', 'NFL', 'Champions League'];

  return (
    <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-4 mb-6 shadow-lg flex flex-col gap-3">
      {/* Top row: Sport selectors & League filter */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            SPORT:
          </span>
          {sportsList.map((sport) => (
            <button
              key={sport}
              onClick={() => onSportChange(sport)}
              className={`px-2.5 py-1 text-xs font-mono rounded-lg transition cursor-pointer ${
                selectedSport === sport
                  ? 'bg-[#00ff66] text-black font-bold shadow-md shadow-[#00ff66]/20'
                  : 'bg-[#151e2e] text-gray-300 hover:bg-[#1f2c42] border border-gray-800'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* League dropdown & Min Edge */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-300">
            <span className="text-gray-400">LEAGUE:</span>
            <select
              value={selectedLeague}
              onChange={(e) => onLeagueChange(e.target.value)}
              className="bg-[#151e2e] border border-gray-700 text-xs font-mono text-cyan-300 rounded-lg px-2.5 py-1 focus:border-[#00ff66] focus:outline-none cursor-pointer"
            >
              {leagueList.map((lg) => (
                <option key={lg} value={lg}>
                  {lg === 'ALL' ? 'ALL LEAGUES' : lg}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-mono whitespace-nowrap">
              MIN EDGE: <span className="text-[#00ff66] font-bold">+{minEdge}%</span>
            </span>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minEdge}
              onChange={(e) => onMinEdgeChange(parseFloat(e.target.value))}
              className="w-24 accent-[#00ff66] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Bottom row: Smart AI Decision Search Bar with quick chips */}
      <div className="pt-2 border-t border-gray-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Type any team, league, or decision (e.g., 'Chiefs', 'BUY', 'Pass', 'Premier League', 'UFC')..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#0a0e17] border border-gray-700 rounded-lg py-2 pl-9 pr-9 text-xs text-white font-mono placeholder-gray-500 focus:border-[#00ff66] focus:outline-none transition shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 text-gray-400 hover:text-white p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Tags & Decision Feedback */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
          <span className="text-gray-500 mr-1">Quick:</span>
          {quickSearches.map((tag) => (
            <button
              key={tag}
              onClick={() => onSearchChange(searchQuery === tag ? '' : tag)}
              className={`px-2 py-0.5 rounded transition cursor-pointer border ${
                searchQuery.toLowerCase() === tag.toLowerCase()
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                  : 'bg-[#121927] text-gray-400 border-gray-800 hover:text-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter / Search Decision Summary */}
      {(searchQuery || selectedLeague !== 'ALL' || selectedSport !== 'ALL') && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 px-1 text-xs font-mono bg-[#090d14] rounded-lg p-2 border border-gray-800/60">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="text-cyan-400 font-bold">DECISION MATRIX FILTER:</span>
            <span>
              {totalMatchesCount} game{totalMatchesCount === 1 ? '' : 's'} matching
              {searchQuery ? ` "${searchQuery}"` : ''}
              {selectedLeague !== 'ALL' ? ` [${selectedLeague}]` : ''}
              {selectedSport !== 'ALL' ? ` (${selectedSport})` : ''}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#00ff66]">
              <CheckCircle className="w-3.5 h-3.5" />
              {aiDecisionsCount.buy} BUY Directives
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <ShieldAlert className="w-3.5 h-3.5 text-gray-500" />
              {aiDecisionsCount.pass} PASS / No Value
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
