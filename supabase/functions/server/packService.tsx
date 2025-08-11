import * as kv from "./kv_store.tsx";

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

const PACK_PREFIX = "pack:";
const PACKS_INDEX_KEY = "packs:index";

// Helper to generate unique ID
function generatePackId(): string {
  return `pack_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Get all packs
export async function getAllPacks(): Promise<DatabasePack[]> {
  try {
    const indexData = await kv.get(PACKS_INDEX_KEY);
    if (!indexData) {
      console.log('No pack index found, returning empty array');
      return [];
    }

    const packIds = JSON.parse(indexData);
    if (!Array.isArray(packIds)) {
      console.log('Invalid pack index format');
      return [];
    }

    const packKeys = packIds.map(id => `${PACK_PREFIX}${id}`);
    const packsData = await kv.mget(packKeys);
    
    return packsData
      .filter(data => data !== null)
      .map(data => JSON.parse(data))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  } catch (error) {
    console.error('Error getting all packs:', error);
    return [];
  }
}

// Get packs by category
export async function getPacksByCategory(category: string): Promise<DatabasePack[]> {
  console.log(`🔍 PackService: Filtering packs by category: ${category}`);
  const allPacks = await getAllPacks();
  console.log(`📦 PackService: Total packs available: ${allPacks.length}`);
  
  const filteredPacks = allPacks.filter(pack => {
    const matches = pack.category === category;
    if (matches) {
      console.log(`✅ PackService: Pack "${pack.title}" matches category ${category}`);
    }
    return matches;
  });
  
  console.log(`📦 PackService: Found ${filteredPacks.length} packs for category ${category}`);
  return filteredPacks;
}

// Get single pack by ID
export async function getPackById(id: string): Promise<DatabasePack | null> {
  try {
    const data = await kv.get(`${PACK_PREFIX}${id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting pack by ID:', error);
    return null;
  }
}

// Save pack
export async function savePack(pack: Omit<DatabasePack, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  try {
    const id = generatePackId();
    const now = new Date().toISOString();
    
    const fullPack: DatabasePack = {
      ...pack,
      id,
      created_at: now,
      updated_at: now
    };

    // Save the pack
    await kv.set(`${PACK_PREFIX}${id}`, JSON.stringify(fullPack));

    // Update index
    const indexData = await kv.get(PACKS_INDEX_KEY);
    const packIds = indexData ? JSON.parse(indexData) : [];
    packIds.push(id);
    await kv.set(PACKS_INDEX_KEY, JSON.stringify(packIds));

    console.log(`Pack saved with ID: ${id}`);
    return id;

  } catch (error) {
    console.error('Error saving pack:', error);
    throw error;
  }
}

// Update pack
export async function updatePack(id: string, updates: Partial<DatabasePack>): Promise<boolean> {
  try {
    const existingPack = await getPackById(id);
    if (!existingPack) {
      return false;
    }

    const updatedPack: DatabasePack = {
      ...existingPack,
      ...updates,
      id: existingPack.id, // Ensure ID doesn't change
      created_at: existingPack.created_at, // Preserve creation date
      updated_at: new Date().toISOString()
    };

    await kv.set(`${PACK_PREFIX}${id}`, JSON.stringify(updatedPack));
    console.log(`Pack updated: ${id}`);
    return true;

  } catch (error) {
    console.error('Error updating pack:', error);
    return false;
  }
}

// Delete pack
export async function deletePack(id: string): Promise<boolean> {
  try {
    // Remove from storage
    await kv.del(`${PACK_PREFIX}${id}`);

    // Update index
    const indexData = await kv.get(PACKS_INDEX_KEY);
    if (indexData) {
      const packIds = JSON.parse(indexData);
      const filteredIds = packIds.filter(packId => packId !== id);
      await kv.set(PACKS_INDEX_KEY, JSON.stringify(filteredIds));
    }

    console.log(`Pack deleted: ${id}`);
    return true;

  } catch (error) {
    console.error('Error deleting pack:', error);
    return false;
  }
}

// Seed database with initial packs
export async function seedDatabase(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    console.log('Starting database seeding...');
    
    // Check if already seeded
    const existingPacks = await getAllPacks();
    if (existingPacks.length > 0) {
      return {
        success: true,
        count: existingPacks.length,
        message: `Database already contains ${existingPacks.length} packs`
      };
    }

    const seedPacks = generateSeedPacks();
    let savedCount = 0;

    for (const pack of seedPacks) {
      try {
        await savePack(pack);
        savedCount++;
      } catch (error) {
        console.error(`Failed to save pack: ${pack.title}`, error);
      }
    }

    console.log(`Seeding completed. Saved ${savedCount}/${seedPacks.length} packs`);
    
    return {
      success: true,
      count: savedCount,
      message: `Successfully seeded ${savedCount} packs`
    };

  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      count: 0,
      message: `Seeding failed: ${error.message}`
    };
  }
}

// Generate seed data
function generateSeedPacks(): Array<Omit<DatabasePack, 'id' | 'created_at' | 'updated_at'>> {
  const packs = [];

  // Health packs (20)
  const healthPacks = [
    {
      title: "Bleeding Control",
      oneLiner: "Stop severe bleeding quickly",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Help Now",
      steps: [
        { title: "Direct pressure", description: "Cover with clean cloth and press firmly.", timerSeconds: null },
        { title: "Elevate limb", description: "Keep above heart if possible.", timerSeconds: null },
        { title: "Do not remove soaked pads", description: "Add new layers on top; keep pressure.", timerSeconds: null },
        { title: "Watch for shock", description: "Pale skin, fast pulse, confusion. Keep warm.", timerSeconds: null }
      ]
    },
    {
      title: "CPR Adult",
      oneLiner: "Life-saving chest compressions",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Start CPR",
      steps: [
        { title: "Check responsiveness", description: "Tap shoulders, shout 'Are you okay?'", timerSeconds: 10 },
        { title: "Call 911", description: "Get help immediately or ask someone else to call.", timerSeconds: null },
        { title: "Position hands", description: "Center of chest, heel of hand, fingers interlaced.", timerSeconds: null },
        { title: "Compress chest", description: "Push hard and fast, 2 inches deep, 100-120/min.", timerSeconds: 120 },
        { title: "Give rescue breaths", description: "Tilt head, lift chin, 2 breaths after 30 compressions.", timerSeconds: null }
      ]
    },
    {
      title: "Choking Adult",
      oneLiner: "Clear blocked airway fast",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 3,
      cta: "Help Now",
      steps: [
        { title: "Encourage coughing", description: "If they can cough or speak, let them try to clear it.", timerSeconds: null },
        { title: "Position behind person", description: "Stand behind, wrap arms around waist.", timerSeconds: null },
        { title: "Make fist", description: "Place above navel, below ribcage.", timerSeconds: null },
        { title: "Thrust upward", description: "Quick, upward thrusts until object comes out.", timerSeconds: null }
      ]
    },
    {
      title: "Heart Attack Response",
      oneLiner: "Recognize and respond to heart attack",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 8,
      cta: "Act Fast",
      steps: [
        { title: "Recognize symptoms", description: "Chest pain, shortness of breath, nausea, sweating.", timerSeconds: null },
        { title: "Call 911 immediately", description: "Time is critical - don't wait or drive yourself.", timerSeconds: null },
        { title: "Give aspirin if available", description: "Chew 325mg aspirin unless allergic.", timerSeconds: null },
        { title: "Keep person calm", description: "Sit them down, loosen tight clothing.", timerSeconds: null },
        { title: "Monitor breathing", description: "Be ready to perform CPR if they become unconscious.", timerSeconds: null }
      ]
    },
    {
      title: "Stroke Recognition",
      oneLiner: "FAST stroke identification",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Check Now",
      steps: [
        { title: "Face drooping", description: "Ask person to smile. Is one side drooping?", timerSeconds: null },
        { title: "Arm weakness", description: "Ask to raise both arms. Does one drift down?", timerSeconds: null },
        { title: "Speech difficulty", description: "Ask to repeat simple phrase. Is speech slurred?", timerSeconds: null },
        { title: "Time to call 911", description: "If any signs present, call emergency services now.", timerSeconds: null }
      ]
    },
    {
      title: "Burn Treatment",
      oneLiner: "Cool and protect burned skin",
      category: "Health" as const,
      urgency: "WARNING" as const,
      estMinutes: 15,
      cta: "Treat Now",
      steps: [
        { title: "Remove from heat source", description: "Get away from fire, hot surface, or chemicals.", timerSeconds: null },
        { title: "Cool with water", description: "Run cool (not cold) water over burn for 10-20 minutes.", timerSeconds: 1200 },
        { title: "Remove jewelry", description: "Take off rings, watches before swelling starts.", timerSeconds: null },
        { title: "Don't pop blisters", description: "Leave intact to prevent infection.", timerSeconds: null },
        { title: "Cover loosely", description: "Use clean, dry cloth. Seek medical care for severe burns.", timerSeconds: null }
      ]
    },
    {
      title: "Allergic Reaction",
      oneLiner: "Manage severe allergic reactions",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Help Now",
      steps: [
        { title: "Remove allergen", description: "Stop exposure to what caused the reaction.", timerSeconds: null },
        { title: "Check for EpiPen", description: "If person has one, help them use it.", timerSeconds: null },
        { title: "Call 911", description: "For severe reactions (trouble breathing, swelling).", timerSeconds: null },
        { title: "Keep person calm", description: "Have them sit up if breathing is difficult.", timerSeconds: null },
        { title: "Monitor breathing", description: "Be ready to perform rescue breathing if needed.", timerSeconds: null }
      ]
    },
    {
      title: "Seizure Response",
      oneLiner: "Safe care during seizures",
      category: "Health" as const,
      urgency: "WARNING" as const,
      estMinutes: 10,
      cta: "Stay Calm",
      steps: [
        { title: "Stay with person", description: "Don't leave them alone during seizure.", timerSeconds: null },
        { title: "Keep them safe", description: "Move objects away, cushion head if possible.", timerSeconds: null },
        { title: "Don't restrain", description: "Never hold them down or put anything in mouth.", timerSeconds: null },
        { title: "Time the seizure", description: "Call 911 if it lasts longer than 5 minutes.", timerSeconds: 300 },
        { title: "Recovery position", description: "Turn on side when seizure ends to keep airway clear.", timerSeconds: null }
      ]
    },
    {
      title: "Broken Bone",
      oneLiner: "Stabilize and protect fractures",
      category: "Health" as const,
      urgency: "WARNING" as const,
      estMinutes: 20,
      cta: "Stabilize",
      steps: [
        { title: "Don't move if spine injury", description: "If neck/back injury suspected, keep person still.", timerSeconds: null },
        { title: "Stop any bleeding", description: "Apply direct pressure around the wound.", timerSeconds: null },
        { title: "Immobilize the area", description: "Splint above and below the fracture.", timerSeconds: null },
        { title: "Apply ice", description: "Wrap in cloth, apply to reduce swelling.", timerSeconds: null },
        { title: "Get medical help", description: "Transport carefully or call for ambulance.", timerSeconds: null }
      ]
    },
    {
      title: "Poison Control",
      oneLiner: "Handle poisoning emergencies",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Act Fast",
      steps: [
        { title: "Call Poison Control", description: "1-800-222-1222 (US) - have container ready.", timerSeconds: null },
        { title: "Don't induce vomiting", description: "Unless specifically told to by poison control.", timerSeconds: null },
        { title: "Remove from mouth", description: "If substance still in mouth, rinse with water.", timerSeconds: null },
        { title: "Save the container", description: "Bring poison container to hospital if going.", timerSeconds: null }
      ]
    },
    {
      title: "Unconscious Person",
      oneLiner: "Check and position unconscious victim",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Check Now",
      steps: [
        { title: "Check responsiveness", description: "Tap shoulders firmly and shout their name.", timerSeconds: null },
        { title: "Check breathing", description: "Look for chest rise and fall for 10 seconds.", timerSeconds: 10 },
        { title: "Call 911", description: "Get emergency help immediately.", timerSeconds: null },
        { title: "Recovery position", description: "If breathing, turn on side to keep airway open.", timerSeconds: null },
        { title: "Monitor continuously", description: "Watch breathing and pulse until help arrives.", timerSeconds: null }
      ]
    },
    {
      title: "Nosebleed Control",
      oneLiner: "Stop nosebleeds quickly",
      category: "Health" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Stop Bleeding",
      steps: [
        { title: "Sit up and lean forward", description: "Prevents blood from running down throat.", timerSeconds: null },
        { title: "Pinch nostrils", description: "Use thumb and finger to pinch soft part closed.", timerSeconds: null },
        { title: "Hold for 10 minutes", description: "Apply constant pressure without checking.", timerSeconds: 600 },
        { title: "Apply ice", description: "Place ice pack on bridge of nose and cheeks.", timerSeconds: null },
        { title: "Seek help if continues", description: "Get medical care if bleeding doesn't stop.", timerSeconds: null }
      ]
    },
    {
      title: "Sprain Treatment",
      oneLiner: "RICE method for sprains",
      category: "Health" as const,
      urgency: "INFO" as const,
      estMinutes: 25,
      cta: "Treat Now",
      steps: [
        { title: "Rest the injury", description: "Stop activity and avoid putting weight on it.", timerSeconds: null },
        { title: "Ice for 20 minutes", description: "Apply ice pack wrapped in cloth.", timerSeconds: 1200 },
        { title: "Compress with bandage", description: "Wrap snugly but not too tight.", timerSeconds: null },
        { title: "Elevate if possible", description: "Raise above heart level to reduce swelling.", timerSeconds: null },
        { title: "Take pain reliever", description: "Use ibuprofen or acetaminophen as directed.", timerSeconds: null }
      ]
    },
    {
      title: "Heat Exhaustion",
      oneLiner: "Cool down overheated body",
      category: "Health" as const,
      urgency: "WARNING" as const,
      estMinutes: 20,
      cta: "Cool Down",
      steps: [
        { title: "Move to cool area", description: "Get out of sun, into air conditioning if possible.", timerSeconds: null },
        { title: "Remove excess clothing", description: "Loosen or remove heavy clothing.", timerSeconds: null },
        { title: "Apply cool water", description: "Use damp cloths on skin, fan the person.", timerSeconds: null },
        { title: "Give fluids", description: "Water or sports drinks if person is conscious.", timerSeconds: null },
        { title: "Monitor temperature", description: "Call 911 if condition worsens or temp over 103°F.", timerSeconds: null }
      ]
    },
    {
      title: "Eye Injury",
      oneLiner: "Protect and treat eye injuries",
      category: "Health" as const,
      urgency: "WARNING" as const,
      estMinutes: 15,
      cta: "Protect Eye",
      steps: [
        { title: "Don't rub the eye", description: "Avoid touching or rubbing the injured eye.", timerSeconds: null },
        { title: "Flush with water", description: "For chemicals, flush with clean water for 15 minutes.", timerSeconds: 900 },
        { title: "Cover both eyes", description: "Use loose bandage to prevent movement.", timerSeconds: null },
        { title: "Don't remove objects", description: "If something is stuck, don't try to remove it.", timerSeconds: null },
        { title: "Seek immediate care", description: "Get to emergency room or eye doctor quickly.", timerSeconds: null }
      ]
    },
    {
      title: "Bee Sting Treatment",
      oneLiner: "Remove stinger and treat reaction",
      category: "Health" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Treat Sting",
      steps: [
        { title: "Remove stinger", description: "Scrape out with credit card, don't use tweezers.", timerSeconds: null },
        { title: "Wash the area", description: "Clean with soap and water.", timerSeconds: null },
        { title: "Apply cold compress", description: "Ice wrapped in cloth for 10 minutes.", timerSeconds: 600 },
        { title: "Take antihistamine", description: "Benadryl can reduce swelling and itching.", timerSeconds: null },
        { title: "Watch for allergic reaction", description: "Difficulty breathing = call 911 immediately.", timerSeconds: null }
      ]
    },
    {
      title: "Fainting Response",
      oneLiner: "Help someone who has fainted",
      category: "Health" as const,
      urgency: "WARNING" as const,
      estMinutes: 10,
      cta: "Help Now",
      steps: [
        { title: "Check for injuries", description: "Look for cuts or bumps from falling.", timerSeconds: null },
        { title: "Position on back", description: "Lay flat and elevate legs 8-12 inches.", timerSeconds: null },
        { title: "Check breathing", description: "Make sure airway is clear and they're breathing.", timerSeconds: null },
        { title: "Loosen clothing", description: "Unbutton tight collars or belts.", timerSeconds: null },
        { title: "Don't give food/water", description: "Wait until fully conscious before offering anything.", timerSeconds: null }
      ]
    },
    {
      title: "Hypothermia Care",
      oneLiner: "Warm person with low body temperature",
      category: "Health" as const,
      urgency: "WARNING" as const,
      estMinutes: 30,
      cta: "Warm Up",
      steps: [
        { title: "Move to warm area", description: "Get inside or to shelter immediately.", timerSeconds: null },
        { title: "Remove wet clothing", description: "Replace with dry, warm clothing or blankets.", timerSeconds: null },
        { title: "Warm core first", description: "Focus on chest, neck, head, and groin.", timerSeconds: null },
        { title: "Give warm drinks", description: "If conscious, warm non-alcoholic, non-caffeinated drinks.", timerSeconds: null },
        { title: "Get medical help", description: "Severe hypothermia needs immediate medical care.", timerSeconds: null }
      ]
    },
    {
      title: "Cut Cleaning",
      oneLiner: "Clean and dress minor cuts",
      category: "Health" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Clean Cut",
      steps: [
        { title: "Wash hands first", description: "Clean your hands before touching the wound.", timerSeconds: null },
        { title: "Stop the bleeding", description: "Apply direct pressure with clean cloth.", timerSeconds: null },
        { title: "Clean the cut", description: "Rinse with clean water, use soap around edges.", timerSeconds: null },
        { title: "Apply antibiotic", description: "Use antibiotic ointment if available.", timerSeconds: null },
        { title: "Cover with bandage", description: "Use adhesive bandage or sterile gauze.", timerSeconds: null }
      ]
    },
    {
      title: "Asthma Attack Help",
      oneLiner: "Assist during breathing emergency",
      category: "Health" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Help Breathe",
      steps: [
        { title: "Help find inhaler", description: "Look for rescue inhaler (usually blue).", timerSeconds: null },
        { title: "Sit upright", description: "Help person sit up straight, don't lie down.", timerSeconds: null },
        { title: "Encourage slow breathing", description: "Breathe slowly and deeply through nose.", timerSeconds: null },
        { title: "Call 911 if severe", description: "If no improvement in 15 minutes or severe distress.", timerSeconds: 900 },
        { title: "Stay calm", description: "Keep person calm and reassured.", timerSeconds: null }
      ]
    }
  ];

  // Survive packs (20)
  const survivePacks = [
    {
      title: "House Fire Escape",
      oneLiner: "Quick escape from burning building",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 3,
      cta: "Escape Now",
      steps: [
        { title: "Check door temperature", description: "Touch door with back of hand. If hot, find another way.", timerSeconds: null },
        { title: "Stay low", description: "Crawl below smoke to breathe cleaner air.", timerSeconds: null },
        { title: "Exit immediately", description: "Don't stop for belongings. Get out fast.", timerSeconds: null },
        { title: "Call 911 from outside", description: "Once safe, call fire department.", timerSeconds: null },
        { title: "Go to meeting point", description: "Meet family at designated spot away from building.", timerSeconds: null }
      ]
    },
    {
      title: "Earthquake Safety",
      oneLiner: "Protect yourself during earthquake",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 2,
      cta: "Take Cover",
      steps: [
        { title: "Drop immediately", description: "Get down on hands and knees.", timerSeconds: null },
        { title: "Take cover", description: "Get under sturdy desk or table if possible.", timerSeconds: null },
        { title: "Hold on", description: "Protect head and neck with arms.", timerSeconds: null },
        { title: "Stay put until stopping", description: "Don't run outside during shaking.", timerSeconds: null },
        { title: "Check for injuries", description: "After shaking stops, check yourself and others.", timerSeconds: null }
      ]
    },
    {
      title: "Flood Evacuation",
      oneLiner: "Safe escape from flood waters",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Evacuate",
      steps: [
        { title: "Get to higher ground", description: "Move to second floor or highest available area.", timerSeconds: null },
        { title: "Avoid walking in water", description: "6 inches can knock you down. 12 inches can carry away cars.", timerSeconds: null },
        { title: "Turn off utilities", description: "Shut off electricity, gas, and water if safe to do so.", timerSeconds: null },
        { title: "Signal for help", description: "Use bright cloth, flashlight, or whistle.", timerSeconds: null },
        { title: "Don't drive through", description: "Turn around, don't drown. Find alternate route.", timerSeconds: null }
      ]
    },
    {
      title: "Tornado Safety",
      oneLiner: "Find shelter from tornado",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Take Shelter",
      steps: [
        { title: "Get to lowest floor", description: "Go to basement or lowest level of building.", timerSeconds: null },
        { title: "Interior room", description: "Choose small room in center, away from windows.", timerSeconds: null },
        { title: "Protect yourself", description: "Cover with mattress, blankets, or sturdy furniture.", timerSeconds: null },
        { title: "Avoid large rooms", description: "Stay out of gymnasiums, auditoriums, cafeterias.", timerSeconds: null },
        { title: "Listen for all-clear", description: "Stay in shelter until danger passes.", timerSeconds: null }
      ]
    },
    {
      title: "Lost in Wilderness",
      oneLiner: "Survive when lost outdoors",
      category: "Survive" as const,
      urgency: "WARNING" as const,
      estMinutes: 60,
      cta: "Survive",
      steps: [
        { title: "Stop and stay calm", description: "Don't panic. Sit down and think clearly.", timerSeconds: null },
        { title: "Signal for help", description: "Use whistle, mirror, or bright clothing.", timerSeconds: null },
        { title: "Find or make shelter", description: "Protect from wind, rain, and cold.", timerSeconds: null },
        { title: "Find water source", description: "Follow streams downhill, collect rainwater.", timerSeconds: null },
        { title: "Stay put if possible", description: "Make yourself visible to rescuers.", timerSeconds: null }
      ]
    },
    {
      title: "Car Accident Response",
      oneLiner: "Stay safe after vehicle crash",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Stay Safe",
      steps: [
        { title: "Check for injuries", description: "Don't move if you suspect spinal injury.", timerSeconds: null },
        { title: "Turn on hazard lights", description: "Make your vehicle visible to other drivers.", timerSeconds: null },
        { title: "Exit safely if possible", description: "Get away from traffic and move to safe area.", timerSeconds: null },
        { title: "Call 911", description: "Report accident and any injuries.", timerSeconds: null },
        { title: "Exchange information", description: "Get insurance and contact info from other drivers.", timerSeconds: null }
      ]
    },
    {
      title: "Power Outage Prep",
      oneLiner: "Stay safe during extended outage",
      category: "Survive" as const,
      urgency: "WARNING" as const,
      estMinutes: 30,
      cta: "Prepare",
      steps: [
        { title: "Check circuit breakers", description: "Make sure it's not just a tripped breaker.", timerSeconds: null },
        { title: "Use flashlights only", description: "Never use candles - fire hazard.", timerSeconds: null },
        { title: "Keep fridge closed", description: "Food stays cold 4 hours if door stays shut.", timerSeconds: null },
        { title: "Unplug electronics", description: "Prevent damage from power surges.", timerSeconds: null },
        { title: "Stay warm safely", description: "Layer clothing, never use gas appliances for heat.", timerSeconds: null }
      ]
    },
    {
      title: "Gas Leak Emergency",
      oneLiner: "Detect and escape gas leak",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Evacuate",
      steps: [
        { title: "Don't use electrical switches", description: "No lights, phones, or appliances.", timerSeconds: null },
        { title: "Open windows and doors", description: "Ventilate area if safe to do so.", timerSeconds: null },
        { title: "Leave immediately", description: "Get everyone out of building.", timerSeconds: null },
        { title: "Call gas company", description: "Use phone away from building to report leak.", timerSeconds: null },
        { title: "Don't return", description: "Stay away until professionals say it's safe.", timerSeconds: null }
      ]
    },
    {
      title: "Blizzard Survival",
      oneLiner: "Survive severe winter storm",
      category: "Survive" as const,
      urgency: "WARNING" as const,
      estMinutes: 45,
      cta: "Weather Storm",
      steps: [
        { title: "Stay indoors", description: "Don't travel unless absolutely necessary.", timerSeconds: null },
        { title: "Conserve heat", description: "Close off unused rooms, wear layers.", timerSeconds: null },
        { title: "Prepare backup heat", description: "Have safe alternative heating method ready.", timerSeconds: null },
        { title: "Clear exhaust vents", description: "Keep car exhaust and heating vents clear of snow.", timerSeconds: null },
        { title: "Stay hydrated", description: "Eat regularly and drink plenty of fluids.", timerSeconds: null }
      ]
    },
    {
      title: "Building Collapse",
      oneLiner: "Escape trapped in collapsed building",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 15,
      cta: "Escape",
      steps: [
        { title: "Protect airway", description: "Cover nose and mouth with cloth to filter dust.", timerSeconds: null },
        { title: "Don't light matches", description: "Gas lines may be broken - avoid sparks.", timerSeconds: null },
        { title: "Make noise", description: "Tap on pipes or walls to signal rescuers.", timerSeconds: null },
        { title: "Conserve energy", description: "Don't shout unless you hear rescuers nearby.", timerSeconds: null },
        { title: "Move carefully", description: "Avoid causing further collapse.", timerSeconds: null }
      ]
    },
    {
      title: "Active Shooter Safety",
      oneLiner: "Run, hide, fight survival strategy",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Stay Safe",
      steps: [
        { title: "Run if safe route", description: "Evacuate immediately if you can safely.", timerSeconds: null },
        { title: "Hide if can't run", description: "Lock doors, turn off lights, silence phones.", timerSeconds: null },
        { title: "Stay quiet", description: "Don't make noise that could attract attention.", timerSeconds: null },
        { title: "Call 911 when safe", description: "Report location and what you know.", timerSeconds: null },
        { title: "Fight as last resort", description: "Work together to incapacitate if confronted.", timerSeconds: null }
      ]
    },
    {
      title: "Chemical Spill Safety",
      oneLiner: "Protect from hazardous chemicals",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Stay Safe",
      steps: [
        { title: "Evacuate upwind", description: "Move away from spill, stay upwind and uphill.", timerSeconds: null },
        { title: "Don't touch anything", description: "Avoid contact with spilled material.", timerSeconds: null },
        { title: "Remove contaminated clothing", description: "Take off affected clothes without pulling over head.", timerSeconds: null },
        { title: "Flush with water", description: "Rinse exposed skin with water for 15 minutes.", timerSeconds: 900 },
        { title: "Seek medical attention", description: "Get professional medical care immediately.", timerSeconds: null }
      ]
    },
    {
      title: "Elevator Emergency",
      oneLiner: "Stay safe in stuck elevator",
      category: "Survive" as const,
      urgency: "WARNING" as const,
      estMinutes: 20,
      cta: "Stay Calm",
      steps: [
        { title: "Press alarm button", description: "Use emergency button to call for help.", timerSeconds: null },
        { title: "Use emergency phone", description: "Call building security or 911.", timerSeconds: null },
        { title: "Don't try to escape", description: "Never try to climb out through ceiling.", timerSeconds: null },
        { title: "Stay calm", description: "Help others remain calm and comfortable.", timerSeconds: null },
        { title: "Wait for professionals", description: "Let trained personnel handle the rescue.", timerSeconds: null }
      ]
    },
    {
      title: "Water Emergency",
      oneLiner: "Help someone drowning",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Rescue",
      steps: [
        { title: "Don't enter water", description: "Throw flotation device or extend pole/rope.", timerSeconds: null },
        { title: "Call for help", description: "Shout for lifeguard or call 911.", timerSeconds: null },
        { title: "Throw something that floats", description: "Life ring, cooler, or anything that floats.", timerSeconds: null },
        { title: "Talk to victim", description: "Keep them calm and tell them help is coming.", timerSeconds: null },
        { title: "Start CPR if needed", description: "Once out of water, check breathing and pulse.", timerSeconds: null }
      ]
    },
    {
      title: "Ice Rescue",
      oneLiner: "Help someone who fell through ice",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Rescue Fast",
      steps: [
        { title: "Don't go on ice", description: "Call 911 immediately, don't become second victim.", timerSeconds: null },
        { title: "Extend something long", description: "Use rope, pole, or branch from safe distance.", timerSeconds: null },
        { title: "Tell them what to do", description: "Shout instructions to kick legs and pull up.", timerSeconds: null },
        { title: "Pull horizontally", description: "Help them slide out flat on ice.", timerSeconds: null },
        { title: "Treat for hypothermia", description: "Get warm dry clothes and medical help.", timerSeconds: null }
      ]
    },
    {
      title: "Lightning Safety",
      oneLiner: "Avoid lightning strikes",
      category: "Survive" as const,
      urgency: "WARNING" as const,
      estMinutes: 15,
      cta: "Find Shelter",
      steps: [
        { title: "Get inside immediately", description: "Go to substantial building or hard-topped vehicle.", timerSeconds: null },
        { title: "Avoid tall objects", description: "Stay away from trees, poles, and metal objects.", timerSeconds: null },
        { title: "Crouch if caught outside", description: "Make yourself small, feet together, hands on knees.", timerSeconds: null },
        { title: "Don't lie flat", description: "Minimize contact with ground.", timerSeconds: null },
        { title: "Wait 30 minutes", description: "Stay sheltered 30 minutes after last thunder.", timerSeconds: 1800 }
      ]
    },
    {
      title: "Severe Allergic Reaction",
      oneLiner: "Handle anaphylactic emergency",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Act Fast",
      steps: [
        { title: "Use EpiPen if available", description: "Give injection into outer thigh.", timerSeconds: null },
        { title: "Call 911 immediately", description: "Even with EpiPen, emergency care needed.", timerSeconds: null },
        { title: "Help person lie down", description: "Elevate legs unless difficulty breathing.", timerSeconds: null },
        { title: "Loosen tight clothing", description: "Make breathing easier.", timerSeconds: null },
        { title: "Be ready for CPR", description: "Monitor breathing and be prepared to resuscitate.", timerSeconds: null }
      ]
    },
    {
      title: "Workplace Violence",
      oneLiner: "Stay safe during workplace threat",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 10,
      cta: "Stay Safe",
      steps: [
        { title: "Stay calm", description: "Don't escalate the situation with arguments.", timerSeconds: null },
        { title: "Alert others discretely", description: "Signal coworkers if possible without provoking.", timerSeconds: null },
        { title: "Keep distance", description: "Maintain safe space between you and threat.", timerSeconds: null },
        { title: "Plan escape route", description: "Know where exits are and how to reach them.", timerSeconds: null },
        { title: "Call 911 when safe", description: "Report incident as soon as you're safe.", timerSeconds: null }
      ]
    },
    {
      title: "Hazmat Incident",
      oneLiner: "Respond to chemical hazard",
      category: "Survive" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 15,
      cta: "Evacuate",
      steps: [
        { title: "Identify the hazard", description: "Look for warning labels, placards, or smell.", timerSeconds: null },
        { title: "Evacuate immediately", description: "Get as far away as possible, upwind.", timerSeconds: null },
        { title: "Avoid vapors", description: "Don't breathe fumes or touch contaminated areas.", timerSeconds: null },
        { title: "Call 911", description: "Report type of chemical if known.", timerSeconds: null },
        { title: "Decontaminate if exposed", description: "Remove clothes, wash with soap and water.", timerSeconds: null }
      ]
    },
    {
      title: "Pandemic Quarantine",
      oneLiner: "Stay safe during disease outbreak",
      category: "Survive" as const,
      urgency: "WARNING" as const,
      estMinutes: 30,
      cta: "Stay Safe",
      steps: [
        { title: "Stay home", description: "Avoid unnecessary contact with others.", timerSeconds: null },
        { title: "Maintain hygiene", description: "Wash hands frequently, clean surfaces.", timerSeconds: null },
        { title: "Monitor symptoms", description: "Watch for fever, cough, or other signs.", timerSeconds: null },
        { title: "Stock essentials", description: "Have 14 days of food, water, and medications.", timerSeconds: null },
        { title: "Follow health guidance", description: "Listen to official health department instructions.", timerSeconds: null }
      ]
    }
  ];

  // Fix packs (20)
  const fixPacks = [
    {
      title: "Flat Tire Change",
      oneLiner: "Replace flat tire safely",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 30,
      cta: "Fix It",
      steps: [
        { title: "Find safe location", description: "Pull over to flat, stable ground away from traffic.", timerSeconds: null },
        { title: "Apply parking brake", description: "Set brake and turn on hazard lights.", timerSeconds: null },
        { title: "Loosen lug nuts", description: "Turn counterclockwise while tire is on ground.", timerSeconds: null },
        { title: "Jack up vehicle", description: "Place jack under frame, lift until tire clears ground.", timerSeconds: null },
        { title: "Remove and replace", description: "Take off flat, put on spare, tighten lug nuts.", timerSeconds: null }
      ]
    },
    {
      title: "Clogged Drain",
      oneLiner: "Clear blocked sink or tub drain",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 20,
      cta: "Unclog",
      steps: [
        { title: "Remove visible debris", description: "Pull out hair, food, or other blockage by hand.", timerSeconds: null },
        { title: "Try hot water", description: "Pour very hot water down drain to dissolve grease.", timerSeconds: null },
        { title: "Use plunger", description: "Cover overflow holes, plunge with firm pressure.", timerSeconds: null },
        { title: "Try baking soda", description: "Pour 1/2 cup baking soda, then vinegar, wait 15 min.", timerSeconds: 900 },
        { title: "Snake the drain", description: "Use drain snake or wire coat hanger to break up clog.", timerSeconds: null }
      ]
    },
    {
      title: "Circuit Breaker Reset",
      oneLiner: "Restore power after circuit trips",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Reset Power",
      steps: [
        { title: "Turn off appliances", description: "Unplug devices that may have caused overload.", timerSeconds: null },
        { title: "Find breaker panel", description: "Locate main electrical panel in basement or utility room.", timerSeconds: null },
        { title: "Identify tripped breaker", description: "Look for switch in middle position or marked 'OFF'.", timerSeconds: null },
        { title: "Reset the breaker", description: "Push switch fully to OFF, then back to ON.", timerSeconds: null },
        { title: "Test the power", description: "Check if outlets work, plug appliances back in slowly.", timerSeconds: null }
      ]
    },
    {
      title: "Running Toilet Fix",
      oneLiner: "Stop toilet from running constantly",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Stop Running",
      steps: [
        { title: "Remove toilet tank lid", description: "Lift off lid carefully and set aside.", timerSeconds: null },
        { title: "Check flapper", description: "Make sure rubber flapper seals properly over drain.", timerSeconds: null },
        { title: "Adjust chain", description: "Chain should have slight slack, not too tight or loose.", timerSeconds: null },
        { title: "Bend float arm", description: "If water level high, gently bend float arm down.", timerSeconds: null },
        { title: "Replace if needed", description: "If parts are warped or cracked, replace them.", timerSeconds: null }
      ]
    },
    {
      title: "Squeaky Hinge",
      oneLiner: "Stop door hinges from squeaking",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 5,
      cta: "Silence Squeak",
      steps: [
        { title: "Clean the hinges", description: "Wipe away dirt and old grease with damp cloth.", timerSeconds: null },
        { title: "Apply lubricant", description: "Use WD-40, 3-in-1 oil, or petroleum jelly.", timerSeconds: null },
        { title: "Work the door", description: "Open and close door several times to distribute oil.", timerSeconds: null },
        { title: "Wipe excess", description: "Clean off extra lubricant to prevent dirt buildup.", timerSeconds: null },
        { title: "Repeat if needed", description: "May need second application for stubborn squeaks.", timerSeconds: null }
      ]
    },
    {
      title: "Dead Car Battery",
      oneLiner: "Jump start dead battery safely",
      category: "Fix" as const,
      urgency: "WARNING" as const,
      estMinutes: 15,
      cta: "Jump Start",
      steps: [
        { title: "Position vehicles", description: "Park running car close enough for cables to reach.", timerSeconds: null },
        { title: "Connect positive cables", description: "Red cable to positive terminals on both batteries.", timerSeconds: null },
        { title: "Connect negative", description: "Black cable to negative on good battery, ground on dead car.", timerSeconds: null },
        { title: "Start running car", description: "Let it run for 2-3 minutes to charge dead battery.", timerSeconds: 180 },
        { title: "Start dead car", description: "Try starting, if no luck wait longer before retry.", timerSeconds: null }
      ]
    },
    {
      title: "Garbage Disposal Jam",
      oneLiner: "Unjam stuck garbage disposal",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Unjam",
      steps: [
        { title: "Turn off power", description: "Switch off at wall and unplug under sink.", timerSeconds: null },
        { title: "Never use hands", description: "Use tongs or pliers to remove visible objects.", timerSeconds: null },
        { title: "Use allen wrench", description: "Turn disposal manually from bottom with hex key.", timerSeconds: null },
        { title: "Press reset button", description: "Find red reset button on bottom of unit.", timerSeconds: null },
        { title: "Test carefully", description: "Turn power back on and test with water running.", timerSeconds: null }
      ]
    },
    {
      title: "Overheating Car",
      oneLiner: "Cool down overheated engine",
      category: "Fix" as const,
      urgency: "WARNING" as const,
      estMinutes: 20,
      cta: "Cool Down",
      steps: [
        { title: "Pull over safely", description: "Stop driving immediately, engine damage possible.", timerSeconds: null },
        { title: "Turn off AC", description: "Turn on heater to full blast to help cool engine.", timerSeconds: null },
        { title: "Wait for cool down", description: "Let engine cool 30 minutes before opening hood.", timerSeconds: 1800 },
        { title: "Check coolant level", description: "Add coolant or water if level is low.", timerSeconds: null },
        { title: "Drive slowly", description: "Get to mechanic slowly, watch temperature gauge.", timerSeconds: null }
      ]
    },
    {
      title: "Leaky Faucet",
      oneLiner: "Stop dripping faucet",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 25,
      cta: "Stop Drip",
      steps: [
        { title: "Turn off water", description: "Shut off water supply valves under sink.", timerSeconds: null },
        { title: "Remove handle", description: "Take off faucet handle to access packing nut.", timerSeconds: null },
        { title: "Replace O-ring", description: "Remove old O-ring and replace with exact match.", timerSeconds: null },
        { title: "Reassemble faucet", description: "Put handle back on and tighten packing nut.", timerSeconds: null },
        { title: "Test the repair", description: "Turn water back on and check for leaks.", timerSeconds: null }
      ]
    },
    {
      title: "Stuck Window",
      oneLiner: "Free window that won't open",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 20,
      cta: "Free Window",
      steps: [
        { title: "Check window locks", description: "Make sure all locks and latches are disengaged.", timerSeconds: null },
        { title: "Tap frame gently", description: "Use rubber mallet or hammer with cloth padding.", timerSeconds: null },
        { title: "Lubricate tracks", description: "Spray WD-40 or soap on window tracks and hardware.", timerSeconds: null },
        { title: "Work window up/down", description: "Gently move window back and forth to loosen.", timerSeconds: null },
        { title: "Check for paint seal", description: "Cut paint seal with utility knife if painted shut.", timerSeconds: null }
      ]
    },
    {
      title: "Water Heater Pilot",
      oneLiner: "Relight water heater pilot light",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Relight",
      steps: [
        { title: "Turn gas to OFF", description: "Wait 5 minutes for gas to clear before continuing.", timerSeconds: 300 },
        { title: "Find pilot light", description: "Locate pilot light assembly at bottom of water heater.", timerSeconds: null },
        { title: "Turn to pilot", description: "Set gas control to PILOT position.", timerSeconds: null },
        { title: "Light with igniter", description: "Hold igniter while pressing pilot button.", timerSeconds: null },
        { title: "Hold 30 seconds", description: "Keep pilot button down, then set to ON.", timerSeconds: 30 }
      ]
    },
    {
      title: "Broken Light Switch",
      oneLiner: "Replace non-working light switch",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 20,
      cta: "Replace",
      steps: [
        { title: "Turn off power", description: "Flip circuit breaker for that room OFF.", timerSeconds: null },
        { title: "Test with meter", description: "Use voltage tester to confirm power is off.", timerSeconds: null },
        { title: "Remove old switch", description: "Unscrew and pull switch from wall box.", timerSeconds: null },
        { title: "Connect new wires", description: "Match wire colors: black to brass, white to silver.", timerSeconds: null },
        { title: "Install and test", description: "Screw in new switch, turn power on, test.", timerSeconds: null }
      ]
    },
    {
      title: "Smartphone Won't Start",
      oneLiner: "Revive unresponsive phone",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Restart",
      steps: [
        { title: "Charge the battery", description: "Connect to charger for at least 30 minutes.", timerSeconds: 1800 },
        { title: "Force restart", description: "Hold power + volume down for 10-15 seconds.", timerSeconds: 15 },
        { title: "Try different charger", description: "Use different cable and power adapter.", timerSeconds: null },
        { title: "Check charging port", description: "Clean out lint or debris with toothpick.", timerSeconds: null },
        { title: "Seek repair help", description: "If still won't start, contact manufacturer.", timerSeconds: null }
      ]
    },
    {
      title: "Slow Internet Fix",
      oneLiner: "Speed up slow internet connection",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Speed Up",
      steps: [
        { title: "Restart router", description: "Unplug for 30 seconds, then plug back in.", timerSeconds: 30 },
        { title: "Check device count", description: "Too many devices can slow connection.", timerSeconds: null },
        { title: "Move closer to router", description: "Walls and distance affect WiFi speed.", timerSeconds: null },
        { title: "Update router firmware", description: "Check manufacturer's website for updates.", timerSeconds: null },
        { title: "Call internet provider", description: "May be service issue in your area.", timerSeconds: null }
      ]
    },
    {
      title: "Washing Machine Won't Drain",
      oneLiner: "Fix washer that won't empty",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 30,
      cta: "Fix Drain",
      steps: [
        { title: "Check drain hose", description: "Make sure hose isn't kinked or clogged.", timerSeconds: null },
        { title: "Clean lint filter", description: "Remove and clean filter if machine has one.", timerSeconds: null },
        { title: "Check load balance", description: "Redistribute clothes if bunched to one side.", timerSeconds: null },
        { title: "Run drain cycle", description: "Try drain/spin cycle without wash.", timerSeconds: null },
        { title: "Check for clogs", description: "Look for socks or small items blocking drain.", timerSeconds: null }
      ]
    },
    {
      title: "Air Conditioner Not Cooling",
      oneLiner: "Get AC working again",
      category: "Fix" as const,
      urgency: "WARNING" as const,
      estMinutes: 20,
      cta: "Cool Down",
      steps: [
        { title: "Check thermostat", description: "Make sure it's set to cool and temperature is low.", timerSeconds: null },
        { title: "Replace air filter", description: "Dirty filter blocks airflow and reduces cooling.", timerSeconds: null },
        { title: "Clear outdoor unit", description: "Remove leaves, debris from around outside unit.", timerSeconds: null },
        { title: "Check circuit breaker", description: "Make sure AC breaker hasn't tripped.", timerSeconds: null },
        { title: "Wait and retry", description: "Turn off 5 minutes, then back on.", timerSeconds: 300 }
      ]
    },
    {
      title: "Computer Won't Start",
      oneLiner: "Troubleshoot computer startup issues",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Boot Up",
      steps: [
        { title: "Check power connection", description: "Make sure power cord is firmly plugged in.", timerSeconds: null },
        { title: "Try different outlet", description: "Test with known working electrical outlet.", timerSeconds: null },
        { title: "Hold power button", description: "Press and hold power button for 10 seconds.", timerSeconds: 10 },
        { title: "Remove peripherals", description: "Disconnect USB devices, external drives.", timerSeconds: null },
        { title: "Check RAM", description: "Reseat memory modules if comfortable doing so.", timerSeconds: null }
      ]
    },
    {
      title: "Garbage Disposal Smell",
      oneLiner: "Eliminate bad disposal odors",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Freshen Up",
      steps: [
        { title: "Run cold water", description: "Always use cold water when running disposal.", timerSeconds: null },
        { title: "Grind ice cubes", description: "Ice helps clean blades and remove buildup.", timerSeconds: null },
        { title: "Add citrus peels", description: "Grind lemon or orange peels for fresh scent.", timerSeconds: null },
        { title: "Use baking soda", description: "Pour 1/2 cup baking soda, let sit 30 minutes.", timerSeconds: 1800 },
        { title: "Flush with water", description: "Run cold water and disposal to rinse clean.", timerSeconds: null }
      ]
    },
    {
      title: "Sticky Door Lock",
      oneLiner: "Free stuck or hard-to-turn lock",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Lubricate",
      steps: [
        { title: "Clean the keyhole", description: "Use compressed air to blow out dirt and debris.", timerSeconds: null },
        { title: "Lubricate with graphite", description: "Use pencil lead or graphite spray, not oil.", timerSeconds: null },
        { title: "Work key in and out", description: "Insert and remove key several times.", timerSeconds: null },
        { title: "Check door alignment", description: "Make sure door isn't sagging and binding.", timerSeconds: null },
        { title: "Test operation", description: "Key should turn smoothly in both directions.", timerSeconds: null }
      ]
    },
    {
      title: "Ceiling Fan Wobble",
      oneLiner: "Stop wobbly ceiling fan",
      category: "Fix" as const,
      urgency: "INFO" as const,
      estMinutes: 20,
      cta: "Balance",
      steps: [
        { title: "Turn off fan", description: "Make sure fan is completely stopped.", timerSeconds: null },
        { title: "Check mounting", description: "Tighten screws in mounting bracket.", timerSeconds: null },
        { title: "Balance the blades", description: "Use balancing kit or tape coins to light blade.", timerSeconds: null },
        { title: "Measure blade pitch", description: "All blades should be same distance from ceiling.", timerSeconds: null },
        { title: "Test at low speed", description: "Run on low speed first to check for wobble.", timerSeconds: null }
      ]
    }
  ];

  // Speak packs (20)
  const speakPacks = [
    {
      title: "Emergency Spanish",
      oneLiner: "Key Spanish phrases for emergencies",
      category: "Speak" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Learn Now",
      steps: [
        { title: "Help me", description: "Ayúdame (ah-YOO-dah-meh)", timerSeconds: null },
        { title: "Call police", description: "Llame a la policía (YAH-meh ah lah po-lee-SEE-ah)", timerSeconds: null },
        { title: "I need a doctor", description: "Necesito un médico (neh-seh-SEE-toh oon MEH-dee-koh)", timerSeconds: null },
        { title: "Where is hospital?", description: "¿Dónde está el hospital? (DOHN-deh ehs-TAH el ohs-pee-TAHL)", timerSeconds: null },
        { title: "I don't understand", description: "No entiendo (noh en-tee-EN-doh)", timerSeconds: null }
      ]
    },
    {
      title: "Basic French Emergency",
      oneLiner: "Essential French for emergencies",
      category: "Speak" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Learn Fast",
      steps: [
        { title: "Help", description: "Au secours (oh suh-KOOR)", timerSeconds: null },
        { title: "Call ambulance", description: "Appelez une ambulance (ah-play oon ahm-boo-LAHNZ)", timerSeconds: null },
        { title: "I am hurt", description: "Je suis blessé(e) (zhuh swee bleh-SAY)", timerSeconds: null },
        { title: "Emergency", description: "Urgence (oor-ZHAHNZ)", timerSeconds: null },
        { title: "Do you speak English?", description: "Parlez-vous anglais? (par-lay voo ahn-GLEH)", timerSeconds: null }
      ]
    },
    {
      title: "German Emergency Words",
      oneLiner: "Critical German phrases",
      category: "Speak" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Learn Quick",
      steps: [
        { title: "Help", description: "Hilfe (HIL-feh)", timerSeconds: null },
        { title: "Emergency", description: "Notfall (NOHT-fahl)", timerSeconds: null },
        { title: "Call doctor", description: "Rufen Sie einen Arzt (ROO-fen zee I-nen ahrst)", timerSeconds: null },
        { title: "Hospital", description: "Krankenhaus (KRAHNG-ken-hous)", timerSeconds: null },
        { title: "I need help", description: "Ich brauche Hilfe (ikh BROW-kheh HIL-feh)", timerSeconds: null }
      ]
    },
    {
      title: "Public Speaking Confidence",
      oneLiner: "Overcome speaking anxiety quickly",
      category: "Speak" as const,
      urgency: "WARNING" as const,
      estMinutes: 10,
      cta: "Build Confidence",
      steps: [
        { title: "Take deep breaths", description: "Breathe slowly and deeply to calm nerves.", timerSeconds: null },
        { title: "Practice power pose", description: "Stand tall, shoulders back for 2 minutes.", timerSeconds: 120 },
        { title: "Visualize success", description: "Imagine audience responding positively.", timerSeconds: null },
        { title: "Start with friendly faces", description: "Make eye contact with smiling people first.", timerSeconds: null },
        { title: "Speak slowly", description: "Take your time, don't rush through content.", timerSeconds: null }
      ]
    },
    {
      title: "Job Interview Prep",
      oneLiner: "Last-minute interview preparation",
      category: "Speak" as const,
      urgency: "WARNING" as const,
      estMinutes: 15,
      cta: "Prepare Now",
      steps: [
        { title: "Research the company", description: "Know their mission, values, and recent news.", timerSeconds: null },
        { title: "Practice elevator pitch", description: "30-second summary of your background.", timerSeconds: null },
        { title: "Prepare STAR examples", description: "Situation, Task, Action, Result stories.", timerSeconds: null },
        { title: "Plan questions to ask", description: "Show interest with thoughtful questions.", timerSeconds: null },
        { title: "Arrive 10 minutes early", description: "Be punctual but not too early.", timerSeconds: null }
      ]
    },
    {
      title: "Difficult Conversation",
      oneLiner: "Handle tough conversations with grace",
      category: "Speak" as const,
      urgency: "WARNING" as const,
      estMinutes: 20,
      cta: "Communicate",
      steps: [
        { title: "Choose right time/place", description: "Private setting when both are calm.", timerSeconds: null },
        { title: "Use 'I' statements", description: "Express your feelings without blaming.", timerSeconds: null },
        { title: "Listen actively", description: "Give full attention to their perspective.", timerSeconds: null },
        { title: "Stay calm", description: "Keep emotions in check, don't escalate.", timerSeconds: null },
        { title: "Find common ground", description: "Look for shared goals or values.", timerSeconds: null }
      ]
    },
    {
      title: "Complaint Resolution",
      oneLiner: "Effectively voice complaints",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Resolve Issue",
      steps: [
        { title: "Stay calm and polite", description: "Anger rarely leads to better outcomes.", timerSeconds: null },
        { title: "State facts clearly", description: "What happened, when, where, who was involved.", timerSeconds: null },
        { title: "Explain desired outcome", description: "Be specific about what you want.", timerSeconds: null },
        { title: "Ask for escalation", description: "Request supervisor if needed.", timerSeconds: null },
        { title: "Document everything", description: "Keep records of conversations and actions.", timerSeconds: null }
      ]
    },
    {
      title: "Meeting Facilitation",
      oneLiner: "Run effective meetings",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 30,
      cta: "Lead Meeting",
      steps: [
        { title: "Set clear agenda", description: "Share objectives and time limits in advance.", timerSeconds: null },
        { title: "Start on time", description: "Respect everyone's schedule.", timerSeconds: null },
        { title: "Encourage participation", description: "Ask quiet members for input.", timerSeconds: null },
        { title: "Keep on track", description: "Redirect off-topic discussions politely.", timerSeconds: null },
        { title: "End with action items", description: "Assign tasks with deadlines.", timerSeconds: null }
      ]
    },
    {
      title: "Phone Call Confidence",
      oneLiner: "Make important calls with confidence",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Call Now",
      steps: [
        { title: "Prepare talking points", description: "Write down key points you want to cover.", timerSeconds: null },
        { title: "Practice introduction", description: "Know how you'll introduce yourself.", timerSeconds: null },
        { title: "Stand while talking", description: "Improves voice projection and confidence.", timerSeconds: null },
        { title: "Smile when speaking", description: "It comes through in your voice.", timerSeconds: null },
        { title: "Take notes", description: "Write down important information discussed.", timerSeconds: null }
      ]
    },
    {
      title: "Networking Conversation",
      oneLiner: "Start meaningful professional connections",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Network",
      steps: [
        { title: "Approach with confidence", description: "Smile and make eye contact.", timerSeconds: null },
        { title: "Ask open questions", description: "What brings you to this event?", timerSeconds: null },
        { title: "Listen more than talk", description: "Show genuine interest in their work.", timerSeconds: null },
        { title: "Share your value", description: "Briefly explain how you might help them.", timerSeconds: null },
        { title: "Follow up promptly", description: "Connect within 24-48 hours.", timerSeconds: null }
      ]
    },
    {
      title: "Presentation Skills",
      oneLiner: "Deliver compelling presentations",
      category: "Speak" as const,
      urgency: "WARNING" as const,
      estMinutes: 25,
      cta: "Present Well",
      steps: [
        { title: "Know your audience", description: "Tailor content to their interests and level.", timerSeconds: null },
        { title: "Structure clearly", description: "Tell them what you'll tell them, tell them, recap.", timerSeconds: null },
        { title: "Use visual aids", description: "Support points with simple, clear slides.", timerSeconds: null },
        { title: "Practice out loud", description: "Rehearse actual speaking, not just reading.", timerSeconds: null },
        { title: "Engage with questions", description: "Encourage and welcome audience interaction.", timerSeconds: null }
      ]
    },
    {
      title: "Conflict De-escalation",
      oneLiner: "Calm heated arguments quickly",
      category: "Speak" as const,
      urgency: "WARNING" as const,
      estMinutes: 10,
      cta: "De-escalate",
      steps: [
        { title: "Lower your voice", description: "Speak softly to encourage them to do same.", timerSeconds: null },
        { title: "Acknowledge emotions", description: "I can see you're really frustrated.", timerSeconds: null },
        { title: "Find agreement", description: "Identify something you both agree on.", timerSeconds: null },
        { title: "Ask questions", description: "Help them think instead of just react.", timerSeconds: null },
        { title: "Suggest break if needed", description: "Take time to cool down if emotions high.", timerSeconds: null }
      ]
    },
    {
      title: "Customer Service Language",
      oneLiner: "Professional customer interaction phrases",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 10,
      cta: "Serve Better",
      steps: [
        { title: "Acknowledge immediately", description: "Thank you for calling/coming in today.", timerSeconds: null },
        { title: "Show empathy", description: "I understand how frustrating that must be.", timerSeconds: null },
        { title: "Take ownership", description: "Let me see what I can do to help.", timerSeconds: null },
        { title: "Explain clearly", description: "Here's what I found and what I recommend.", timerSeconds: null },
        { title: "Follow up", description: "Is there anything else I can help with?", timerSeconds: null }
      ]
    },
    {
      title: "Negotiation Tactics",
      oneLiner: "Get better deals through smart talking",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 20,
      cta: "Negotiate",
      steps: [
        { title: "Research beforehand", description: "Know market prices and alternatives.", timerSeconds: null },
        { title: "Start with rapport", description: "Build connection before discussing terms.", timerSeconds: null },
        { title: "Ask for more than expected", description: "Leave room for compromise.", timerSeconds: null },
        { title: "Use silence effectively", description: "Let them fill uncomfortable pauses.", timerSeconds: null },
        { title: "Look for win-win", description: "Find solutions that benefit both parties.", timerSeconds: null }
      ]
    },
    {
      title: "Teaching/Training Speaking",
      oneLiner: "Explain complex topics clearly",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 30,
      cta: "Teach Well",
      steps: [
        { title: "Start with overview", description: "Explain what they'll learn and why it matters.", timerSeconds: null },
        { title: "Break into small steps", description: "Chunk information into digestible pieces.", timerSeconds: null },
        { title: "Use examples", description: "Give concrete examples they can relate to.", timerSeconds: null },
        { title: "Check understanding", description: "Ask questions to ensure they're following.", timerSeconds: null },
        { title: "Encourage practice", description: "Let them try it with your guidance.", timerSeconds: null }
      ]
    },
    {
      title: "Workplace Boundaries",
      oneLiner: "Set professional limits respectfully",
      category: "Speak" as const,
      urgency: "WARNING" as const,
      estMinutes: 15,
      cta: "Set Boundaries",
      steps: [
        { title: "Be direct but polite", description: "I'm not able to take on additional projects right now.", timerSeconds: null },
        { title: "Offer alternatives", description: "Here's when I could help or who else might.", timerSeconds: null },
        { title: "Explain your reasoning", description: "I want to maintain quality on current commitments.", timerSeconds: null },
        { title: "Stay consistent", description: "Don't make exceptions that undermine boundaries.", timerSeconds: null },
        { title: "Document if needed", description: "Keep records of repeated boundary violations.", timerSeconds: null }
      ]
    },
    {
      title: "Giving Constructive Feedback",
      oneLiner: "Deliver feedback that helps improve",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Give Feedback",
      steps: [
        { title: "Focus on behavior", description: "Address actions, not personality traits.", timerSeconds: null },
        { title: "Be specific", description: "Give concrete examples of what happened.", timerSeconds: null },
        { title: "Explain impact", description: "How their actions affected others or outcomes.", timerSeconds: null },
        { title: "Suggest improvements", description: "Offer specific ways to do better.", timerSeconds: null },
        { title: "End positively", description: "Express confidence in their ability to improve.", timerSeconds: null }
      ]
    },
    {
      title: "International Business Phrases",
      oneLiner: "Professional English for global business",
      category: "Speak" as const,
      urgency: "INFO" as const,
      estMinutes: 15,
      cta: "Communicate",
      steps: [
        { title: "Formal greetings", description: "Good morning, thank you for your time today.", timerSeconds: null },
        { title: "Clarifying understanding", description: "Could you please clarify what you mean by...?", timerSeconds: null },
        { title: "Polite disagreement", description: "I see your point, however I have a different perspective.", timerSeconds: null },
        { title: "Requesting action", description: "Would it be possible to have this by Friday?", timerSeconds: null },
        { title: "Professional closing", description: "Thank you for your time. I look forward to hearing from you.", timerSeconds: null }
      ]
    },
    {
      title: "Emergency Communication",
      oneLiner: "Communicate clearly in crisis situations",
      category: "Speak" as const,
      urgency: "EMERGENCY" as const,
      estMinutes: 5,
      cta: "Communicate",
      steps: [
        { title: "State emergency clearly", description: "This is an emergency. I need immediate help.", timerSeconds: null },
        { title: "Give your location", description: "I am at [address/landmark]. Can you find me?", timerSeconds: null },
        { title: "Describe the situation", description: "Someone is hurt/there's a fire/we need police.", timerSeconds: null },
        { title: "Stay on the line", description: "Don't hang up unless told to by dispatcher.", timerSeconds: null },
        { title: "Answer questions clearly", description: "Give short, accurate answers to their questions.", timerSeconds: null }
      ]
    },
    {
      title: "Medical Communication",
      oneLiner: "Talk to doctors and medical staff effectively",
      category: "Speak" as const,
      urgency: "WARNING" as const,
      estMinutes: 10,
      cta: "Communicate",
      steps: [
        { title: "Prepare symptom list", description: "Write down symptoms, when they started, severity.", timerSeconds: null },
        { title: "List current medications", description: "Include prescriptions, over-counter, supplements.", timerSeconds: null },
        { title: "Ask questions", description: "What does this mean? What are my options?", timerSeconds: null },
        { title: "Repeat instructions", description: "Let me make sure I understand correctly...", timerSeconds: null },
        { title: "Get written summary", description: "Ask for written instructions or next steps.", timerSeconds: null }
      ]
    }
  ];

  return [...healthPacks, ...survivePacks, ...fixPacks, ...speakPacks];
}