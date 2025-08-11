interface FormattedMessageProps {
  text: string;
  isUser: boolean;
}

export function FormattedMessage({ text, isUser }: FormattedMessageProps) {
  if (isUser) {
    // User messages don't need special formatting
    return (
      <div className="font-['REM:Regular',_sans-serif] text-[14px] leading-normal">
        {text}
      </div>
    );
  }

  // Format AI responses
  const formatText = (text: string) => {
    // Split into lines first, then process paragraphs
    let lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // If no lines, return the original text
    if (lines.length === 0) {
      return [<div key={0}>{formatInlineText(text)}</div>];
    }
    
    // Group consecutive lines into paragraphs, but keep numbered steps separate
    const blocks: string[] = [];
    let currentBlock = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if it's a numbered step or bullet point
      const isStep = /^\d+\.\s/.test(line);
      const isBullet = /^[-•]\s/.test(line);
      
      if (isStep || isBullet) {
        // Push current block if it exists
        if (currentBlock.trim()) {
          blocks.push(currentBlock.trim());
          currentBlock = '';
        }
        // Add the step/bullet as its own block
        blocks.push(line);
      } else {
        // Regular text - add to current block
        if (currentBlock) {
          currentBlock += ' ' + line;
        } else {
          currentBlock = line;
        }
      }
    }
    
    // Don't forget the last block
    if (currentBlock.trim()) {
      blocks.push(currentBlock.trim());
    }
    
    return blocks.map((block, pIndex) => {
      // Check if it's a numbered step (starts with number and dot)
      const numberedStepMatch = block.match(/^(\d+)\.\s*(.+)/s);
      if (numberedStepMatch) {
        const [, number, content] = numberedStepMatch;
        return (
          <div key={pIndex} className="mb-3 last:mb-0">
            <div className="flex gap-3 items-start">
              <span className="bg-[#0A84FF] text-white text-[12px] font-['REM:SemiBold',_sans-serif] rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                {number}
              </span>
              <div className="flex-1 min-w-0">
                {formatInlineText(content)}
              </div>
            </div>
          </div>
        );
      }
      
      // Check if it's a bullet point
      if (block.match(/^[-•]\s+/)) {
        const content = block.replace(/^[-•]\s+/, '');
        return (
          <div key={pIndex} className="mb-2 last:mb-0">
            <div className="flex gap-3 items-start">
              <span className="text-[#8f8f8f] mt-1 text-[14px] shrink-0">•</span>
              <div className="flex-1 min-w-0">
                {formatInlineText(content)}
              </div>
            </div>
          </div>
        );
      }
      
      // Regular paragraph - break long text appropriately
      return (
        <div key={pIndex} className="mb-3 last:mb-0">
          {formatInlineText(block)}
        </div>
      );
    });
  };

  const formatInlineText = (text: string) => {
    // Split by **bold** patterns
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    
    return parts.map((part, index) => {
      // Check if this part is bold
      const boldMatch = part.match(/^\*\*(.+)\*\*$/);
      if (boldMatch) {
        return (
          <span key={index} className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff]">
            {boldMatch[1]}
          </span>
        );
      }
      
      // Handle line breaks within text
      const lines = part.split('–');
      if (lines.length > 1) {
        return (
          <span key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <><br />– </>}
                {line.trim()}
              </span>
            ))}
          </span>
        );
      }
      
      return <span key={index} className="break-words">{part}</span>;
    });
  };

  return (
    <div className="font-['REM:Regular',_sans-serif] text-[14px] leading-relaxed text-[#dcdcdc]">
      {formatText(text)}
    </div>
  );
}