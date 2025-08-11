import { StepsBlock as StepsBlockType } from "../data/models";
import { Play, Volume2, Check, Timer, AlertTriangle } from "lucide-react";

interface StepsBlockProps {
  steps: StepsBlockType;
  index?: number;
  onStartTimer?: () => void;
  onReadAloud?: () => void;
  onDone?: () => void;
  onEscalate?: () => void;
}

export function StepsBlock({ steps, index = 0, onStartTimer, onReadAloud, onDone, onEscalate }: StepsBlockProps) {
  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return { color: '#ff6265', bg: '#131314' };
      case 'warning': return { color: '#ffb162', bg: '#131314' };
      case 'info': return { color: '#8f8f8f', bg: '#131314' };
      default: return { color: '#8f8f8f', bg: '#131314' };
    }
  };

  const urgencyStyle = getUrgencyStyle(steps.urgency);
  const isEmergency = steps.urgency === 'emergency';

  return (
    <div 
      className="bg-[#1e1f20] rounded-[20px] p-4 mb-4 relative"
      style={{
        animation: `slideInUp 0.22s ease-out ${index * 0.04}s both`
      }}
    >
      {/* Emergency accent stripe */}
      {isEmergency && (
        <div 
          className="absolute top-0 left-0 right-0 h-1 rounded-t-[20px] bg-[#ff6265]"
          style={{
            animation: 'emergencyGlow 1.6s ease-in-out infinite alternate'
          }}
        />
      )}

      {/* Header */}
      <div className="mb-4">
        <h2 className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px] mb-2">
          {steps.title}
        </h2>
        
        <div className="flex flex-row gap-2 items-center mb-2">
          <div 
            className="px-2.5 py-1 rounded-[60px]"
            style={{ backgroundColor: urgencyStyle.bg }}
          >
            <span 
              className="font-['REM:Medium',_sans-serif] font-medium text-[10px] uppercase"
              style={{ color: urgencyStyle.color }}
            >
              {steps.urgency.toUpperCase()}
            </span>
          </div>
          <div className="bg-[#131314] px-2.5 py-1 rounded-[60px]">
            <span className="font-['REM:Medium',_sans-serif] font-medium text-[#8f8f8f] text-[10px] uppercase">
              ~{steps.etaMin} MIN
            </span>
          </div>
        </div>

        {steps.source && (
          <div className="font-['REM:Light',_sans-serif] text-[12px] text-[#8f8f8f]">
            Source: {steps.source}
          </div>
        )}
      </div>

      {/* Steps List */}
      <div className="space-y-3 mb-4">
        {steps.steps.map((step, stepIndex) => (
          <div 
            key={stepIndex} 
            className="flex flex-row gap-3"
            style={{
              animation: `stepCascade 0.22s ease-out ${stepIndex * 0.04}s both`
            }}
          >
            <div 
              className="flex-shrink-0 rounded-full flex items-center justify-center bg-[#34C759]"
              style={{
                width: '24px',
                height: '24px'
              }}
            >
              <span className="text-white font-['REM:SemiBold',_sans-serif] font-semibold text-[12px]">
                {stepIndex + 1}
              </span>
            </div>
            <div className="flex-1">
              <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[16px] mb-1">
                {step.title}
              </div>
              <div className="font-['REM:Light',_sans-serif] text-[#dcdcdc] text-[14px] leading-normal">
                {step.desc}
              </div>
              {step.timerSec && (
                <div className="mt-1 flex items-center gap-1 text-[#8f8f8f] text-[12px]">
                  <Timer size={12} />
                  {Math.floor(step.timerSec / 60)}:{(step.timerSec % 60).toString().padStart(2, '0')} timer available
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row gap-2 flex-wrap">
        <button 
          onClick={onStartTimer}
          className="bg-[#0A84FF] flex flex-row gap-2 items-center px-4 py-2 rounded-[20px] min-h-[48px] transition-transform active:scale-[0.98]"
        >
          <Timer size={16} className="text-white" />
          <span className="text-white font-['REM:SemiBold',_sans-serif] font-semibold text-[14px]">
            Start Timer
          </span>
        </button>
        
        <button 
          onClick={onReadAloud}
          className="bg-[#131314] flex flex-row gap-2 items-center px-4 py-2 rounded-[20px] min-h-[48px] transition-transform active:scale-[0.98]"
        >
          <Volume2 size={16} className="text-white" />
          <span className="text-white font-['REM:SemiBold',_sans-serif] font-semibold text-[14px]">
            Read Aloud
          </span>
        </button>

        <button 
          onClick={onDone}
          className="bg-[#34C759] flex flex-row gap-2 items-center px-4 py-2 rounded-[20px] min-h-[48px] transition-transform active:scale-[0.98]"
        >
          <Check size={16} className="text-white" />
          <span className="text-white font-['REM:SemiBold',_sans-serif] font-semibold text-[14px]">
            Done
          </span>
        </button>

        {isEmergency && (
          <button 
            onClick={onEscalate}
            className="bg-[#ff6265] flex flex-row gap-2 items-center px-4 py-2 rounded-[20px] min-h-[48px] transition-transform active:scale-[0.98]"
          >
            <AlertTriangle size={16} className="text-white" />
            <span className="text-white font-['REM:SemiBold',_sans-serif] font-semibold text-[14px]">
              Escalate
            </span>
          </button>
        )}
      </div>

      <style jsx>{`
        @keyframes emergencyGlow {
          from { opacity: 0.6; }
          to { opacity: 1.0; }
        }
        
        @keyframes stepCascade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}