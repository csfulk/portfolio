/**
 * Spacing Design Tokens
 * Consistent spacing scale based on Major Third (1.25x) ratio
 */

export const spacing = {
  // Fine-grained spacing
  xxxs: '0.25rem',   // 4px
  xxs: '0.3125rem',  // 5px  
  xs: '0.5rem',      // 8px
  sm: '0.75rem',     // 12px
  md: '1rem',        // 16px (base)
  lg: '1.25rem',     // 20px
  xl: '1.563rem',    // 25px
  
  // Large spacing
  '2xl': '1.953rem', // 31px
  '3xl': '2.441rem', // 39px
  '4xl': '3.052rem', // 49px
  '5xl': '3.815rem', // 61px
  '6xl': '4.768rem', // 76px
  '7xl': '5.96rem',  // 95px

  // Semantic spacing
  section: '5.96rem',     // 7xl for section padding
  container: '1.25rem',   // lg for container padding
  component: '1rem',      // md for component spacing
  element: '0.5rem',      // xs for element spacing
  
  // Layout spacing
  layout: {
    horizontal: '5.96rem', // Main horizontal padding
    vertical: '2.441rem',  // Main vertical padding
    gap: '1.25rem'         // Default gap between elements
  }
};
