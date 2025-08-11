import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4f36f0d0`;
const ANON_KEY = publicAnonKey;

export interface DatabasePack {
  id: string;
  title: string;
  oneLiner: string;
  category: "Health" | "Survive" | "Fix" | "Speak";
  urgency: "EMERGENCY" | "WARNING" | "INFO";
  estMinutes: number;
  cta: string;
  steps: Array<{
    title: string;
    description: string;
    timerSeconds: number | null;
  }>;
  created_at: string;
  updated_at: string;
}

// Convert database pack to app pack format
export function convertDatabasePackToAppPack(dbPack: DatabasePack) {
  // Convert database urgency format to app format
  const urgencyMap = {
    'EMERGENCY': 'emergency',
    'WARNING': 'warning', 
    'INFO': 'info'
  } as const;
  
  // Convert database category format to app format
  const categoryMap = {
    'Health': 'HEALTH',
    'Survive': 'SURVIVE',
    'Fix': 'FIX',
    'Speak': 'SPEAK'
  } as const;
  
  return {
    id: dbPack.id || 'unknown',
    title: dbPack.title || 'Untitled Pack',
    oneLiner: dbPack.oneLiner || 'Emergency guide',
    umbrella: categoryMap[dbPack.category] || 'HEALTH',
    urgency: urgencyMap[dbPack.urgency] || 'info',
    etaMin: dbPack.estMinutes || 10,
    cta: dbPack.cta || 'Get Started',
    icon: 'default', // Add default icon
    isOffline: false, // Default offline status
    steps: (dbPack.steps || []).map((step, index) => ({
      title: step.title || `Step ${index + 1}`,
      desc: step.description || 'Follow this step',
      timerSec: step.timerSeconds || null
    }))
  };
}

// Convert app pack to database pack format
export function convertAppPackToDatabasePack(appPack: any): Omit<DatabasePack, 'id' | 'created_at' | 'updated_at'> {
  // Convert app urgency format to database format
  const urgencyMap = {
    'emergency': 'EMERGENCY',
    'warning': 'WARNING',
    'info': 'INFO'
  } as const;
  
  // Convert app category format to database format
  const categoryMap = {
    'HEALTH': 'Health',
    'SURVIVE': 'Survive',
    'FIX': 'Fix',
    'SPEAK': 'Speak'
  } as const;
  
  return {
    title: appPack.title || 'Untitled Pack',
    oneLiner: appPack.oneLiner || 'Emergency guide',
    category: categoryMap[appPack.umbrella] || 'Health',
    urgency: urgencyMap[appPack.urgency] || 'INFO',
    estMinutes: appPack.etaMin || 10,
    cta: appPack.cta || "Get Started",
    steps: (appPack.steps || []).map((step: any) => ({
      title: step.title || 'Step',
      description: step.desc || 'Follow this step',
      timerSeconds: step.timerSec || null
    }))
  };
}

// API helper function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey': ANON_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// Get all packs from database
export async function getAllPacksFromDatabase(): Promise<any[]> {
  try {
    console.log('🔍 Fetching all packs from database...');
    const result = await apiRequest('/packs');
    console.log('📦 Received packs:', result.packs?.length || 0);
    
    return (result.packs || []).map(convertDatabasePackToAppPack);
  } catch (error) {
    console.error('❌ Error fetching packs from database:', error);
    return [];
  }
}

// Get packs by category
export async function getPacksByCategory(category: string): Promise<any[]> {
  try {
    // Convert app category format to database format for API call
    const categoryMap = {
      'HEALTH': 'Health',
      'SURVIVE': 'Survive', 
      'FIX': 'Fix',
      'SPEAK': 'Speak'
    } as const;
    
    const dbCategory = categoryMap[category] || category;
    console.log(`🔍 Fetching ${category} (${dbCategory}) packs from database...`);
    
    const result = await apiRequest(`/packs/category/${dbCategory}`);
    console.log(`📦 Received ${category} packs:`, result.packs?.length || 0);
    
    return (result.packs || []).map(convertDatabasePackToAppPack);
  } catch (error) {
    console.error(`❌ Error fetching ${category} packs:`, error);
    return [];
  }
}

// Get single pack by ID
export async function getPackById(id: string): Promise<any | null> {
  try {
    console.log(`🔍 Fetching pack ${id} from database...`);
    const result = await apiRequest(`/packs/${id}`);
    
    if (!result.pack) {
      console.log(`📦 Pack ${id} not found`);
      return null;
    }
    
    console.log(`📦 Received pack: ${result.pack.title}`);
    return convertDatabasePackToAppPack(result.pack);
  } catch (error) {
    console.error(`❌ Error fetching pack ${id}:`, error);
    return null;
  }
}

// Save new pack to database
export async function savePackToDatabase(pack: any): Promise<string | null> {
  try {
    console.log('💾 Saving pack to database:', pack.title);
    const dbPack = convertAppPackToDatabasePack(pack);
    const result = await apiRequest('/packs', {
      method: 'POST',
      body: JSON.stringify(dbPack),
    });
    
    console.log('✅ Pack saved with ID:', result.id);
    return result.id;
  } catch (error) {
    console.error('❌ Error saving pack:', error);
    throw error;
  }
}

// Update existing pack
export async function updatePackInDatabase(id: string, updates: any): Promise<boolean> {
  try {
    console.log('📝 Updating pack in database:', id);
    const dbUpdates = convertAppPackToDatabasePack(updates);
    await apiRequest(`/packs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dbUpdates),
    });
    
    console.log('✅ Pack updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating pack:', error);
    return false;
  }
}

// Delete pack from database
export async function deletePackFromDatabase(id: string): Promise<boolean> {
  try {
    console.log('🗑️ Deleting pack from database:', id);
    await apiRequest(`/packs/${id}`, {
      method: 'DELETE',
    });
    
    console.log('✅ Pack deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Error deleting pack:', error);
    return false;
  }
}

// Seed database with initial packs
export async function seedDatabase(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    console.log('🌱 Seeding database with initial packs...');
    const result = await apiRequest('/packs/seed', {
      method: 'POST',
    });
    
    console.log('✅ Database seeding result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return {
      success: false,
      count: 0,
      message: `Seeding failed: ${error.message}`
    };
  }
}

// Force reseed database (clear and reseed)
export async function forceReseedDatabase(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    console.log('🔄 Force reseeding database...');
    
    // First, get all packs to see what we have
    const existingPacks = await getAllPacksFromDatabase();
    console.log(`📦 Found ${existingPacks.length} existing packs`);
    
    // Delete all existing packs
    for (const pack of existingPacks) {
      try {
        await deletePackFromDatabase(pack.id);
        console.log(`🗑️ Deleted pack: ${pack.title}`);
      } catch (error) {
        console.warn(`⚠️ Failed to delete pack ${pack.id}:`, error);
      }
    }
    
    // Now seed fresh
    const result = await seedDatabase();
    
    return {
      success: result.success,
      count: result.count,
      message: `Force reseed completed. ${result.message}`
    };
  } catch (error) {
    console.error('❌ Error force reseeding database:', error);
    return {
      success: false,
      count: 0,
      message: `Force reseed failed: ${error.message}`
    };
  }
}

// Test database connection
export async function testDatabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔍 Testing database connection...');
    const packs = await getAllPacksFromDatabase();
    
    return {
      success: true,
      message: `Database connection successful. Found ${packs.length} packs.`
    };
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return {
      success: false,
      message: `Database connection failed: ${error.message}`
    };
  }
}

// Debug function to get category breakdown
export async function debugCategories(): Promise<any> {
  try {
    console.log('🔍 Getting category debug info...');
    const result = await apiRequest('/packs/debug/categories');
    console.log('📊 Category breakdown:', result);
    return result;
  } catch (error) {
    console.error('❌ Error getting category debug info:', error);
    return { error: error.message };
  }
}