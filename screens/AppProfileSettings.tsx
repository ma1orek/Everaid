import { useState } from "react";
import { ArrowLeft, User, Shield, Palette, Globe, Database, Info, Moon, Sun, Smartphone } from "lucide-react";
import { Switch } from "../components/ui/switch";

interface AppProfileSettingsProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function AppProfileSettings({ onNavigate }: AppProfileSettingsProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [pinEnabled, setPinEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [textSize, setTextSize] = useState("medium");

  const settingsSections = [
    {
      title: "User Info",
      icon: User,
      color: "#34C759",
      items: [
        {
          type: "input",
          label: "Display Name",
          value: "Anonymous User",
          placeholder: "Enter your name"
        },
        {
          type: "button",
          label: "Profile Avatar",
          value: "Tap to change avatar",
          action: () => {}
        }
      ]
    },
    {
      title: "Security",
      icon: Shield,
      color: "#FF9F0A",
      items: [
        {
          type: "switch",
          label: "Enable PIN Lock",
          description: "Require PIN to open app",
          value: pinEnabled,
          onChange: setPinEnabled
        },
        {
          type: "switch",
          label: "Biometric Unlock",
          description: "Use fingerprint or face recognition",
          value: biometricEnabled,
          onChange: setBiometricEnabled
        }
      ]
    },
    {
      title: "Appearance",
      icon: Palette,
      color: "#0A84FF",
      items: [
        {
          type: "switch",
          label: "Dark Mode",
          description: "Use dark theme",
          value: darkMode,
          onChange: setDarkMode
        },
        {
          type: "select",
          label: "Text Size",
          value: textSize,
          options: [
            { value: "small", label: "Small" },
            { value: "medium", label: "Medium" },
            { value: "large", label: "Large" }
          ],
          onChange: setTextSize
        }
      ]
    },
    {
      title: "Language",
      icon: Globe,
      color: "#00C7BE",
      items: [
        {
          type: "select",
          label: "Pack Language",
          value: selectedLanguage,
          options: [
            { value: "english", label: "English" },
            { value: "spanish", label: "Español" },
            { value: "french", label: "Français" },
            { value: "german", label: "Deutsch" },
            { value: "polish", label: "Polski" }
          ],
          onChange: setSelectedLanguage
        }
      ]
    },
    {
      title: "Data Management",
      icon: Database,
      color: "#FF6B6B",
      items: [
        {
          type: "button",
          label: "Export All Data",
          value: "Backup packs and settings",
          action: () => {}
        },
        {
          type: "button",
          label: "Import Data",
          value: "Restore from backup file",
          action: () => {}
        },
        {
          type: "button",
          label: "Reset to Defaults",
          value: "Clear all data and settings",
          action: () => {},
          destructive: true
        }
      ]
    }
  ];

  const aboutItems = [
    { label: "App Version", value: "1.0.0" },
    { label: "Build", value: "2024.08.08" },
    { label: "Platform", value: "React Native/Expo" }
  ];

  return (
    <div className="relative h-full bg-[#131314] text-white overflow-hidden">
      {/* Header */}
      <div className="relative w-full bg-[#131314] px-4 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate("settings")}
            className="p-2 -m-2"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          
          <h1 className="text-lg font-medium text-white">App & Profile Settings</h1>
          
          <div className="w-6 h-6" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => {
            const IconComponent = section.icon;
            return (
              <div key={sectionIndex} className="bg-[#1e1f20] rounded-lg overflow-hidden">
                {/* Section Header */}
                <div className="flex items-center gap-3 p-4 border-b border-[#2a2b2c]">
                  <div className="w-8 h-8 bg-[#131314] rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-medium text-white">{section.title}</h3>
                </div>

                {/* Section Items */}
                <div className="divide-y divide-[#2a2b2c]">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="p-4">
                      {item.type === "switch" && (
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-white">{item.label}</div>
                            {item.description && (
                              <div className="text-sm text-gray-400 mt-1">{item.description}</div>
                            )}
                          </div>
                          <Switch
                            checked={item.value as boolean}
                            onCheckedChange={item.onChange}
                          />
                        </div>
                      )}

                      {item.type === "select" && (
                        <div>
                          <label className="block font-medium text-white mb-2">{item.label}</label>
                          <select
                            value={item.value as string}
                            onChange={(e) => item.onChange?.(e.target.value)}
                            className="w-full bg-[#131314] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50"
                          >
                            {item.options?.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {item.type === "input" && (
                        <div>
                          <label className="block font-medium text-white mb-2">{item.label}</label>
                          <input
                            type="text"
                            defaultValue={item.value as string}
                            placeholder={item.placeholder}
                            className="w-full bg-[#131314] text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A84FF]/50"
                          />
                        </div>
                      )}

                      {item.type === "button" && (
                        <button
                          onClick={item.action}
                          className={`w-full text-left ${
                            item.destructive 
                              ? "text-red-400 hover:bg-red-400/10" 
                              : "text-white hover:bg-[#2a2b2c]"
                          } p-3 -m-3 rounded-lg transition-colors`}
                        >
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-gray-400 mt-1">{item.value}</div>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* About Section */}
          <div className="bg-[#1e1f20] rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-[#2a2b2c]">
              <div className="w-8 h-8 bg-[#131314] rounded-lg flex items-center justify-center">
                <Info className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-white">About App</h3>
            </div>

            <div className="divide-y divide-[#2a2b2c]">
              {aboutItems.map((item, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <span className="text-white">{item.label}</span>
                  <span className="text-gray-400">{item.value}</span>
                </div>
              ))}
              
              <div className="p-4">
                <button className="w-full text-left text-white hover:bg-[#2a2b2c] p-3 -m-3 rounded-lg transition-colors">
                  <div className="font-medium">Licenses & Credits</div>
                  <div className="text-sm text-gray-400 mt-1">View open source licenses</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}