# EverAid AI Integration Smoke Test

## 🧪 Quick Test Checklist

### Prerequisites
- [ ] **Configure Environment Variables**: 
  - Copy `.env.example` to `.env`
  - Set your actual `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - Example: `VITE_SUPABASE_URL=https://your-project.supabase.co`
- [ ] Edge function `gptoss` deployed to Supabase
- [ ] `TOGETHER_API_KEY` secret configured in Supabase (optional - fallback works without it)

### Test 1: Chat Feature ✅
**Location**: Ask EverAid screen

1. **Navigate to Chat**:
   - Go to Home screen
   - Click "Ask EverAid" or any pack to enter chat mode

2. **Send Test Message**:
   - Type: `I cut my hand and it's bleeding`
   - Press Send button
   - **Expected**: User bubble appears immediately
   - **Expected**: "Thinking..." bubble appears briefly  
   - **Expected**: AI response bubble with emergency first aid steps

3. **Error Handling Test**:
   - Turn off internet connection
   - Send another message
   - **Expected**: Error message "AI is unavailable. Try again in a moment."

### Test 2: Pack Builder Generation ✅
**Location**: Create Pack → Generate with AI

1. **Navigate to Pack Builder**:
   - Go to Home screen  
   - Tap "+" floating action button
   - Select "Create Pack"

2. **Generate Pack**:
   - In AI generation section, type: `emergency choking response`
   - Click "Generate Pack Details"
   - **Expected**: Loading spinner appears
   - **Expected**: Form fields auto-populate:
     - Category: Health
     - Title: Contains "choking"
     - One-liner: Descriptive text
     - Urgency: Emergency or Warning
     - ETA: 3-10 minutes
     - Steps: 3+ actionable steps

3. **Form Validation**:
   - All fields should be properly filled
   - Character limits respected (Title ≤32, One-liner ≤90, etc.)
   - Steps should have meaningful titles and descriptions

### Test 3: Browser Console Tests ✅

Open browser console (`F12`) and run:

```javascript
// Test basic connection
testAIConnection()
// Expected: { success: true, details: { ... } }

// Test exact user example  
askAI("Create a 3-step emergency pack for choking in a conscious adult.")
  .then(console.log)
  .catch(console.error);
// Expected: String response with emergency steps
```

### Test 4: Edge Function Direct Test ✅

Test the endpoint directly:

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/gptoss' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'apikey: YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"mode":"chat","prompt":"test emergency"}'
```

**Expected Response**:
```json
{
  "ok": true,
  "result": {
    "text": "Emergency response text..."
  }
}
```

### Test 5: Fallback Behavior ✅

1. **Without TOGETHER_API_KEY**:
   - AI should still work using fallback responses
   - Responses should be contextually appropriate
   - No console errors

2. **Network Issues**:
   - User messages always preserved 
   - Graceful error messages shown
   - No app crashes

## ✅ Pass Criteria

All tests must pass with:
- **No console errors** related to AI integration
- **User messages preserved** even when AI fails
- **Appropriate fallbacks** when API unavailable
- **Form auto-population** in PackBuilder
- **Contextually relevant** AI responses

## 🚨 Common Issues & Fixes

### 401 Authorization Error
- **Check**: Environment variables properly set
- **Check**: Anon key matches Supabase project
- **Check**: Headers include both `Authorization` and `apikey`

### "Failed to fetch" Error  
- **Check**: Edge function deployed to correct project
- **Check**: Function name is exactly `gptoss`
- **Check**: CORS headers configured properly

### Empty AI Responses
- **Check**: `TOGETHER_API_KEY` in Supabase secrets
- **Check**: API key has sufficient credits
- **Check**: Fallback generation working

---

**✨ When all tests pass, the AI integration is fully functional!** 🎯