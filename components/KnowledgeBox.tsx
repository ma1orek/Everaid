import { Pack } from "../data/models";
import svgPaths from "../imports/svg-l3ulnkoq78";
import centeredSvg from "../imports/svg-centered";
import { MoreHorizontal, Download, HardDrive, Share } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useState } from "react";

interface KnowledgeBoxProps {
  pack: Pack;
  onClick?: (pack: Pack) => void;
  onTap?: (pack: Pack) => void;
  onToggleOffline?: (pack: Pack) => void;
  onShare?: (pack: Pack) => void;
}

export function KnowledgeBox({ pack, onClick, onTap, onToggleOffline, onShare }: KnowledgeBoxProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const getUmbrellaIcon = (umbrella: string) => {
    switch (umbrella) {
      case 'HEALTH': return { path: centeredSvg.p7928780, color: '#34C759' };
      case 'SURVIVE': return { path: centeredSvg.p1fcb4b80, color: '#FF9F0A' };
      case 'FIX': return { path: centeredSvg.p3072b700, color: '#0A84FF' };
      case 'SPEAK': return { path: centeredSvg.p32cee580, color: '#00C7BE' };
      default: return { path: centeredSvg.p7928780, color: '#34C759' };
    }
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return { color: '#ff6265', bg: '#131314' };
      case 'warning': return { color: '#ffb162', bg: '#131314' };
      case 'info': return { color: '#8f8f8f', bg: '#131314' };
      default: return { color: '#8f8f8f', bg: '#131314' };
    }
  };

  const icon = getUmbrellaIcon(pack.umbrella || 'HEALTH');
  const urgencyStyle = getUrgencyStyle(pack.urgency || 'info');

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on menu
    if ((e.target as HTMLElement).closest('[data-menu-trigger]')) {
      return;
    }
    (onClick || onTap)?.(pack);
  };

  const handleToggleOffline = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleOffline?.(pack);
    setMenuOpen(false);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(pack);
    setMenuOpen(false);
  };

  return (
    <div 
      className="bg-[#1e1f20] h-[214px] overflow-clip relative rounded-[20px] shrink-0 cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] p-4 flex flex-col"
      style={{
        width: '190px',
        maxWidth: 'calc(50vw - 24px)', // Responsive max-width for mobile
        minWidth: '160px' // Ensure minimum readable width
      }}
      onClick={handleCardClick}
    >
      {/* 3-dot menu */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button 
              data-menu-trigger
              className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#2a2b2c] transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4 text-[#8f8f8f]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-[#2a2b2c] border-[#3a3b3c] min-w-[160px]"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem 
              onClick={handleToggleOffline}
              className="text-[#dcdcdc] focus:bg-[#3a3b3c] focus:text-[#dcdcdc]"
            >
              {pack.isOffline ? (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Remove offline
                </>
              ) : (
                <>
                  <HardDrive className="w-4 h-4 mr-2" />
                  Download offline
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleShare}
              className="text-[#dcdcdc] focus:bg-[#3a3b3c] focus:text-[#dcdcdc]"
            >
              <Share className="w-4 h-4 mr-2" />
              Share pack
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Title - Dynamic height with line-clamp, padding to avoid 3-dot overlap */}
      <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[16px] mb-2 pr-8">
        <p className="block leading-[20px] line-clamp-2">{pack.title || 'Untitled Pack'}</p>
      </div>

      {/* Description - Consistent gap from title, padding to avoid 3-dot overlap */}
      <div className="font-['REM:Light',_sans-serif] font-light text-[#dcdcdc] text-[13px] mb-4 pr-8">
        <p className="block leading-[18px] line-clamp-2">{pack.oneLiner || 'Emergency guide'}</p>
      </div>

      {/* Chips Row - Auto positioned */}
      <div className="flex flex-row gap-[5px] items-center mb-4">
        {/* Urgency Chip */}
        <div className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center px-2.5 py-2 rounded-[60px] shrink-0" style={{ backgroundColor: urgencyStyle.bg }}>
          <div className="font-['REM:Medium',_sans-serif] font-medium text-[10px]" style={{ color: urgencyStyle.color }}>
            <p className="block leading-[normal] whitespace-pre">{(pack.urgency || 'info').toUpperCase()}</p>
          </div>
        </div>
        {/* ETA Chip with offline indicator */}
        <div className="bg-[#131314] box-border content-stretch flex flex-row gap-2 items-center justify-center px-2.5 py-2 rounded-[60px] shrink-0">
          <div className="font-['REM:Medium',_sans-serif] font-medium text-[#8f8f8f] text-[10px]">
            <p className="block leading-[normal] whitespace-pre">~{pack.etaMin || 10} MIN</p>
          </div>
          {pack.isOffline && (
            <HardDrive className="w-3 h-3 text-[#34C759]" />
          )}
        </div>
      </div>

      {/* Bottom row with icon and CTA - Auto positioned at bottom */}
      <div className="mt-auto flex items-center justify-between">
        {/* Round icon (left) */}
        <div className="bg-[#131314] rounded-full size-10 grid place-items-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" preserveAspectRatio="xMidYMid meet">
            <path d={icon.path} fill={icon.color} />
          </svg>
        </div>

        {/* CTA Button */}
        <div className="bg-[#131314] box-border content-stretch flex flex-row gap-1.5 h-10 items-center justify-center px-3.5 py-3 rounded-[20px] w-[122px]">
          <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[14px] text-center text-nowrap tracking-[-1px]">
            <p className="adjustLetterSpacing block leading-[51px] whitespace-pre">
              {pack.cta || 'Get Started'}
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        
        .adjustLetterSpacing {
          letter-spacing: -1px;
        }
      `}</style>
    </div>
  );
}