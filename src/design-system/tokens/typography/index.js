/**
 * Enhanced Typography Design Tokens
 * Centralized typography system with semantic scales and utility generation
 */

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Inter Tight', sans-serif",
    mono: "'SF Mono', 'Monaco', 'Menlo', monospace"
  },

  // Font Sizes - Major Third Scale (1.25x) - Keep existing scaling
  fontSize: {
    // Display sizes
    display1: '5.96rem',   // 95px
    display2: '4.768rem',  // 76px
    
    // Heading sizes
    '4xl': '3.815rem',     // 61px
    '3xl': '3.052rem',     // 49px  
    '2xl': '2.441rem',     // 39px
    'xl': '1.953rem',      // 31px
    'lg': '1.563rem',      // 25px
    
    // Body sizes
    'md': '1.25rem',       // 17.5px (with 14px base)
    'sm': '1rem',          // 14px (base)
    'xs': '0.8rem',        // 11.2px
    'xxs': '0.64rem'       // 8.96px
  },

  // Font Weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },

  // Line Heights
  lineHeight: {
    tight: 1.2,
    normal: 1.3,
    relaxed: 1.6,
    loose: 1.9
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em'
  },

  // Typography Scales - Semantic combinations for consistent usage
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
      lineHeight: 1.6,
      letterSpacing: '0em'
    },
    'body-sm': {
      fontSize: '0.8rem',
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em'
    },

    // Special purpose
    'section-description': {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.8,  // loose for better readability
      letterSpacing: '0em'
    },
    'caption': {
      fontSize: '0.64rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0em'
    }
  }
};

/**
 * Generate typography utility classes
 * Creates CSS class names for each typography scale
 * This function can be used to dynamically generate CSS utilities
 */
export function generateTypographyClasses() {
  let css = `
/* Typography Utility Classes - Auto-generated */
.font-family-primary { font-family: var(--typography-font-family-primary); }
.font-family-mono { font-family: var(--typography-font-family-mono); }

`;

  // Generate scale-based classes
  Object.entries(typography.scales).forEach(([name, styles]) => {
    css += `
.text-${name} {
  font-size: ${styles.fontSize};
  font-weight: ${styles.fontWeight};
  line-height: ${styles.lineHeight};
  letter-spacing: ${styles.letterSpacing};
  font-family: var(--typography-font-family-primary);
}
`;
  });

  // Generate individual property classes for flexibility
  Object.entries(typography.fontSize).forEach(([size, value]) => {
    css += `.text-${size} { font-size: ${value}; }\n`;
  });

  Object.entries(typography.fontWeight).forEach(([weight, value]) => {
    css += `.font-${weight} { font-weight: ${value}; }\n`;
  });

  Object.entries(typography.lineHeight).forEach(([height, value]) => {
    css += `.leading-${height} { line-height: ${value}; }\n`;
  });

  return css;
}
