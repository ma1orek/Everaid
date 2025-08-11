import { useState } from "react";
import { Button } from "./ui/button";

interface QRModalProps {
  qrTiles: string[];
  title: string;
  onClose: () => void;
}

export function QRModal({ qrTiles, title, onClose }: QRModalProps) {
  const [currentTile, setCurrentTile] = useState(0);

  return (
    <div className="absolute inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute inset-4 bg-[#1e1f20] rounded-[20px] p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-['REM:SemiBold',_sans-serif] font-semibold text-[#ffffff] text-[18px]">
              Share {title}
            </h3>
            <p className="font-['REM:Regular',_sans-serif] text-[#8f8f8f] text-[14px] mt-1">
              Scan QR tiles in order
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#2a2b2c] text-[#8f8f8f]"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-['REM:Medium',_sans-serif] font-medium text-[#ffffff] text-[14px]">
              Tile {currentTile + 1} of {qrTiles.length}
            </span>
            <span className="font-['REM:Regular',_sans-serif] text-[#8f8f8f] text-[12px]">
              Hold for 2s per tile
            </span>
          </div>
          <div className="flex gap-1">
            {qrTiles.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${
                  index <= currentTile ? "bg-[#ffffff]" : "bg-[#2a2b2c]"
                }`}
              />
            ))}
          </div>
        </div>

        {/* QR Code Area */}
        <div className="flex-1 flex items-center justify-center mb-6">
          <div className="bg-white p-8 rounded-[16px] max-w-full max-h-full flex items-center justify-center">
            <div className="font-mono text-black text-[8px] break-all max-w-[280px] max-h-[280px] overflow-hidden">
              {qrTiles[currentTile]}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            onClick={() => setCurrentTile(Math.max(0, currentTile - 1))}
            disabled={currentTile === 0}
            className="flex-1 bg-[#131314] hover:bg-[#2a2b2c] text-[#ffffff] rounded-[12px] h-11 font-['REM:Regular',_sans-serif] disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentTile(Math.min(qrTiles.length - 1, currentTile + 1))}
            disabled={currentTile === qrTiles.length - 1}
            className="flex-1 bg-[#131314] hover:bg-[#2a2b2c] text-[#ffffff] rounded-[12px] h-11 font-['REM:Regular',_sans-serif] disabled:opacity-50"
          >
            Next
          </Button>
        </div>

        {/* Note */}
        <p className="font-['REM:Regular',_sans-serif] text-[#8f8f8f] text-[12px] text-center mt-4">
          Receiver should scan all tiles in order using "Scan QR" in the + menu
        </p>
      </div>
    </div>
  );
}