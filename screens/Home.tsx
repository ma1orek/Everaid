import { useState, useEffect, useRef } from "react";
import { KnowledgeBox } from "../components/KnowledgeBox";
import { SearchOverlay } from "../components/SearchOverlay";
import { mockPacks, shuffleArray } from "../data/mock";
import { Pack, Umbrella } from "../data/models";
import { getAllPacks, initializeDatabase } from "../utils/packManager";
import centeredSvg from "../imports/svg-centered";
import logoSvgPaths from "../imports/svg-tdzkwenj79";
import settingsIconPaths from "../imports/svg-1k9npr9zdy";
import svgPaths2 from "../imports/svg-w4xzugruwz";
import { toast } from "sonner@2.0.3";

interface HomeProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [selectedFilters, setSelectedFilters] = useState<Set<Umbrella>>(new Set());
  const [shuffledPacks, setShuffledPacks] = useState<Pack[]>([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showStickyFilters, setShowStickyFilters] = useState(false);
  const shuffledOnce = useRef(false);
  const filtersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPacks = async () => {
      try {
        if (!shuffledOnce.current) {
          console.log('🏠 Home: Loading packs for first time...');
          
          // Initialize database if needed
          const initResult = await initializeDatabase();
          console.log('🌱 Database initialization:', initResult.message);
          
          // Load all packs (database + custom)
          const allPacks = await getAllPacks();
          console.log('📦 Loaded packs:', allPacks.length);
          console.log('📦 First few packs:', allPacks.slice(0, 3));
          
          setShuffledPacks(shuffleArray(allPacks));
          shuffledOnce.current = true;
        }
      } catch (error) {
        console.error('❌ Error loading packs in Home:', error);
        // Fallback to empty array if loading fails
        setShuffledPacks([]);
      }
    };
    
    loadPacks();
  }, []);

  // Refresh packs when returning from pack builder
  useEffect(() => {
    const refreshPacks = async () => {
      try {
        console.log('🔄 Home: Refreshing packs...');
        const allPacks = await getAllPacks();
        setShuffledPacks(shuffleArray(allPacks));
      } catch (error) {
        console.error('❌ Error refreshing packs in Home:', error);
      }
    };
    
    refreshPacks();
  }, []);

  // Intersection Observer for sticky filters
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    
    const initializeObserver = () => {
      if (filtersRef.current && !observer) {
        observer = new IntersectionObserver(
          ([entry]) => {
            setShowStickyFilters(!entry.isIntersecting);
          },
          { 
            threshold: 0.1,
            rootMargin: '-68px 0px 0px 0px' // Account for header height
          }
        );
        observer.observe(filtersRef.current);
      }
    };

    const timeoutId = setTimeout(initializeObserver, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, []);

  // Filter logic for packs
  const filteredPacks = shuffledPacks.filter(pack => {
    if (selectedFilters.size > 0 && !selectedFilters.has(pack.umbrella || 'HEALTH')) {
      return false;
    }
    return true;
  });

  const handleFilterToggle = (umbrella: Umbrella) => {
    const newFilters = new Set(selectedFilters);
    if (newFilters.has(umbrella)) {
      newFilters.delete(umbrella);
    } else {
      newFilters.add(umbrella);
    }
    setSelectedFilters(newFilters);
  };

  const handlePackClick = (pack: Pack) => {
    onNavigate("chat", { pack });
  };

  const handleToggleOffline = (pack: Pack) => {
    // Update the pack's offline status
    const updatedPacks = shuffledPacks.map(p => 
      p.id === pack.id ? { ...p, isOffline: !p.isOffline } : p
    );
    setShuffledPacks(updatedPacks);
    
    // Show toast notification
    if (pack.isOffline) {
      toast.success(`"${pack.title}" removed from offline storage`);
    } else {
      toast.success(`"${pack.title}" downloaded for offline use`);
    }
    
    // TODO: Implement actual offline storage
    console.log(`Pack "${pack.title}" ${pack.isOffline ? 'removed from' : 'downloaded for'} offline use`);
  };

  const handleSharePack = (pack: Pack) => {
    // TODO: Implement QR share functionality
    toast.success(`Sharing "${pack.title}" pack...`);
    console.log(`Sharing pack: ${pack.title}`);
    
    // Navigate to QR share screen (when implemented)
    // onNavigate("qr-share", { pack });
  };

  const clearFilters = () => {
    setSelectedFilters(new Set());
  };

  const renderFilterChips = () => {
    const filters = [
      { key: "HEALTH" as Umbrella, label: "Health", iconPath: centeredSvg.p7928780, color: "#34C759" },
      { key: "SURVIVE" as Umbrella, label: "Survive", iconPath: centeredSvg.p1fcb4b80, color: "#FF9F0A" },
      { key: "FIX" as Umbrella, label: "Fix", iconPath: centeredSvg.p3072b700, color: "#0A84FF" },
      { key: "SPEAK" as Umbrella, label: "Speak", iconPath: centeredSvg.p32cee580, color: "#00C7BE" }
    ];

    return (
      <div className="flex items-center gap-2 px-4">
        {filters.map(({ key, label, iconPath, color }) => {
          const isSelected = selectedFilters.has(key);
          const iconColor = isSelected ? color : "#8F8F8F";
          const textColor = isSelected ? "#ffffff" : "#8f8f8f";
          
          return (
            <button
              key={key}
              onClick={() => handleFilterToggle(key)}
              className="bg-[#1e1f20] flex items-center justify-center gap-1.5 px-4 py-2 rounded-[20px] flex-1 min-h-[40px]"
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" preserveAspectRatio="xMidYMid meet">
                  <path d={iconPath} fill={iconColor} />
                </svg>
              </div>
              <div 
                className="font-['REM:Medium',_sans-serif] font-medium text-[16px] text-center text-nowrap tracking-[-1px] shrink-0" 
                style={{ color: textColor }}
              >
                <p className="adjustLetterSpacing block leading-[normal] whitespace-pre">
                  {label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#131314] relative w-full h-full overflow-hidden" data-name="Dashboard" style={{ height: '926px' }}>
      {/* Sticky Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-[#131314] h-[68px] border-b border-[#1e1f20]">
        <div className="flex items-center justify-between px-4 py-3 h-full">
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="[grid-area:1_/_1] h-6 ml-0 mt-[3px] relative w-[11px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 24">
                <path d={logoSvgPaths.p1973f3f0} fill="#FF6265" />
              </svg>
            </div>
            <div className="[grid-area:1_/_1] box-border content-stretch flex flex-row gap-2.5 items-center justify-start ml-[11px] mt-0 p-0 relative">
              <div className="font-['REM:SemiBold',_sans-serif] font-semibold leading-[0] relative shrink-0 text-[#ffffff] text-[24px] text-left text-nowrap">
                <p className="block leading-[normal] whitespace-pre">EverAid</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Search Icon */}
            <button 
              onClick={() => setShowSearchOverlay(true)}
              className="w-6 h-6 flex items-center justify-center"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#8F8F8F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* Settings Icon */}
            <button 
              onClick={() => onNavigate("settings")}
              className="relative shrink-0 size-6"
            >
              <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                <path d={settingsIconPaths.p12da2b80} fill="#8F8F8F" />
              </svg>
            </button>
            
            {/* Create Button */}
            <button
              onClick={() => setShowActionSheet(true)}
              className="bg-[#1e1f20] rounded-full shrink-0 size-10 grid place-items-center"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" preserveAspectRatio="xMidYMid meet">
                <path d={svgPaths2.p3ad56700} fill="white" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Filter Chips */}
      <div 
        className={`absolute left-0 right-0 z-20 bg-[#131314] transition-all duration-200 ${
          showStickyFilters ? 'top-[68px] py-3 border-b border-[#1e1f20] opacity-100' : 'top-[68px] py-0 border-b border-transparent opacity-0 pointer-events-none'
        }`}
      >
        {renderFilterChips()}
      </div>

      {/* Scrollable Content */}
      <div 
        className="absolute top-[68px] left-0 right-0 bottom-0 overflow-y-scroll scrollbar-hide"
        style={{ height: 'calc(926px - 68px)' }}
      >
        {/* Hero Section */}
        <div className="px-4 pt-6 pb-4">
          <div className="font-['REM:Bold',_sans-serif] font-bold text-[36px] leading-[42px] text-[#ffffff] mb-3">
            <span className="adjustLetterSpacing">{`How can I help `}</span>
            <span className="adjustLetterSpacing">you today?</span>
          </div>
          <div className="font-['REM:Regular',_sans-serif] font-normal text-[16px] text-[#b5b6ba] tracking-[-1px] mb-4">
            <p className="adjustLetterSpacing leading-[normal]">
              Pick a pack or tap "Ask EverAid"
            </p>
          </div>
        </div>

        {/* Original Filter Chips */}
        <div ref={filtersRef} className="pb-4">
          {renderFilterChips()}
        </div>

        {/* Knowledge Packs Grid */}
        <div className="px-4 pb-40">
          <div className="grid grid-cols-2 gap-4">
            {filteredPacks.length === 0 && selectedFilters.size > 0 ? (
              <div className="col-span-2">
                <div className="bg-[#1e1f20] rounded-[20px] p-6 text-center">
                  <div className="font-['REM:Regular',_sans-serif] text-[#8f8f8f] text-[16px] mb-4">
                    No packs found for selected categories.
                  </div>
                  <button
                    onClick={clearFilters}
                    className="bg-[#131314] hover:bg-[#2a2b2c] text-[#ffffff] px-4 py-2 rounded-[12px] font-['REM:Medium',_sans-serif] text-[14px] transition-colors"
                  >
                    Clear filters
                  </button>
                </div>
              </div>
            ) : (
              filteredPacks.map((pack, index) => (
                <div
                  key={pack.id}
                  className="flex justify-center animate-fade-in-down"
                  style={{
                    animation: `fadeInDown 0.22s ease-out ${index * 0.04}s both`
                  }}
                >
                  <KnowledgeBox 
                    pack={pack} 
                    onClick={handlePackClick} 
                    onToggleOffline={handleToggleOffline}
                    onShare={handleSharePack}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sticky Ask EverAid Button */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-[120px] pointer-events-none">
        {/* Gradient Backdrop */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #131314 0%, #131314 30%, rgba(19, 19, 20, 0.8) 70%, rgba(19, 19, 20, 0) 100%)'
        }} />
        
        {/* Ask EverAid Button */}
        <div className="absolute bg-[#1e1f20] flex items-center justify-center left-4 right-4 px-5 py-[19px] rounded-[40px] bottom-[24px] pointer-events-auto">
          <button 
            onClick={() => onNavigate("chat", { prefill: "" })}
            className="font-['REM:Regular',_sans-serif] font-normal text-[#dcdcdc] text-[16px] tracking-[1px] w-full"
          >
            <p className="adjustLetterSpacing block leading-[normal] whitespace-pre text-center">
              Ask EverAid
            </p>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        packs={shuffledPacks}
        selectedFilters={selectedFilters}
        onPackClick={handlePackClick}
        onToggleOffline={handleToggleOffline}
        onShare={handleSharePack}
      />

      {/* Action Sheet */}
      {showActionSheet && (
        <>
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 z-50"
            onClick={() => setShowActionSheet(false)}
          />
          
          {/* Action Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#1e1f20] rounded-t-[20px] p-6 animate-slide-up z-50">
            <div className="w-12 h-1 bg-[#8f8f8f] rounded-full mx-auto mb-6" />
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowActionSheet(false);
                  onNavigate("pack-builder");
                }}
                className="w-full flex items-center gap-4 p-4 text-left text-[#ffffff] hover:bg-[#2a2b2c] rounded-[12px] transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                    <path d={svgPaths2.p3ad56700} fill="#ffffff" />
                  </svg>
                </div>
                <div>
                  <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[16px]">Create Pack</div>
                  <div className="font-['REM:Regular',_sans-serif] text-[14px] text-[#8f8f8f]">Build a new emergency guide</div>
                </div>
              </button>
              

              
              <button
                onClick={() => {
                  setShowActionSheet(false);
                  // TODO: Implement QR scan
                }}
                className="w-full flex items-center gap-4 p-4 text-left text-[#ffffff] hover:bg-[#2a2b2c] rounded-[12px] transition-colors"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg className="block size-full" fill="none" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                    <path d="M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H9V11M15,11H17V13H15V11M19,5H21V9H19V5M5,5H9V9H5V5M3,19H5V21H3V19M5,19H9V21H5V19M11,19H13V21H11V19M15,19H21V21H15V19M19,11H21V15H19V11M5,3H9V5H5V3M11,3H13V5H11V3M19,3H21V5H19V3M3,5H5V9H3V5" fill="#ffffff" />
                  </svg>
                </div>
                <div>
                  <div className="font-['REM:SemiBold',_sans-serif] font-semibold text-[16px]">Scan QR</div>
                  <div className="font-['REM:Regular',_sans-serif] text-[14px] text-[#8f8f8f]">Import from QR tiles</div>
                </div>
              </button>
            </div>
            
            <button
              onClick={() => setShowActionSheet(false)}
              className="w-full mt-6 p-4 text-[#8f8f8f] hover:bg-[#2a2b2c] rounded-[12px] transition-colors font-['REM:Regular',_sans-serif] text-[16px]"
            >
              Cancel
            </button>
          </div>
        </>
      )}

      <style jsx>{`        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 0.2s ease-out;
        }
        
        .adjustLetterSpacing {
          letter-spacing: -1px;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}