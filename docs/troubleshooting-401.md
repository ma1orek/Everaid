# Troubleshooting 401 Authorization Errors

## Quick Diagnosis

### 1. Test AI Connection
Open browser console and run:
```javascript
testAIConnection()
```

This will show detailed request/response information including:
- Endpoint URL being used
- Headers being sent
- Response status and body
- Error details

### 2. Check Environment
The AI client should initialize with these values:
```javascript
// Check in browser console:
console.log('Project ID:', window.projectId);
console.log('AI URL:', window.aiClientURL);
```

### 3. Expected Values
- **Project ID**: `tnzhrxkulxcfpfaxouif`
- **API URL**: `https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/server/gptoss`
- **ANON Key**: Should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## Common Issues & Fixes

### ❌ 401 Unauthorized
**Symptoms**: "AI client: 401 - Brak autoryzacji"

**Causes**:
1. **Missing apikey header** (most common)
2. **Wrong ANON key** (expired or from different project)
3. **Edge function not deployed**
4. **CORS configuration missing apikey**

**Solutions**:
```bash
# Test with cURL:
curl -X POST 'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/server/gptoss' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -d '{"mode":"chat","prompt":"test","lang":"en"}'
```

### ❌ 404 Not Found
**Symptoms**: "AI client: HTTP 404"

**Causes**:
1. **Wrong endpoint URL**
2. **Edge function not deployed**
3. **Function name mismatch**

**Fix**: Check if endpoint exists:
```bash
curl -X GET 'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/server/health'
```

### ❌ Network/CORS Errors
**Symptoms**: "TypeError: Failed to fetch"

**Causes**:
1. **Missing CORS headers**
2. **Wrong request format**
3. **Network connectivity**

**Fix**: Check browser Network tab for exact error

## Debugging Steps

### Step 1: Verify Keys
```javascript
// In browser console:
const { projectId, publicAnonKey } = await import('./utils/supabase/info');
console.log('Project ID:', projectId);
console.log('ANON Key prefix:', publicAnonKey.substring(0, 30) + '...');
```

### Step 2: Test Manual Request
```javascript
// Test the exact request AI client makes:
const response = await fetch('https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/server/gptoss', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY',
    'apikey': 'YOUR_ANON_KEY',
  },
  body: JSON.stringify({
    mode: 'chat',
    prompt: 'test emergency',
    lang: 'en'
  })
});

console.log('Status:', response.status);
console.log('Response:', await response.text());
```

### Step 3: Check Edge Function Logs
1. Go to Supabase Dashboard
2. Edge Functions → server → Invocations
3. Look for requests to `/gptoss`
4. Check status codes and error messages

## Expected Responses

### ✅ Successful Chat
```json
{
  "ok": true,
  "mode": "chat",
  "text": "1. Assess the situation\n2. Call for help if needed\n3. Follow safety procedures"
}
```

### ✅ Successful Pack Generation
```json
{
  "ok": true,
  "mode": "pack",
  "text": "Generated pack: Emergency Response",
  "pack": {
    "title": "Emergency Response",
    "category": "HEALTH",
    "urgency": "emergency",
    "steps": [...]
  }
}
```

### ❌ Error Response
```json
{
  "ok": false,
  "mode": "chat",
  "text": "Prompt is required",
  "error": "Prompt is required"
}
```

## Quick Fixes

### Fix 1: Update ANON Key
```typescript
// In /utils/supabase/info.tsx:
export const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### Fix 2: Force Reload
```javascript
// Clear any cached credentials:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 3: Check Function Deployment
Ensure edge function is deployed with the `/gptoss` endpoint:
```typescript
app.post("/gptoss", async (c) => {
  // Handler code...
});
```

## Contact Support

If issues persist after following this guide:

1. **Check**: Browser console for exact error messages
2. **Verify**: Supabase Edge Function logs show requests
3. **Test**: cURL command works from command line
4. **Report**: Include specific error messages and request details

---

**Last Updated**: Current deployment  
**Function**: `/functions/v1/server/gptoss`  
**Expected Status**: 200 OK with JSON response