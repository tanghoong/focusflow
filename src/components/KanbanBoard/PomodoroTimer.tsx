import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

const PomodoroTimer: React.FC = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  useEffect(() => {
    // Load saved state from localStorage
    const loadSavedState = () => {
      const savedTime = localStorage.getItem('pomodoroTime');
      const savedIsActive = localStorage.getItem('pomodoroIsActive');
      const savedLastUpdateTime = localStorage.getItem('pomodoroLastUpdateTime');

      if (savedTime) setTime(parseInt(savedTime, 10));
      if (savedIsActive) setIsActive(savedIsActive === 'true');
      if (savedLastUpdateTime) setLastUpdateTime(parseInt(savedLastUpdateTime, 10));
    };

    loadSavedState();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdateTime) / 1000);
      const newTime = Math.max(0, time - elapsed);
      setTime(newTime);
      setLastUpdateTime(now);

      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = Math.max(0, prevTime - 1);
          localStorage.setItem('pomodoroTime', newTime.toString());
          return newTime;
        });
        setLastUpdateTime(Date.now());
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      alert('Pomodoro session completed!');
    }

    localStorage.setItem('pomodoroIsActive', isActive.toString());
    localStorage.setItem('pomodoroLastUpdateTime', lastUpdateTime.toString());

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, lastUpdateTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60);
    localStorage.setItem('pomodoroTime', (25 * 60).toString());
  };

  const adjustTime = (minutes: number) => {
    setTime((prevTime) => {
      const newTime = Math.max(0, prevTime + minutes * 60);
      localStorage.setItem('pomodoroTime', newTime.toString());
      return newTime;
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-solarized-base02 p-2 rounded-lg flex items-center space-x-2">
      <button
        onClick={() => adjustTime(-5)}
        className="bg-solarized-cyan text-solarized-base3 p-1 rounded-full hover:bg-opacity-80 transition-colors"
        aria-label="Decrease time by 5 minutes"
      >
        <Minus size={14} />
      </button>
      <div className="w-16 text-center">
        <span className="text-base font-bold text-solarized-base1">{formatTime(time)}</span>
      </div>
      <button
        onClick={() => adjustTime(5)}
        className="bg-solarized-cyan text-solarized-base3 p-1 rounded-full hover:bg-opacity-80 transition-colors"
        aria-label="Increase time by 5 minutes"
      >
        <Plus size={14} />
      </button>
      <button
        onClick={toggleTimer}
        className="bg-solarized-blue text-solarized-base3 p-1 rounded-full hover:bg-opacity-80 transition-colors"
        aria-label={isActive ? "Pause timer" : "Start timer"}
      >
        {isActive ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button
        onClick={resetTimer}
        className="bg-solarized-red text-solarized-base3 p-1 rounded-full hover:bg-opacity-80 transition-colors"
        aria-label="Reset timer"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
};

export default PomodoroTimer;