/**
 * Layout Design Tokens
 * Border radius, shadows, z-index, and layout utilities
 */

export const radius = {
  none: '0px',
  sm: '2px',
  md: '4px', 
  lg: '8px',
  xl: '16px',
  '2xl': '24px',
  '3xl': '32px',
  full: '1000px'
};

export const shadows = {
  sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0px 10px 15px rgba(0, 0, 0, 0.15)',
  xl: '0px 20px 25px rgba(0, 0, 0, 0.2)',
  
  // Semantic shadows
  button: '0px 1px 2px rgba(0, 0, 0, 0.05)',
  modal: '0px 20px 25px rgba(0, 0, 0, 0.2)',
  dropdown: '0px 4px 6px rgba(0, 0, 0, 0.1)'
};

export const zIndex = {
  base: 0,
  dropdown: 800,
  overlay: 900, 
  modal: 1000,
  tooltip: 1100,
  notification: 1200
};

export const breakpoints = {
  mobile: '480px',
  tablet: '768px', 
  desktop: '1024px',
  wide: '1440px'
};

// Responsive base font size scaling
// NOTE: These values are implemented in CSS (src/styles/primitives.css)
// because font-size media queries cannot be applied via JavaScript
export const responsiveScaling = {
  base: '14px',      // Matches primitives.css root font-size
  tablet: '14px',    // Keeping consistent with base
  mobile: '14px',    // Keeping consistent with base  
  small: '14px'      // Keeping consistent with base
};

export const transitions = {
  fast: '0.15s ease-out',
  normal: '0.25s ease-out',
  slow: '0.35s ease-out',
  
  // Semantic transitions
  hover: '0.15s ease-out',
  modal: '0.25s ease-out',
  fade: '0.35s ease-out'
};
