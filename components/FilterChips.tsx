import { Umbrella } from "../data/models";
import svgPaths from "../imports/svg-l3ulnkoq78";

interface FilterChipsProps {
  selected: Set<Umbrella>;
  onToggle: (umbrella: Umbrella) => void;
}

export function FilterChips({ selected, onToggle }: FilterChipsProps) {
  const categories = [
    { key: "HEALTH" as Umbrella, label: "Health", iconPath: svgPaths.p7928780, color: "#34C759" },
    { key: "SURVIVE" as Umbrella, label: "Survive", iconPath: svgPaths.p1fcb4b80, color: "#FF9F0A" },
    { key: "FIX" as Umbrella, label: "Fix", iconPath: svgPaths.p3072b700, color: "#0A84FF" },
    { key: "SPEAK" as Umbrella, label: "Speak", iconPath: svgPaths.p32cee580, color: "#8F8F8F" }
  ];

  return (
    <div className="absolute box-border content-stretch flex flex-row gap-2 items-center justify-start left-[15px] p-0 top-[269px]">
      {categories.map(({ key, label, iconPath, color }) => {
        const isSelected = selected.has(key);
        const iconColor = isSelected ? color : "#8F8F8F";
        const textColor = isSelected ? "#ffffff" : "#8f8f8f";
        
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className="bg-[#1e1f20] box-border content-stretch flex flex-row gap-1.5 items-center justify-center px-3.5 py-3 relative rounded-[20px] shrink-0"
          >
            <div className="relative shrink-0 size-4">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                <path d={iconPath} fill={iconColor} />
              </svg>
            </div>
            <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[16px] text-center text-nowrap tracking-[-1px]" style={{ color: textColor }}>
              <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
                {label}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}