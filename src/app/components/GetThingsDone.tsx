import React from 'react';
import { Trophy, Target, TrendingUp, Activity } from 'lucide-react';

interface GetThingsDoneProps {
  gamifyData: {
    tasksCompleted: number;
    streakDays: number;
    productivityScore: number;
    productivityTrend: number[];
  };
}

const GetThingsDone: React.FC<GetThingsDoneProps> = ({ gamifyData }) => {
  const generateChartPoints = (data: number[], width: number, height: number) => {
    const linePoints = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - (value / 100) * height;
      return `${x},${y}`;
    }).join(' ');

    const curvedLinePoints = `M${linePoints}`;
    const areaPoints = `${curvedLinePoints} L ${width},${height} L 0,${height} Z`;

    return { curvedLinePoints, areaPoints };
  };
  
  return (
    <div className="bg-solarized-base02 rounded-lg p-4 mb-8 relative overflow-hidden">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 150" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(38, 139, 210, 0.1)" />
            <stop offset="100%" stopColor="rgba(38, 139, 210, 0)" />
          </linearGradient>
        </defs>
        <path
          d={generateChartPoints(gamifyData.productivityTrend, 300, 150).areaPoints}
          fill="url(#gradient)"
        />
        <path
          d={generateChartPoints(gamifyData.productivityTrend, 300, 150).curvedLinePoints}
          fill="none"
          stroke="#268bd2"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-solarized-base1">Get Things Done</h2>
          <div className="flex space-x-2">
            <Trophy size={16} className="text-solarized-yellow" />
            <Target size={16} className="text-solarized-magenta" />
            <TrendingUp size={16} className="text-solarized-green" />
            <Activity size={16} className="text-solarized-cyan" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-solarized-base03 p-2 rounded">
            <p className="text-sm text-solarized-base1">Tasks</p>
            <p className="text-lg font-bold text-solarized-cyan">{gamifyData.tasksCompleted}</p>
          </div>
          <div className="bg-solarized-base03 p-2 rounded">
            <p className="text-sm text-solarized-base1">Streak</p>
            <p className="text-lg font-bold text-solarized-yellow">{gamifyData.streakDays}</p>
          </div>
          <div className="bg-solarized-base03 p-2 rounded">
            <p className="text-sm text-solarized-base1">Score</p>
            <p className="text-lg font-bold text-solarized-green">{gamifyData.productivityScore}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetThingsDone;