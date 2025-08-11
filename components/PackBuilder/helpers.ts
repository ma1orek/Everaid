import { PackDraft } from "../../utils/aiClient";
import { Umbrella } from "../../data/models";

export interface PackData {
  umbrella: Umbrella | "";
  title: string;
  oneLiner: string;
  detailedDescription: string;
  cta: string;
  urgency: "emergency" | "warning" | "info" | "";
  etaMin: number;
  icon: string;
  steps: Array<{
    title: string;
    desc: string;
    timerSec?: number;
  }>;
}

export const validateBasics = (packData: PackData): Record<string, string> => {
  const newErrors: Record<string, string> = {};
  
  if (!packData.umbrella) newErrors.umbrella = "Category is required";
  if (!packData.title) newErrors.title = "Title is required";
  if (packData.title.length > 32) newErrors.title = "Title must be ≤32 characters";
  if (!packData.oneLiner) newErrors.oneLiner = "One-liner is required";
  if (packData.oneLiner.length > 90) newErrors.oneLiner = "One-liner must be ≤90 characters";
  if (packData.detailedDescription.length > 300) newErrors.detailedDescription = "Detailed description must be ≤300 characters";
  if (!packData.cta) newErrors.cta = "CTA is required";
  if (packData.cta.length > 16) newErrors.cta = "CTA must be ≤16 characters";
  if (!packData.urgency) newErrors.urgency = "Urgency is required";
  if (packData.etaMin < 1 || packData.etaMin > 60) newErrors.etaMin = "ETA must be 1-60 minutes";
  
  return newErrors;
};

export const validateSteps = (packData: PackData): Record<string, string> => {
  const newErrors: Record<string, string> = {};
  
  if (packData.steps.length === 0 || !packData.steps.some(step => step.title.trim())) {
    newErrors.steps = "At least one step is required";
  }
  
  packData.steps.forEach((step, index) => {
    if (step.title.length > 40) newErrors[`step${index}Title`] = "Step title must be ≤40 characters";
    if (step.desc.length > 140) newErrors[`step${index}Desc`] = "Step description must be ≤140 characters";
  });
  
  return newErrors;
};

export const mapCategoryToUmbrella = (category: PackDraft["category"]): Umbrella => {
  const mapping = {
    "Health": "HEALTH" as const,
    "Survive": "SURVIVE" as const, 
    "Fix": "FIX" as const,
    "Speak": "SPEAK" as const
  };
  return mapping[category] || "HEALTH";
};

export const mapUrgency = (urgency: PackDraft["urgency"]): "emergency" | "warning" | "info" => {
  return urgency.toLowerCase() as "emergency" | "warning" | "info";
};

export const generateMockPackData = (prompt: string): Partial<PackData> => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Determine category based on keywords
  let umbrella: Umbrella = "HEALTH";
  let urgency: "emergency" | "warning" | "info" = "info";
  
  if (lowerPrompt.includes("bleed") || lowerPrompt.includes("wound") || lowerPrompt.includes("injury") || lowerPrompt.includes("medical")) {
    umbrella = "HEALTH";
    urgency = "emergency";
  } else if (lowerPrompt.includes("fire") || lowerPrompt.includes("survival") || lowerPrompt.includes("emergency") || lowerPrompt.includes("escape")) {
    umbrella = "SURVIVE";
    urgency = "emergency";
  } else if (lowerPrompt.includes("repair") || lowerPrompt.includes("fix") || lowerPrompt.includes("broken") || lowerPrompt.includes("maintenance")) {
    umbrella = "FIX";
    urgency = "info";
  } else if (lowerPrompt.includes("language") || lowerPrompt.includes("speak") || lowerPrompt.includes("communicate") || lowerPrompt.includes("translate")) {
    umbrella = "SPEAK";
    urgency = "info";
  }

  // Generate basic pack info
  const title = prompt.slice(0, 32).replace(/^\w/, c => c.toUpperCase());
  const oneLiner = `Step-by-step guide for ${prompt.toLowerCase()}`;
  const detailedDescription = `This pack provides detailed instructions to help you handle ${prompt.toLowerCase()} safely and effectively.`;
  const cta = urgency === "emergency" ? "Help Now" : "Get Started";
  const etaMin = urgency === "emergency" ? 3 : 10;

  // Generate basic steps
  const steps = [
    {
      title: "Assess the situation",
      desc: "Quickly evaluate what needs to be done and ensure safety first."
    },
    {
      title: "Gather necessary items",
      desc: "Collect all tools or materials you'll need for this procedure."
    },
    {
      title: "Take action",
      desc: "Follow the specific steps for your situation carefully and methodically."
    }
  ];

  return {
    umbrella,
    title,
    oneLiner,
    detailedDescription,
    cta,
    urgency,
    etaMin,
    steps
  };
};