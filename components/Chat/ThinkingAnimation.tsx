export function ThinkingAnimation() {
  return (
    <div className="flex items-center gap-2">
      <span className="font-['REM:Regular',_sans-serif] text-[14px] text-[#8f8f8f]">
        Thinking
      </span>
      <div className="flex gap-1">
        <div 
          className="w-1.5 h-1.5 bg-[#8f8f8f] rounded-full"
          style={{
            animation: 'thinking-pulse 1.4s ease-in-out infinite',
            animationDelay: '0ms'
          }}
        />
        <div 
          className="w-1.5 h-1.5 bg-[#8f8f8f] rounded-full"
          style={{
            animation: 'thinking-pulse 1.4s ease-in-out infinite',
            animationDelay: '200ms'
          }}
        />
        <div 
          className="w-1.5 h-1.5 bg-[#8f8f8f] rounded-full"
          style={{
            animation: 'thinking-pulse 1.4s ease-in-out infinite',
            animationDelay: '400ms'
          }}
        />
      </div>
    </div>
  );
}