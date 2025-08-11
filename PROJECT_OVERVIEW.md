# 🏗️ EverAid Project Overview

> **Technical Architecture & Implementation Details**

## 🎯 Project Summary

EverAid is a **mobile-first AI emergency assistant** built for the OpenAI OSS Hackathon. The application provides step-by-step guidance for emergency situations, working both online and offline using gpt-oss-20b through Supabase Edge Functions.

## 🏆 Hackathon Categories

### For Humanity
- **Real-world impact**: Emergency guidance that can save lives
- **Accessibility**: Works for everyone, regardless of technical skill
- **Offline reliability**: Critical when networks fail during disasters
- **Multilingual support**: PL/EN auto-detection for global reach

### Best Local Agent
- **Offline-first design**: Core functionality without internet
- **Local AI fallback**: Basic guidance when AI is unavailable
- **Cached content**: 80 emergency packs always available
- **Service Worker**: Ensures critical content accessibility

## 🏗️ Technical Architecture

### Frontend Stack
```
React Native (Mobile) + React (Web)
├── Expo framework for cross-platform development
├── Tailwind CSS for consistent styling
├── Custom design system with dark theme
├── TypeScript for type safety
└── Local state management with React hooks
```

### Backend Infrastructure
```
Supabase Platform
├── Edge Functions (Hono.js)
│   ├── /gptoss - AI integration endpoint
│   ├── /server - Pack management API
│   └── /kv_store - Key-value storage
├── PostgreSQL Database
│   ├── Emergency packs storage
│   ├── User preferences
│   └── Usage analytics
└── Real-time subscriptions
```

### AI Integration
```
User Input → Edge Function → Together AI → gpt-oss-20b
     ↓
Structured Response → JSON Pack → UI Update
```

## 📱 Application Structure

### Screen Architecture
```
App.tsx (Root)
├── Home.tsx (Main Dashboard)
│   ├── KnowledgeBox Grid (2x2 layout)
│   ├── FilterChips (Category filters)
│   └── SearchOverlay (Pack discovery)
├── Chat.tsx (AI Guidance)
│   ├── ChatMessage (AI responses)
│   ├── StepsBlock (Step-by-step)
│   └── SuggestionChips (Quick actions)
├── Settings.tsx (Configuration)
├── ManagePacks.tsx (Pack Library)
├── AppProfileSettings.tsx (User Profile)
└── PackBuilder.tsx (Pack Creation)
```

### Component System
```
Core Components
├── KnowledgeBox - Emergency pack display
├── FilterChips - Category filtering
├── SearchOverlay - Search functionality
├── TopBar - Navigation header
├── ChatMessage - AI interaction
├── StepsBlock - Instruction display
├── ThinkingAnimation - AI processing
├── QRModal - Pack sharing
└── CreateActionSheet - Pack creation
```

## 🧠 AI Implementation

### gpt-oss Integration
- **Model**: gpt-oss-20b via Together AI
- **Endpoint**: Supabase Edge Function `/gptoss`
- **Input Format**: Structured prompts with context
- **Output Format**: JSON packs or chat responses

### AI Prompts
```typescript
// Chat Mode
"You are EverAid – a calm on-device emergency helper. 
Detect user language (PL/EN) and answer in it. 
Max 120 words, use short bullet points, prioritize safety."

// Pack Mode
"Return STRICT JSON ONLY with pack structure:
{ type: 'pack', pack: { title, oneLiner, category, 
  urgency, estMinutes, steps: [{ title, description, 
  timerSeconds }] } }"
```

### Response Processing
1. **Language Detection**: Auto-detect PL/EN
2. **Safety Validation**: Ensure medical advice is safe
3. **Structured Output**: Convert to app-compatible format
4. **Local Fallback**: Basic guidance if AI fails

## 🗄️ Data Architecture

### Emergency Pack Structure
```typescript
interface EmergencyPack {
  id: string;
  title: string;
  oneLiner: string;
  category: 'Health' | 'Survive' | 'Fix' | 'Speak';
  urgency: 'EMERGENCY' | 'WARNING' | 'INFO';
  estMinutes: number;
  steps: PackStep[];
  icon?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface PackStep {
  title: string;
  description: string;
  timerSeconds?: number;
  order: number;
}
```

### Database Schema
```sql
-- Emergency Packs
CREATE TABLE emergency_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  one_liner TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  urgency VARCHAR(20) NOT NULL,
  est_minutes INTEGER NOT NULL,
  steps JSONB NOT NULL,
  icon VARCHAR(255),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  language VARCHAR(10) DEFAULT 'en',
  theme VARCHAR(20) DEFAULT 'dark',
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔒 Security & Privacy

### Authentication Model
- **Public Access**: Emergency packs available to all
- **User Accounts**: Optional for personalization
- **API Security**: Rate limiting and input validation
- **Data Privacy**: No personal data collection

### API Security
```typescript
// Edge Function Security
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Input Validation
const validateInput = (input: any) => {
  if (!input.prompt || typeof input.prompt !== 'string') {
    throw new Error('Invalid input format');
  }
  return input;
};
```

## 🚫 Offline Functionality

### Service Worker Strategy
```typescript
// Cache Strategy
const CACHE_NAME = 'everaid-v1';
const CACHE_URLS = [
  '/offline.html',
  '/emergency-packs.json',
  '/assets/icons/',
  '/assets/seed/'
];

// Offline Fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
  }
});
```

### Local Storage
- **Emergency Packs**: 80 pre-loaded packs cached
- **User Preferences**: Settings and favorites
- **Chat History**: Recent AI interactions
- **Offline Mode**: Basic guidance without AI

## 📊 Performance Metrics

### Mobile Performance
- **App Launch**: <2 seconds
- **Pack Loading**: <500ms
- **AI Response**: <3 seconds
- **Offline Switch**: <100ms

### Web Performance
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

## 🧪 Testing Strategy

### Automated Testing
```typescript
// AI Integration Tests
describe('AI Integration', () => {
  test('should generate valid pack JSON', async () => {
    const response = await aiClient.generatePack('Stop bleeding');
    expect(response.type).toBe('pack');
    expect(response.pack.steps).toBeInstanceOf(Array);
  });
});

// Offline Functionality Tests
describe('Offline Mode', () => {
  test('should load cached packs without network', async () => {
    const packs = await loadCachedPacks();
    expect(packs.length).toBeGreaterThan(0);
  });
});
```

### Manual Testing
- **Emergency Scenarios**: Real-world situation simulation
- **Cross-Platform**: iOS, Android, Web testing
- **Accessibility**: Screen reader and keyboard navigation
- **Stress Testing**: High-pressure situation simulation

## 🚀 Deployment

### Mobile App
- **Platform**: Expo Application Services
- **Build**: EAS Build for iOS/Android
- **Distribution**: TestFlight (iOS) / Internal Testing (Android)

### Web Version
- **Hosting**: Vercel/Netlify
- **Domain**: everaid.app (example)
- **SSL**: Automatic HTTPS
- **CDN**: Global edge distribution

### Backend
- **Supabase**: Managed PostgreSQL + Edge Functions
- **Scaling**: Automatic based on usage
- **Monitoring**: Built-in analytics and logging

## 📈 Future Roadmap

### Phase 2 (Post-Hackathon)
- **Voice Commands**: Hands-free emergency guidance
- **AR Integration**: Visual step-by-step guidance
- **Community Packs**: User-generated emergency procedures
- **Professional Review**: Medical professional validation

### Phase 3 (Long-term)
- **Multi-language**: Support for 10+ languages
- **IoT Integration**: Smart device connectivity
- **Emergency Services**: Direct integration with 911/112
- **Training Mode**: Emergency preparedness education

## 🔧 Development Setup

### Prerequisites
```bash
# Required Software
Node.js 18+
npm or yarn
Expo CLI
Supabase CLI
Git
```

### Environment Variables
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Configuration
TOGETHER_API_KEY=your_together_api_key

# App Configuration
APP_ENV=development
DEBUG_MODE=true
```

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run start

# Run web version
npm run web

# Build for production
npm run build

# Test AI integration
npm run test:ai

# Test offline functionality
npm run test:offline
```

## 📚 Additional Resources

### Documentation
- [API Integration Guide](docs/api-integration-guide.md)
- [Quick Test Instructions](docs/quick-test-instructions.md)
- [Troubleshooting Guide](docs/troubleshooting-401.md)
- [Platform Examples](docs/platform-examples.md)

### External Links
- [OpenAI OSS Hackathon](https://openai.devpost.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Native Documentation](https://reactnative.dev/)
- [Together AI Platform](https://together.ai/)

---

**EverAid - Built for Humanity, Powered by Open Source AI**

*This document provides a comprehensive technical overview for hackathon judges, developers, and contributors.*
