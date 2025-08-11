# EverAid - Emergency Aid Mobile Application

## Product Summary

EverAid is a mobile emergency assistance application built with React Native/Expo, designed to provide step-by-step guidance during emergency situations. The app works offline and features a dark UI theme optimized for stress situations and low-light conditions.

### Core Features
- **Offline-first**: All functionality works without internet connection
- **Dark theme**: Optimized for emergency situations and battery conservation
- **Category-based organization**: Health, Survive, Fix, Speak umbrellas
- **Step-by-step guidance**: Interactive chat-style emergency protocols
- **Quick response**: Urgency-based prioritization and time estimates
- **Pack sharing**: QR code sharing for custom emergency packs

## Screen Overview

### Primary Navigation
1. **Home** - Main dashboard with filterable emergency packs in 2-column grid
2. **Chat/Guide** - Interactive step-by-step emergency guidance 
3. **Settings** - App configuration and pack management

### Secondary Screens
4. **Manage Packs** - User pack library with edit/delete actions
5. **Pack Builder** - Create/edit custom emergency packs
   - **Details** - Basic pack information (title, category, urgency)
   - **Steps** - Add/edit step-by-step instructions
   - **Review** - Final preview before saving
6. **App Profile Settings** - User preferences and app configuration
7. **Import Preview** - Preview imported pack before adding to library
8. **QR Share** - Generate QR codes for pack sharing

## User Flows

### Core Emergency Flow
```
Home → Filter by Category → Select Pack → Chat/Guide → Follow Steps → Complete/Exit
```

### Pack Management Flow
```
Settings → Manage Packs → [Edit existing] / [Create new via Pack Builder]
Pack Builder: Details → Steps → Review → Save
```

### Import/Share Flow
```
Share: Chat/Settings → QR Share → Generate QR
Import: External QR scan → Import Preview → Add to Library
```

### Search Flow
```
Home → Search (overlay) → Filter results → Select Pack → Chat/Guide
```

## UI Terminology Glossary

### Components
- **Knowledge Box/Pack Card** - Emergency pack display card with icon, title, CTA, urgency badge
- **Filter Chips** - Category filters (Health, Survive, Fix, Speak) with sticky behavior
- **Urgency Badge** - Color-coded priority indicators (Emergency/Warning/Info)
- **Steps Block** - Chat bubble containing step-by-step instructions
- **Quick Chips** - Context-aware suggestion buttons below chat input
- **Bottom CTA** - Primary action button with gradient backdrop
- **Guide Book** - Emergency pack header shown in Chat with title and urgency

### Interactions
- **Filter** - Category-based content filtering on Home screen
- **Search** - Text-based pack discovery with overlay interface  
- **Share Pack** - QR code generation for pack distribution (Chat/Settings only)
- **Handoff** - Transferring emergency situation to professional responders

### Categories (Umbrellas)
- **Health** (#34C759) - Medical emergencies and first aid
- **Survive** (#FF9F0A) - Wilderness and survival situations
- **Fix** (#0A84FF) - Mechanical repairs and troubleshooting
- **Speak** (#00C7BE) - Communication aids and language assistance

### Urgency Levels
- **Emergency** (Red) - Life-threatening situations requiring immediate action
- **Warning** (Orange/Yellow) - Serious situations with potential for escalation
- **Info** (Blue/Gray) - Preventive measures and general guidance

## Development Checklist

### ✅ Completed
- [x] Core UI components and screens
- [x] Dark theme implementation
- [x] Offline data structure
- [x] Category filtering system
- [x] Chat-style guidance interface
- [x] Pack builder functionality
- [x] QR sharing system

### 🔲 Production Readiness
- [ ] Real-world content validation with emergency professionals
- [ ] Accessibility testing (VoiceOver, large text, high contrast)
- [ ] Performance optimization for older devices
- [ ] Internationalization framework
- [ ] Analytics and crash reporting
- [ ] App store compliance (medical disclaimers, liability)
- [ ] Content moderation for user-generated packs
- [ ] Backup/sync functionality (optional online features)

### 🚨 Critical Pre-Launch
- [ ] Medical/legal review of health-related content
- [ ] Emergency services coordination testing
- [ ] Battery optimization validation
- [ ] Stress testing UI in actual emergency scenarios
- [ ] Clear disclaimer about professional medical care

## Technical Stack

- **Framework**: React Native with Expo
- **Styling**: Tailwind CSS with custom design tokens
- **Navigation**: Custom screen state management
- **Storage**: Local JSON-based data persistence
- **Icons**: Lucide React Native + custom SVGs
- **Testing**: Manual QA with emergency scenario simulation

## Content Guidelines

All emergency content should follow these principles:
1. **Brevity**: Steps should be actionable in under 30 seconds
2. **Clarity**: Use simple language, avoid medical jargon
3. **Safety-first**: Always prioritize user safety over completion
4. **Professional handoff**: Include clear "when to seek help" guidance
5. **Offline reliability**: No dependencies on network connectivity

---

*Last updated: August 2025*
*Version: 1.0.0 (Prototype)*