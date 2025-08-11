export interface TimerState {
  timers: Record<number, number>;
  activeTimers: Record<number, boolean>;
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getTimerColor = (seconds: number, isActive: boolean): string => {
  if (!isActive) {
    return 'bg-[#131314] text-[#ffffff] hover:bg-[#2a2b2c]';
  }
  
  if (seconds <= 10) {
    // Emergency state - red text (ostatnie 10 sekund)
    return 'bg-[#131314] text-[#FF6265]';
  } else if (seconds <= 30) {
    // Warning state - orange text (ostatnie 30 sekund) 
    return 'bg-[#131314] text-[#FFB162]';
  } else {
    // Normal active state - white text (powyżej 30 sekund)
    return 'bg-[#131314] text-[#ffffff]';
  }
};

interface TimerButtonProps {
  stepIndex: number;
  duration: number;
  timers: Record<number, number>;
  activeTimers: Record<number, boolean>;
  onStartTimer: (stepIndex: number, duration: number) => void;
}

export function TimerButton({ stepIndex, duration, timers, activeTimers, onStartTimer }: TimerButtonProps) {
  const isActive = activeTimers[stepIndex] || false;
  const currentTime = timers[stepIndex] || 0;

  return (
    <button
      onClick={() => onStartTimer(stepIndex, duration)}
      disabled={isActive}
      className={`px-4 py-2 rounded-[12px] font-['REM:Medium',_sans-serif] font-medium text-[14px] ${
        getTimerColor(currentTime, isActive)
      } transition-colors`}
    >
      {isActive ? formatTime(currentTime) : 'Start Timer'}
    </button>
  );
}