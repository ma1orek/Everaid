import React from 'react';
import { Search, Plus, Settings } from 'lucide-react';

interface TopBarProps {
  onSearchClick: () => void;
  onCreateClick: () => void;
  onSettingsClick: () => void;
}

export function TopBar({ onSearchClick, onCreateClick, onSettingsClick }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[44px] flex items-center justify-between px-4" 
         style={{
           background: 'rgba(16, 18, 21, 0.94)',
           backdropFilter: 'saturate(120%) blur(8px)',
           WebkitBackdropFilter: 'saturate(120%) blur(8px)',
           borderBottom: '1px solid #2C323A',
           maxWidth: '428px',
           marginLeft: 'auto',
           marginRight: 'auto'
         }}>
      
      {/* Logo */}
      <div className="font-['REM:Bold',_sans-serif] font-bold text-[18px] text-white">
        EverAid
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button
          onClick={onSearchClick}
          className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-120"
          aria-label="Search"
        >
          <Search className="w-[20px] h-[20px] text-white" />
        </button>

        {/* Create - with subtle border */}
        <button
          onClick={onCreateClick}
          className="w-[44px] h-[44px] flex items-center justify-center rounded-full border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-120"
          aria-label="Create"
        >
          <Plus className="w-[20px] h-[20px] text-white" />
        </button>

        {/* Settings */}
        <button
          onClick={onSettingsClick}
          className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-120"
          aria-label="Settings"
        >
          <Settings className="w-[20px] h-[20px] text-white" />
        </button>
      </div>
    </div>
  );
}