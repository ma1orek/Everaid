# EverAid AI API Integration Guide

## Overview

EverAid provides a simplified AI API for generating emergency packs and chat responses. This guide shows how to integrate with external tools like Figma/Make, automation platforms, and custom applications.

## API Endpoint

```
POST https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss
```

## Authentication

All requests require two headers with the same ANON key:

```http
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
apikey: <SUPABASE_ANON_KEY>
```

⚠️ **Important**: Use only the `SUPABASE_ANON_KEY`, never the `SERVICE_ROLE_KEY` in client-side code or external tools.

## Request Format

### Chat Mode (Emergency Responses)
```json
{
  "mode": "chat",
  "prompt": "I cut my hand and it's bleeding a lot",
  "lang": "en"
}
```

### Pack Mode (Emergency Guide Generation)  
```json
{
  "mode": "pack", 
  "prompt": "Create a 3-step emergency pack for choking in a conscious adult",
  "lang": "en"
}
```

### Parameters
- `mode`: `"chat"` | `"pack"` 
- `prompt`: User's request/situation description
- `lang`: `"en"` | `"pl"` (optional, defaults to "en")

## Response Format

### Success Response
```json
{
  "ok": true,
  "mode": "chat" | "pack",
  "text": "cleaned text response",
  "pack": { /* only for pack mode if JSON parsing succeeded */ }
}
```

### Chat Response Example
```json
{
  "ok": true,
  "mode": "chat", 
  "text": "1. Apply direct pressure to the wound with clean cloth\n2. Elevate the injured hand above heart level\n3. Call emergency services if bleeding doesn't stop\n4. Keep pressure until help arrives"
}
```

### Pack Response Example  
```json
{
  "ok": true,
  "mode": "pack",
  "text": "Emergency pack for choking created",
  "pack": {
    "title": "Choking Adult Response",
    "oneLiner": "Step-by-step choking rescue for conscious adults",
    "category": "HEALTH",
    "urgency": "EMERGENCY", 
    "estMinutes": 3,
    "cta": "Help Now",
    "steps": [
      {
        "id": 1,
        "title": "Assess consciousness",
        "description": "Confirm person is conscious and can cough",
        "timerSeconds": 10
      },
      {
        "id": 2, 
        "title": "Encourage coughing",
        "description": "Tell them to cough forcefully to dislodge object"
      },
      {
        "id": 3,
        "title": "Back blows if needed", 
        "description": "Give 5 sharp blows between shoulder blades"
      }
    ]
  }
}
```

## Figma/Make Integration

### HTTP Module Configuration

**Method:** `POST`

**URL:** `https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{SUPABASE_ANON_KEY}}  
apikey: {{SUPABASE_ANON_KEY}}
```

**Body Type:** `Raw`

**Body (Chat):**
```json
{
  "mode": "chat",
  "prompt": "{{YourPrompt}}",
  "lang": "pl" 
}
```

**Body (Pack Generation):**
```json
{
  "mode": "pack", 
  "prompt": "Create a 3-step pack for {{emergency_type}}",
  "lang": "en"
}
```

### Response Handling in Make

**For Chat Mode:**
- Use `{{response.text}}` to get the emergency response
- Display directly to user

**For Pack Mode:**
- Check if `{{response.pack}}` exists
  - **Success**: Use `{{response.pack.title}}`, `{{response.pack.steps}}` etc.
  - **Fallback**: Use `{{response.text}}` and suggest retry

### Example Make Scenario

```json
{
  "scenarios": [
    {
      "name": "Emergency AI Response",
      "modules": [
        {
          "type": "http",
          "method": "POST",
          "url": "https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss",
          "headers": {
            "Content-Type": "application/json",
            "Authorization": "Bearer {{ANON_KEY}}",
            "apikey": "{{ANON_KEY}}"
          },
          "body": {
            "mode": "chat",
            "prompt": "{{trigger.prompt}}",
            "lang": "en"
          }
        }
      ]
    }
  ]
}
```

## Code Integration Examples

### JavaScript/TypeScript (fetch)
```typescript
const SUPABASE_ANON_KEY = 'your_anon_key_here';

const response = await fetch('https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY,
  },
  body: JSON.stringify({ 
    mode: 'chat', 
    prompt: 'I cut my hand and it\'s bleeding', 
    lang: 'en' 
  })
});

const data = await response.json();
console.log(data.text); // Display AI response
```

### cURL
```bash
curl -X POST \
  'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <SUPABASE_ANON_KEY>' \
  -H 'apikey: <SUPABASE_ANON_KEY>' \
  --data '{
    "mode": "chat",
    "prompt": "I cut my hand and its bleeding a lot",
    "lang": "en"
  }'
```

### Python (requests)
```python
import requests

SUPABASE_ANON_KEY = 'your_anon_key_here'
url = 'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss'

headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'apikey': SUPABASE_ANON_KEY
}

payload = {
    'mode': 'pack',
    'prompt': 'Create emergency pack for fire evacuation',
    'lang': 'en'
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()

if data.get('pack'):
    print(f"Generated pack: {data['pack']['title']}")
    for step in data['pack']['steps']:
        print(f"- {step['title']}: {step['description']}")
else:
    print(f"Text response: {data['text']}")
```

## Troubleshooting 401 Errors

### Checklist

1. **Verify Headers**
   - ✅ `Content-Type: application/json`
   - ✅ `Authorization: Bearer <ANON_KEY>` 
   - ✅ `apikey: <ANON_KEY>`
   - ✅ Both headers use the same ANON key

2. **Check Supabase Dashboard**
   - Go to **Edge Functions** → **Invocations**
   - See if request reaches the function
   - **Status 401 in invocations**: JWT validation failed → check headers
   - **Status 200 in invocations, but 401 in client**: Wrong endpoint/proxy issue

3. **Verify Key and Project**
   - ANON key must be from same project as endpoint
   - URL contains correct project reference: `tnzhrxkulxcfpfaxouif`
   - Key format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

4. **CORS Issues**
   - Edge function handles OPTIONS requests
   - `TypeError: Failed to fetch` usually = missing headers
   - Check browser network tab for actual error

### Common Fixes

**Missing apikey header:**
```diff
headers: {
  'Content-Type': 'application/json',
- 'Authorization': 'Bearer <key>'
+ 'Authorization': 'Bearer <key>',
+ 'apikey': '<key>'
}
```

**Wrong key type:**
```diff
# ❌ Don't use service role in client
- Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...service_role...

# ✅ Use anon key  
+ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...anon...
```

**URL typos:**
```diff
# ❌ Wrong endpoint
- https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gpt

# ✅ Correct endpoint
+ https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss
```

## Rate Limits & Best Practices

### Rate Limiting
- Max 1 concurrent request per client
- Retry with 800ms delay on failure
- 25 second timeout per request

### Best Practices

**Request Optimization:**
- Keep prompts under 600 characters
- Use appropriate `mode` for your use case
- Set `lang` parameter for non-English responses

**Error Handling:**
```javascript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Authentication issue - check headers
      throw new Error('Authentication failed - verify API keys');
    }
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Handle both success cases
  if (data.pack) {
    // Pack mode success - use structured data
    return data.pack;
  } else {
    // Chat mode or pack fallback - use text
    return data.text;
  }
  
} catch (error) {
  console.error('AI API error:', error);
  // Implement fallback logic
}
```

**Retry Logic:**
```javascript
async function callAIWithRetry(payload, maxRetries = 2) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      if (response.status === 401 && i < maxRetries - 1) {
        // Retry auth errors once
        await new Promise(resolve => setTimeout(resolve, 800));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
      
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
}
```

## Use Cases

### Emergency Chatbots
Integrate chat mode for instant emergency guidance:

```json
{
  "mode": "chat",
  "prompt": "{{user_emergency_description}}",
  "lang": "{{user_language}}"
}
```

### Training Simulations
Generate emergency scenarios for training:

```json
{
  "mode": "pack", 
  "prompt": "Create training scenario for {{emergency_type}} in {{location}}",
  "lang": "en"
}
```

### Mobile Apps
Quick emergency responses with structured data:

```javascript
// Get immediate chat response
const chatResponse = await callAPI({
  mode: 'chat',
  prompt: userInput,
  lang: deviceLanguage
});

// Generate detailed guide  
const packResponse = await callAPI({
  mode: 'pack',
  prompt: `Detailed guide for: ${userInput}`,
  lang: deviceLanguage
});
```

## Support

For issues with the API integration:

1. **Check this guide first** - most issues are header/auth related
2. **Test with cURL** - verify basic connectivity  
3. **Check Supabase logs** - see if requests reach the function
4. **Verify project keys** - ensure ANON key matches project

**Test Endpoint:**
```bash
curl -X POST \
  'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <YOUR_ANON_KEY>' \
  -H 'apikey: <YOUR_ANON_KEY>' \
  --data '{"mode":"chat","prompt":"test","lang":"en"}'
```

Expected: HTTP 200 with JSON response containing `text` field.