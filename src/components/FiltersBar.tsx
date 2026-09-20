import React from 'react';
import { Filter, Sliders, Search } from 'lucide-react';

interface FiltersBarProps {
  sports: string[];
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  strictnessTrigger: number;
  setStrictnessTrigger: (val: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  sports,
  selectedSport,
  setSelectedSport,
  strictnessTrigger,
  setStrictnessTrigger,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="bg-[#0e141e] border border-[#1f2937] p-4 rounded-lg mb-6 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
      {/* 1. Sport Selector */}
      <div className="flex-1 min-w-[200px]">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-1.5">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          Filter Market Sport
        </label>
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className="w-full bg-[#161b22] border border-[#30363d] text-white rounded-md px-3 py-2 text-xs font-mono focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] outline-none"
        >
          {sports.map((sport) => (
            <option key={sport} value={sport} className="bg-[#161b22] text-white">
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* 2. Edge Cutoff Slider */}
      <div className="flex-1 min-w-[240px]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <label className="flex items-center gap-1.5 font-semibold text-gray-400">
            <Sliders className="w-3.5 h-3.5 text-[#00ff66]" />
            AI Minimum Value Edge Cutoff (%)
          </label>
          <span className="font-mono text-[#00ff66] font-bold">
            {strictnessTrigger.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0.0}
            max={50.0}
            step={0.5}
            value={strictnessTrigger}
            onChange={(e) => setStrictnessTrigger(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#21262d] rounded-lg appearance-none cursor-pointer accent-[#00ff66]"
          />
          <span className="text-[11px] font-mono text-gray-500 w-8 text-right">50%</span>
        </div>
      </div>

      {/* 3. Search Query */}
      <div className="flex-1 min-w-[200px]">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 mb-1.5">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          Search Matchup / Team
        </label>
        <input
          type="text"
          placeholder="e.g. Dodgers, 49ers, Miami..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#161b22] border border-[#30363d] text-white rounded-md px-3 py-2 text-xs font-mono focus:border-[#00ff66] focus:ring-1 focus:ring-[#00ff66] outline-none placeholder:text-gray-600"
        />
      </div>
    </div>
  );
};
