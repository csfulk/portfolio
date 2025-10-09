#!/usr/bin/env node

/**
 * Build Script: Generate Static CSS Tokens
 * Generates a static CSS file from design tokens for optimal load performance
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the token generator
async function generateStaticTokens() {
  try {
    // Dynamic import to handle ES modules
    const { generateStaticCSS } = await import('../src/design-system/tokens/cssGenerator.js');
    
    const cssContent = generateStaticCSS();
    const outputPath = resolve(__dirname, '../dist/tokens.css');
    
    // Ensure directory exists
    await mkdir(dirname(outputPath), { recursive: true });
    
    // Write the CSS file
    await writeFile(outputPath, cssContent);
    
    console.log('🎨 Design Tokens Build Complete!');
    console.log(`📄 Generated: ${outputPath}`);
    console.log(`📏 Size: ${Math.round(cssContent.length / 1024 * 100) / 100}KB`);
    console.log('✨ Ready for production use');
    
    return outputPath;
    
  } catch (error) {
    console.error('❌ Token build failed:', error);
    process.exit(1);
  }
}

// Run if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateStaticTokens();
}

export { generateStaticTokens };
