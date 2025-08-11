import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as packService from "./packService.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "apikey"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-4f36f0d0/health", (c) => {
  return c.json({ status: "ok" });
});

// GPT-OSS endpoint for simplified AI API
app.post("/make-server-4f36f0d0/gptoss", async (c) => {
  try {
    const { mode, prompt, lang } = await c.req.json();
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return c.json({ 
        ok: false, 
        mode: mode || 'chat',
        text: 'Prompt is required',
        error: 'Prompt is required' 
      }, 400);
    }

    const togetherApiKey = Deno.env.get('TOGETHER_API_KEY');
    console.log('🔑 TOGETHER_API_KEY status:', {
      exists: !!togetherApiKey,
      length: togetherApiKey?.length || 0,
      preview: togetherApiKey?.slice(0, 20) + '...' || 'undefined',
      mode,
      prompt: prompt.slice(0, 50) + '...'
    });
    
    if (!togetherApiKey) {
      console.log('❌ Together API key not configured, using fallback');
      
      if (mode === 'pack') {
        const fallbackPack = generateFallbackPackData(prompt);
        return c.json({
          ok: true,
          mode: 'pack',
          text: `Generated pack: ${fallbackPack.title}`,
          pack: fallbackPack
        });
      } else {
        // Chat mode fallback
        return c.json({
          ok: true,
          mode: 'chat',
          text: `I understand you need help with: ${prompt}. This is a fallback response since AI service is not configured.`
        });
      }
    }

    // Determine system prompt based on mode
    let systemPrompt;
    if (mode === 'pack') {
      systemPrompt = `You are an expert emergency preparedness guide creator. Generate a structured emergency knowledge pack based on user input.

Respond ONLY with a valid JSON object in this exact format:
{
  "title": "string (max 32 chars)",
  "category": "HEALTH|SURVIVE|FIX|SPEAK",
  "urgency": "emergency|warning|info",
  "oneLiner": "string (max 90 chars)",
  "detailedDescription": "string (max 300 chars)",
  "cta": "string (max 16 chars)",
  "etaMin": number (1-60),
  "steps": [
    {
      "title": "string (max 40 chars)",
      "desc": "string (max 140 chars)",
      "timerSec": number (optional)
    }
  ]
}`;
    } else {
      // Chat mode
      systemPrompt = `You are EverAid, an emergency assistance AI. Provide clear, concise, step-by-step emergency guidance.

Guidelines:
- Give immediate, actionable advice
- Use numbered steps (1., 2., 3.)
- Keep responses under 1000 words for detailed explanations
- Prioritize safety first
- If life-threatening, remind to call emergency services
- Be calm and reassuring
- When asked for more detail, provide comprehensive step-by-step guidance`;
    }

    // Call Together AI
    console.log('📡 Calling Together AI API...');
    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: mode === 'pack' ? 1000 : 1500,
        temperature: 0.7
      })
    });

    console.log('📨 Together API response:', {
      status: togetherResponse.status,
      statusText: togetherResponse.statusText,
      ok: togetherResponse.ok
    });

    if (!togetherResponse.ok) {
      const errorText = await togetherResponse.text();
      console.log('❌ Together API error details:', {
        status: togetherResponse.status,
        statusText: togetherResponse.statusText,
        headers: Object.fromEntries(togetherResponse.headers.entries()),
        body: errorText,
        apiKeyUsed: togetherApiKey?.slice(0, 20) + '...'
      });
      
      // Return fallback based on mode
      if (mode === 'pack') {
        const fallbackPack = generateFallbackPackData(prompt);
        return c.json({
          ok: true,
          mode: 'pack',
          text: `Generated pack: ${fallbackPack.title}`,
          pack: fallbackPack
        });
      } else {
        return c.json({
          ok: true,
          mode: 'chat',
          text: `I understand you need help with: ${prompt}. Due to high demand, I'm providing a basic response.`
        });
      }
    }

    const togetherData = await togetherResponse.json();
    
    if (!togetherData.choices || !togetherData.choices[0]?.message?.content) {
      console.log('Invalid Together API response structure:', togetherData);
      
      // Return fallback
      if (mode === 'pack') {
        const fallbackPack = generateFallbackPackData(prompt);
        return c.json({
          ok: true,
          mode: 'pack',
          text: `Generated pack: ${fallbackPack.title}`,
          pack: fallbackPack
        });
      } else {
        return c.json({
          ok: true,
          mode: 'chat',
          text: `I understand you need help with: ${prompt}. Please try rephrasing your request.`
        });
      }
    }

    const aiResponse = togetherData.choices[0].message.content.trim();

    if (mode === 'pack') {
      // Try to parse JSON for pack mode
      let generatedContent;
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : aiResponse;
        generatedContent = JSON.parse(jsonString);
        
        const sanitizedPack = validateAndSanitizePackData(generatedContent, prompt);
        return c.json({
          ok: true,
          mode: 'pack',
          text: `Generated pack: ${sanitizedPack.title}`,
          pack: sanitizedPack
        });
      } catch (parseError) {
        console.log('Failed to parse pack JSON, returning text:', aiResponse);
        return c.json({
          ok: true,
          mode: 'pack',
          text: aiResponse
        });
      }
    } else {
      // Chat mode - return text response
      return c.json({
        ok: true,
        mode: 'chat',
        text: aiResponse
      });
    }

  } catch (error) {
    console.log('Error in gptoss endpoint:', error);
    
    // Return fallback based on mode
    if (mode === 'pack') {
      const fallbackPack = generateFallbackPackData(prompt || 'emergency guide');
      return c.json({
        ok: true,
        mode: 'pack',
        text: `Generated pack: ${fallbackPack.title}`,
        pack: fallbackPack
      });
    } else {
      return c.json({
        ok: true,
        mode: 'chat',
        text: 'I apologize, but I am temporarily unable to process your request. Please try again.'
      });
    }
  }
});

// AI Pack Generation endpoint (legacy compatibility)
app.post("/make-server-4f36f0d0/generate-pack", async (c) => {
  try {
    const { prompt } = await c.req.json();
    
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    const togetherApiKey = Deno.env.get('TOGETHER_API_KEY');
    if (!togetherApiKey) {
      return c.json({ error: "Together API key not configured" }, 500);
    }

    // Call Together API for GPT generation
    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content: `You are an expert emergency preparedness guide creator. Generate a structured emergency knowledge pack based on user input. 

Respond ONLY with a valid JSON object in this exact format:
{
  "title": "string (max 32 chars)",
  "category": "HEALTH|SURVIVE|FIX|SPEAK",
  "urgency": "emergency|warning|info",
  "oneLiner": "string (max 90 chars)",
  "detailedDescription": "string (max 300 chars)",
  "cta": "string (max 16 chars)",
  "etaMin": number (1-60),
  "steps": [
    {
      "title": "string (max 40 chars)",
      "desc": "string (max 140 chars)",
      "timerSec": number (optional)
    }
  ]
}

Guidelines:
- HEALTH: Medical emergencies, first aid
- SURVIVE: Emergency situations, natural disasters  
- FIX: Repairs, maintenance, troubleshooting
- SPEAK: Communication, language assistance
- Emergency urgency for life-threatening situations
- Warning for potentially dangerous situations
- Info for general guidance
- Include 3-7 practical, actionable steps
- Add timerSec only when timing is critical (CPR, bleeding control, etc.)
- Keep all text concise and actionable`
          },
          {
            role: 'user',
            content: `Generate an emergency knowledge pack for: ${prompt}`
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!togetherResponse.ok) {
      const errorText = await togetherResponse.text();
      console.log(`Together API error: ${togetherResponse.status} - ${errorText}`);
      return c.json({ error: "AI service temporarily unavailable" }, 500);
    }

    const togetherData = await togetherResponse.json();
    
    if (!togetherData.choices || !togetherData.choices[0]?.message?.content) {
      console.log('Invalid Together API response structure:', togetherData);
      return c.json({ error: "Invalid AI response" }, 500);
    }

    let generatedContent;
    try {
      const contentText = togetherData.choices[0].message.content.trim();
      // Try to extract JSON from the response if it's wrapped in other text
      const jsonMatch = contentText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : contentText;
      generatedContent = JSON.parse(jsonString);
    } catch (parseError) {
      console.log('Failed to parse AI response as JSON:', togetherData.choices[0].message.content);
      // Fallback to mock generation if AI response is invalid
      generatedContent = generateFallbackPackData(prompt);
    }

    // Validate and sanitize the generated content
    const sanitizedPack = validateAndSanitizePackData(generatedContent, prompt);
    
    return c.json({ pack: sanitizedPack });

  } catch (error) {
    console.log('Error in AI generation:', error);
    // Return fallback generation instead of error
    const fallbackPack = generateFallbackPackData(await c.req.json().then(data => data.prompt));
    return c.json({ pack: fallbackPack });
  }
});

// Fallback pack generation function
function generateFallbackPackData(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Determine category based on keywords
  let category = "HEALTH";
  let urgency = "info";
  
  if (lowerPrompt.includes("bleed") || lowerPrompt.includes("wound") || lowerPrompt.includes("injury") || lowerPrompt.includes("medical") || lowerPrompt.includes("cpr") || lowerPrompt.includes("heart")) {
    category = "HEALTH";
    urgency = "emergency";
  } else if (lowerPrompt.includes("fire") || lowerPrompt.includes("survival") || lowerPrompt.includes("emergency") || lowerPrompt.includes("escape") || lowerPrompt.includes("earthquake") || lowerPrompt.includes("flood")) {
    category = "SURVIVE";
    urgency = "emergency";
  } else if (lowerPrompt.includes("repair") || lowerPrompt.includes("fix") || lowerPrompt.includes("broken") || lowerPrompt.includes("maintenance") || lowerPrompt.includes("car") || lowerPrompt.includes("plumbing")) {
    category = "FIX";
    urgency = "info";
  } else if (lowerPrompt.includes("language") || lowerPrompt.includes("speak") || lowerPrompt.includes("communicate") || lowerPrompt.includes("translate") || lowerPrompt.includes("spanish") || lowerPrompt.includes("french")) {
    category = "SPEAK";
    urgency = "info";
  }

  const title = prompt.slice(0, 32).replace(/^\w/, c => c.toUpperCase());
  const oneLiner = `Step-by-step guide for ${prompt.toLowerCase()}`.slice(0, 90);
  const detailedDescription = `This pack provides detailed instructions to help you handle ${prompt.toLowerCase()} safely and effectively.`.slice(0, 300);
  const cta = urgency === "emergency" ? "Help Now" : "Get Started";
  const etaMin = urgency === "emergency" ? 3 : 10;

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
    title,
    category,
    urgency,
    oneLiner,
    detailedDescription,
    cta,
    etaMin,
    steps
  };
}

// Validation and sanitization function
function validateAndSanitizePackData(data: any, originalPrompt: string) {
  try {
    // Ensure all required fields exist with proper types and lengths
    const sanitized = {
      title: (data.title || originalPrompt || "Emergency Pack").slice(0, 32),
      category: ["HEALTH", "SURVIVE", "FIX", "SPEAK"].includes(data.category) ? data.category : "HEALTH",
      urgency: ["emergency", "warning", "info"].includes(data.urgency) ? data.urgency : "info",
      oneLiner: (data.oneLiner || `Guide for ${originalPrompt}`).slice(0, 90),
      detailedDescription: (data.detailedDescription || "Detailed emergency instructions").slice(0, 300),
      cta: (data.cta || "Get Started").slice(0, 16),
      etaMin: Math.max(1, Math.min(60, parseInt(data.etaMin) || 10)),
      steps: []
    };

    // Validate and sanitize steps
    if (Array.isArray(data.steps) && data.steps.length > 0) {
      sanitized.steps = data.steps.slice(0, 10).map((step: any) => ({
        title: (step.title || "Step").slice(0, 40),
        desc: (step.desc || "Follow this step carefully").slice(0, 140),
        ...(step.timerSec && typeof step.timerSec === 'number' && step.timerSec > 0 ? { timerSec: Math.min(3600, step.timerSec) } : {})
      }));
    } else {
      // Fallback steps if none provided
      sanitized.steps = [
        {
          title: "Assess the situation",
          desc: "Quickly evaluate what needs to be done and ensure safety first."
        },
        {
          title: "Take appropriate action",
          desc: "Follow the proper procedure for your specific situation."
        }
      ];
    }

    return sanitized;
  } catch (error) {
    console.log('Error sanitizing pack data:', error);
    return generateFallbackPackData(originalPrompt);
  }
}

// Pack Management Endpoints

// Get all packs
app.get("/make-server-4f36f0d0/packs", async (c) => {
  try {
    const packs = await packService.getAllPacks();
    return c.json({ packs });
  } catch (error) {
    console.error('Error getting packs:', error);
    return c.json({ error: 'Failed to get packs' }, 500);
  }
});

// Get packs by category
app.get("/make-server-4f36f0d0/packs/category/:category", async (c) => {
  try {
    const category = c.req.param('category');
    console.log(`🔍 Backend: Getting packs for category: ${category}`);
    
    const packs = await packService.getPacksByCategory(category);
    console.log(`📦 Backend: Found ${packs.length} packs for category ${category}`);
    
    return c.json({ packs });
  } catch (error) {
    console.error('Error getting packs by category:', error);
    return c.json({ error: 'Failed to get packs by category' }, 500);
  }
});

// Get single pack by ID
app.get("/make-server-4f36f0d0/packs/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const pack = await packService.getPackById(id);
    
    if (!pack) {
      return c.json({ error: 'Pack not found' }, 404);
    }
    
    return c.json({ pack });
  } catch (error) {
    console.error('Error getting pack by ID:', error);
    return c.json({ error: 'Failed to get pack' }, 500);
  }
});

// Create new pack
app.post("/make-server-4f36f0d0/packs", async (c) => {
  try {
    const packData = await c.req.json();
    
    // Validate required fields
    if (!packData.title || !packData.category || !packData.steps) {
      return c.json({ error: 'Missing required fields: title, category, steps' }, 400);
    }
    
    const packId = await packService.savePack(packData);
    return c.json({ id: packId, message: 'Pack created successfully' });
  } catch (error) {
    console.error('Error creating pack:', error);
    return c.json({ error: 'Failed to create pack' }, 500);
  }
});

// Update existing pack
app.put("/make-server-4f36f0d0/packs/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const success = await packService.updatePack(id, updates);
    
    if (!success) {
      return c.json({ error: 'Pack not found or update failed' }, 404);
    }
    
    return c.json({ message: 'Pack updated successfully' });
  } catch (error) {
    console.error('Error updating pack:', error);
    return c.json({ error: 'Failed to update pack' }, 500);
  }
});

// Delete pack
app.delete("/make-server-4f36f0d0/packs/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const success = await packService.deletePack(id);
    
    if (!success) {
      return c.json({ error: 'Pack not found or delete failed' }, 404);
    }
    
    return c.json({ message: 'Pack deleted successfully' });
  } catch (error) {
    console.error('Error deleting pack:', error);
    return c.json({ error: 'Failed to delete pack' }, 500);
  }
});

// Seed database with initial packs
app.post("/make-server-4f36f0d0/packs/seed", async (c) => {
  try {
    const result = await packService.seedDatabase();
    return c.json(result);
  } catch (error) {
    console.error('Error seeding database:', error);
    return c.json({ 
      success: false, 
      count: 0, 
      message: `Seeding failed: ${error.message}` 
    }, 500);
  }
});

// Debug endpoint - get pack counts by category
app.get("/make-server-4f36f0d0/packs/debug/categories", async (c) => {
  try {
    const allPacks = await packService.getAllPacks();
    const categoryCounts = {};
    
    allPacks.forEach(pack => {
      const category = pack.category || 'Unknown';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return c.json({ 
      total: allPacks.length,
      categories: categoryCounts,
      samplePacks: allPacks.slice(0, 5).map(p => ({
        id: p.id,
        title: p.title,
        category: p.category,
        urgency: p.urgency
      }))
    });
  } catch (error) {
    console.error('Error getting category debug info:', error);
    return c.json({ error: 'Failed to get debug info' }, 500);
  }
});

Deno.serve(app.fetch);