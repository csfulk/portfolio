/**
 * CSS Variable Generator
 * Converts design tokens to CSS custom properties
 */

import { tokens } from './index';

/**
 * Flattens nested token objects into CSS custom property names
 * @param {object} obj - The token object to flatten
 * @param {string} prefix - The CSS variable prefix
 * @param {string} separator - The separator for nested keys
 * @returns {object} Flattened CSS custom properties
 */
function flattenTokens(obj, prefix = '--', separator = '-') {
  const result = {};
  
  function flatten(current, path = []) {
    for (const [key, value] of Object.entries(current)) {
      const newPath = [...path, key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)];
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        flatten(value, newPath);
      } else {
        const cssVar = `${prefix}${newPath.join(separator)}`;
        result[cssVar] = value;
      }
    }
  }
  
  flatten(obj);
  return result;
}

/**
 * Generates CSS custom properties from design tokens
 * @returns {string} CSS custom properties as a string
 */
export function generateCSSVariables() {
  const flattened = flattenTokens(tokens);
  
  let css = ':root {\n';
  
  // Add organized sections with comments
  css += '  /* Surface Colors */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('surface'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  css += '\n  /* Text Colors */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('text'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  css += '\n  /* Interactive Colors */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('interactive') || key.includes('brand'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  css += '\n  /* Spacing */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('spacing'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  css += '\n  /* Typography */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('font') || key.includes('typography'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  css += '\n  /* Layout */\n';
  Object.entries(flattened)
    .filter(([key]) => key.includes('radius') || key.includes('shadows') || key.includes('z-index') || key.includes('transitions'))
    .forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`;
    });
  
  css += '}\n';
  
  return css;
}

/**
 * Applies design tokens as CSS custom properties to the document root
 */
export function applyTokensToDOM() {
  const root = document.documentElement;
  const flattened = flattenTokens(tokens);
  
  Object.entries(flattened).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
}

export { tokens };
