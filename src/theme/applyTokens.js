import { tokens } from './tokens';

export const applyTokens = () => {
  const root = document.documentElement;

  // Apply colors
  Object.entries(tokens.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });

  // Apply spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });

  // Apply font sizes
  Object.entries(tokens.fontSizes).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });

  // Apply zIndex
  Object.entries(tokens.zIndex).forEach(([key, value]) => {
    root.style.setProperty(`--z-index-${key}`, value);
  });

  // Apply boxShadow
  Object.entries(tokens.boxShadow).forEach(([key, value]) => {
    root.style.setProperty(`--box-shadow-${key}`, value);
  });
};