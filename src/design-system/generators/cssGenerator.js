/**
 * Enhanced CSS Variable Generator
 * Converts design tokens to CSS custom properties with validation and alias mapping
 */

import { tokens } from '../tokens/index.js';

/**
 * Validates that a value is a valid CSS property value
 * @param {any} value - The value to validate
 * @returns {boolean} True if valid for CSS
 */
function isValidCSSValue(value) {
  if (value === null || value === undefined) return false;
  
  const type = typeof value;
  if (type === 'string' || type === 'number') return true;
  
  // Reject objects, arrays, functions, etc.
  return false;
}

/**
 * Flattens nested token objects into CSS custom property names with validation
 * @param {object} obj - The token object to flatten
 * @param {string} prefix - The CSS variable prefix
 * @param {string} separator - The separator for nested keys
 * @returns {object} Flattened and validated CSS custom properties
 */
function flattenTokens(obj, prefix = '--', separator = '-') {
  const result = {};
  const skippedTokens = [];
  
  function flatten(current, path = []) {
    for (const [key, value] of Object.entries(current)) {
      const newPath = [...path, key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flatten(value, newPath);
      } else {
        const cssVar = `${prefix}${newPath.join(separator)}`;
        
        // Validate the value before adding it
        if (isValidCSSValue(value)) {
          result[cssVar] = value;
        } else {
          skippedTokens.push({ 
            variable: cssVar, 
            value: value, 
            type: typeof value,
            reason: 'Invalid CSS value type'
          });
        }
      }
    }
  }
  
  flatten(obj);
  
  // Log skipped tokens in development
  if (skippedTokens.length > 0) {
    console.warn('Skipped invalid CSS tokens:', skippedTokens);
  }
  
  return result;
}

/**
 * Creates semantic alias mappings for documentation
 * @returns {object} Mapping of semantic names to primitive values
 */
function createAliasMap() {
  return {
    // Spacing aliases
    'element': 'xs',          // --spacing-element → --spacing-xs
    'component': 'md',        // --spacing-component → --spacing-md  
    'container': 'lg',        // --spacing-container → --spacing-lg
    'section': '7xl',         // --spacing-section → --spacing-7xl
    
    // Layout aliases
    'layout-horizontal': '7xl', // --spacing-layout-horizontal → --spacing-7xl
    'layout-vertical': '3xl',   // --spacing-layout-vertical → --spacing-3xl
    'layout-gap': 'lg',         // --spacing-layout-gap → --spacing-lg
  };
}

/**
 * Generates CSS custom properties from design tokens with validation and alias documentation
 * @returns {string} CSS custom properties as a string
 */
export function generateCSSVariables() {
  const flattened = flattenTokens(tokens);
  const aliasMap = createAliasMap();
  
  let css = ':root {\n';
  
  // Add alias documentation
  css += '  /*\n';
  css += '   * Semantic Token Aliases\n';
  css += '   * These semantic tokens map to primitive values for consistency:\n';
  Object.entries(aliasMap).forEach(([semantic, primitive]) => {
    css += `   *   --spacing-${semantic} → --spacing-${primitive}\n`;
  });
  css += '   */\n\n';
  
  // Primitive tokens first
  css += '  /* === PRIMITIVE TOKENS === */\n\n';
  
  // Surface Colors
  css += '  /* Surface Colors */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('surface'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  // Text Colors
  css += '\n  /* Text Colors */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('text'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  // Interactive Colors
  css += '\n  /* Interactive Colors */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('interactive') || key.includes('brand'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  // Utility Colors
  css += '\n  /* Utility Colors */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('utility'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  // Base Spacing (primitives)
  css += '\n  /* Base Spacing Scale */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('spacing') && 
             !key.includes('layout') && 
             !['section', 'container', 'component', 'element'].some(semantic => key.includes(semantic)))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  // Typography
  css += '\n  /* Typography */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('font') || key.includes('typography'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  // Layout tokens
  css += '\n  /* Layout */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('radius') || key.includes('shadows') || key.includes('z-index') || key.includes('transitions') || key.includes('transforms') || key.includes('filters'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  // Semantic tokens (aliases) second
  css += '\n  /* === SEMANTIC TOKENS (ALIASES) === */\n\n';
  
  // Semantic spacing with references to primitives
  css += '  /* Semantic Spacing - References to primitive scale */\n';
  Object.entries(flattened)
    .filter(([key]) => ['section', 'container', 'component', 'element'].some(semantic => key.includes(semantic)) ||
                       key.includes('layout'))
    .forEach(([key, value]) => {
      // Try to find the primitive this maps to
      const semantic = key.replace('--spacing-', '').replace('layout-', '');
      const primitiveMapping = aliasMap[semantic];
      
      if (primitiveMapping) {
        css += `  ${key}: var(--spacing-${primitiveMapping}); /* ${value} */\n`;
      } else {
        css += `  ${key}: ${value};\n`;
      }
    });

  // Layout Properties - Min Heights
  css += '\n  /* Layout - Min Heights */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('min-height'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });

  // Layout Properties - Display, Flex, Visibility, etc.
  css += '\n  /* Layout Properties */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('display-') || key.includes('flex-') || 
                       key.includes('visibility-') || key.includes('overflow-') ||
                       key.includes('border-') || key.includes('outline-') ||
                       key.includes('text-decoration-') || key.includes('icon-sizes-'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  css += '}\n';
  
  return css;
}

/**
 * Generates a static CSS file content for build-time generation
 * @returns {string} Complete CSS file content with imports and custom properties
 */
export function generateStaticCSS() {
  const customProperties = generateCSSVariables();
  
  return `/*
 * Design System Tokens - Auto-generated
 * Do not edit this file manually. Generated from design-system/tokens/
 * 
 * Generation time: ${new Date().toISOString()}
 */

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&display=swap');

${customProperties}

/* Base responsive font sizing - must be in CSS for media query support */
:root {
  font-size: 14px; /* Base for rem calculations */
}

@media (max-width: 1024px) {
  :root { font-size: 16px; }
}

@media (max-width: 768px) {
  :root { font-size: 16px; }
}

@media (max-width: 480px) {
  :root { font-size: 16px; }
}
`;
}

/**
 * Applies design tokens as CSS custom properties to the document root with validation
 */
export function applyTokensToDOM() {
  const root = document.documentElement;
  const flattened = flattenTokens(tokens);
  const aliasMap = createAliasMap();
  
  // Apply primitive tokens first
  Object.entries(flattened)
    .filter(([key]) => !['section', 'container', 'component', 'element'].some(semantic => key.includes(semantic)) &&
                       !key.includes('layout'))
    .forEach(([property, value]) => {
      if (isValidCSSValue(value)) {
        root.style.setProperty(property, value);
      }
    });
  
  // Apply semantic tokens (aliases) second, referencing primitives where possible
  Object.entries(flattened)
    .filter(([key]) => ['section', 'container', 'component', 'element'].some(semantic => key.includes(semantic)) ||
                       key.includes('layout'))
    .forEach(([property, value]) => {
      const semantic = property.replace('--spacing-', '').replace('layout-', '');
      const primitiveMapping = aliasMap[semantic];
      
      if (primitiveMapping && flattened[`--spacing-${primitiveMapping}`]) {
        root.style.setProperty(property, `var(--spacing-${primitiveMapping})`);
      } else if (isValidCSSValue(value)) {
        root.style.setProperty(property, value);
      }
    });
}

/**
 * Creates a build script for generating static CSS files
 * @param {string} outputPath - Where to write the CSS file
 */
export async function buildStaticTokens(outputPath = './dist/tokens.css') {
  const cssContent = generateStaticCSS();
  
  // In Node.js environment
  if (typeof require !== 'undefined') {
    const fs = require('fs').promises;
    const path = require('path');
    
    try {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, cssContent);
      console.log(`✅ Static tokens generated at: ${outputPath}`);
      return outputPath;
    } catch (error) {
      console.error('❌ Failed to write static tokens:', error);
      throw error;
    }
  } else {
    // Browser environment - return content for manual handling
    return cssContent;
  }
}

export { tokens };
