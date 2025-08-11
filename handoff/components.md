# Component Inventory

## Core Display Components

### KnowledgeBox (Pack Card)
**File**: `/components/KnowledgeBox.tsx`

**Purpose**: Display emergency pack information in grid layout

**Props**:
- `pack: Pack` - Pack data object
- `onPress: (pack: Pack) => void` - Card tap handler
- `className?: string` - Additional styling

**Layout**: 
- Fixed aspect ratio card with rounded corners
- Icon, title, urgency badge, CTA button, eta display
- Category-specific accent colors

**States**:
- Default
- Pressed (reduced opacity)
- Loading (skeleton placeholder)

---

### FilterChips
**File**: `/components/FilterChips.tsx`

**Purpose**: Category filtering with sticky scroll behavior

**Props**:
- `categories: Umbrella[]` - Available filter options
- `activeFilters: Umbrella[]` - Currently selected filters  
- `onFilterChange: (filters: Umbrella[]) => void` - Filter update handler
- `totalCount: number` - Total items count
- `filteredCount: number` - Filtered items count

**Layout**:
- Horizontal scroll with sticky positioning
- "All" chip + category chips with counts
- Active state visual distinction

**States**:
- Default (unselected)
- Active (selected with category color)
- Disabled (no items in category)

---

### StepsBlock  
**File**: `/components/StepsBlock.tsx`

**Purpose**: Chat bubble containing step-by-step instructions

**Props**:
- `stepsBlock: StepsBlock` - Steps data
- `onStepComplete?: (stepIndex: number) => void` - Step completion handler
- `completedSteps?: number[]` - Array of completed step indices

**Layout**:
- Chat bubble styling with steps list
- Timer indicators for timed steps
- Progress indicators
- Source attribution

**States**:
- Default
- Step in progress (highlighted)
- Step completed (checked)
- Expandable/collapsible details

---

## Navigation Components

### TopBar
**File**: `/components/TopBar.tsx`

**Purpose**: Screen header with navigation and actions

**Props**:
- `title?: string` - Screen title
- `showBack?: boolean` - Show back button
- `showSettings?: boolean` - Show settings action
- `onBack?: () => void` - Back button handler
- `onSettings?: () => void` - Settings button handler
- `actions?: ReactNode` - Custom action buttons

**Layout**:
- Fixed positioning with backdrop blur
- Left: back button, Center: title, Right: actions
- Safe area aware

**States**:
- Default
- With search (integrated search bar)
- Transparent (for overlay screens)

---

### SearchOverlay
**File**: `/components/SearchOverlay.tsx`

**Purpose**: Full-screen search interface

**Props**:
- `isVisible: boolean` - Show/hide overlay
- `onClose: () => void` - Close overlay handler
- `onSearch: (query: string) => void` - Search query handler
- `results?: Pack[]` - Search results array
- `loading?: boolean` - Loading state

**Layout**:
- Full-screen overlay with backdrop
- Search input with cancel button
- Results list with highlighting
- Empty state messaging

**States**:
- Hidden
- Empty (no query)
- Loading (search in progress)
- Results (with highlighting)
- No results (empty state)

---

## Interactive Components

### CreateActionSheet
**File**: `/components/CreateActionSheet.tsx`

**Purpose**: Bottom sheet for creating new packs

**Props**:
- `isVisible: boolean` - Show/hide state
- `onClose: () => void` - Close handler
- `onCreatePack: () => void` - Create pack handler
- `onImportPack: () => void` - Import pack handler

**Layout**:
- Bottom sheet with backdrop
- Action buttons with icons
- Gesture-aware dismissal

**States**:
- Hidden
- Visible (with animation)
- Dismissing

---

### QRModal
**File**: `/components/QRModal.tsx`

**Purpose**: QR code generation and sharing

**Props**:
- `pack: Pack` - Pack to share
- `isVisible: boolean` - Modal visibility
- `onClose: () => void` - Close handler

**Layout**:
- Center modal with QR code
- Pack information display
- Share and save actions

**States**:
- Hidden
- Generating QR
- Ready to share
- Error state

---

## UI Primitives

### Button (ShadCN)
**File**: `/components/ui/button.tsx`

**Variants**:
- `default` - Primary action button
- `secondary` - Secondary action
- `outline` - Outlined button
- `ghost` - Text-only button
- `destructive` - Delete/remove actions

**Sizes**:
- `sm` - Compact button
- `default` - Standard size
- `lg` - Large touch targets

---

### Badge (ShadCN)
**File**: `/components/ui/badge.tsx`

**Purpose**: Urgency and status indicators

**Variants**:
- `emergency` - Red background
- `warning` - Orange background  
- `info` - Blue background
- `default` - Gray background

---

### Sheet (ShadCN)
**File**: `/components/ui/sheet.tsx`

**Purpose**: Modal bottom sheets and slide-overs

**Positions**:
- `bottom` - Bottom sheet (mobile primary)
- `top` - Top sheet
- `left` - Side navigation
- `right` - Side panel

---

## Layout Components

### Card (ShadCN)
**File**: `/components/ui/card.tsx`

**Purpose**: Content containers with consistent styling

**Anatomy**:
- `Card` - Root container
- `CardHeader` - Header section
- `CardTitle` - Title text
- `CardContent` - Main content area
- `CardFooter` - Action area

---

### Separator (ShadCN)
**File**: `/components/ui/separator.tsx`

**Purpose**: Visual content separation

**Variants**:
- `horizontal` - Horizontal divider
- `vertical` - Vertical divider

---

## Form Components

### Input (ShadCN)
**File**: `/components/ui/input.tsx`

**Purpose**: Text input fields

**States**:
- Default
- Focused (with ring)
- Disabled (reduced opacity)
- Error (red border)

---

### Textarea (ShadCN)  
**File**: `/components/ui/textarea.tsx`

**Purpose**: Multi-line text input

**Features**:
- Auto-resize capability
- Character count (optional)
- Placeholder support

---

## Feedback Components

### Toast (Sonner)
**File**: `/components/ui/sonner.tsx`

**Purpose**: Temporary notifications

**Types**:
- Success (green)
- Warning (orange)  
- Error (red)
- Info (blue)
- Loading (with spinner)

**Position**: Top-center for mobile optimization

---

### Progress (ShadCN)
**File**: `/components/ui/progress.tsx`

**Purpose**: Task completion indicators

**Use cases**:
- Step progress in guides
- Pack completion status
- Loading states

---

## Design System Notes

### Responsive Behavior
- All components built mobile-first (428px viewport)
- Touch targets minimum 44px for accessibility
- Scroll-aware positioning for fixed elements

### Accessibility
- VoiceOver compatible with proper labels
- Keyboard navigation support
- High contrast mode compatibility
- Large text scaling support

### Performance
- Lazy loading for off-screen components
- Virtualized lists for large datasets
- Memoized expensive calculations
- Optimized re-renders with React.memo

### Theme Integration
- All components use design tokens from `/theme/`
- Dark mode optimized (primary theme)
- Category colors applied consistently
- Urgency-based color coding