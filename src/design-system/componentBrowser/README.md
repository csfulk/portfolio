# Component Browser

Unified design system development dashboard with sidebar navigation for testing, optimizing, and browsing components and icons.

## Main Application

### 🏠 **ComponentBrowser** - Navigation Dashboard
**URL**: `?demo=any` 

The main application provides:
- **Left Sidebar Navigation** - Quick access to all tools (open by default)
- **Home Dashboard** - System overview with key metrics and quick actions
- **Unified Interface** - All tools integrated into a single browsing experience
- **URL Sync** - Navigation state synced with browser URL for easy sharing

## Available Tools

### 🔍 **Icon Library** 
**Navigation**: "Icon Library" → **URL**: `?demo=browse`

Searchable browser for all 1,600+ Iconoir icons featuring:
- Real-time search functionality across all icon names
- Interactive icon size and stroke weight preview controls
- Click-to-copy icon names for development
- Visual icon grid with instant filtering

### 🎯 **Button Optimization**
**Navigation**: "Button Optimization" → **URL**: `?demo=buttons`

Visual optimization matrix for button-icon combinations:
- Matrix of all button sizes vs icon sizes
- Interactive stroke weight controls for fine-tuning
- All button variant comparisons (primary, secondary, outline, ghost)
- Typography reference for each button size
- Helps identify optimal icon/button pairings

### 📚 **Button Documentation**
**Navigation**: "Button Documentation" → **URL**: `?demo=docs`

Interactive button documentation and code generator:
- **Live Controls Panel**: Configure all button properties with dropdowns, checkboxes, and inputs
- **Real-time Preview**: See changes instantly as you adjust settings
- **Code Generation**: Auto-generates ready-to-use JSX code snippets
- **One-click Copy**: Copy generated code directly to clipboard
- **All Button Options**: Variants, sizes, icons, states, links, and positioning
- **Popular Icon Library**: Quick access to commonly used icons
- **Common Patterns**: Pre-built examples of typical button configurations

### ⚡ **Icon Defaults**
**Navigation**: "Icon Defaults" → **URL**: `?demo=defaults`

Automatic icon optimization showcase:
- **Smart Defaults**: xs→md/2.0, sm→lg/2.25, md→lg/2.25, lg→xl/2.25, xl→xl/2.5
- Manual override examples with code snippets
- All button variants with optimized icons
- Comparison of automatic vs. custom settings

### 🎨 **Stroke Weights**
**Navigation**: "Stroke Weights" → **URL**: `?demo=stroke`

Debug tool for stroke weight functionality:
- Direct Iconoir component testing
- Side-by-side icon component comparisons
- Various icons rendered at different stroke weights (1.0-3.0)
- Validation of strokeWeight prop passing

### 🚀 **Basic Examples**
**Navigation**: "Basic Examples" → **URL**: `?demo=demo`

Simple Iconoir feature demonstrations:
- Basic icon usage patterns
- Size and stroke weight examples
- Quick reference implementations

## Usage

Access any tool by adding the query parameter to your development URL:

```
http://localhost:PORT/?demo=browse
http://localhost:PORT/?demo=buttons
http://localhost:PORT/?demo=defaults
http://localhost:PORT/?demo=stroke
http://localhost:PORT/?demo=icons
```

## Development

These tools are automatically included in development builds and provide real-time testing capabilities for the design system components.

## File Structure

```
componentBrowser/
├── index.js                    # Main exports
├── IconoirBrowser*.jsx         # Icon library browser (multiple versions)
├── ButtonIconMatrix.jsx        # Button optimization matrix
├── IconDefaultsTest.jsx        # Icon defaults comparison
├── StrokeWeightTest.jsx        # Stroke weight debugging
└── IconoirDemo.jsx            # Basic icon demonstration
```
