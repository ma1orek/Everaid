import { ArrowLeft, Settings as SettingsIcon, Package } from "lucide-react";

interface SettingsProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="relative h-full bg-[#131314] text-white overflow-hidden">
      {/* Header */}
      <div className="relative w-full bg-[#131314] px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate("home")}
            className="p-2 -m-2"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-lg font-medium text-white">Settings</h1>
          
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-8">
        <div className="space-y-4">
          {/* Manage Packs Section */}
          <button
            onClick={() => onNavigate("manage-packs")}
            className="w-full rounded-lg p-6 text-left hover:bg-[#2a2b2c] transition-colors"
            style={{
              background: 'linear-gradient(135deg, #1e1f20 0%, #2a2b2c 100%)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#131314] rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Manage Packs</h3>
                  <p className="text-sm text-gray-400 mt-1">Create, edit, sort, and organize your packs</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>

          {/* App & Profile Settings Section */}
          <button
            onClick={() => onNavigate("app-profile-settings")}
            className="w-full rounded-lg p-6 text-left hover:bg-[#2a2b2c] transition-colors"
            style={{
              background: 'linear-gradient(135deg, #1e1f20 0%, #2a2b2c 100%)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[#131314] rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-white">App & Profile Settings</h3>
                  <p className="text-sm text-gray-400 mt-1">App preferences, language, security, and user data</p>
                </div>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}