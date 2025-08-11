# Platform Integration Examples

## Figma/Make.com

### Scenario 1: Emergency Chat Bot
```json
{
  "name": "EverAid Emergency Response",
  "trigger": {
    "type": "webhook",
    "settings": {
      "url": "https://hook.make.com/your-webhook-id"
    }
  },
  "modules": [
    {
      "type": "http",
      "name": "Call EverAid AI",
      "settings": {
        "method": "POST",
        "url": "https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {{env.SUPABASE_ANON_KEY}}",
          "apikey": "{{env.SUPABASE_ANON_KEY}}"
        },
        "body": {
          "mode": "chat",
          "prompt": "{{trigger.emergency_description}}",
          "lang": "{{trigger.language|default:en}}"
        }
      }
    },
    {
      "type": "text",  
      "name": "Format Response",
      "settings": {
        "text": "🚨 Emergency Response:\n\n{{modules[1].text}}\n\n⚠️ If life-threatening, call emergency services immediately!"
      }
    }
  ]
}
```

### Scenario 2: Pack Generator with Fallback
```json
{
  "modules": [
    {
      "type": "http",
      "name": "Generate Emergency Pack",
      "settings": {
        "method": "POST", 
        "url": "https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss",
        "headers": {
          "Content-Type": "application/json",
          "Authorization": "Bearer {{env.SUPABASE_ANON_KEY}}",
          "apikey": "{{env.SUPABASE_ANON_KEY}}"
        },
        "body": {
          "mode": "pack",
          "prompt": "Create a {{trigger.steps}}-step emergency pack for {{trigger.situation}}",
          "lang": "en"
        }
      }
    },
    {
      "type": "router",
      "name": "Handle Response Type",
      "routes": [
        {
          "condition": "{{modules[1].pack != null}}",
          "modules": [
            {
              "type": "json",
              "name": "Structure Pack Data",
              "settings": {
                "title": "{{modules[1].pack.title}}",
                "category": "{{modules[1].pack.category}}",
                "urgency": "{{modules[1].pack.urgency}}",
                "estimated_time": "{{modules[1].pack.estMinutes}} minutes",
                "steps": "{{modules[1].pack.steps}}"
              }
            }
          ]
        },
        {
          "condition": "{{modules[1].pack == null}}",
          "modules": [
            {
              "type": "text",
              "name": "Fallback Response", 
              "settings": {
                "text": "Generated guidelines:\n\n{{modules[1].text}}\n\n💡 For structured data, try rephrasing your request."
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## Zapier Integration

### Trigger: New Emergency Request (Webhook)
**URL**: `https://hooks.zapier.com/hooks/catch/your-id/`

**Payload Example**:
```json
{
  "emergency_type": "fire evacuation",
  "location": "office building", 
  "language": "en",
  "user_id": "user123"
}
```

### Action: EverAid AI Response (Webhook)
**URL**: `https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss`
**Method**: `POST`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{zap.env.SUPABASE_ANON_KEY}}",
  "apikey": "{{zap.env.SUPABASE_ANON_KEY}}"
}
```

**Body**:
```json
{
  "mode": "pack",
  "prompt": "Create emergency evacuation plan for {{emergency_type}} in {{location}}",
  "lang": "{{language}}"
}
```

### Follow-up Actions:
1. **Format Response** (Formatter)
2. **Send Email** (Gmail/Outlook) 
3. **Create Document** (Google Docs)
4. **Post to Slack** (Slack)

## n8n Workflow

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300],
      "parameters": {
        "httpMethod": "POST",
        "path": "everaid-emergency"
      }
    },
    {
      "name": "EverAid AI",
      "type": "n8n-nodes-base.httpRequest",
      "position": [440, 300],
      "parameters": {
        "method": "POST",
        "url": "https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss",
        "authentication": "none",
        "requestMethod": "POST",
        "headers": {
          "parameters": [
            {
              "name": "Content-Type",
              "value": "application/json"
            },
            {
              "name": "Authorization", 
              "value": "Bearer {{$env.SUPABASE_ANON_KEY}}"
            },
            {
              "name": "apikey",
              "value": "{{$env.SUPABASE_ANON_KEY}}"
            }
          ]
        },
        "body": {
          "mode": "chat",
          "prompt": "={{$json.situation}}",
          "lang": "={{$json.lang || 'en'}}"
        }
      }
    },
    {
      "name": "Format & Send",
      "type": "n8n-nodes-base.set",
      "position": [640, 300],
      "parameters": {
        "values": {
          "string": [
            {
              "name": "response",
              "value": "🆘 EMERGENCY GUIDANCE:\n\n{{$json.text}}\n\n📞 Call local emergency services if needed!"
            },
            {
              "name": "timestamp",
              "value": "={{new Date().toISOString()}}"
            }
          ]
        }
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "EverAid AI", "type": "main", "index": 0}]]
    },
    "EverAid AI": {
      "main": [[{"node": "Format & Send", "type": "main", "index": 0}]]
    }
  }
}
```

## Power Automate (Microsoft)

### Trigger: When HTTP request is received
**HTTP Method**: `POST`
**Request Body JSON Schema**:
```json
{
  "type": "object",
  "properties": {
    "situation": {"type": "string"},
    "mode": {"type": "string", "enum": ["chat", "pack"]}, 
    "language": {"type": "string", "default": "en"}
  },
  "required": ["situation"]
}
```

### Action: HTTP Request to EverAid
**URI**: `https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss`
**Method**: `POST`

**Headers**:
```
Content-Type: application/json
Authorization: Bearer @{variables('SUPABASE_ANON_KEY')}
apikey: @{variables('SUPABASE_ANON_KEY')}
```

**Body**:
```json
{
  "mode": "@{triggerBody()['mode']}",
  "prompt": "@{triggerBody()['situation']}",
  "lang": "@{coalesce(triggerBody()['language'], 'en')}"
}
```

### Condition: Check Response Type
**If Pack Generated**:
```
@{not(empty(body('HTTP_Request')['pack']))}
```

**Then**: Process structured pack data
**Else**: Use text response

## IFTTT Integration

### Trigger: Webhook Received
**URL**: Provided by IFTTT

### Action: Webhooks Request
**URL**: `https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss`
**Method**: `POST`

**Headers**: 
```
Content-Type: application/json
Authorization: Bearer YOUR_ANON_KEY
apikey: YOUR_ANON_KEY
```

**Body**:
```json
{
  "mode": "chat",
  "prompt": "<<<{{Value1}}>>>",
  "lang": "en"
}
```

**Note**: IFTTT has limited JSON handling, so response processing may need additional services.

## Node-RED Flow

```json
{
  "id": "everaid-emergency-flow",
  "type": "tab",
  "label": "EverAid Emergency Response"
},
{
  "id": "http-in",
  "type": "http in",
  "url": "/emergency",
  "method": "post"
},
{
  "id": "process-request",
  "type": "function",
  "name": "Prepare EverAid Request",
  "func": "const payload = {\n    mode: msg.payload.mode || 'chat',\n    prompt: msg.payload.situation,\n    lang: msg.payload.language || 'en'\n};\n\nmsg.headers = {\n    'Content-Type': 'application/json',\n    'Authorization': `Bearer ${env.get('SUPABASE_ANON_KEY')}`,\n    'apikey': env.get('SUPABASE_ANON_KEY')\n};\n\nmsg.payload = payload;\nreturn msg;"
},
{
  "id": "http-request", 
  "type": "http request",
  "method": "POST",
  "url": "https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss"
},
{
  "id": "format-response",
  "type": "function", 
  "name": "Format Emergency Response",
  "func": "let response;\n\nif (msg.payload.pack) {\n    response = {\n        type: 'pack',\n        title: msg.payload.pack.title,\n        urgency: msg.payload.pack.urgency,\n        steps: msg.payload.pack.steps,\n        text: msg.payload.text\n    };\n} else {\n    response = {\n        type: 'chat',\n        text: msg.payload.text\n    };\n}\n\nmsg.payload = response;\nreturn msg;"
},
{
  "id": "http-response",
  "type": "http response",
  "statusCode": "200"
}
```

## Common Integration Patterns

### Error Handling Template
```javascript
// Universal error handling for any platform
function handleEverAidResponse(response) {
  // Check for HTTP errors
  if (!response.ok) {
    if (response.status === 401) {
      return { error: 'Authentication failed - check API keys' };
    }
    return { error: `API error: ${response.status}` };
  }
  
  const data = response.json();
  
  // Handle successful responses
  if (data.pack) {
    // Structured pack data available
    return {
      type: 'pack',
      title: data.pack.title,
      category: data.pack.category,
      urgency: data.pack.urgency,
      steps: data.pack.steps,
      fallbackText: data.text
    };
  } else {
    // Text-only response (chat or pack fallback)
    return {
      type: 'text',
      content: data.text,
      suggestion: data.mode === 'pack' ? 'Try rephrasing for structured data' : null
    };
  }
}
```

### Retry Logic Template
```javascript
async function callEverAidWithRetry(payload, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(EVERAID_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ANON_KEY}`,
          'apikey': ANON_KEY
        },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      // Retry auth errors
      if (response.status === 401 && attempt < maxRetries) {
        await sleep(800);
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await sleep(800);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

These examples show how to integrate EverAid AI across different automation platforms, with proper error handling and response processing for both chat and pack generation modes.