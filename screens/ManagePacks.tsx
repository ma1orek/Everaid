import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, Search, Filter, Plus, Download, Edit3, Copy, Trash2, Share, ChevronDown } from "lucide-react";
import { mockPacks } from "../data/mock";
import { Pack, Umbrella } from "../data/models";
import { 
  getAllPacks, 
  getCustomPacks, 
  CustomPack, 
  savePackToDatabase,
  updatePackInDatabase,
  deletePackFromDatabase,
  deleteCustomPack,
  clearPacksCache
} from "../utils/packManager";
import { CategoryIcon } from "../components/icons/CategoryIcons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

interface ManagePacksProps {
  onNavigate: (screen: string, data?: any) => void;
}

type SortOption = "alphabetical-asc" | "alphabetical-desc" | "recent-added" | "recent-used" | "duration-short" | "duration-long";
type FilterCategory = "all" | "health" | "survive" | "fix" | "speak";
type FilterOrigin = "all" | "builtin" | "custom";

export function ManagePacks({ onNavigate }: ManagePacksProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical-asc");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterOrigin, setFilterOrigin] = useState<FilterOrigin>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPacks, setSelectedPacks] = useState<Set<string>>(new Set());
  const [allPacks, setAllPacks] = useState<(Pack | CustomPack)[]>([]);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showStickySearch, setShowStickySearch] = useState(false);
  const [showFullScreenSearch, setShowFullScreenSearch] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const loadAllPacks = async () => {
      try {
        console.log('🏠 ManagePacks: Loading all packs...');
        
        // Load all packs (database + custom)
        const allPacksFromDb = await getAllPacks();
        console.log('📦 ManagePacks: Loaded packs:', allPacksFromDb.length);
        
        setAllPacks(allPacksFromDb);
      } catch (error) {
        console.error('❌ Error loading packs in ManagePacks:', error);
        // Fallback to empty array
        setAllPacks([]);
      }
    };
    
    loadAllPacks();
  }, []);

  // Debounce search query
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 200);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Intersection Observer for sticky search
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickySearch(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const categoryNames = {
    HEALTH: "Health",
    SURVIVE: "Survive", 
    FIX: "Fix",
    SPEAK: "Speak"
  };

  const filteredPacks = allPacks.filter(pack => {
    // Search filter - use debounced query
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase().trim();
      const matchesTitle = pack.title.toLowerCase().includes(query);
      const matchesDescription = (pack.oneLiner || pack.description || "").toLowerCase().includes(query);
      const matchesCategory = pack.umbrella.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesCategory) {
        return false;
      }
    }

    // Category filter
    if (filterCategory !== "all" && pack.umbrella.toLowerCase() !== filterCategory) {
      return false;
    }

    // Origin filter
    if (filterOrigin !== "all") {
      const isCustom = 'isCustom' in pack && pack.isCustom;
      if (filterOrigin === "custom" && !isCustom) return false;
      if (filterOrigin === "builtin" && isCustom) return false;
    }

    return true;
  });

  const sortedPacks = [...filteredPacks].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical-asc":
        return a.title.localeCompare(b.title);
      case "alphabetical-desc":
        return b.title.localeCompare(a.title);
      case "duration-short":
        return a.etaMin - b.etaMin;
      case "duration-long":
        return b.etaMin - a.etaMin;
      case "recent-added":
      case "recent-used":
        // For demo purposes, just use alphabetical
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  const handlePackAction = async (pack: Pack | CustomPack, action: string) => {
    switch (action) {
      case "edit":
        onNavigate("pack-builder", { pack, mode: "edit" });
        break;
      case "duplicate":
        onNavigate("pack-builder", { pack, mode: "duplicate" });
        break;
      case "delete":
        await handleDeletePack(pack);
        break;
      case "export":
        // TODO: Implement export functionality
        break;
    }
  };

  const handleDeletePack = async (pack: Pack | CustomPack) => {
    try {
      const isCustom = 'isCustom' in pack && pack.isCustom;
      
      if (isCustom) {
        // Delete custom pack from localStorage
        deleteCustomPack(pack.id);
        console.log(`🗑️ Deleted custom pack: ${pack.title}`);
      } else {
        // Delete from database
        const success = await deletePackFromDatabase(pack.id);
        if (success) {
          console.log(`🗑️ Deleted database pack: ${pack.title}`);
          clearPacksCache(); // Clear cache to refresh
        } else {
          console.error(`❌ Failed to delete pack: ${pack.title}`);
          return;
        }
      }
      
      // Refresh pack list
      const updatedPacks = allPacks.filter(p => p.id !== pack.id);
      setAllPacks(updatedPacks);
      
    } catch (error) {
      console.error('❌ Error deleting pack:', error);
    }
  };

  const togglePackSelection = (packId: string) => {
    const newSelected = new Set(selectedPacks);
    if (newSelected.has(packId)) {
      newSelected.delete(packId);
    } else {
      newSelected.add(packId);
    }
    setSelectedPacks(newSelected);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilterCategory("all");
    setFilterOrigin("all");
  };

  const renderSearchBar = (isSticky = false) => (
    <div className={`${isSticky ? 'px-4' : ''}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search packs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1e1f20] text-white pl-10 pr-4 py-3 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="relative h-full bg-[#131314] text-white flex flex-col">
      {/* Header */}
      <div ref={headerRef} className="relative w-full bg-[#131314] px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate("settings")}
            className="p-2 -m-2"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-lg font-medium text-white">Manage Packs</h1>
          
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-4 pb-4 space-y-3 flex-shrink-0">
        {/* Search Bar */}
        {renderSearchBar()}

        {/* Filter and Sort Row */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 rounded-[20px] text-sm font-medium transition-all duration-200 h-10 ${
              showFilters 
                ? "bg-[#0A84FF] text-white" 
                : "bg-[#1e1f20] text-white hover:bg-[#2a2b2c]"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="bg-[#1e1f20] border-[#1e1f20] text-gray-400 font-medium text-sm hover:bg-[#2a2b2c] focus:ring-[#0A84FF]/50 focus:ring-2 focus:border-[#0A84FF] transition-colors h-10 px-4 rounded-[20px] [&>span]:text-gray-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1e1f20] border-[#2a2b2c] text-white min-w-[200px]">
              <SelectItem value="alphabetical-asc" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                A → Z
              </SelectItem>
              <SelectItem value="alphabetical-desc" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                Z → A
              </SelectItem>
              <SelectItem value="recent-added" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                Recently Added
              </SelectItem>
              <SelectItem value="recent-used" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                Recently Used
              </SelectItem>
              <SelectItem value="duration-short" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                Duration: Short → Long
              </SelectItem>
              <SelectItem value="duration-long" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                Duration: Long → Short
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Options - Animated */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showFilters ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-[#1e1f20] rounded-lg p-4 space-y-4 mt-3">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Category</label>
              <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value as FilterCategory)}>
                <SelectTrigger className="bg-[#131314] border-[#131314] text-gray-400 font-medium text-sm hover:bg-[#2a2b2c] focus:ring-[#0A84FF]/50 focus:ring-2 focus:border-[#0A84FF] transition-colors h-10 px-3 rounded-[20px] [&>span]:text-gray-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1f20] border-[#2a2b2c] text-white">
                  <SelectItem value="all" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    All Categories
                  </SelectItem>
                  <SelectItem value="health" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    Health
                  </SelectItem>
                  <SelectItem value="survive" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    Survive
                  </SelectItem>
                  <SelectItem value="fix" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    Fix
                  </SelectItem>
                  <SelectItem value="speak" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    Speak
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Origin</label>
              <Select value={filterOrigin} onValueChange={(value) => setFilterOrigin(value as FilterOrigin)}>
                <SelectTrigger className="bg-[#131314] border-[#131314] text-gray-400 font-medium text-sm hover:bg-[#2a2b2c] focus:ring-[#0A84FF]/50 focus:ring-2 focus:border-[#0A84FF] transition-colors h-10 px-3 rounded-[20px] [&>span]:text-gray-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1e1f20] border-[#2a2b2c] text-white">
                  <SelectItem value="all" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    All Packs
                  </SelectItem>
                  <SelectItem value="builtin" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    Built-in
                  </SelectItem>
                  <SelectItem value="custom" className="hover:bg-[#2a2b2c] focus:bg-[#0A84FF]/20 focus:text-white cursor-pointer">
                    Created by User
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Pack List */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-hide min-h-0">
        <div className="space-y-3 pb-32">
          {sortedPacks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No packs found</div>
              <div className="text-sm text-gray-500 mb-4">
                {debouncedQuery ? "Try adjusting your search" : "Try different filters"}
              </div>
              {(debouncedQuery || filterCategory !== "all" || filterOrigin !== "all") && (
                <button
                  onClick={clearSearch}
                  className="bg-[#1e1f20] hover:bg-[#2a2b2c] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            sortedPacks.map((pack, index) => {
              const isCustom = 'isCustom' in pack && pack.isCustom;
              return (
                <div 
                  key={pack.id} 
                  className="bg-[#1e1f20] rounded-lg p-4 hover:bg-[#2a2b2c] transition-colors"
                  style={{
                    animation: `slideInUp 0.15s ease-out ${index * 0.03}s both`
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h3 className="font-medium text-white">{pack.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{pack.oneLiner || pack.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <CategoryIcon category={pack.umbrella} size={12} active={true} />
                          <span className="text-xs text-white">{categoryNames[pack.umbrella as keyof typeof categoryNames]}</span>
                        </div>
                        <span className="text-xs text-gray-500 uppercase">{pack.urgency}</span>
                        <span className="text-xs text-gray-500">~{pack.etaMin} min</span>
                        {isCustom && (
                          <span className="px-2 py-1 bg-[#34C759]/10 text-[#34C759] text-xs rounded-full font-medium">
                            Custom
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-1 ml-4 pt-1">
                      <button
                        onClick={() => handlePackAction(pack, "edit")}
                        className="p-2 hover:bg-[#34343a] rounded-lg transition-colors"
                        title="Edit pack"
                      >
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handlePackAction(pack, "duplicate")}
                        className="p-2 hover:bg-[#34343a] rounded-lg transition-colors"
                        title="Duplicate pack"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => setShowShareSheet(true)}
                        className="p-2 hover:bg-[#34343a] rounded-lg transition-colors"
                        title="Share pack"
                      >
                        <Share className="w-4 h-4 text-gray-400" />
                      </button>
                      <button
                        onClick={() => handlePackAction(pack, "delete")}
                        className="p-2 hover:bg-[#34343a] rounded-lg transition-colors"
                        title="Delete pack"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Bottom Section with Gradient and Button - Ask EverAid Style */}
      <div className="absolute left-0 right-0 bottom-0 h-[120px] pointer-events-none">
        {/* Gradient Backdrop */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, #131314 0%, rgba(19, 19, 20, 0) 100%)'
        }} />

        {/* Create New Pack Button */}
        <div className="absolute bg-[#1e1f20] box-border content-stretch flex flex-row gap-2.5 items-center justify-center left-4 right-4 overflow-clip px-5 py-[19px] rounded-[40px] bottom-[24px] pointer-events-auto">
          <button 
            onClick={() => onNavigate("pack-builder", { mode: "create" })}
            className="font-['REM:Regular',_sans-serif] font-normal leading-[0] relative shrink-0 text-[#dcdcdc] text-[16px] text-left text-nowrap tracking-[1px] w-full flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="adjustLetterSpacing block leading-[normal] whitespace-pre">
              Create New Pack
            </span>
          </button>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
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
        
        @keyframes slide-down {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100%);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        
        .adjustLetterSpacing {
          letter-spacing: 1px;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .transition-all {
          transition: all 0.12s ease-out;
        }
        
        .duration-120 {
          transition-duration: 0.12s;
        }

      `}</style>

      {/* Sticky Search Bar */}
      {showStickySearch && (
        <div className="absolute top-0 left-0 right-0 bg-[#131314] bg-opacity-95 border-b border-[#2a2b2c] h-[60px] flex items-center z-40 transition-all duration-120 px-4">
          <div className="flex-1 flex items-center gap-3">
            <div className="flex-1">
              {renderSearchBar(true)}
            </div>
            <button
              onClick={() => setShowFullScreenSearch(true)}
              className="shrink-0 w-8 h-8 flex items-center justify-center hover:bg-[#2a2b2c] rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Search/Filters Overlay */}
      {showFullScreenSearch && (
        <>
          <div 
            className="absolute inset-0 bg-[#131314] z-50"
            onClick={() => setShowFullScreenSearch(false)}
          />
          
          <div className="absolute inset-0 bg-[#131314] z-50 flex flex-col">
            <div className="p-4 border-b border-[#2a2b2c]">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => setShowFullScreenSearch(false)}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <h2 className="font-medium text-white text-lg">Search & Filters</h2>
              </div>
              
              <div className="space-y-3">
                {renderSearchBar()}
                
                {/* Quick Filters */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setFilterCategory("all")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterCategory === "all" 
                        ? "bg-[#0A84FF] text-white" 
                        : "bg-[#1e1f20] text-gray-400 hover:bg-[#2a2b2c]"
                    }`}
                  >
                    All Categories
                  </button>
                  <button
                    onClick={() => setFilterCategory("health")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterCategory === "health" 
                        ? "bg-[#34C759] text-white" 
                        : "bg-[#1e1f20] text-gray-400 hover:bg-[#2a2b2c]"
                    }`}
                  >
                    Health
                  </button>
                  <button
                    onClick={() => setFilterCategory("survive")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterCategory === "survive" 
                        ? "bg-[#FF9F0A] text-white" 
                        : "bg-[#1e1f20] text-gray-400 hover:bg-[#2a2b2c]"
                    }`}
                  >
                    Survive
                  </button>
                  <button
                    onClick={() => setFilterCategory("fix")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterCategory === "fix" 
                        ? "bg-[#0A84FF] text-white" 
                        : "bg-[#1e1f20] text-gray-400 hover:bg-[#2a2b2c]"
                    }`}
                  >
                    Fix
                  </button>
                  <button
                    onClick={() => setFilterCategory("speak")}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filterCategory === "speak" 
                        ? "bg-[#00C7BE] text-white" 
                        : "bg-[#1e1f20] text-gray-400 hover:bg-[#2a2b2c]"
                    }`}
                  >
                    Speak
                  </button>
                </div>
              </div>
            </div>
            
            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {sortedPacks.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">No packs found</div>
                    <div className="text-sm text-gray-500 mb-4">
                      {debouncedQuery ? "Try adjusting your search" : "Try different filters"}
                    </div>
                    <button
                      onClick={clearSearch}
                      className="bg-[#1e1f20] hover:bg-[#2a2b2c] text-white px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  sortedPacks.map((pack, index) => {
                    const isCustom = 'isCustom' in pack && pack.isCustom;
                    return (
                      <div 
                        key={pack.id} 
                        className="bg-[#1e1f20] rounded-lg p-4 hover:bg-[#2a2b2c] transition-colors"
                        onClick={() => {
                          setShowFullScreenSearch(false);
                          // Navigate to pack details or edit
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2">
                              <h3 className="font-medium text-white">{pack.title}</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{pack.oneLiner || pack.description}</p>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <CategoryIcon category={pack.umbrella} size={12} active={true} />
                                <span className="text-xs text-white">{categoryNames[pack.umbrella as keyof typeof categoryNames]}</span>
                              </div>
                              <span className="text-xs text-gray-500 uppercase">{pack.urgency}</span>
                              <span className="text-xs text-gray-500">~{pack.etaMin} min</span>
                              {isCustom && (
                                <span className="px-2 py-1 bg-[#34C759]/10 text-[#34C759] text-xs rounded-full font-medium">
                                  Custom
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
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
    </div>
  );
}