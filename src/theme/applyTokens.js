// Enhanced token application with load order optimization (NEW STRUCTURE)
import { applyTokensToDOM } from '../design-system/generators/cssGenerator.js';
import { legacyTokens } from '../design-system/tokens/index.js';

/**
 * Applies tokens synchronously for optimal load performance
 * This function is designed to run before first paint
 */
export const applyTokens = () => {
  try {
    // Apply new design system tokens with validation
    applyTokensToDOM();
    
    // Apply legacy tokens for backward compatibility
    const root = document.documentElement;
    
    // Apply color tokens (legacy format)
    Object.entries(legacyTokens.colors).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        root.style.setProperty(`--${key}`, value);
      }
    });
    
    // Apply spacing tokens (legacy format)
    Object.entries(legacyTokens.spacing).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        root.style.setProperty(`--spacing-${key}`, value);
      }
    });
    
    // Apply font size tokens (legacy format)
    Object.entries(legacyTokens.fontSizes).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        root.style.setProperty(`--font-size-${key}`, value);
      }
    });
    
    // Apply radius tokens (legacy format)
    Object.entries(legacyTokens.radius).forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        root.style.setProperty(`--radius-${key}`, value);
      }
    });
    
    // Apply font family tokens (legacy format)
    Object.entries(legacyTokens.fontFamily).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--font-family-${key}`, value);
      }
    });
    
    // Apply z-index tokens (legacy format)
    Object.entries(legacyTokens.zIndex).forEach(([key, value]) => {
      if (typeof value === 'number') {
        root.style.setProperty(`--z-index-${key}`, value);
      }
    });
    
    // Apply box shadow tokens (legacy format)
    Object.entries(legacyTokens.boxShadow).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--box-shadow-${key}`, value);
      }
    });
    
    // Apply explicit shadow tokens for legacy CSS
    Object.entries(legacyTokens.shadows).forEach(([key, value]) => {
      if (typeof value === 'string') {
        root.style.setProperty(`--${key}`, value);
      }
    });
    
    console.log('✅ Design tokens applied successfully');
    
  } catch (error) {
    console.error('❌ Failed to apply design tokens:', error);
    // Don't throw - fallback to CSS-only tokens
  }
};

/**
 * Injects critical CSS tokens inline for immediate availability
 * Use this for server-side rendering or critical path optimization
 */
export const injectCriticalTokens = () => {
  // Check if we already have injected tokens
  if (document.getElementById('critical-tokens')) return;
  
  const style = document.createElement('style');
  style.id = 'critical-tokens';
  
  // Only inject the most critical tokens that might cause layout shift
  style.textContent = `
    :root {
      /* Critical spacing tokens */
      --spacing-xs: 0.5rem;
      --spacing-sm: 0.75rem;
      --spacing-md: 1rem;
      --spacing-lg: 1.25rem;
      --spacing-xl: 1.563rem;
      
      /* Critical colors to prevent flash */
      --colors-surface-primary: #ffffff;
      --colors-surface-section: #000000;
      --colors-text-primary: #1D1D1D;
      --colors-text-inverse: #ffffff;
      
      /* Critical typography */
      --typography-font-family-primary: 'Inter Tight', sans-serif;
      --typography-font-size-md: 1.25rem;
    }
  `;
  
  // Insert at the beginning of head for highest priority
  document.head.insertBefore(style, document.head.firstChild);
};