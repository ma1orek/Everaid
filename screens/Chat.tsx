import { useState, useEffect, useRef } from "react";
import { ArrowLeft, MoreVertical, HardDrive, Download } from "lucide-react";
import { Pack } from "../data/models";
import { mockSteps } from "../data/mock";
import { getPackSteps } from "../utils/packManager";
import svgPaths from "../imports/svg-l3ulnkoq78";
import centeredSvg from "../imports/svg-centered";
import sendSvgPaths from "../imports/svg-4binxeigtk";
import { toast } from "sonner@2.0.3";
import { askEverAidWithContext } from "../utils/aiClient";
import { FormattedMessage } from "../components/Chat/FormattedMessage";
import { ThinkingAnimation } from "../components/Chat/ThinkingAnimation";

interface ChatProps {
  onNavigate: (screen: string, data?: any) => void;
  initialPack?: Pack;
  prefill?: string;
}

interface GuideState {
  stepIndex: number;
  timers: Record<number, number>;
  isFinished: boolean;
  activeTimers: Record<number, boolean>;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function Chat({ onNavigate, initialPack, prefill }: ChatProps) {
  const [currentPack, setCurrentPack] = useState<Pack | null>(initialPack || null);
  const [guideState, setGuideState] = useState<GuideState>({
    stepIndex: 0,
    timers: {},
    isFinished: false,
    activeTimers: {}
  });
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [currentInput, setCurrentInput] = useState(prefill || "");
  const [isAISending, setIsAISending] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Dynamic suggestions based on pack category
  const getSuggestionsForCategory = (umbrella?: string) => {
    const QUICK_CHIPS = {
      HEALTH: [
        { label: "I don't have it", prompt: "I don't have the required item. Give a safe alternative for THIS step only. 1–2 options, very brief." },
        { label: "It hurts more", prompt: "Symptoms are worsening. What immediate adjustment should I make for THIS step? Two short actions." },
        { label: "When to stop", prompt: "Give a clear stop rule for THIS step and when to seek help. One sentence." }
      ],
      SURVIVE: [
        { label: "Bad weather", prompt: "Adapt THIS step for bad weather (rain/wind/snow). List 2 concrete changes." },
        { label: "Low light", prompt: "Night or low visibility. How do I adjust THIS step safely? Keep it brief." },
        { label: "No gear", prompt: "I'm missing the needed gear. Safe workaround for THIS step? 1–2 options." }
      ],
      FIX: [
        { label: "No tool/part", prompt: "I'm missing the tool/part. Is there a safe workaround for THIS step? If not, say 'don't do it'." },
        { label: "Temporary fix", prompt: "Give a safe temporary fix for THIS step until proper repair is possible. One or two lines." },
        { label: "Safety check", prompt: "List the essential safety checks before/while doing THIS step. 2 bullets." }
      ],
      SPEAK: [
        { label: "Say it slower", prompt: "Provide a slower, spaced version of THIS phrase for clarity." },
        { label: "Polite version", prompt: "Polite/softer version of THIS phrase, same meaning." },
        { label: "Phonetics", prompt: "Give simple Latin-letter phonetics for THIS phrase, no extra text." }
      ]
    };
    
    return QUICK_CHIPS[umbrella as keyof typeof QUICK_CHIPS] || [
      { label: "I don't have it", prompt: "I don't have the required item. What can I use instead?" },
      { label: "It's raining", prompt: "How do I adapt this for bad weather?" },
      { label: "Why this step?", prompt: "Can you explain why this step is important?" }
    ];
  };
  
  const suggestions = getSuggestionsForCategory(currentPack?.umbrella);
  
  // Get steps data - check both mock and database/custom packs
  const [stepsData, setStepsData] = useState(null);
  
  useEffect(() => {
    const loadStepsData = async () => {
      if (!currentPack) {
        setStepsData(null);
        return;
      }
      
      // First check mock data
      if (mockSteps[currentPack.id]) {
        setStepsData(mockSteps[currentPack.id]);
        return;
      }
      
      // Then check database/custom packs
      const steps = await getPackSteps(currentPack.id);
      setStepsData(steps);
    };
    
    loadStepsData();
  }, [currentPack]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);
  
  const getUmbrellaIcon = (umbrella?: string) => {
    switch (umbrella) {
      case 'HEALTH': return { path: centeredSvg.p7928780, color: '#34C759' };
      case 'SURVIVE': return { path: centeredSvg.p1fcb4b80, color: '#FF9F0A' };
      case 'FIX': return { path: centeredSvg.p3072b700, color: '#0A84FF' };
      case 'SPEAK': return { path: centeredSvg.p32cee580, color: '#00C7BE' };
      default: return { path: centeredSvg.p7928780, color: '#34C759' };
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'emergency': return '#FF6265';
      case 'warning': return '#FFB162';
      case 'info': return '#8F8F8F';
      default: return '#8F8F8F';
    }
  };

  const icon = getUmbrellaIcon(currentPack?.umbrella);
  
  const nextStep = () => {
    if (stepsData && guideState.stepIndex < stepsData.steps.length - 1) {
      setGuideState(prev => ({ ...prev, stepIndex: prev.stepIndex + 1 }));
    }
  };

  const prevStep = () => {
    if (guideState.stepIndex > 0) {
      setGuideState(prev => ({ ...prev, stepIndex: prev.stepIndex - 1 }));
    }
  };

  const finishGuide = () => {
    setGuideState(prev => ({ ...prev, isFinished: true }));
  };

  const startTimer = (stepIndex: number, duration: number) => {
    if (guideState.activeTimers[stepIndex]) return; // Timer already running
    
    setGuideState(prev => ({
      ...prev,
      timers: { ...prev.timers, [stepIndex]: duration },
      activeTimers: { ...prev.activeTimers, [stepIndex]: true }
    }));

    const interval = setInterval(() => {
      setGuideState(prev => {
        const currentTime = prev.timers[stepIndex];
        if (currentTime <= 1) {
          clearInterval(interval);
          return {
            ...prev,
            timers: { ...prev.timers, [stepIndex]: 0 },
            activeTimers: { ...prev.activeTimers, [stepIndex]: false }
          };
        }
        return {
          ...prev,
          timers: { ...prev.timers, [stepIndex]: currentTime - 1 }
        };
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (seconds: number, isActive: boolean) => {
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

  const sendMessage = async () => {
    if (!currentInput.trim() || isAISending) return;
    
    const userText = currentInput;
    setCurrentInput("");
    setIsAISending(true);
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: userText,
      isUser: true,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Add thinking bubble
    const thinkingMessage: ChatMessage = {
      id: `thinking-${Date.now()}`,
      text: "THINKING_ANIMATION",
      isUser: false,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, thinkingMessage]);
    
    try {
      // Prepare pack context if available
      const packContext = (currentPack && stepsData) ? {
        title: currentPack.title,
        category: currentPack.umbrella || 'HEALTH',
        urgency: currentPack.urgency || 'info',
        steps: stepsData.steps || [],
        currentStepIndex: guideState.stepIndex
      } : undefined;
      
      const reply = await askEverAidWithContext(userText, packContext);
      
      // Remove thinking bubble and add AI response
      setChatMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: reply || "Sorry, I couldn't find a safe answer for that.",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      // Remove thinking bubble and add error message
      setChatMessages(prev => prev.filter(msg => msg.id !== thinkingMessage.id));
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "AI is unavailable. Try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      
      console.error(e);
    } finally {
      setIsAISending(false);
    }
  };

  const handleSuggestion = (suggestion: { label: string; prompt: string }) => {
    setCurrentInput(suggestion.prompt);
  };

  const handleToggleOffline = () => {
    if (!currentPack) return;
    
    const updatedPack = { ...currentPack, isOffline: !currentPack.isOffline };
    setCurrentPack(updatedPack);
    
    // Show toast notification
    if (currentPack.isOffline) {
      toast.success(`"${currentPack.title}" removed from offline storage`);
    } else {
      toast.success(`"${currentPack.title}" downloaded for offline use`);
    }
    
    // TODO: Implement actual offline storage
    console.log(`Pack "${currentPack.title}" ${currentPack.isOffline ? 'removed from' : 'downloaded for'} offline use`);
    setShowActionMenu(false);
  };

  return (
    <div className="bg-[#131314] relative size-full overflow-hidden">
      {/* Header */}
      <div className="absolute box-border content-stretch flex flex-row items-center justify-between left-4 p-0 top-[16px] w-[396px] z-50">
        <button 
          onClick={() => onNavigate("home")}
          className="relative shrink-0 size-6"
        >
          <ArrowLeft size={24} color="#ffffff" />
        </button>
        
        <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[18px] text-left">
          <p className="block leading-[normal]">EverAid</p>
        </div>

        <button 
          onClick={() => setShowActionMenu(true)}
          className="relative shrink-0 size-6"
        >
          <MoreVertical size={24} color="#8F8F8F" />
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-col h-full relative">
        {/* Spacer for header */}
        <div className="h-[64px] shrink-0" />
        
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 min-h-0">
          <div className="space-y-6 pt-2 pb-4" style={{ paddingBottom: '120px' }}>
            {currentPack && stepsData ? (
              <>
                {/* Guide Block */}
                <div className="bg-[#1e1f20] rounded-[20px] p-4 space-y-4 relative z-30">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 grid place-items-center">
                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" preserveAspectRatio="xMidYMid meet">
                          <path d={icon.path} fill={icon.color} />
                        </svg>
                      </div>
                      <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px]">
                        {currentPack.title}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  {currentPack.detailedDescription && (
                    <div className="font-['REM:Regular',_sans-serif] text-[#dcdcdc] text-[16px] leading-normal">
                      {currentPack.detailedDescription}
                    </div>
                  )}

                  {/* Chips */}
                  <div className="flex gap-2">
                    <div className="bg-[#131314] px-3 py-1 rounded-full">
                      <span 
                        className="font-['REM:Medium',_sans-serif] font-medium text-[12px] uppercase"
                        style={{ color: getUrgencyColor(currentPack.urgency) }}
                      >
                        {currentPack.urgency}
                      </span>
                    </div>
                    <div className="bg-[#131314] px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="font-['REM:Medium',_sans-serif] font-medium text-[#8f8f8f] text-[12px]">
                        ~{currentPack.etaMin} MIN
                      </span>
                      {currentPack.isOffline && (
                        <HardDrive className="w-3 h-3 text-[#34C759]" />
                      )}
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-3">
                    {stepsData.steps.map((step, index) => (
                      <div 
                        key={index}
                        className={`flex gap-3 p-3 rounded-[12px] ${
                          index === guideState.stepIndex ? 'bg-[#131314]' : 'bg-transparent'
                        }`}
                      >
                        <div 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-medium ${
                            index === guideState.stepIndex 
                              ? 'bg-[#ffffff] text-[#131314]' 
                              : index < guideState.stepIndex 
                                ? 'bg-[#34C759] text-[#ffffff]'
                                : 'bg-[#2a2b2c] text-[#8f8f8f]'
                          }`}
                        >
                          {index < guideState.stepIndex ? '✓' : index + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[16px]">
                            {step.title}
                          </div>
                          <div className="font-['REM:Regular',_sans-serif] text-[#dcdcdc] text-[16px] leading-normal">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Control Bar */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#2a2b2c] relative z-40">
                    <button
                      onClick={prevStep}
                      disabled={guideState.stepIndex === 0}
                      className="px-4 py-2 rounded-[12px] bg-[#131314] text-[#ffffff] font-['REM:Medium',_sans-serif] font-medium text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2a2b2c] transition-colors"
                    >
                      Back
                    </button>
                    
                    <div className="flex gap-3">
                      {stepsData.steps[guideState.stepIndex]?.timerSec && (
                        <button
                          onClick={() => startTimer(guideState.stepIndex, stepsData.steps[guideState.stepIndex].timerSec!)}
                          disabled={guideState.activeTimers[guideState.stepIndex]}
                          className={`px-4 py-2 rounded-[12px] font-['REM:Medium',_sans-serif] font-medium text-[14px] ${
                            getTimerColor(
                              guideState.timers[guideState.stepIndex] || 0, 
                              guideState.activeTimers[guideState.stepIndex] || false
                            )
                          } transition-colors`}
                        >
                          {guideState.activeTimers[guideState.stepIndex] 
                            ? formatTime(guideState.timers[guideState.stepIndex] || 0)
                            : 'Start Timer'
                          }
                        </button>
                      )}
                      <button
                        onClick={() => console.log('Read aloud')}
                        className="px-4 py-2 rounded-[12px] bg-[#131314] text-[#ffffff] font-['REM:Medium',_sans-serif] font-medium text-[14px]"
                      >
                        Read Aloud
                      </button>
                    </div>

                    {guideState.stepIndex === stepsData.steps.length - 1 ? (
                      <button
                        onClick={finishGuide}
                        className="px-4 py-2 rounded-[12px] bg-[#34C759] text-[#ffffff] font-['REM:Medium',_sans-serif] font-medium text-[14px]"
                      >
                        Done
                      </button>
                    ) : (
                      <button
                        onClick={nextStep}
                        className="px-4 py-2 rounded-[12px] bg-[#131314] text-[#ffffff] font-['REM:Medium',_sans-serif] font-medium text-[14px]"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>

                {/* Emergency disclaimer for Health/Survive */}
                {(currentPack.umbrella === 'HEALTH' || currentPack.umbrella === 'SURVIVE') && (
                  <div className="bg-[#2a1f1f] border border-[#4a2626] rounded-[12px] p-3">
                    <div className="font-['REM:Regular',_sans-serif] text-[#ff9999] text-[13px] text-center">
                      Not medical advice. In emergencies, contact local services if possible.
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#1e1f20] rounded-[20px] p-4">
                <div className="text-center space-y-2">
                  <div className="font-['REM:Regular',_sans-serif] font-normal text-[#dcdcdc] text-[16px] leading-normal">
                    What's going on? I'll walk you through it.
                  </div>
                  <div className="font-['REM:Regular',_sans-serif] font-normal text-[#8f8f8f] text-[14px] leading-normal">
                    Short, step-by-step answers. Works offline.
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div 
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-4 rounded-[16px] ${
                      message.isUser 
                        ? 'bg-[#0A84FF] text-[#ffffff] rounded-br-[6px]' 
                        : 'bg-[#1e1f20] text-[#dcdcdc] rounded-bl-[6px]'
                    }`}
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      hyphens: 'auto'
                    }}
                  >
                    {message.text === "THINKING_ANIMATION" ? (
                      <ThinkingAnimation />
                    ) : (
                      <FormattedMessage text={message.text} isUser={message.isUser} />
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="shrink-0 relative">
          {/* Bottom Input Area */}
          <div className="absolute left-4 right-4 bottom-[16px] space-y-3 z-30">
            {/* Suggestion Chips */}
            {currentPack && !guideState.isFinished && (
              <div className="flex gap-2 justify-center">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestion(suggestion)}
                    className="bg-[#2a2b2c] px-3 py-2 rounded-[16px] font-['REM:Regular',_sans-serif] text-[#8f8f8f] text-[13px] hover:bg-[#3a3b3c] transition-colors"
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Bar */}
            <div className="bg-[#1e1f20] box-border content-stretch flex flex-row gap-2.5 items-center justify-between overflow-clip px-5 py-[19px] rounded-[40px]">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Describe the situation…"
                className="bg-transparent font-['REM:Regular',_sans-serif] font-normal text-[#dcdcdc] text-[16px] flex-1 outline-none placeholder-[#8f8f8f]"
                disabled={isAISending}
                maxLength={1000}
              />
              <button 
                onClick={sendMessage}
                disabled={!currentInput.trim() || isAISending}
                className="bg-[#131314] rounded-full p-2 hover:bg-[#2a2b2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="relative shrink-0 size-5">
                  {isAISending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                      <path d={sendSvgPaths.pa41fe00} fill="#ffffff" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
        
        @keyframes thinking-pulse {
          0%, 20% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        
        .animate-thinking {
          animation: thinking-pulse 1.4s ease-in-out infinite;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Action Menu - positioned within container bounds */}
      {showActionMenu && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 z-50"
            onClick={() => setShowActionMenu(false)}
          />
          
          {/* Action Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#1e1f20] rounded-t-[20px] p-6 animate-slide-up z-50">
            <div className="w-12 h-1 bg-[#8f8f8f] rounded-full mx-auto mb-6" />
            
            <div className="space-y-4">
              {currentPack && (
                <>
                  <button
                    onClick={handleToggleOffline}
                    className="w-full flex items-center gap-4 p-4 text-left text-[#ffffff] hover:bg-[#2a2b2c] rounded-[12px] transition-colors"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      {currentPack.isOffline ? (
                        <Download className="w-6 h-6 text-[#ffffff]" />
                      ) : (
                        <HardDrive className="w-6 h-6 text-[#ffffff]" />
                      )}
                    </div>
                    <div>
                      <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[16px]">
                        {currentPack.isOffline ? 'Remove offline' : 'Download for offline'}
                      </div>
                      <div className="font-['REM:Regular',_sans-serif] text-[14px] text-[#8f8f8f]">
                        {currentPack.isOffline ? 'Remove from offline storage' : 'Save for offline use'}
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowActionMenu(false);
                      setShowShareSheet(true);
                    }}
                    className="w-full flex items-center gap-4 p-4 text-left text-[#ffffff] hover:bg-[#2a2b2c] rounded-[12px] transition-colors"
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" fill="#ffffff" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[16px]">Share Pack</div>
                      <div className="font-['REM:Regular',_sans-serif] text-[14px] text-[#8f8f8f]">Send to another device</div>
                    </div>
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={() => setShowActionMenu(false)}
              className="w-full mt-6 p-4 text-[#8f8f8f] hover:bg-[#2a2b2c] rounded-[12px] transition-colors font-['REM:Regular',_sans-serif] text-[16px]"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Share Sheet */}
      {showShareSheet && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 z-50"
            onClick={() => setShowShareSheet(false)}
          />
          
          {/* Share Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#1e1f20] rounded-t-[20px] p-6 animate-slide-up z-50">
            <div className="w-12 h-1 bg-[#8f8f8f] rounded-full mx-auto mb-6" />
            
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center mx-auto mb-3">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z" fill="#8f8f8f" />
                  </svg>
                </div>
                <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px] mb-1">Share Pack</div>
                <div className="font-['REM:Regular',_sans-serif] text-[14px] text-[#8f8f8f]">Send to another device</div>
              </div>
            </div>
            
            <button
              onClick={() => setShowShareSheet(false)}
              className="w-full mt-6 p-4 text-[#8f8f8f] hover:bg-[#2a2b2c] rounded-[12px] transition-colors font-['REM:Regular',_sans-serif] text-[16px]"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      {/* Gradient Overlay - positioned over the bottom area */}
      <div className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none" style={{
        background: 'linear-gradient(to top, #131314 0%, #131314 30%, rgba(19, 19, 20, 0.8) 70%, rgba(19, 19, 20, 0) 100%)',
        zIndex: 25
      }} />
    </div>
  );
}