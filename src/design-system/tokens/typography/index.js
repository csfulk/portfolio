/**
 * Typography Design Tokens - Clean & Unified
 * Centralized typography system using semantic scales only
 */

// Typography Primitives - Core values used in semantic scales
const fontFamily = {
  primary: "'Inter Tight', sans-serif",
  mono: "'SF Mono', 'Monaco', 'Menlo', monospace"
};

const fontSize = {
  'xxs': '0.64rem',
  'xs': '0.8rem',
  'sm': '1rem',
  'md': '1.25rem',
  'lg': '1.563rem',
  'xl': '1.953rem',
  '2xl': '2.441rem',
  '3xl': '3.052rem',
  '4xl': '3.815rem'
};

const fontWeight = {
  light: 300,
  normal: 400,
  medium: 475,
  semibold: 600,
  bold: 700
};

const lineHeight = {
  tight: 1.2,
  normal: 1.3,
  relaxed: 1.6,
  loose: 1.8
};

const letterSpacing = {
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em'
};

// Unified weight mapping for text and icon parity
const weightMapping = {
  light: { iconStroke: 1 },
  normal: { iconStroke: 1.5 },
  medium: { iconStroke: 1.75 },
  semibold: { iconStroke: 2.25 },
  bold: { iconStroke: 2.5 }
};

// Optimized icon defaults for each component size (size only, weight handled by fontWeight)
const iconDefaults = {
  xs: { size: 'md' },
  sm: { size: 'lg' },
  md: { size: 'lg' },
  lg: { size: 'xl' },
  xl: { size: 'xl' }
};

export const typography = {
  // Export primitives for external use
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  weightMapping,
  iconDefaults,

  // Typography Scales - Semantic combinations for consistent usage
  // This is the single source of truth for all typography
  scales: {
    // Display Typography
    'display-1': {
      fontSize: '5.96rem', // Custom size for display
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight
    },
    'display-2': {
      fontSize: '4.768rem', // Custom size for display
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight
    },

    // Heading Typography
    'heading-1': {
      fontSize: fontSize['4xl'],
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight
    },
    'heading-2': {
      fontSize: fontSize['3xl'],
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.tight,
      letterSpacing: letterSpacing.tight
    },
    'heading-3': {
      fontSize: fontSize['2xl'],
      fontWeight: fontWeight.semibold,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal
    },
    'heading-4': {
      fontSize: fontSize.xl,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal
    },
    'heading-5': {
      fontSize: fontSize.lg,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal
    },
    'heading-6': {
      fontSize: fontSize.md,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal
    },

    // Body Typography
    'body-lg': {
      fontSize: fontSize.md,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.relaxed,
      letterSpacing: letterSpacing.normal
    },
    'body': {
      fontSize: fontSize.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.loose,
      letterSpacing: letterSpacing.normal
    },
    'body-sm': {
      fontSize: fontSize.xs,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.relaxed,
      letterSpacing: letterSpacing.normal
    },

    // Special purpose
    'caption': {
      fontSize: fontSize.xxs,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.normal,
      letterSpacing: letterSpacing.normal
    }
  }
};
