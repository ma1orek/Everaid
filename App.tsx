import { useState, useEffect } from "react";
import { Home } from "./screens/Home";
import { Chat } from "./screens/Chat";
import { Settings } from "./screens/Settings";
import { ManagePacks } from "./screens/ManagePacks";
import { AppProfileSettings } from "./screens/AppProfileSettings";
import { PackBuilder } from "./screens/PackBuilder";
import { Toaster } from "sonner@2.0.3";
import { Screen, NavigationData, setupAITesting, setupDatabaseTesting, exposeAIFunctionsGlobally } from "./utils/appUtils";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [navigationData, setNavigationData] = useState<NavigationData>({});

  const handleNavigate = (screen: string, data?: any) => {
    setCurrentScreen(screen as Screen);
    setNavigationData(data || {});
  };

  // Test AI and Database connections on app startup
  useEffect(() => {
    setupAITesting();
    setupDatabaseTesting();
    exposeAIFunctionsGlobally();
  }, []);

  return (
    <>
      <div 
        className="w-full mx-auto overflow-hidden bg-[#131314] relative"
        style={{
          maxWidth: '428px',
          height: '926px',
          width: '100%'
        }}
      >
      {currentScreen === "home" && (
        <Home onNavigate={handleNavigate} />
      )}
      
      {currentScreen === "chat" && (
        <Chat 
          onNavigate={handleNavigate}
          initialPack={navigationData.pack}
          prefill={navigationData.prefill}
        />
      )}
      
      {currentScreen === "settings" && (
        <Settings onNavigate={handleNavigate} />
      )}
      
      {currentScreen === "manage-packs" && (
        <ManagePacks onNavigate={handleNavigate} />
      )}
      
      {currentScreen === "app-profile-settings" && (
        <AppProfileSettings onNavigate={handleNavigate} />
      )}
      
      {currentScreen === "pack-builder" && (
        <PackBuilder 
          onNavigate={handleNavigate}
          pack={navigationData.pack}
          mode={navigationData.mode}
        />
      )}
      </div>
      
      <Toaster 
        position="top-center"
        theme="dark"
      />
    </>
  );
}