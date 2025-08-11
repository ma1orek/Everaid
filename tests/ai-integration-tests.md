# AI Integration Tests

## Automated Tests (Run after deployment)

### 1. Generate Pack Test (NEW API)
**Input:** "treating a house fire evacuation"
**Expected:**
- NEW API call: `{ mode: "pack", prompt: "...", lang: "en" }`
- If successful: Form fields populate automatically from `result.pack`
- If no JSON: Show `result.text` and suggest retry
- Category: SURVIVE, Urgency: emergency, Steps: 3-6 numbered steps
- Toast: "Pack draft generated ✓" OR error message with text

**Command:**
```javascript
// In browser console:
const textarea = document.querySelector('textarea[placeholder*="treating"]');
textarea.value = "treating a house fire evacuation";
textarea.dispatchEvent(new Event('change', { bubbles: true }));
document.querySelector('button:has(svg)').click(); // Generate button
```

### 2. Chat Emergency Response Test (NEW API)
**Input:** "I cut my hand and it's bleeding a lot"
**Expected:**
- NEW API call: `{ mode: "chat", prompt: "...", lang: "en" }`
- Server handles system prompts and formatting
- Clean numbered steps (1-6) in `result.text`
- Response appears in gray chat bubble
- Spinner shows during request

**Command:**
```javascript
// Navigate to chat and send message:
const input = document.querySelector('input[placeholder*="Describe"]');
input.value = "I cut my hand and it's bleeding a lot";
input.dispatchEvent(new Event('change', { bubbles: true }));
document.querySelector('button[disabled]:last-child').click(); // Send button
```

### 3. Network Error Test
**Steps:**
1. Block network requests to Edge Function URL
2. Try generating pack or sending chat message
3. Expected: Toast "AI is busy. Try again." 
4. Fallback behavior for pack generation

### 4. Character Limit Test
**Input:** 650+ characters in any AI field
**Expected:**
- Toast: "Please shorten the description"
- Request blocked
- No API call made

### 5. Concurrent Request Test
**Steps:**
1. Send AI request
2. Immediately send another before first completes
3. Expected: Second request shows "AI is busy. Try again."

## Manual Verification Points

✅ **PackBuilder AI Generation:**
- [ ] Button disabled when textarea empty
- [ ] Loading spinner appears during generation
- [ ] Form fields populate with valid data
- [ ] Toast feedback appears
- [ ] Can edit generated fields manually
- [ ] Character limits enforced (600 chars)

✅ **Chat AI Responses:**
- [ ] Spinner in input field during request
- [ ] Response appears as AI bubble (gray background)
- [ ] User message preserved even if AI fails
- [ ] No markdown in responses
- [ ] Emergency situations get proper urgency
- [ ] Responses are actionable step-by-step

✅ **Error Handling:**
- [ ] Network failures show appropriate toasts
- [ ] Invalid responses handled gracefully
- [ ] Rate limiting prevents spam
- [ ] Timeout after 25 seconds
- [ ] Retry logic works (1 retry after 500ms)

✅ **UI Integration:**
- [ ] No UI changes from original design
- [ ] All existing functionality preserved
- [ ] Buttons disable properly during requests
- [ ] Loading states consistent with app style

## Edge Cases to Test

1. **Empty AI Response:** Edge function returns empty/null
2. **Malformed JSON:** Edge function returns invalid JSON
3. **Network Timeout:** Request takes >25 seconds
4. **Rapid Clicking:** Multiple clicks on generate button
5. **Field Validation:** Generated content exceeds character limits

## Success Criteria

- ✅ Real AI integration replaces all mock functionality
- ✅ Original UI/UX preserved exactly
- ✅ Proper error handling and fallbacks
- ✅ Performance: responses under 10 seconds typical
- ✅ No crashes or broken states
- ✅ Character limits enforced correctly
- ✅ Rate limiting prevents abuse

## Environment Verification

**Check these are set correctly:**
- `EDGE_GPT_URL`: https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss
- `SUPABASE_ANON_KEY`: Available in environment
- **Headers Required**: Both `Authorization: Bearer <key>` AND `apikey: <key>` 
- Edge function accessible and responds to test requests
- TOGETHER_API_KEY configured in Supabase secrets

**Quick cURL Test:**
```bash
curl -X POST 'https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <SUPABASE_ANON_KEY>' \
  -H 'apikey: <SUPABASE_ANON_KEY>' \
  --data '{ "prompt": "Create a 3-step emergency pack for choking in a conscious adult." }'
```
Expected: HTTP 200 with AI response

## Debug Commands

```javascript
// Test NEW centralized AI client directly:
import { callAI } from './utils/aiClientNew';
callAI({
  mode: "chat",
  prompt: "Test emergency situation", 
  lang: "en"
}).then(console.log);

// Test pack generation:
callAI({
  mode: "pack",
  prompt: "Create emergency pack for choking",
  lang: "en",
  format: "json"
}).then(result => {
  console.log('Pack result:', result.pack ? 'SUCCESS' : 'TEXT ONLY');
  console.log('Response:', result);
});

// Test user flow helpers:
import { showUserBubble, showThinkingBubble, showAIBubble } from './utils/aiClientNew';
// These are used for chat UI flows

// Check environment:
console.log('Edge URL accessible:', 'tnzhrxkulxcfpfaxouif' in window.location.href);

// Verify no concurrent requests:
// Client has built-in isAIBusy guard
```

## Terminal Testing

Run the test script to verify Edge Function connectivity:
```bash
# Make executable and run
chmod +x tests/edge-function-test.sh
./tests/edge-function-test.sh
```

**Expected Results:**
- HTTP Status: 200 
- JSON response for pack generation
- Text response for chat
- No 401/403 authentication errors