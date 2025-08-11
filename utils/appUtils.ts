// App utility functions and types
export type Screen = "home" | "chat" | "settings" | "manage-packs" | "app-profile-settings" | "pack-builder";

export interface NavigationData {
  pack?: any;
  mode?: string;
  prefill?: string;
}

// AI Testing utility for development
export const setupAITesting = async () => {
  try {
    console.log('🚀 EverAid startup - testing AI connection...');
    const { testAIConnection } = await import('./aiClient');
    const result = await testAIConnection();
    if (result.success) {
      console.log('✅ AI połączenie działa!', result.details);
    } else {
      console.log('❌ AI połączenie nie działa:', result.error);
      console.log('🔧 Debug info:', result);
    }
  } catch (error) {
    console.log('⚠️  AI test błąd:', error);
  }
};

// Database Testing utility for development
export const setupDatabaseTesting = async () => {
  try {
    console.log('🚀 EverAid startup - testing database connection...');
    const { testDatabaseConnection, initializeDatabase } = await import('./packService');
    
    const connectionResult = await testDatabaseConnection();
    if (connectionResult.success) {
      console.log('✅ Database connection working!', connectionResult.message);
    } else {
      console.log('❌ Database connection failed:', connectionResult.message);
    }
    
    // Initialize if needed
    const initResult = await initializeDatabase();
    console.log('🌱 Database initialization:', initResult.message);
    
  } catch (error) {
    console.log('⚠️  Database test error:', error);
  }
};

// Make AI and Database functions available globally for debugging
export const exposeAIFunctionsGlobally = () => {
  if (typeof window !== 'undefined') {
    Promise.all([
      import('./aiClient'),
      import('./aiDebug'),
      import('./packService'),
      import('./packManager')
    ]).then(([aiClient, aiDebug, packService, packManager]) => {
      // AI functions
      (window as any).testAI = aiClient.testAIConnection;
      (window as any).askAI = aiClient.askAI;
      (window as any).askEverAid = aiClient.askEverAid;
      (window as any).askEverAidWithContext = aiClient.askEverAidWithContext;
      (window as any).generatePack = aiClient.generatePack;
      (window as any).debugEndpoints = aiDebug.debugEndpoints;
      
      // Database functions
      (window as any).testDB = packService.testDatabaseConnection;
      (window as any).seedDB = packService.seedDatabase;
      (window as any).forceReseedDB = packService.forceReseedDatabase;
      (window as any).getAllPacks = packService.getAllPacksFromDatabase;
      (window as any).getPacksByCategory = packService.getPacksByCategory;
      (window as any).debugCategories = packService.debugCategories;
      (window as any).clearCache = packManager.clearPacksCache;
      (window as any).initDB = packManager.initializeDatabase;
      (window as any).forceReseed = packManager.forceReseedDatabasePacks;
      
      console.log('🛠️  Debug functions available in console:');
      console.log('');
      console.log('🤖 AI Functions:');
      console.log('   testAI() - Test AI connection');
      console.log('   debugEndpoints() - Detailed endpoint testing');
      console.log('   askAI(prompt, mode) - Direct AI call');
      console.log('   askEverAid(prompt) - Chat function');
      console.log('   askEverAidWithContext(prompt, context) - Chat with pack context');
      console.log('   generatePack(prompt) - Pack generation');
      console.log('');
      console.log('📦 Database Functions:');
      console.log('   testDB() - Test database connection');
      console.log('   seedDB() - Seed database with 80 packs');
      console.log('   forceReseedDB() - Clear and reseed database');
      console.log('   getAllPacks() - Get all packs from database');
      console.log('   getPacksByCategory("Health") - Get packs by category');
      console.log('   debugCategories() - Get category breakdown');
      console.log('   clearCache() - Clear packs cache');
      console.log('   initDB() - Initialize database');
      console.log('   forceReseed() - Force reseed through packManager');
      console.log('');
      console.log('🔧 Quick fixes:');
      console.log('   forceReseed() - If seeing wrong number of packs');
      console.log('   clearCache() - If packs not updating');
      console.log('   getPacksByCategory("Health") - Check specific category');
      console.log('');
      console.log('📌 Endpoint: /functions/v1/make-server-4f36f0d0/gptoss');
    });
  }
};