import React from 'react';
import { Filter, Search } from 'lucide-react';

interface FiltersBarProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
  minEdge: number;
  onMinEdgeChange: (val: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sportsList: string[];
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  selectedSport,
  onSportChange,
  minEdge,
  onMinEdgeChange,
  searchQuery,
  onSearchChange,
  sportsList
}) => {
  return (
    <div className="bg-[#0e141f] border border-[#1f2937] rounded-xl p-4 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-400 font-mono flex items-center gap-1 mr-2">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          SPORT:
        </span>
        {sportsList.map((sport) => (
          <button
            key={sport}
            onClick={() => onSportChange(sport)}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition cursor-pointer ${
              selectedSport === sport
                ? 'bg-[#00ff66] text-black font-bold shadow-md shadow-[#00ff66]/20'
                : 'bg-[#151e2e] text-gray-300 hover:bg-[#1f2c42] border border-gray-800'
            }`}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        {/* Edge slider */}
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
            className="w-28 accent-[#00ff66] cursor-pointer"
          />
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search teams or matchups..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-56 bg-[#0a0e17] border border-gray-700 rounded-lg py-1.5 pl-8 pr-3 text-xs text-white font-mono placeholder-gray-500 focus:border-[#00ff66] focus:outline-none transition"
          />
        </div>
      </div>
    </div>
  );
};
