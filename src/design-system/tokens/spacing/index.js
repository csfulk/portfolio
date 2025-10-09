/**
 * Spacing Design Tokens
 * Consistent spacing scale based on Major Third (1.25x) ratio
 */

export const spacing = {
  // Core spacing scale - Major Third (1.25x) progression
  xxxs: '0.25rem',   // 4px  - Borders, focus outlines
  xxs: '0.3125rem',  // 5px  - Fine adjustments
  xs: '0.5rem',      // 8px  - Small gaps, icon spacing
  sm: '0.75rem',     // 12px - Form elements, tight spacing
  md: '1rem',        // 16px - Base unit, component padding
  lg: '1.25rem',     // 20px - Standard gaps, button padding
  xl: '1.563rem',    // 25px - Generous padding, card spacing
  '2xl': '1.953rem', // 31px - Section gaps, form groups
  '3xl': '2.441rem', // 39px - Large sections, vertical rhythm
  '4xl': '3.052rem', // 49px - Major sections, page spacing
  '5xl': '3.815rem', // 61px - Hero spacing, major breaks
  '6xl': '4.768rem', // 76px - Extra large sections
  '7xl': '5.96rem',  // 95px - Maximum standard spacing
  '8xl': '7.45rem',  // 119px - Extra large sections
  '9xl': '9.31rem',  // 149px - Massive spacing
  '10xl': '11.64rem', // 186px - Section content offset

  // Semantic spacing categories for consistent usage
  semantic: {
    // Component-level spacing
    component: {
      tight: '0.5rem',     // xs - Compact components
      normal: '1rem',      // md - Standard components  
      loose: '1.25rem'     // lg - Generous components
    },
    
    // Section-level spacing
    section: {
      padding: '5.96rem',  // 7xl - Main section padding
      gap: '3.052rem',     // 4xl - Between sections
      margin: '2.441rem',  // 3xl - Section margins
      contentOffset: '11.64rem' // 10xl - Top offset for section content
    },
    
    // UI element spacing
    ui: {
      border: '0.25rem',   // xxxs - Border spacing, focus rings
      focus: '0.3125rem',  // xxs - Focus outline offset
      icon: '0.5rem',      // xs - Icon margins, spacing
      button: '1rem'       // md - Button internal padding
    },
    
    // Navigation specific
    navigation: {
      height: '4rem',      // Standard navigation height (4xl equivalent)
      padding: '1.563rem', // xl - Navigation padding
      offset: '1.25rem'    // lg - Animation transforms
    },
    
    // Modal and overlay spacing
    modal: {
      padding: '1.953rem', // 2xl - Modal internal padding
      gap: '1.563rem',     // xl - Modal element gaps
      offset: '1.25rem'    // lg - Modal animations
    },
    
    // Form specific spacing
    form: {
      fieldGap: '1rem',     // md - Between form fields
      groupGap: '1.953rem', // 2xl - Between form groups
      labelGap: '0.5rem'    // xs - Label to input spacing
    }
  },

  // Layout spacing - responsive and contextual
  layout: {
    // Horizontal padding system
    horizontal: {
      mobile: '1.953rem',   // 2xl - 31px mobile padding
      tablet: '3.052rem',   // 4xl - 49px tablet padding  
      desktop: '5.96rem'    // 7xl - 95px desktop padding
    },
    
    // Vertical rhythm
    vertical: '2.441rem',   // 3xl - Main vertical spacing
    
    // Standard gaps
    gap: {
      tight: '0.75rem',     // sm - Tight layouts
      normal: '1.25rem',    // lg - Standard gap
      loose: '1.953rem'     // 2xl - Loose layouts
    }
  }
};
