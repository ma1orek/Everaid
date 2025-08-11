import { CATEGORY_OPTIONS, URGENCY_OPTIONS } from "./constants";
import { PackData } from "./helpers";

interface PreviewCardProps {
  packData: PackData;
}

export function PreviewCard({ packData }: PreviewCardProps) {
  const categoryOption = CATEGORY_OPTIONS.find(cat => cat.value === packData.umbrella);
  const urgencyOption = URGENCY_OPTIONS.find(urg => urg.value === packData.urgency);
  
  return (
    <div className="bg-[#1e1f20] h-[214px] overflow-clip relative rounded-[20px] w-full">
      <div className="absolute font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] left-[11px] right-[11px] text-[#ffffff] text-[16px] text-left top-[19px]">
        <p className="block leading-[normal] truncate">{packData.title || "Pack Title"}</p>
      </div>
      <div className="absolute font-['REM:Light',_sans-serif] font-light leading-[0] left-[11px] right-[11px] text-[#dcdcdc] text-[13px] text-left top-[51px]">
        <p className="block leading-[normal] line-clamp-2">{packData.oneLiner || "One-liner description..."}</p>
      </div>
      
      {/* Chips */}
      <div className="absolute box-border content-stretch flex flex-row gap-[5px] items-center justify-start left-[11px] p-0 top-[95px]">
        {urgencyOption && (
          <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
            <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[10px] text-left text-nowrap uppercase" style={{ color: urgencyOption.color }}>
              <p className="block leading-[normal] whitespace-pre">{urgencyOption.label}</p>
            </div>
          </div>
        )}
        <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 relative rounded-[60px] shrink-0">
          <div className="font-['REM:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#8f8f8f] text-[10px] text-left text-nowrap">
            <p className="block leading-[normal] whitespace-pre">~{packData.etaMin} MIN</p>
          </div>
        </div>
      </div>
      
      {/* Bottom row with icon and CTA */}
      <div className="absolute bottom-[11px] left-[11px] right-[11px] flex items-center justify-between">
        {/* Icon */}
        <div className="bg-[#131314] rounded-full size-10 grid place-items-center shrink-0">
          {categoryOption && (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" preserveAspectRatio="xMidYMid meet">
              <path d={categoryOption.iconPath} fill={categoryOption.color} />
            </svg>
          )}
        </div>

        {/* CTA */}
        <div className="bg-[#131314] box-border content-stretch flex flex-row gap-1.5 h-10 items-center justify-center px-3.5 py-3 rounded-[20px] flex-1 ml-3">
          <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-1px] truncate">
            <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
              {packData.cta || "Action"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}