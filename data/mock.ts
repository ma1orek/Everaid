import { Pack, StepsBlock } from "./models";

// Comprehensive pack data (24+ packs as specified)
export const mockPacks: Pack[] = [
  // HEALTH (green) #34C759
  {
    id: "bleeding_control",
    umbrella: "HEALTH",
    title: "Bleeding Control",
    cta: "Stop Bleeding",
    oneLiner: "Stop heavy bleeding fast until help arrives.",
    urgency: "emergency",
    etaMin: 10,
    icon: "heart-pulse",
    isOffline: true
  },
  {
    id: "heatstroke",
    umbrella: "HEALTH", 
    title: "Heatstroke",
    cta: "Cool Down",
    oneLiner: "Cool down safely and monitor for shock.",
    urgency: "emergency",
    etaMin: 10,
    icon: "thermometer"
  },
  {
    id: "nosebleed",
    umbrella: "HEALTH",
    title: "Nosebleed",
    cta: "Stop Nosebleed", 
    oneLiner: "Pinch, lean forward, avoid head tilt.",
    urgency: "info",
    etaMin: 5,
    icon: "droplets"
  },
  {
    id: "panic_calm",
    umbrella: "HEALTH",
    title: "Panic Calm-Down",
    cta: "Start Breathing",
    oneLiner: "Box breathing and 5-4-3-2-1 grounding.",
    urgency: "info", 
    etaMin: 4,
    icon: "wind"
  },
  {
    id: "cpr_basics",
    umbrella: "HEALTH",
    title: "CPR Basics",
    cta: "Start CPR",
    oneLiner: "30 compressions / 2 breaths timing aid.",
    urgency: "emergency",
    etaMin: 3,
    icon: "heart",
    isOffline: true
  },
  {
    id: "hypothermia",
    umbrella: "HEALTH",
    title: "Hypothermia",
    cta: "Warm Up",
    oneLiner: "Core rewarming and safe handling.",
    urgency: "warning",
    etaMin: 20,
    icon: "snowflake"
  },
  {
    id: "sprain_ankle",
    umbrella: "HEALTH",
    title: "Sprained Ankle",
    cta: "Stabilize",
    oneLiner: "RICE: Rest, Ice, Compress, Elevate.",
    urgency: "info",
    etaMin: 7,
    icon: "footprint"
  },
  {
    id: "frostbite",
    umbrella: "HEALTH",
    title: "Frostbite",
    cta: "Rewarm Safely",
    oneLiner: "Warm water bath—never rub or dry heat.",
    urgency: "warning",
    etaMin: 15,
    icon: "snowflake"
  },

  // SURVIVE (orange) #FF9F0A  
  {
    id: "wind_shelter",
    umbrella: "SURVIVE",
    title: "Wind Shelter Basics", 
    cta: "Build Shelter",
    oneLiner: "A-frame tarp shelter when wind rips your tent.",
    urgency: "warning",
    etaMin: 15,
    icon: "home"
  },
  {
    id: "fire_nomatch",
    umbrella: "SURVIVE",
    title: "Fire Without Matches",
    cta: "Start Fire", 
    oneLiner: "Spark, tinder, and wind shield steps.",
    urgency: "info",
    etaMin: 12,
    icon: "flame"
  },
  {
    id: "water_purify",
    umbrella: "SURVIVE",
    title: "Water Purification",
    cta: "Purify Water",
    oneLiner: "Boil, filter, or tablets—choose quickly.",
    urgency: "info",
    etaMin: 8,
    icon: "droplet"
  },
  {
    id: "food_safety",
    umbrella: "SURVIVE", 
    title: "Food Safety Outdoors",
    cta: "Safe Food",
    oneLiner: "Avoid contamination and wildlife.",
    urgency: "info",
    etaMin: 6,
    icon: "apple"
  },
  {
    id: "wildlife_bear",
    umbrella: "SURVIVE",
    title: "Wildlife: Bear", 
    cta: "Bear Safety",
    oneLiner: "Defensive vs. predatory behavior responses.",
    urgency: "emergency",
    etaMin: 2,
    icon: "shield"
  },
  {
    id: "wildlife_snake",
    umbrella: "SURVIVE",
    title: "Wildlife: Snakebite",
    cta: "Stabilize",
    oneLiner: "Immobilize and monitor swelling; no cutting.",
    urgency: "emergency",
    etaMin: 10,
    icon: "snake"
  },
  {
    id: "storm_blackout",
    umbrella: "SURVIVE",
    title: "Storm Blackout",
    cta: "Stay Safe",
    oneLiner: "Light, ventilation, food, water checklist.",
    urgency: "info",
    etaMin: 5,
    icon: "cloud-lightning"
  },
  {
    id: "lost_night_trail",
    umbrella: "SURVIVE",
    title: "Night Trail Lost",
    cta: "Signal & Wait",
    oneLiner: "Stop, assess, signal, stay put and warm.",
    urgency: "warning",
    etaMin: 5,
    icon: "map"
  },

  // FIX (blue) #0A84FF
  {
    id: "flat_tire",
    umbrella: "FIX",
    title: "Flat Tire Kit",
    cta: "Change Wheel", 
    oneLiner: "Safe roadside wheel change.",
    urgency: "info",
    etaMin: 12,
    icon: "car",
    isOffline: true
  },
  {
    id: "jump_start",
    umbrella: "FIX",
    title: "Jump-Start Battery",
    cta: "Jump-Start",
    oneLiner: "+/+ then − to chassis; remove in reverse.",
    urgency: "info", 
    etaMin: 8,
    icon: "battery"
  },
  {
    id: "bike_chain",
    umbrella: "FIX",
    title: "Bike Chain Repair",
    cta: "Fix Chain",
    oneLiner: "Re-seat, quick link, tension check.",
    urgency: "info",
    etaMin: 10,
    icon: "bike"
  },
  {
    id: "phone_power",
    umbrella: "FIX",
    title: "Phone Power SOS", 
    cta: "Save Power",
    oneLiner: "Ultra-low battery playbook and charge hacks.",
    urgency: "info",
    etaMin: 3,
    icon: "smartphone"
  },
  {
    id: "patch_leak",
    umbrella: "FIX",
    title: "Patch a Leak",
    cta: "Patch Now",
    oneLiner: "Temporary hose/boot tape fix.",
    urgency: "warning", 
    etaMin: 10,
    icon: "wrench"
  },

  // SPEAK (teal) #00C7BE
  {
    id: "quick_phrases", 
    umbrella: "SPEAK",
    title: "Quick Phrases PL↔ES",
    cta: "Speak Phrase",
    oneLiner: "Show or play key phrases instantly.",
    urgency: "info",
    etaMin: 1,
    icon: "message-square",
    isOffline: true
  },
  {
    id: "big_text_id",
    umbrella: "SPEAK",
    title: "Big-Text Medical Card",
    cta: "Show Card", 
    oneLiner: "Display allergies, meds, contacts.",
    urgency: "info",
    etaMin: 1,
    icon: "file-text"
  },
  {
    id: "city_lost",
    umbrella: "SPEAK",
    title: "Lost in City",
    cta: "Get Directions",
    oneLiner: "Find main streets & transit hubs.",
    urgency: "info", 
    etaMin: 4,
    icon: "map-pin"
  },
  {
    id: "handover_report",
    umbrella: "SPEAK", 
    title: "Handover Report",
    cta: "Generate Report",
    oneLiner: "Create QR/PDF for responders.",
    urgency: "info",
    etaMin: 1,
    icon: "qr-code"
  },
  {
    id: "numbers_time",
    umbrella: "SPEAK",
    title: "Numbers & Time",
    cta: "Show Numbers",
    oneLiner: "Digits and time to coordinate.",
    urgency: "info",
    etaMin: 1,
    icon: "clock"
  }
];

// Comprehensive steps data
export const mockSteps: Record<string, StepsBlock> = {
  bleeding_control: {
    title: "Stop Bleeding",
    urgency: "emergency",
    etaMin: 10,
    steps: [
      { title: "Direct pressure", desc: "Cover with clean cloth and press firmly.", timerSec: 120 },
      { title: "Elevate limb", desc: "Keep above heart if possible." },
      { title: "Do not remove soaked pads", desc: "Add new layers on top; keep pressure." },
      { title: "Watch for shock", desc: "Pale skin, fast pulse, confusion. Keep warm." }
    ],
    source: "WHO First Aid (abridged)"
  },
  heatstroke: {
    title: "Cool Down",
    urgency: "emergency",
    etaMin: 10,
    steps: [
      { title: "Move to shade", desc: "Loosen clothing, fan air.", timerSec: 60 },
      { title: "Cool core", desc: "Wet skin; cold packs to armpits/groin/neck." },
      { title: "Sip water", desc: "If conscious; small sips only." },
      { title: "Monitor", desc: "Worsening confusion or vomiting → escalate." }
    ],
    source: "CDC Heat Stress (abridged)"
  },
  wind_shelter: {
    title: "Build Shelter",
    urgency: "warning", 
    etaMin: 15,
    steps: [
      { title: "Find leeward", desc: "Behind rock, trees, or slope." },
      { title: "A-frame", desc: "Tripod frame; ridge line taut." },
      { title: "Tarp on leeward", desc: "Stake low; close windward side." },
      { title: "Weight edges", desc: "Rocks/packs every 50 cm for stability." }
    ],
    source: "Fieldcraft Basics"
  },
  flat_tire: {
    title: "Change Wheel", 
    urgency: "info",
    etaMin: 12,
    steps: [
      { title: "Secure car", desc: "Hazards, handbrake, wheel chock. Make sure the car is on flat, solid ground away from traffic. Set parking brake and turn on hazard lights for visibility." },
      { title: "Loosen lugs", desc: "Quarter turn while on ground. Use the wrench in a counter-clockwise direction to break the initial resistance while tire still has traction." },
      { title: "Jack & swap", desc: "Jack at reinforced point; replace wheel. Locate the proper jacking point in your owner's manual. Raise the car until the flat tire is completely off the ground." },
      { title: "Tighten cross pattern", desc: "Lower car; torque diagonally. Hand-tighten in a star pattern, lower the jack, then fully tighten with the wrench using the same pattern." }
    ],
    source: "Roadside Guide"
  },
  jump_start: {
    title: "Jump-Start",
    urgency: "info",
    etaMin: 8,
    steps: [
      { title: "Place cars neutral/park", desc: "Ignitions off; parking brakes on." },
      { title: "Clamp order", desc: "+ donor to + dead, + dead to + dead, − donor to chassis of dead." },
      { title: "Start donor, then dead", desc: "Wait 1–2 min before attempt." },
      { title: "Remove in reverse", desc: "Keep clamps from touching." }
    ],
    source: "Owner's manual (common pattern)"
  },
  panic_calm: {
    title: "Start Breathing",
    urgency: "info",
    etaMin: 4,
    steps: [
      { title: "Box breathing 4-4-4-4", desc: "In 4s, hold 4s, out 4s, hold 4s.", timerSec: 240 },
      { title: "5-4-3-2-1 grounding", desc: "5 see, 4 feel, 3 hear, 2 smell, 1 taste." }
    ],
    source: "Anxiety first aid"
  },
  wildlife_snake: {
    title: "Stabilize",
    urgency: "emergency",
    etaMin: 10,
    steps: [
      { title: "Immobilize limb", desc: "Keep below heart; minimize movement." },
      { title: "Remove rings/watches", desc: "Swelling may trap jewelry." },
      { title: "No cutting or suction", desc: "Do not apply tourniquet or ice." },
      { title: "Observe symptoms", desc: "Pain, swelling, breathing issues." }
    ],
    source: "Wilderness med (abridged)"
  },
  quick_phrases: {
    title: "Speak Phrase",
    urgency: "info",
    etaMin: 1,
    steps: [
      { title: "I need help", desc: "\"Necesito ayuda, por favor.\""},
      { title: "I have a headache", desc: "\"Me duele la cabeza.\""},
      { title: "Where is drinking water?", desc: "\"¿Dónde hay agua potable?\""}
    ],
    source: "EverAid basic phrasebook"
  },
  cpr_basics: {
    title: "Start CPR",
    urgency: "emergency",
    etaMin: 3,
    steps: [
      { title: "Check responsiveness", desc: "Tap shoulders firmly, shout 'Are you okay?' loudly. Look for any response, movement, or normal breathing. If unresponsive, proceed immediately." },
      { title: "Call 911", desc: "Get help immediately before starting CPR. If others present, point to specific person and say 'You call 911'. Request AED if available nearby." },
      { title: "Position hands", desc: "Heel of one hand on center of chest between nipples, interlock fingers of other hand. Keep arms straight, shoulders directly over hands." },
      { title: "30 compressions", desc: "Push hard and fast at least 2 inches deep, 100-120 per minute. Let chest return completely between compressions. Count out loud.", timerSec: 15 },
      { title: "2 rescue breaths", desc: "Tilt head back, lift chin, pinch nose closed. Seal mouth with your mouth and give 2 breaths, each lasting 1 second. Watch for chest rise." },
      { title: "Continue cycles", desc: "Repeat 30 compressions and 2 breaths continuously. Don't stop until emergency services arrive or person starts breathing normally. Switch rescuers every 2 minutes if possible." }
    ],
    source: "AHA Guidelines 2023"
  }
};

// Shuffle function for pack order
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}