export type Umbrella = "HEALTH" | "SURVIVE" | "FIX" | "SPEAK";
export type Urgency = "emergency" | "warning" | "info";

export interface Pack {
  id: string;
  umbrella: Umbrella;
  title: string;
  cta: string;
  oneLiner: string;
  detailedDescription?: string;
  urgency: Urgency;
  etaMin: number;
  icon: string;
  isOffline?: boolean;
}

export interface Step {
  title: string;
  desc: string;
  timerSec?: number;
}

export interface StepsBlock {
  title: string;
  urgency: Urgency;
  etaMin: number;
  steps: Step[];
  source?: string;
}

export interface ChatMessage {
  id: string;
  type: "user" | "assistant" | "steps";
  content: string;
  stepsBlock?: StepsBlock;
  timestamp: Date;
}