# Icon Component - Design System

## Overview
The Icon component provides a consistent way to display SVG icons throughout the application using a sprite-based system.

## Usage

```jsx
import { Icon } from '@components';

// Basic usage
<Icon name="chevron-right" />

// With size
<Icon name="star" size="lg" />

// With custom styling
<Icon 
  name="heart" 
  size="md" 
  className="text-red-500" 
  aria-label="Favorite item"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | Required | Name of the icon file (without .svg extension) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Icon size based on design tokens |
| `className` | `string` | `''` | Additional CSS classes |
| `aria-label` | `string` | `name` | Accessibility label |
| `role` | `string` | `'img'` | ARIA role |

## Size Scale

| Size | Token Value | Pixels | Use Case |
|------|-------------|--------|----------|
| `xs` | 0.5rem | 8px | Small decorative icons |
| `sm` | 0.75rem | 12px | Form field icons |
| `md` | 1rem | 16px | Standard inline icons |
| `lg` | 1.25rem | 20px | Button icons |
| `xl` | 1.563rem | 25px | Large interactive icons |

## Design Tokens

The Icon component uses the following design tokens:

- **Sizes**: `--icon-sizes-{xs|sm|md|lg|xl}`
- **Colors**: Inherits `currentColor` from parent
- **Spacing**: Uses semantic spacing for margins

## Icon Asset Structure

Icons should be placed in `/public/assets/icons/` as SVG sprite files:

```
public/assets/icons/
├── chevron-right.svg
├── star.svg
├── heart.svg
└── ...
```

Each SVG should contain an element with `id="icon"` for the sprite system to work:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path id="icon" d="M9 18l6-6-6-6"/>
</svg>
```

## Accessibility

- Always provide meaningful `aria-label` values
- Icons are announced to screen readers with `role="img"`
- Use semantic HTML context around icons when needed

## Examples

```jsx
// Navigation icon
<Icon name="menu" size="lg" aria-label="Open navigation" />

// Status icon with color
<Icon 
  name="check" 
  size="sm" 
  className="text-success"
  aria-label="Completed"
/>

// Loading spinner
<Icon 
  name="spinner" 
  size="md" 
  className="ds-icon--loading"
  aria-label="Loading..."
/>
```
