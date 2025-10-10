/**
 * Color Design Tokens
 * Semantic color definitions for the design system
 */

export const colors = {
  // Surface Colors - Backgrounds and containers
  surface: {
    primary: '#ffffff',       // Main app background (--surface-0)
    secondary: '#f5f5f5',     // Secondary backgrounds (--surface-1) 
    tertiary: '#e0e0e0',      // Tertiary backgrounds (--surface-2)
    section: '#000000',       // Section backgrounds (--surfaceSection)
    modal: '#1D1D1D',         // Modal backgrounds (--surfaceModal) - legacy
    'modal-light': '#ffffff', // Light modal backgrounds
    'modal-dark': '#1D1D1D',  // Dark modal backgrounds
    overlay: 'rgba(0, 0, 0, 0.84)', // Overlay backgrounds (--surfaceOverlay)
    loading: '#f0f0f0'        // Loading state backgrounds
  },

  // Text Colors - All text content
  text: {
    primary: '#1D1D1D',       // Primary text on light backgrounds (--textPrimary)
    secondary: '#757575',     // Secondary text (--textSecondary) 
    tertiary: '#5a5a5a',      // Tertiary text (--textTertiary)
    inverse: '#f5f5f5',       // Text on dark backgrounds (--textNeutralPrimary)
    section: {
      primary: '#f5f5f5',     // Primary text in dark sections (--textPrimarySection)
      secondary: '#a1a1a1'    // Secondary text in dark sections (--textSecondarySection)
    }
  },

  // Interactive Colors - Buttons, links, and interactive elements
  interactive: {
    primary: '#1D1D1D',       // Primary button background (--buttonPrimary)
    secondary: '#f5f5f5',     // Secondary button background (--buttonSecondary)
    accent: '#F09',           // Accent color for highlights (--buttonAccent)
    inverse: '#f5f5f5', 
    outline: '#e0e0e0',       // Outline/border color (--buttonOutline)
    destructive: '#ff0000',   // Destructive actions (--buttonDestructive)
    success: '#0aba62',       // Success states (--success)
    
    // Hover States - Comprehensive hover color system
    hover: {
      primary: '#0077ff',      // Primary button hover (--buttonPrimaryHover)
      secondary: '#e0e0e0',    // Secondary button hover (--buttonSecondaryHover)
      outline: '#1D1D1D',      // Outline button hover (--buttonOutlineHover)
      ghost: '#f0f0f0',        // Ghost button hover (--buttonGhostHover)
      link: '#cc0066',         // Link hover (--buttonLinkHover)
      destructive: '#cc0000',  // Destructive hover (--buttonDestructiveHover)
      text: '#1D1D1D',         // Text hover color (--buttonTextHover)
      accent: '#cc0066'        // Accent hover (--buttonAccentHover)
    }
  },

  // Brand Colors - Brand identity colors
  brand: {
    primary: '#0000FF',       // Primary brand color (--primary)
    accent: '#F09'            // Brand accent color (--accent)
  },

  // Utility Colors - Common utility colors
  utility: {
    white: '#ffffff',
    black: '#000000', 
    transparent: 'transparent',
    // Semi-transparent overlays
    whiteOverlay: 'rgba(255, 255, 255, 0.5)',
    blackOverlay: 'rgba(0, 0, 0, 0.5)',
    whiteOverlayLight: 'rgba(255, 255, 255, 0.2)',
    whiteOverlayMedium: 'rgba(255, 255, 255, 0.8)'
  }
};
