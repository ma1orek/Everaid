#!/bin/bash

# Test Edge Function Connection with Required Headers
# Run this in terminal to verify the fix

EDGE_URL="https://tnzhrxkulxcfpfaxouif.supabase.co/functions/v1/gptoss"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuemhyeGt1bHhjZnBmYXhvdWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MzE0MDcsImV4cCI6MjA0OTUwNzQwN30.AI_TJp4TZtKfpgC9mCwzpKPkbCF4uHkhJ_dZZpN2QDA"

echo "🧪 Testing Edge Function with corrected headers..."
echo "URL: $EDGE_URL"
echo ""

# Test 1: Simple pack generation
echo "Test 1: Pack Generation"
curl -X POST \
  "$EDGE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  --data '{
    "prompt": "You are EverAid generator. Create a concise emergency \"Pack\" object with fields: { id, title, oneLiner, category (Health|Survive|Fix|Speak), urgency (EMERGENCY|WARNING|INFO), estMinutes (number), cta, steps: [{id,title,description,timerSeconds?}] }. 3–6 steps max. Keep text short, imperative. No markdown.\nUser request: treating a house fire evacuation",
    "mode": "pack",
    "format": "json",
    "context": {}
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  --max-time 30

echo -e "\n" "="*50 "\n"

# Test 2: Chat response  
echo "Test 2: Chat Response"
curl -X POST \
  "$EDGE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  --data '{
    "prompt": "You are EverAid. Reply with short, numbered rescue steps (max 6), 1–2 lines each, imperative voice. If life-threatening → start with CALL EMERGENCY. Finish with a one-line safety check. No markdown.\nSituation: \"I cut my hand and its bleeding a lot\"",
    "mode": "chat", 
    "format": "text",
    "context": { "locale": "en", "offlineHint": false }
  }' \
  -w "\nHTTP Status: %{http_code}\n" \
  --max-time 30

echo -e "\n" "="*50 "\n"

# Test 3: Simple prompt test (as per your instruction)
echo "Test 3: Simple Prompt (per instructions)"
curl -X POST \
  "$EDGE_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "apikey: $ANON_KEY" \
  --data '{ "prompt": "Create a 3-step emergency pack for choking in a conscious adult." }' \
  -w "\nHTTP Status: %{http_code}\n" \
  --max-time 30

echo -e "\n🏁 Test completed!"