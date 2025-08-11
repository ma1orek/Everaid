# 🚨 EverAid - Any Emergency AI Assistant

> **You're not alone. Open EverAid.**

## 🌐 [**everaid.app**](https://everaid.app)

*Visit our website for live demo and more information*

[![OpenAI Open Model Hackathon](https://img.shields.io/badge/OpenAI-Open%20Model%20Hackathon-blue?style=for-the-badge&logo=openai)](https://openai.devpost.com/)
[![License](https://img.shields.io/badge/License-Apache%202.0-green.svg?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-React%20Native%20%2B%20Web-blue?style=for-the-badge&logo=react)](https://reactnative.dev/)

A mobile-first AI emergency toolkit that works **online and offline**, providing step-by-step guidance for any crisis situation. Built for the **OpenAI Open Model Hackathon** with gpt-oss + Supabase.

## 🎯 Built for Humanity

**EverAid** is designed for real-world emergencies where seconds matter and connectivity fails. Whether you're dealing with a medical crisis, survival situation, technical failure, or communication breakdown - EverAid provides clear, actionable steps that work with or without internet.

### 🏆 Hackathon Categories
- **For Humanity** - Practical, high-impact guidance for first aid, evacuation, and crisis response
- **Best Local Agent** - Offline-first AI with local fallback behavior in real use cases
- **OpenAI Open Model Hackathon** - Built specifically for this competition

## ✨ Key Features

### 🚫 Offline-First Design
- **80 pre-loaded emergency packs** cached locally
- **Local AI fallback** when networks fail
- **Service Worker** ensures critical content is always available

### 🧠 AI-Powered Guidance
- **gpt-oss-20b** via Supabase Edge Functions
- **Real-time chat** for custom emergency scenarios
- **Multilingual support** (PL/EN auto-detection)
- **Structured JSON output** for consistent pack creation

### 🎨 Mobile-First UI/UX
- **Dark theme** optimized for low-light emergency situations
- **High contrast** design for stress-free reading
- **Zero-friction** interface - get help in under 3 taps
- **Responsive design** that works on any device

### 📱 Cross-Platform
- **React Native** mobile app (iOS/Android)
- **Web version** for hackathon demo
- **PWA support** for offline access

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Together AI API key

### 1. Clone & Install
```bash
git clone https://github.com/ma1orek/EverAid.git
cd EverAid
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
TOGETHER_API_KEY=your_together_api_key
```

### 3. Run the App

#### Mobile (React Native)
```bash
npm run start
# Scan QR with Expo Go app
```

#### Web Version
```bash
npm run web
# Open http://localhost:19006
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native + Expo, React (web)
- **Backend**: Supabase Edge Functions (Hono)
- **AI**: Together AI (gpt-oss-20b)
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS + custom design system
- **State**: React hooks + local storage

### Data Flow
```
User Input → Edge Function → gpt-oss-20b → Structured Response → UI Update
     ↓
Local Cache ← Supabase Database ← Pack Storage
```

### Security Model
- **Secrets** stored in Supabase Edge Functions
- **Client** uses only public anon key
- **No sensitive data** in browser/mobile
- **Local-first** design respects privacy

## 📦 Emergency Pack System

### 4 Core Categories
- **🏥 Health** - Medical emergencies, first aid, symptoms
- **🆘 Survive** - Natural disasters, accidents, survival skills
- **🔧 Fix** - Technical issues, repairs, troubleshooting
- **💬 Speak** - Communication, language barriers, crisis management

### Pack Structure
```json
{
  "type": "pack",
  "pack": {
    "title": "Stop Bleeding",
    "oneLiner": "Immediate steps to control bleeding",
    "category": "Health",
    "urgency": "EMERGENCY",
    "estMinutes": 5,
    "steps": [
      {
        "title": "Apply direct pressure",
        "description": "Use clean cloth and press firmly",
        "timerSeconds": 300
      }
    ]
  }
}
```

### Urgency Levels
- **🚨 EMERGENCY** - Life-threatening situations (red)
- **⚠️ WARNING** - Serious but not critical (yellow)  
- **ℹ️ INFO** - General guidance (blue)

## 🧪 Testing & Development

### AI Testing
```javascript
// Test AI connection
setupAITesting();

// Test database
setupDatabaseTesting();

// Expose functions globally for debugging
exposeAIFunctionsGlobally();
```

### Edge Function Testing
```bash
# Test Supabase functions
cd supabase/functions
npm run dev
```

### Quality Assurance
- **Smoke tests** for core functionality
- **AI integration tests** for response quality
- **Offline behavior** validation
- **Cross-platform** compatibility checks

## 📚 Documentation

- [API Integration Guide](docs/api-integration-guide.md)
- [Quick Test Instructions](docs/quick-test-instructions.md)
- [Troubleshooting Guide](docs/troubleshooting-401.md)
- [Platform Examples](docs/platform-examples.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for the OSS Hackathon opportunity
- **Supabase** for the amazing backend platform
- **Together AI** for open-source model access
- **React Native** community for the mobile framework

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/ma1orek/EverAid/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ma1orek/EverAid/discussions)
- **Email**: [idzikbartosz@gmail.com](mailto:idzikbartosz@gmail.com)

---

**Built with ❤️ for the OpenAI Open Model Hackathon**

*EverAid - Because in emergencies, you're not alone.*