import svgPaths from "../../imports/svg-4ve1u6zlcw";
import ChatBubble from "../../imports/ChatBubble-21-230";

interface CategoryIconProps {
  category: "HEALTH" | "SURVIVE" | "FIX" | "SPEAK";
  size?: number;
  active?: boolean;
}

export function CategoryIcon({ category, size = 24, active = true }: CategoryIconProps) {
  const iconMap = {
    HEALTH: svgPaths.p354d1d00,
    SURVIVE: svgPaths.p2ada3880,
    FIX: svgPaths.p15a55000,
    SPEAK: svgPaths.p32cee580
  };

  const getColor = () => {
    if (!active) return '#9AA0A6'; // Text50
    
    switch (category) {
      case 'HEALTH': return '#34C759';
      case 'SURVIVE': return '#FF9F0A';
      case 'FIX': return '#0A84FF';
      case 'SPEAK': return '#00C7BE';
      default: return '#9AA0A6';
    }
  };

  // Use ChatBubble component for SPEAK category
  if (category === 'SPEAK') {
    return (
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ChatBubble />
      </div>
    );
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <path
          d={iconMap[category]}
          fill={getColor()}
        />
      </svg>
    </div>
  );
}