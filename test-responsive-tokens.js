/**
 * Test script to verify responsive token generation
 * Run with: node test-responsive-tokens.js
 */

import { generateCSSVariables } from './src/design-system/generators/cssGenerator.js';

console.log('🎨 Generating Responsive CSS Tokens...\n');

const css = generateCSSVariables();

// Extract and display the responsive media queries section
const mediaQuerySection = css.split('@media')[1];
if (mediaQuerySection) {
  console.log('✅ Responsive Media Queries Generated:\n');
  console.log('@media' + mediaQuerySection.substring(0, 500) + '...\n');
} else {
  console.log('❌ No media queries found\n');
}

// Show mobile-first base values
console.log('📱 Mobile-First Base Values:\n');
const layoutSpacingMatches = css.match(/--spacing-layout-section-[^:]+: [^;]+;/g);
if (layoutSpacingMatches) {
  layoutSpacingMatches.slice(0, 5).forEach(match => console.log('  ' + match));
}

console.log('\n✨ Token generation complete!');
