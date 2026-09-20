import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SparklineProps {
  data: number[];
  trend: 'STEAM_UP' | 'STEAM_DOWN' | 'STABLE';
  width?: number;
  height?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  trend,
  width = 60,
  height = 20
}) => {
  if (!data || data.length < 2) {
    return <span className="text-gray-600 text-[10px]">--</span>;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min === 0 ? 1 : max - min;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * (width - 4) + 2;
      const y = height - 3 - ((val - min) / range) * (height - 6);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const strokeColor =
    trend === 'STEAM_UP'
      ? '#00ff66'
      : trend === 'STEAM_DOWN'
      ? '#f43f5e'
      : '#38bdf8';

  const badgeConfig = {
    STEAM_UP: { label: 'STEAM', icon: TrendingUp, color: 'text-[#00ff66] bg-[#00ff66]/10 border-[#00ff66]/30' },
    STEAM_DOWN: { label: 'DRIFT', icon: TrendingDown, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    STABLE: { label: 'HOLD', icon: Minus, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' }
  }[trend];

  const Icon = badgeConfig.icon;

  return (
    <div className="flex items-center gap-1.5" title={`Recent movement: ${data.join(' → ')}`}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {/* End pulse circle */}
        {data.length > 0 && (
          <circle
            cx={(width - 2).toString()}
            cy={(height - 3 - ((data[data.length - 1] - min) / range) * (height - 6)).toFixed(1)}
            r="2"
            fill={strokeColor}
          />
        )}
      </svg>
      <span
        className={`px-1 py-0.2 text-[9px] font-mono font-bold rounded border flex items-center gap-0.5 ${badgeConfig.color}`}
      >
        <Icon className="w-2.5 h-2.5" />
        {badgeConfig.label}
      </span>
    </div>
  );
};
