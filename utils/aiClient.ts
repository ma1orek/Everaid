import { projectId, publicAnonKey } from './supabase/info';
import { AI_CONFIG, ERROR_MESSAGES } from './aiConstants';
import { mapCategory, mapUrgency, mapSteps, extractPackData, extractChatText, logResponseInfo } from './aiHelpers';

const MAIN_ENDPOINT = `https://${projectId}.supabase.co/functions/v1/make-server-4f36f0d0/gptoss`;
const EDGE_ENDPOINT = `https://${projectId}.supabase.co/functions/v1/gptoss`;
const ANON_KEY = publicAnonKey;

// Pack generation types
export type PackDraft = {
  type: "pack";
  title: string;
  oneLiner: string;
  category: "Health" | "Survive" | "Fix" | "Speak";
  urgency: "EMERGENCY" | "WARNING" | "INFO";
  estMinutes: number;
  steps: { title: string; description: string; timerSeconds: number | null }[];
};

// Main AI API function
export async function askAI(prompt: string, mode: "chat" | "pack" = "chat", lang: string = "en") {
  // Try main server first, then edge function as fallback
  const endpoints = [MAIN_ENDPOINT, EDGE_ENDPOINT];
  
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    console.log(`[AI] Trying endpoint ${i + 1}/${endpoints.length}:`, endpoint);
    console.log("[AI] call", { 
      endpoint,
      prompt: prompt.slice(0, 50) + "...",
      mode 
    });

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${ANON_KEY}`,
          "apikey": ANON_KEY,
        },
        body: JSON.stringify({ prompt, mode, lang }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error(`[AI] HTTP error on ${endpoint}:`, {
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
          body: txt
        });
        
        if (i === endpoints.length - 1) {
          throw new Error(`AI ${res.status}: ${txt}`);
        }
        continue;
      }

      const data = await res.json();
      console.log("[AI] Response received from", endpoint, { 
        ok: data.ok, 
        mode: data.mode,
        hasResult: !!data.result, 
        resultType: data.result?.type,
        hasText: !!data.text, 
        hasPack: !!data.pack,
        resultPack: !!data.result?.pack
      });
      
      if (data.ok === false) {
        console.error(`[AI] API error from ${endpoint}:`, {
          error: data.error,
          result: data.result,
          mode: data.mode,
          text: data.text,
          fullResponse: data
        });
        
        if (i === endpoints.length - 1) {
          throw new Error(`AI: ${data.error || data.result?.error || 'Unknown error'}`);
        }
        continue;
      }

      logResponseInfo(endpoint, data);
      return data;
      
    } catch (error) {
      console.error(`[AI] Network error on ${endpoint}:`, {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        endpoint,
        prompt: prompt.slice(0, 50) + "...",
        mode
      });
      
      if (i === endpoints.length - 1) {
        throw error;
      }
      continue;
    }
  }
  
  throw new Error("All AI endpoints failed");
}

// Chat function for compatibility  
export async function askEverAid(prompt: string): Promise<string> {
  const response = await askAI(prompt, "chat");
  console.log("[AI] askEverAid response format:", response);
  
  const text = extractChatText(response);
  console.log("[AI] Extracted text:", text);
  
  return text;
}

// Chat function with pack context for better responses
export async function askEverAidWithContext(
  prompt: string, 
  packContext?: {
    title: string;
    category: string;
    urgency: string;
    steps: Array<{ title: string; desc: string; timerSec?: number }>;
    currentStepIndex: number;
  }
): Promise<string> {
  let contextualPrompt = prompt;
  
  if (packContext) {
    const currentStep = packContext.steps[packContext.currentStepIndex];
    const stepContext = currentStep ? 
      `Currently on step ${packContext.currentStepIndex + 1}: "${currentStep.title}" - ${currentStep.desc}` : 
      'No specific step active';
    
    contextualPrompt = `Context: User is following "${packContext.title}" (${packContext.category}, ${packContext.urgency} urgency). ${stepContext}

All steps:
${packContext.steps.map((step, index) => 
  `${index + 1}. ${step.title}: ${step.desc}${step.timerSec ? ` (${step.timerSec}s timer)` : ''}`
).join('\n')}

User question: ${prompt}

Respond contextually about their current situation. If they ask about "this step" or "current step", refer to step ${packContext.currentStepIndex + 1}. Provide detailed guidance when requested - you can use up to 1000 words for comprehensive explanations.`;
  }
  
  const response = await askAI(contextualPrompt, "chat");
  console.log("[AI] askEverAidWithContext response format:", response);
  
  const text = extractChatText(response);
  console.log("[AI] Extracted text with context:", text);
  
  return text;
}

// Pack generation function
export async function generatePack(prompt: string): Promise<PackDraft> {
  const response = await askAI(prompt, "pack");
  console.log("[AI] Pack generation response:", response);
  
  let packData = extractPackData(response);
  
  if (!packData) {
    console.error("[AI] No pack data in response:", response);
    throw new Error(ERROR_MESSAGES.NO_PACK_DATA);
  }
  
  console.log("[AI] Raw pack data:", packData);
  
  // Check if it's already in the correct PackDraft format
  if (packData.type === "pack" && packData.title && packData.category && packData.steps) {
    console.log("[AI] Pack already in correct format:", packData);
    return packData as PackDraft;
  }
  
  // Convert server format to PackDraft format
  const pack: PackDraft = {
    type: "pack",
    title: packData.title || "Emergency Pack",
    oneLiner: packData.oneLiner || packData.detailedDescription || "Emergency guide",
    category: mapCategory(packData.category),
    urgency: mapUrgency(packData.urgency),
    estMinutes: packData.etaMin || packData.estMinutes || 10,
    steps: mapSteps(packData.steps || [])
  };
  
  console.log("[AI] Converted pack:", pack);
  return pack;
}

// Test function
export async function testAIConnection() {
  try {
    console.log('🔍 Testing AI connection...');
    console.log('🔗 Main endpoint:', MAIN_ENDPOINT);
    console.log('🔗 Edge endpoint:', EDGE_ENDPOINT);
    console.log('🔑 Using API key:', ANON_KEY.slice(0, 20) + '...');
    
    // Test basic connection
    console.log('💬 Testing chat mode...');
    const chatResult = await askAI("How to change a tire", "chat");
    console.log('📄 Chat raw response:', chatResult);
    
    const chatText = await askEverAid("How to change a tire");
    console.log('✅ Chat text extracted:', chatText);
    
    // Test pack generation mode
    console.log('📦 Testing pack generation...');
    const packResult = await askAI("house fire emergency", "pack");
    console.log('📄 Pack raw response:', packResult);
    
    // Test the generatePack function specifically
    console.log('🏗️ Testing generatePack function...');
    const actualPack = await generatePack("first aid for cuts");
    console.log('✅ GeneratePack function successful:', actualPack);
    
    return { 
      success: true, 
      details: { 
        chatRaw: chatResult,
        chatProcessed: chatText,
        packRaw: packResult,
        packProcessed: actualPack,
        mainEndpoint: MAIN_ENDPOINT,
        edgeEndpoint: EDGE_ENDPOINT
      } 
    };
  } catch (error) {
    console.error('❌ AI connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      mainEndpoint: MAIN_ENDPOINT,
      edgeEndpoint: EDGE_ENDPOINT,
      apiKey: ANON_KEY.slice(0, 20) + '...'
    };
  }
}