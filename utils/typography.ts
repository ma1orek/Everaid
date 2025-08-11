// Typography utility with exact REM scale and specifications (1rem = 16px)
export const rem = (n: number) => `${n}rem`;

export const typography = {
  h1: {
    fontSize: rem(2.25), // 36px
    lineHeight: rem(2.75), // 44px
    fontWeight: '700',
    letterSpacing: '-0.2px',
    maxWidth: '88%'
  },
  section: {
    fontSize: rem(1.125), // 18px
    fontWeight: '600'
  },
  body: {
    fontSize: rem(1), // 16px
    fontWeight: '400'
  },
  packTitle: {
    fontSize: rem(1.25), // 20px
    fontWeight: '600',
    letterSpacing: '-0.2px'
  },
  hint: {
    fontSize: rem(0.9375), // 15px
    fontWeight: '400',
    color: '#C8CBD3',
    marginTop: '8px'
  },
  chip: {
    fontSize: rem(0.875), // 14px
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
    fontWeight: '500'
  },
  cta: {
    fontSize: rem(1), // 16px
    fontWeight: '700'
  }
} as const;

// Exact color system from specifications
export const colors = {
  app: {
    bg: '#101215',
    cardBg: '#171A1F',
    textPrimary: '#F2F3F5', // Text100
    text70: '#C8CBD3', // Text70
    text50: '#9AA0A6', // Text50
    chipNeutralBg: '#1C2026',
    chipNeutralBorder: '#2C323A',
    ctaBg: '#1C1F25',
    ctaActionBg: '#1E2228'
  },
  umbrellas: {
    HEALTH: '#34C759',
    SURVIVE: '#FF9F0A', 
    FIX: '#0A84FF',
    SPEAK: '#00C7BE'
  },
  urgency: {
    emergency: { bg: '#FF3B30', fg: '#FFFFFF' },
    warning: { bg: '#FFCC00', fg: '#111111' },
    info: { bg: 'transparent', fg: '#C8CBD3', border: '#2C323A' }
  }
} as const;

// Exact layout constants from specifications
export const layout = {
  frame: { width: 440, height: 948 },
  safeArea: { top: 24, bottom: 24 },
  sidePadding: 24,
  gridGutter: 16,
  cardWidth: 188,
  cardMinHeight: 240, // Ensures aligned rows
  cardRadius: 20, // Softer corners
  cardPadding: 16,
  filterChipHeight: 40,
  filterChipRadius: 20,
  urgencyChipHeight: 28,
  urgencyChipRadius: 14,
  ctaButtonHeight: 64,
  ctaButtonRadius: 32,
  ctaActionHeight: 44,
  ctaActionRadius: 22,
  scrimHeight: 112,
  contentPaddingBottom: 96 // 64 CTA height + 32 spacing
} as const;

// Exact spacing constants
export const spacing = {
  hintFromH1: 8,
  filtersFromHint: 16,
  titleToDesc: 6,
  descToChips: 12,
  chipsToActions: 16
} as const;