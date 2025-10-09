/**
 * Token System Usage Examples
 * Demonstrates different ways to use the enhanced token system
 */

// === Development Mode (Runtime Injection) ===

import { applyTokens, injectCriticalTokens } from '@theme';
import { generateCSSVariables, applyTokensToDOM } from '@design-system/tokens/cssGenerator';

// 1. Critical Path - Inject essential tokens immediately
function setupCriticalTokens() {
  // Inject critical tokens before any layout occurs
  injectCriticalTokens();
  console.log('✅ Critical tokens injected');
}

// 2. Full Token Application - After DOM ready
function setupFullTokens() {
  // Apply all validated tokens
  applyTokens();
  console.log('✅ Full token system applied');
}

// 3. Manual Token Management
function manualTokenSetup() {
  // Direct DOM application with validation
  applyTokensToDOM();
  
  // Or generate CSS string for custom handling
  const cssString = generateCSSVariables();
  console.log('Generated CSS length:', cssString.length);
}

// === Production Mode (Static CSS) ===

// Build script integration (in package.json)
const buildScripts = {
  "scripts": {
    "dev": "vite",
    "build": "npm run build:tokens && vite build",
    "build:tokens": "node scripts/build-tokens.js",
    "preview": "vite preview"
  }
};

// === Component Usage Examples ===

// Using tokens in CSS
const cssExample = `
/* Using semantic tokens (recommended) */
.component {
  padding: var(--spacing-component);     /* 1rem */
  margin: var(--spacing-element);        /* 0.5rem */
  background: var(--colors-surface-primary);
  color: var(--colors-text-primary);
}

/* Using primitive tokens when needed */
.special-spacing {
  padding: var(--spacing-xl);            /* 1.563rem */
  gap: var(--spacing-lg);               /* 1.25rem */
}
`;

// Using tokens in JavaScript/React
function ExampleComponent() {
  const styles = {
    // Access via CSS custom properties
    padding: 'var(--spacing-component)',
    background: 'var(--colors-surface-primary)',
    
    // Or calculate based on tokens (advanced)
    maxWidth: 'calc(var(--spacing-7xl) * 8)',
  };
  
  return <div style={styles}>Component with tokens</div>;
}

// === Load Order Strategies ===

// Strategy 1: Critical Path (Best for performance)
function criticalPathStrategy() {
  // In <head> before any CSS
  injectCriticalTokens();
  
  // After DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    applyTokens();
  });
}

// Strategy 2: Static File (Best for production)
function staticFileStrategy() {
  // Include in HTML <head>:
  // <link rel="stylesheet" href="/dist/tokens.css">
  
  // No JavaScript needed - tokens are available immediately
}

// Strategy 3: Hybrid (Development flexibility)
function hybridStrategy() {
  if (process.env.NODE_ENV === 'production') {
    // Use static file
    console.log('Using static tokens');
  } else {
    // Use runtime injection for development
    applyTokens();
  }
}

// === Token Validation Examples ===

// The system automatically validates tokens
const validationExamples = {
  // ✅ Valid tokens (will be output)
  validString: '#ffffff',
  validNumber: 16,
  validRem: '1.5rem',
  
  // ❌ Invalid tokens (will be skipped)
  invalidObject: { nested: 'value' },  // Skipped
  invalidArray: [1, 2, 3],            // Skipped  
  invalidFunction: () => {},           // Skipped
  invalidNull: null,                   // Skipped
  invalidUndefined: undefined,         // Skipped
};

// === Alias System Examples ===

// Semantic tokens automatically reference primitives:
const aliasExamples = {
  // Generated output:
  // --spacing-element: var(--spacing-xs);     /* 0.5rem */
  // --spacing-component: var(--spacing-md);   /* 1rem */
  // --spacing-container: var(--spacing-lg);   /* 1.25rem */
  // --spacing-section: var(--spacing-7xl);    /* 5.96rem */
};

// === Build Integration Examples ===

// Vite plugin integration
function viteIntegration() {
  // vite.config.js
  return {
    plugins: [
      {
        name: 'design-tokens',
        buildStart() {
          // Generate tokens before build
          require('./scripts/build-tokens.js');
        }
      }
    ]
  };
}

// Webpack integration
function webpackIntegration() {
  // webpack.config.js
  const path = require('path');
  
  return {
    plugins: [
      {
        apply: (compiler) => {
          compiler.hooks.beforeCompile.tapAsync('DesignTokens', (params, callback) => {
            require('./scripts/build-tokens.js').then(() => callback());
          });
        }
      }
    ]
  };
}

// === Error Handling Examples ===

function robustTokenApplication() {
  try {
    // Critical tokens first (never fails)
    injectCriticalTokens();
    
    // Full tokens with error handling  
    applyTokens();
    
  } catch (error) {
    console.warn('Token application failed, using fallback CSS:', error);
    
    // Fallback to basic CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--spacing-md', '1rem');
    root.style.setProperty('--colors-surface-primary', '#ffffff');
  }
}

// === Performance Monitoring ===

function monitorTokenPerformance() {
  const start = performance.now();
  
  applyTokens();
  
  const end = performance.now();
  console.log(`Token application took ${end - start}ms`);
  
  // Log token count
  const tokenCount = document.documentElement.style.length;
  console.log(`Applied ${tokenCount} CSS custom properties`);
}

export {
  setupCriticalTokens,
  setupFullTokens,
  manualTokenSetup,
  criticalPathStrategy,
  staticFileStrategy,
  hybridStrategy,
  robustTokenApplication,
  monitorTokenPerformance
};
