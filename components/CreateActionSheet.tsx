import React from 'react';
import { Plus, FileText, Download, QrCode, X } from 'lucide-react';

interface CreateActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePack: () => void;
  onScanQR: () => void;
}

export function CreateActionSheet({ 
  isOpen, 
  onClose, 
  onCreatePack, 
  onScanQR 
}: CreateActionSheetProps) {
  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
        style={{ maxWidth: '428px', marginLeft: 'auto', marginRight: 'auto' }}
      />
      
      {/* Action Sheet */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e1f20] rounded-t-[20px] animate-slide-up"
        style={{ maxWidth: '428px', marginLeft: 'auto', marginRight: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2C323A]">
          <div className="font-['REM:Medium',_sans-serif] font-medium text-[18px] text-white">
            Create
          </div>
          <button
            onClick={onClose}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors duration-120"
            aria-label="Close"
          >
            <X className="w-[20px] h-[20px] text-white" />
          </button>
        </div>

        {/* Actions */}
        <div className="p-4 pb-8">
          <div className="space-y-2">
            {/* Create Pack */}
            <button
              onClick={() => handleAction(onCreatePack)}
              className="w-full flex items-center gap-4 p-4 rounded-[16px] hover:bg-white/5 transition-colors duration-120"
            >
              <div className="w-10 h-10 rounded-full bg-[#0A84FF]/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#0A84FF]" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-['REM:Medium',_sans-serif] font-medium text-[16px] text-white">
                  Create Pack
                </div>
                <div className="font-['REM:Regular',_sans-serif] font-normal text-[14px] text-[#b5b6ba] mt-1">
                  Build a new emergency knowledge pack
                </div>
              </div>
            </button>



            {/* Scan QR */}
            <button
              onClick={() => handleAction(onScanQR)}
              className="w-full flex items-center gap-4 p-4 rounded-[16px] hover:bg-white/5 transition-colors duration-120"
            >
              <div className="w-10 h-10 rounded-full bg-[#FF9F0A]/20 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-[#FF9F0A]" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-['REM:Medium',_sans-serif] font-medium text-[16px] text-white">
                  Scan QR Code
                </div>
                <div className="font-['REM:Regular',_sans-serif] font-normal text-[14px] text-[#b5b6ba] mt-1">
                  Import pack from QR code
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
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
      `}</style>
    </>
  );
}