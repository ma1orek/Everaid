interface Suggestion {
  label: string;
  prompt: string;
}

interface SuggestionChipsProps {
  umbrella?: string;
  onSuggestion: (suggestion: Suggestion) => void;
  isVisible: boolean;
}

export function SuggestionChips({ umbrella, onSuggestion, isVisible }: SuggestionChipsProps) {
  const getSuggestionsForCategory = (umbrella?: string): Suggestion[] => {
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

  const suggestions = getSuggestionsForCategory(umbrella);

  if (!isVisible) return null;

  return (
    <div className="flex gap-2 justify-center">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestion(suggestion)}
          className="bg-[#2a2b2c] px-3 py-2 rounded-[16px] font-['REM:Regular',_sans-serif] text-[#8f8f8f] text-[13px] hover:bg-[#3a3b3c] transition-colors"
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}