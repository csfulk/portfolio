/**
 * Color Design Tokens
 * Semantic color definitions for the design system
 */

export const colors = {
  // Surface Colors
  surface: {
    primary: '#ffffff',
    secondary: '#f5f5f5', 
    tertiary: '#e0e0e0',
    section: '#000000',
    modal: '#1D1D1D',
    overlay: 'rgba(0, 0, 0, 0.84)',
    loading: '#f0f0f0'
  },

  // Text Colors
  text: {
    primary: '#1D1D1D',
    secondary: '#757575',
    tertiary: '#5a5a5a',
    inverse: '#ffffff',
    section: {
      primary: '#f5f5f5',
      secondary: '#a1a1a1'
    }
  },

  // Interactive Colors
  interactive: {
    primary: '#1D1D1D',
    secondary: '#f5f5f5',
    accent: '#F09',
    outline: '#e0e0e0',
    destructive: '#ff0000',
    success: '#0aba62',
    // Variant-specific hover colors
    hover: {
      primary: '#0077ff',      // Primary button hover background
      secondary: '#e0e0e0',    // Secondary button hover background
      outline: '#1D1D1D',      // Outline button hover (fills with primary)
      ghost: '#f0f0f0',        // Ghost button hover background
      link: '#cc0066',         // Link button hover color
      destructive: '#cc0000',  // Destructive button hover background
      text: '#1D1D1D'          // Text hover color (for buttons)
    }
  },

  // Brand Colors
  brand: {
    primary: '#0000FF',
    accent: '#F09'
  },

  // Utility Colors
  utility: {
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent'
  }
};
