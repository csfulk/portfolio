// Enhanced token application using new design system
import { applyTokensToDOM } from '../design-system/tokens/cssGenerator';
import { legacyTokens } from '../design-system/tokens';

export const applyTokens = () => {
  // Apply new design system tokens
  applyTokensToDOM();
  
  // Apply legacy tokens for backward compatibility
  const root = document.documentElement;
  
  // Apply color tokens (legacy format)
  Object.entries(legacyTokens.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value);
  });
  
  // Apply spacing tokens (legacy format)
  Object.entries(legacyTokens.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value);
  });
  
  // Apply font size tokens (legacy format)
  Object.entries(legacyTokens.fontSizes).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value);
  });
  
  // Apply radius tokens (legacy format)
  Object.entries(legacyTokens.radius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
  
  // Apply font family tokens (legacy format)
  Object.entries(legacyTokens.fontFamily).forEach(([key, value]) => {
    root.style.setProperty(`--font-family-${key}`, value);
  });
  
  // Apply z-index tokens (legacy format)
  Object.entries(legacyTokens.zIndex).forEach(([key, value]) => {
    root.style.setProperty(`--z-index-${key}`, value);
  });
  
  // Apply box shadow tokens (legacy format)
  Object.entries(legacyTokens.boxShadow).forEach(([key, value]) => {
    root.style.setProperty(`--box-shadow-${key}`, value);
  });
};