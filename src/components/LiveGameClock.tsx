import React, { useState, useEffect } from 'react';

interface LiveGameClockProps {
  initialTimeMetric: string;
  sport: string;
}

export const LiveGameClock: React.FC<LiveGameClockProps> = ({ initialTimeMetric, sport }) => {
  // Parse clock or inning
  const [display, setDisplay] = useState(initialTimeMetric);

  useEffect(() => {
    // Check if it's a soccer clock like "68:51 Live Ticker" or "54:10 Live Ticker"
    const soccerMatch = initialTimeMetric.match(/(\d+):(\d+)/);
    // Check if it's an NBA clock like "Q3 04:12" or "Q4 02:45"
    const nbaMatch = initialTimeMetric.match(/(Q\d)\s*(\d+):(\d+)/);

    if (soccerMatch && (sport.toUpperCase().includes('SOCCER') || initialTimeMetric.includes('Live Ticker'))) {
      let minute = parseInt(soccerMatch[1], 10);
      let second = parseInt(soccerMatch[2], 10);

      const interval = setInterval(() => {
        second += 1;
        if (second >= 60) {
          second = 0;
          minute += 1;
        }
        if (minute >= 95) {
          setDisplay('FT (Full Time)');
          clearInterval(interval);
        } else {
          setDisplay(`${minute}:${second < 10 ? '0' : ''}${second} Live Ticker`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    if (nbaMatch && sport.toUpperCase().includes('NBA')) {
      const q = nbaMatch[1];
      let minute = parseInt(nbaMatch[2], 10);
      let second = parseInt(nbaMatch[3], 10);

      const interval = setInterval(() => {
        if (minute === 0 && second === 0) {
          setDisplay(`${q} 00:00 Final`);
          clearInterval(interval);
          return;
        }
        second -= 1;
        if (second < 0) {
          second = 59;
          minute -= 1;
        }
        setDisplay(`${q} ${minute < 10 ? '0' : ''}${minute}:${second < 10 ? '0' : ''}${second}`);
      }, 1000);

      return () => clearInterval(interval);
    }

    // Default fallback
    setDisplay(initialTimeMetric);
  }, [initialTimeMetric, sport]);

  return (
    <span className="flex items-center gap-1.5 text-rose-400 font-mono font-semibold">
      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
      {display}
    </span>
  );
};
