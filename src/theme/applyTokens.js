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
};