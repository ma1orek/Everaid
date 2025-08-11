// Helper functions to map server format to client format
export function mapCategory(serverCategory: string): "Health" | "Survive" | "Fix" | "Speak" {
  switch (serverCategory?.toUpperCase()) {
    case "HEALTH": return "Health";
    case "SURVIVE": return "Survive";
    case "FIX": return "Fix";
    case "SPEAK": return "Speak";
    default: return "Health";
  }
}

export function mapUrgency(serverUrgency: string): "EMERGENCY" | "WARNING" | "INFO" {
  switch (serverUrgency?.toLowerCase()) {
    case "emergency": return "EMERGENCY";
    case "warning": return "WARNING";
    case "info": return "INFO";
    default: return "INFO";
  }
}

export function mapSteps(serverSteps: any[]): { title: string; description: string; timerSeconds: number | null }[] {
  return serverSteps.map(step => ({
    title: step.title || "Step",
    description: step.desc || step.description || "Follow this step",
    timerSeconds: step.timerSec || step.timerSeconds || null
  }));
}

// Response format detection and extraction helpers
export function extractPackData(response: any) {
  // Handle different server formats:
  // Main server: { ok: true, mode: "pack", text: "...", pack: {...} }
  // Edge function: { ok: true, result: { type: "pack", pack: {...} } }
  return response?.pack ?? response?.result?.pack ?? response?.result;
}

export function extractChatText(response: any): string {
  // Handle different server formats:
  // Main server: { ok: true, mode: "chat", text: "..." }
  // Edge function: { ok: true, result: { type: "chat", text: "..." } }
  return response?.result?.text ?? response?.text ?? "";
}

export function isFallbackResponse(data: any): boolean {
  return data.text?.includes("Due to high demand") || 
         data.text?.includes("fallback") || 
         data.text?.includes("temporarily unavailable");
}

export function logResponseInfo(endpoint: string, data: any) {
  console.log(`[AI] Success from ${endpoint}`, {
    endpoint,
    mode: data.mode,
    ok: data.ok,
    hasText: !!data.text,
    hasPack: !!data.pack,
    hasResult: !!data.result,
    isFallback: isFallbackResponse(data)
  });
}