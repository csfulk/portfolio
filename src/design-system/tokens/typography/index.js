/**
 * Typography Design Tokens - Clean & Unified
 * Centralized typography system using semantic scales only
 */

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Inter Tight', sans-serif",
    mono: "'SF Mono', 'Monaco', 'Menlo', monospace"
  },

  // Minimal primitives for backward compatibility - DEPRECATED
  // Use typography.scales instead for new code
  fontSize: {
    'xs': '0.8rem',
    'sm': '1rem',
    'md': '1.25rem',
    'lg': '1.563rem',
    'xl': '1.953rem',
    '2xl': '2.441rem',
    '3xl': '3.052rem',
    '4xl': '3.815rem'
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.3,
    relaxed: 1.6
  },

  // Typography Scales - Semantic combinations for consistent usage
  // This is the single source of truth for all typography
  scales: {
    // Display Typography
    'display-1': {
      fontSize: '5.96rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em'
    },
    'display-2': {
      fontSize: '4.768rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em'
    },

    // Heading Typography
    'heading-1': {
      fontSize: '3.815rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em'
    },
    'heading-2': {
      fontSize: '3.052rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.025em'
    },
    'heading-3': {
      fontSize: '2.441rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '0em'
    },
    'heading-4': {
      fontSize: '1.953rem',
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '0em'
    },
    'heading-5': {
      fontSize: '1.563rem',
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '0em'
    },
    'heading-6': {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '0em'
    },

    // Body Typography
    'body-lg': {
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em'
    },
    'body': {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.8,
      letterSpacing: '0em'
    },
    'body-sm': {
      fontSize: '0.8rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em'
    },

    // Special purpose
    'caption': {
      fontSize: '0.64rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0em'
    }
  }
};
