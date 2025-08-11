export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
}

export function ChatMessageComponent({ message }: ChatMessageProps) {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-[16px] ${
          message.isUser 
            ? 'bg-[#0A84FF] text-[#ffffff]' 
            : 'bg-[#1e1f20] text-[#dcdcdc]'
        }`}
      >
        <div className="font-['REM:Regular',_sans-serif] text-[14px] leading-normal">
          {message.text}
        </div>
      </div>
    </div>
  );
}