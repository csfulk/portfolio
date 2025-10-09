/**
 * Typography Design Tokens
 * Font sizes, families, and typography scales
 */

export const typography = {
  // Font Families
  fontFamily: {
    primary: "'Inter Tight', sans-serif",
    mono: "'SF Mono', 'Monaco', 'Menlo', monospace"
  },

  // Font Sizes - Major Third Scale (1.25x)
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
    'md': '1.25rem',       // 20px
    'sm': '1rem',          // 16px (base)
    'xs': '0.8rem',        // 13px
    'xxs': '0.64rem'       // 10px
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
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8
  },

  // Letter Spacing
  letterSpacing: {
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em'
  }
};
