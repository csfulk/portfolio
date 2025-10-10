/**
 * Design System - Main Export
 * Single entry point for the entire design system
 */

// Export tokens from unified structure
export { tokens, legacyTokens } from './tokens/index.js';

// Export generators (for build scripts)
export { generateCSSVariables, applyTokensToDOM } from './generators/cssGenerator.js';

// Export components
export * from './components/index.js';

// Re-export individual token categories for convenience (NEW STRUCTURE)
export { colors } from './tokens/colors/index.js';
export { spacing } from './tokens/spacing/index.js';
export { typography } from './tokens/typography/index.js';
export { radius, shadows, zIndex, breakpoints, transitions, responsiveScaling, transforms, filters } from './tokens/layout/index.js';
