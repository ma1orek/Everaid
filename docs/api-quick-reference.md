# EverAid AI API - Quick Reference

## Endpoint
```
POST https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss
```

## Headers (Required)
```http
Content-Type: application/json
Authorization: Bearer <SUPABASE_ANON_KEY>
apikey: <SUPABASE_ANON_KEY>
```

## Request Body

### Chat Mode
```json
{
  "mode": "chat",
  "prompt": "I cut my hand and it's bleeding",
  "lang": "en"
}
```

### Pack Mode
```json
{
  "mode": "pack", 
  "prompt": "Create emergency pack for choking",
  "lang": "en"
}
```

## Response

### Chat
```json
{
  "ok": true,
  "mode": "chat",
  "text": "1. Apply pressure\n2. Elevate hand\n3. Call for help"
}
```

### Pack (Success)
```json
{
  "ok": true,
  "mode": "pack", 
  "text": "Pack created",
  "pack": {
    "title": "Choking Response",
    "category": "HEALTH",
    "urgency": "EMERGENCY",
    "steps": [...]
  }
}
```

### Pack (Fallback)
```json
{
  "ok": true,
  "mode": "pack",
  "text": "Here are the emergency steps: 1. Check consciousness 2. Give back blows..."
}
```

## Usage

### Handle Pack Response
```javascript
if (response.pack) {
  // Success - use structured data
  const title = response.pack.title;
  const steps = response.pack.steps;
} else {
  // Fallback - use text and suggest retry
  const instructions = response.text;
}
```

### Handle Chat Response  
```javascript
// Always use text field
const guidance = response.text;
```

## Common Errors

**401 Unauthorized**
- Missing `apikey` header
- Wrong ANON key
- Service role key used instead of anon

**CORS/Network**
- Missing `Content-Type` header
- Typo in endpoint URL
- Network connectivity issues

**Rate Limited**
- One concurrent request max
- Retry after 800ms delay

## Test Command

```bash
curl -X POST \
  'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -d '{"mode":"chat","prompt":"test emergency","lang":"en"}'
```

Expected: `200 OK` with JSON response