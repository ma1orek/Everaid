import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Pack, Umbrella } from '../data/models';
import { KnowledgeBox } from './KnowledgeBox';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  packs: Pack[];
  selectedFilters: Set<Umbrella>;
  onPackClick: (pack: Pack) => void;
  onToggleOffline?: (pack: Pack) => void;
  onShare?: (pack: Pack) => void;
}

export function SearchOverlay({ isOpen, onClose, packs, selectedFilters, onPackClick, onToggleOffline, onShare }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Debounce search query
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = undefined;
    }
    
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      debounceTimer.current = undefined;
    }, 200);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = undefined;
      }
    };
  }, [searchQuery]);

  // Auto-focus when overlay opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Filter packs based on search and active categories
  const filteredPacks = packs.filter(pack => {
    // Filter by active categories
    if (selectedFilters.size > 0 && !selectedFilters.has(pack.umbrella)) {
      return false;
    }

    // Filter by search query
    if (debouncedQuery.trim()) {
      const query = debouncedQuery.toLowerCase();
      const searchableFields = [
        pack.title || '',
        pack.oneLiner || '',
        pack.cta || ''
      ];
      
      const searchableText = searchableFields.join(' ').toLowerCase();
      return searchableText.includes(query);
    }

    return true;
  });

  const clearSearch = () => {
    setSearchQuery("");
    setDebouncedQuery("");
  };

  const handlePackClick = (pack: Pack) => {
    onPackClick(pack);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#131314] flex flex-col"
      style={{ 
        maxWidth: '428px', 
        height: '100vh',
        maxHeight: '926px',
        marginLeft: 'auto', 
        marginRight: 'auto',
        width: '100%'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#2C323A] shrink-0">
        <div className="font-['REM:Medium',_sans-serif] font-medium text-[18px] text-white">
          Search
        </div>
        <button
          onClick={onClose}
          className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-120"
          aria-label="Close"
        >
          <X className="w-[20px] h-[20px] text-white" />
        </button>
      </div>

      {/* Search Input - matching ManagePacks styling */}
      <div className="px-4 py-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packs..."
            className="w-full bg-[#1e1f20] text-white pl-10 pr-4 py-3 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-white transition-colors"
              type="button"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-hide">
        {filteredPacks.length > 0 ? (
          <div 
            className="grid gap-4 pb-8"
            style={{
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              maxWidth: '100%'
            }}
          >
            {filteredPacks.map((pack) => (
              <div
                key={pack.id}
                className="flex justify-center"
              >
                <KnowledgeBox
                  pack={pack}
                  onClick={() => handlePackClick(pack)}
                  onToggleOffline={onToggleOffline}
                  onShare={onShare}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[#1e1f20] flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <div className="font-['REM:Medium',_sans-serif] font-medium text-[16px] text-white mb-2">
              No results
            </div>
            <div className="font-['REM:Regular',_sans-serif] font-normal text-[14px] text-[#b5b6ba] max-w-[240px]">
              Try other keywords or clear filters
            </div>
            {(debouncedQuery || selectedFilters.size > 0) && (
              <button
                onClick={() => {
                  clearSearch();
                  // Note: We can't clear filters here as they're managed by parent
                }}
                className="mt-4 px-4 py-2 bg-[#1e1f20] text-white rounded-[20px] hover:bg-[#2a2b2c] transition-colors duration-120"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
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