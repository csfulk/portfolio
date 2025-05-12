// src/theme/tokens.js
export const tokens = {
  colors: {
    'surface-0': '#ffffff', // Lightest surface (e.g., background)
    'surface-1': '#f5f5f5', // Slightly darker surface
    'surface-2': '#e0e0e0', // Even darker surface
    surfaceSection: '#000000', // Section background color

    textPrimary: '#1e1e1e',
    textSecondary: '#757575',
    textNeutralPrimary: '#ffffff',
    textPrimarySection: '#f5f5f5',
    textSecondarySection: '#a1a1a1',

    buttonPrimary: '#1e1e1e',
    buttonSecondary: '#f5f5f5',
    buttonAccent: '#F09',
    buttonOutline: '#e0e0e0',
    buttonDestructive: '#ff0000',

    buttonHover: '#0077ff',
    buttonTextHover: '#1e1e1e',

    primary: '#0000FF',
    accent: '#F09',
  },
  spacing: {
    xxxs: '0.25rem', // 4px
    xxs: '0.3125rem', // 5px
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 14px
    lg: '1.25rem', // 20px
    xl: '1.563rem', // 25px
    '2xl': '1.953rem', // 31px
    '3xl': '2.441rem', // 39px
    '4xl': '3.052rem', // 49px
    '5xl': '3.815rem', // 61px
    '6xl': '4.768rem', // 76px
    '7xl': '5.96rem', // 95px
  },
  fontSizes: {
    display1: '5.96rem', // ~95px
    display2: '4.768rem', // ~76px
    '4xl': '3.815rem', // ~61px
    '3xl': '3.052rem', // ~49px
    '2xl': '2.441rem', // ~39px
    xl: '1.953rem', // ~31px
    lg: '1.563rem', // ~25px
    md: '1.25rem', // ~20px
    sm: '1rem', // ~14px
    xs: '0.8rem', // ~11px
    xxs: '0.64rem', // ~9px
  },
  radius: {
    sm: '2px',
    md: '4px',
    lg: '8px',
    xl: '16px',
    full: '1000px',
  },
  fontFamily: {
    primary: "'Inter Tight', sans-serif",
  },
  zIndex: {
    modal: 1000,
    overlay: 900,
    dropdown: 800,
    tooltip: 1100,
  },
  boxShadow: {
    sm: '0px 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0px 10px 15px rgba(0, 0, 0, 0.15)',
    xl: '0px 20px 25px rgba(0, 0, 0, 0.2)',
  },
};
