import { Pack, Umbrella } from '../data/models';
import { 
  getAllPacksFromDatabase, 
  getPacksByCategory, 
  getPackById as getPackByIdFromDB,
  savePackToDatabase,
  updatePackInDatabase,
  deletePackFromDatabase,
  seedDatabase as seedDatabasePacks,
  forceReseedDatabase,
  testDatabaseConnection
} from "./packService";

export interface EverPackManifest {
  schema: number;
  id: string;
  title: string;
  umbrella: Umbrella;
  oneLiner: string;
  detailedDescription?: string;
  cta: string;
  urgency: "emergency" | "warning" | "info";
  etaMin: number;
  icon: string;
  createdAt: string;
  author: {
    name: string;
    contact: string;
  };
  assets: string[];
  checksum: string;
}

export interface EverPackSteps {
  title: string;
  steps: Array<{
    title: string;
    desc: string;
    timerSec?: number;
  }>;
  source?: string;
}

export interface CustomPack extends Pack {
  isCustom: boolean;
  createdAt: string;
}

const CUSTOM_PACKS_KEY = 'everaid_custom_packs';

// In-memory cache for database packs
let cachedDatabasePacks: Pack[] = [];
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Get all packs from database (cached)
export async function getAllDatabasePacks(): Promise<Pack[]> {
  const now = Date.now();
  
  // Return cached data if still fresh
  if (cachedDatabasePacks.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log('📦 Returning cached database packs:', cachedDatabasePacks.length);
    return cachedDatabasePacks;
  }
  
  try {
    console.log('🔄 Fetching fresh database packs...');
    const packs = await getAllPacksFromDatabase();
    
    // Update cache
    cachedDatabasePacks = packs;
    cacheTimestamp = now;
    
    console.log('✅ Database packs loaded:', packs.length);
    return packs;
  } catch (error) {
    console.error('❌ Error loading database packs:', error);
    // Return cached data even if stale, or empty array
    return cachedDatabasePacks;
  }
}

// Get packs by category from database
export async function getDatabasePacksByCategory(category: string): Promise<Pack[]> {
  try {
    return await getPacksByCategory(category);
  } catch (error) {
    console.error(`❌ Error loading ${category} packs:`, error);
    return [];
  }
}

// Get all custom packs from localStorage
export function getCustomPacks(): CustomPack[] {
  try {
    const stored = localStorage.getItem(CUSTOM_PACKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading custom packs:', error);
    return [];
  }
}

// Get combined packs (database + custom)
export async function getAllPacks(): Promise<Pack[]> {
  const [databasePacks, customPacks] = await Promise.all([
    getAllDatabasePacks(),
    Promise.resolve(getCustomPacks())
  ]);
  
  // Combine database packs with custom packs
  return [...databasePacks, ...customPacks];
}

// Save a new custom pack
export function saveCustomPack(packData: {
  umbrella: Umbrella;
  title: string;
  oneLiner: string;
  detailedDescription?: string;
  cta: string;
  urgency: "emergency" | "warning" | "info";
  etaMin: number;
  icon: string;
  steps: Array<{
    title: string;
    desc: string;
    timerSec?: number;
  }>;
}): CustomPack {
  const customPacks = getCustomPacks();
  
  const newPack: CustomPack = {
    id: generatePackId(),
    umbrella: packData.umbrella,
    title: packData.title,
    oneLiner: packData.oneLiner,
    detailedDescription: packData.detailedDescription,
    cta: packData.cta,
    urgency: packData.urgency,
    etaMin: packData.etaMin,
    icon: packData.icon,
    source: "Custom Pack",
    isCustom: true,
    createdAt: new Date().toISOString()
  };
  
  customPacks.push(newPack);
  localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(customPacks));
  
  // Also save the steps data separately
  const stepsData: EverPackSteps = {
    title: packData.title,
    steps: packData.steps.filter(step => step.title.trim()),
    source: "Custom Pack"
  };
  
  localStorage.setItem(`everaid_steps_${newPack.id}`, JSON.stringify(stepsData));
  
  return newPack;
}

// Delete a custom pack
export function deleteCustomPack(packId: string): void {
  const customPacks = getCustomPacks();
  const filtered = customPacks.filter(pack => pack.id !== packId);
  localStorage.setItem(CUSTOM_PACKS_KEY, JSON.stringify(filtered));
  localStorage.removeItem(`everaid_steps_${packId}`);
}

// Get steps for a pack (database, custom, or built-in)
export async function getPackSteps(packId: string): Promise<EverPackSteps | null> {
  try {
    // First check if it's a custom pack in localStorage
    const stored = localStorage.getItem(`everaid_steps_${packId}`);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // If not found locally, try to get from database
    const databasePack = await getPackByIdFromDB(packId);
    if (databasePack && databasePack.steps) {
      return {
        title: databasePack.title,
        steps: databasePack.steps,
        source: "Database Pack"
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error loading pack steps:', error);
    return null;
  }
}

// Clear cache
export function clearPacksCache(): void {
  cachedDatabasePacks = [];
  cacheTimestamp = 0;
  console.log('🗑️ Cleared packs cache');
}

// Initialize database with seed data
export async function initializeDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🌱 Initializing database...');
    
    // Test connection first
    const connectionTest = await testDatabaseConnection();
    if (!connectionTest.success) {
      return connectionTest;
    }
    
    // Check if database is already seeded
    const existingPacks = await getAllDatabasePacks();
    if (existingPacks.length >= 80) {
      return {
        success: true,
        message: `Database already initialized with ${existingPacks.length} packs`
      };
    }
    
    // If we have some but not all packs, force reseed
    if (existingPacks.length > 0 && existingPacks.length < 80) {
      console.log(`🔄 Found ${existingPacks.length} packs, but expected 80. Force reseeding...`);
      const reseedResult = await forceReseedDatabase();
      clearPacksCache();
      return reseedResult;
    }
    
    // Seed the database
    const seedResult = await seedDatabasePacks();
    
    // Clear cache to force refresh
    clearPacksCache();
    
    return seedResult;
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    return {
      success: false,
      message: `Database initialization failed: ${error.message}`
    };
  }
}

// Force reseed database
export async function forceReseedDatabasePacks(): Promise<{ success: boolean; message: string }> {
  try {
    console.log('🔄 Force reseeding database...');
    const result = await forceReseedDatabase();
    clearPacksCache();
    return result;
  } catch (error) {
    console.error('❌ Error force reseeding:', error);
    return {
      success: false,
      message: `Force reseed failed: ${error.message}`
    };
  }
}

// Re-export database functions for convenience
export { 
  savePackToDatabase, 
  updatePackInDatabase, 
  deletePackFromDatabase 
} from "./packService";

// Export pack as .everpack format
export function exportPack(pack: CustomPack, steps: EverPackSteps): string {
  const manifest: EverPackManifest = {
    schema: 1,
    id: pack.id,
    title: pack.title,
    umbrella: pack.umbrella,
    oneLiner: pack.oneLiner,
    detailedDescription: pack.detailedDescription,
    cta: pack.cta,
    urgency: pack.urgency,
    etaMin: pack.etaMin,
    icon: pack.icon,
    createdAt: pack.createdAt,
    author: {
      name: "You",
      contact: "everaid://u/you"
    },
    assets: [],
    checksum: generateChecksum(pack.title + pack.oneLiner + JSON.stringify(steps))
  };
  
  const packData = {
    manifest,
    steps
  };
  
  return JSON.stringify(packData, null, 2);
}

// Import pack from .everpack format
export function importPack(packContent: string): { pack: CustomPack; steps: EverPackSteps } | null {
  try {
    const packData = JSON.parse(packContent);
    const { manifest, steps } = packData;
    
    // Validate schema
    if (manifest.schema !== 1) {
      throw new Error('Unsupported pack schema version');
    }
    
    // Validate required fields
    if (!manifest.title || !manifest.umbrella || !manifest.urgency || !steps.steps?.length) {
      throw new Error('Invalid pack format');
    }
    
    // Create custom pack
    const customPack: CustomPack = {
      id: generatePackId(), // Generate new ID to avoid conflicts
      umbrella: manifest.umbrella,
      title: manifest.title,
      oneLiner: manifest.oneLiner,
      detailedDescription: manifest.detailedDescription,
      cta: manifest.cta,
      urgency: manifest.urgency,
      etaMin: manifest.etaMin,
      icon: manifest.icon,
      source: "Imported Pack",
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    
    return { pack: customPack, steps };
  } catch (error) {
    console.error('Error importing pack:', error);
    return null;
  }
}

// Generate QR tiles for sharing
export function generateQRTiles(packContent: string): string[] {
  const chunkSize = 800; // Approximate QR capacity
  const chunks: string[] = [];
  
  for (let i = 0; i < packContent.length; i += chunkSize) {
    chunks.push(packContent.slice(i, i + chunkSize));
  }
  
  return chunks.map((chunk, index) => {
    return JSON.stringify({
      index: index + 1,
      total: chunks.length,
      data: chunk,
      checksum: generateChecksum(packContent)
    });
  });
}

// Helper functions
function generatePackId(): string {
  return 'pack_' + Math.random().toString(36).substr(2, 9);
}

function generateChecksum(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}