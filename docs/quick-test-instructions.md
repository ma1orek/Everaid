# Quick Test Instructions - AI Endpoint Fix

## 🚀 Immediate Testing

### 1. Open Browser Console
Press `F12` or `Ctrl+Shift+I` and go to Console tab.

### 2. Test Basic Connection
```javascript
// Test the exact endpoint format:
testAIConnection()
```

**Expected Result**: Should show `success: true` and response data.

### 3. Test User Example Function
```javascript
// Test the exact function from user comment:
askAI("Create a 3-step emergency pack for choking in a conscious adult.")
  .then(console.log)
  .catch(console.error);
```

**Expected Result**: Should return emergency response text.

### 4. Test Pack Generation
```javascript
// Test pack mode:
askAI("choking emergency pack").then(console.log);
```

## 🔧 Fixed Issues

### ✅ Corrected Endpoint URL
- **Old**: `https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/server/gptoss`
- **New**: `https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss`

### ✅ Exact Header Format
```javascript
headers: {
  "Authorization": `Bearer ${ANON_KEY}`,
  "apikey": ANON_KEY,
  "Content-Type": "application/json",
}
```

### ✅ Proper Body Format
```javascript
body: JSON.stringify({ prompt })
```

## 🐛 If Still Getting 401

### Check 1: Verify Keys Match
```javascript
// Check current key in use:
console.log('Key prefix:', publicAnonKey.substring(0, 30));
```

### Check 2: Test cURL
```bash
curl -X POST 'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"prompt":"test emergency"}'
```

### Check 3: Edge Function Status
- Go to Supabase Dashboard → Edge Functions
- Verify `gptoss` function is deployed
- Check function logs for errors

## ✨ App Testing

### Chat Feature
1. Go to "Ask EverAid"
2. Type: "I cut my hand and it's bleeding"
3. Should see AI response with emergency steps

### Pack Builder
1. Go to Create Pack → Generate with AI
2. Type: "emergency choking response"
3. Should auto-populate form OR show text response

---

**All requests now use the exact format specified in user comment!** 🎯