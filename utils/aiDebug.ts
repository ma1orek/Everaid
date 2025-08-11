import { projectId, publicAnonKey } from './supabase/info';

const MAIN_ENDPOINT = `https://${projectId}.supabase.co/functions/v1/make-server-4f36f0d0/gptoss`;
const EDGE_ENDPOINT = `https://${projectId}.supabase.co/functions/v1/gptoss`;
const ANON_KEY = publicAnonKey;

// Direct endpoint testing function
export async function debugEndpoints() {
  console.log('🔬 Starting detailed endpoint debugging...');
  
  const testPayload = {
    prompt: "test emergency response",
    mode: "chat",
    lang: "en"
  };
  
  // Test each endpoint individually
  const endpoints = [
    { name: "Main Server", url: MAIN_ENDPOINT },
    { name: "Edge Function", url: EDGE_ENDPOINT }
  ];
  
  for (const endpoint of endpoints) {
    console.log(`\n🧪 Testing ${endpoint.name}: ${endpoint.url}`);
    
    try {
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "authorization": `Bearer ${ANON_KEY}`,
          "apikey": ANON_KEY,
        },
        body: JSON.stringify(testPayload),
      });
      
      console.log(`📊 ${endpoint.name} Response:`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        ok: response.ok
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`📦 ${endpoint.name} Data:`, {
          ok: data.ok,
          mode: data.mode,
          hasText: !!data.text,
          hasPack: !!data.pack,
          hasResult: !!data.result,
          isFallback: data.text?.includes("Due to high demand") || data.text?.includes("fallback"),
          textPreview: data.text?.slice(0, 100) + "..."
        });
        
        if (data.text?.includes("Due to high demand")) {
          console.log(`⚠️ ${endpoint.name} is returning fallback responses - API key may not be working`);
        }
      } else {
        const errorText = await response.text().catch(() => "Could not read error");
        console.log(`❌ ${endpoint.name} Error:`, errorText);
      }
      
    } catch (error) {
      console.log(`💥 ${endpoint.name} Network Error:`, error instanceof Error ? error.message : String(error));
    }
  }
  
  // Test the health endpoint
  console.log('\n🔑 Testing server health...');
  
  try {
    const healthResponse = await fetch(`https://${MAIN_ENDPOINT.split('/')[2]}/functions/v1/make-server-4f36f0d0/health`);
    console.log('💗 Health check:', {
      status: healthResponse.status,
      ok: healthResponse.ok
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('💗 Health data:', healthData);
    }
  } catch (error) {
    console.log('💗 Health check failed:', error instanceof Error ? error.message : String(error));
  }
}

export function logEndpointInfo() {
  console.log('🔗 AI Endpoints:', {
    main: MAIN_ENDPOINT,
    edge: EDGE_ENDPOINT,
    apiKey: ANON_KEY.slice(0, 20) + '...'
  });
}