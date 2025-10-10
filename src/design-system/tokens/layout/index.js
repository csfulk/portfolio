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

export const containers = {
  sm: '512px',
  md: '640px', 
  lg: '1024px',
  xl: '1200px',
  '2xl': '1440px',
  // Component-specific containers
  banner: '280px',
  modal: '600px'
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

// Min Heights - Component minimum heights
export const minHeight = {
  button: {
    xs: '24px',
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '56px'
  },
  textTruncate: '5.4em',  // Text truncation height for expandable content
  spinner: {
    size: '40px',
    borderWidth: '4px'
  }
};

// Display Properties - Layout display values
export const display = {
  flex: 'flex',
  block: 'block',
  inline: 'inline',
  inlineBlock: 'inline-block',
  none: 'none',
  grid: 'grid'
};

// Flex Properties - Flexbox layout values
export const flex = {
  direction: {
    row: 'row',
    column: 'column',
    rowReverse: 'row-reverse',
    columnReverse: 'column-reverse'
  },
  align: {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch'
  },
  justify: {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  }
};

// Visibility Properties - Visibility and overflow
export const visibility = {
  visible: 'visible',
  hidden: 'hidden',
  collapse: 'collapse'
};

export const overflow = {
  visible: 'visible',
  hidden: 'hidden',
  scroll: 'scroll',
  auto: 'auto'
};

// Border Properties - Border utilities
export const border = {
  none: 'none',
  width: {
    thin: '1px',
    medium: '2px',
    thick: '4px'
  }
};

// Outline Properties - Focus and accessibility outlines
export const outline = {
  width: {
    thin: '1px',
    medium: '2px',
    thick: '3px'
  },
  offset: {
    none: '0px',
    sm: '1px',
    md: '2px',
    lg: '4px'
  }
};

// Text Decoration Properties
export const textDecoration = {
  none: 'none',
  underline: 'underline',
  lineThrough: 'line-through',
  overline: 'overline'
};

// Filter Properties - CSS filters for visual effects
export const filters = {
  blur: {
    none: 'blur(0)',
    sm: 'blur(2px)',
    md: 'blur(5px)',
    lg: 'blur(10px)',
    xl: 'blur(16px)'
  },
  backdropBlur: {
    none: 'blur(0)',
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)'
  }
};

// Transform Properties - CSS transforms for animations and positioning
export const transforms = {
  // Slide animations
  slideUp: 'translateY(calc(-1 * var(--spacing-lg)))', // Slide up by spacing-lg
  slideDown: 'translateY(var(--spacing-lg))',         // Slide down by spacing-lg
  slideReset: 'translateY(0)',                        // Reset to original position
  
  // Common transform values
  translateCenter: 'translate(-50%, -50%)',           // Center positioning
  translateXCenter: 'translateX(-50%)',               // Horizontal center
  translateYCenter: 'translateY(-50%)',               // Vertical center
  
  // Scale transforms
  scaleNone: 'scale(1)',
  scaleDown: 'scale(0.95)',
  scaleUp: 'scale(1.05)',
  
  // Combined transforms for animations
  slideUpScale: 'translateY(100%) scale(0.95)',       // Initial state for slide-up animations
  slideDownScale: 'translateY(var(--spacing-lg)) scale(0.95)', // Modal entrance
  resetScale: 'translateY(0) scale(1)',               // Final state
  modalEntrance: 'translateY(20px) scale(0.95)'      // Modal entrance animation
};
