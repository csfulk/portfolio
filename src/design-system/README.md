# 🎨 Design System Documentation

## 📁 **Structure Overview**

The design system is organized into focused, maintainable modules:

```
src/design-system/
├── tokens/          # Design token definitions (single source of truth)
│   ├── typography/  # Font families, scales, semantic combinations
│   ├── colors/      # Color palette and semantic color tokens
│   ├── spacing/     # Spacing scale and semantic spacing
│   ├── layout/      # Shadows, radius, breakpoints, transitions
│   └── index.js     # Unified token exports
├── components/      # React components built with tokens
│   ├── Button.jsx      # Button component with design system integration
│   ├── Surface.jsx     # Surface/container component
│   ├── Icon.jsx        # Icon component (Iconoir wrapper)
│   └── index.js        # Component exports
├── styles/          # CSS implementations from tokens
│   ├── typography.css  # Typography CSS variables and utilities
│   ├── button.css      # Button component styles
│   └── icon.css        # Icon component styles
├── generators/      # Build tools and CSS generation
│   └── cssGenerator.js # Converts tokens to CSS variables
└── index.js         # Main design system export
```

## 🚀 **Usage**

### **Import Components**
```jsx
// From main components barrel (PREFERRED)
import { Button, Surface, Icon } from '@components';

// From design system directly
import { Button, Surface, Icon } from '@design-system';
```

### **Typography Usage**
Use semantic HTML elements styled by CSS variables from `styles/typography.css`.
```jsx
// Semantic HTML with design system variables
<h1 style={{
  fontSize: 'var(--typography-scales-heading-1-font-size)',
  fontWeight: 'var(--typography-scales-heading-1-font-weight)'
}}>Main Heading</h1>

<p style={{
  fontSize: 'var(--typography-scales-body-font-size)',
  color: 'var(--colors-text-secondary)'
}}>Body text</p>
```

### **Button Component**
```jsx
// Enhanced button with design system integration
<Button variant="primary" size="lg">Primary Action</Button>
<Button variant="secondary" disabled>Secondary Action</Button>
<Button variant="outline" size="sm">Outline Action</Button>
```

### **Design Tokens**
```jsx
// Access tokens programmatically
import { tokens } from '@design-system';

const customStyles = {
  // Prefer CSS variables in UI; JS tokens are available for logic/reference
  color: tokens.colors.interactive.primary,
  spacing: tokens.spacing.component.md
};
```

## 🎯 **Design Token Architecture**

### **Typography System**
- **Major Third Scale (1.25x)**: Consistent sizing progression
- **Semantic Variants**: `h1-h6`, `body1-body2`, `caption`, etc.
- **CSS Variables**: Use variables like `--typography-scales-heading-1-font-size`

### **Color System**
- **Semantic Colors**: `primary`, `secondary`, `tertiary`, `inverse`
- **Brand Integration**: Colors map to your portfolio brand
- **CSS Variables**: `--textPrimary`, `--colors-interactive-primary`

### **Spacing System**
- **Consistent Scale**: Based on design token multiples
- **Semantic Categories**: `component`, `layout`, `section`
- **Responsive Scaling**: Automatic scaling across breakpoints

## 🔧 **Development Workflow**

### **Adding New Components**
1. Create component in `src/design-system/components/`
2. Use design tokens for styling
3. Export from `components/index.js`
4. Add styles to `design-system/styles/` if needed

### **Updating Design Tokens**
1. Edit tokens in respective folders (`tokens/typography/`, etc.)
2. Run `npm run build:tokens` to regenerate CSS
3. Test component integration

### **Build Process**
```bash
npm run build:tokens  # Generates CSS from tokens
npm run build        # Full application build
```

## 📊 **Migration Benefits**

✅ **Single Source of Truth**: All design decisions in organized tokens  
✅ **Type Safety**: PropTypes validation on all components  
✅ **Performance**: CSS classes instead of inline styles  
✅ **Maintainability**: Clear organization and separation of concerns  
✅ **Scalability**: Easy to add new tokens and components  
✅ **Consistency**: Automatic design system compliance  

## 🎨 **Component APIs**

### **Typography Props**
- `variant`: Semantic scale (`h1`, `body1`, `caption`, etc.)
- `color`: Semantic color (`primary`, `secondary`, `tertiary`, `inverse`)
- `align`: Text alignment (`left`, `center`, `right`)
- `transform`: Text transform (`uppercase`, `lowercase`, `capitalize`)
- `as`: Override HTML element (`div`, `span`, etc.)

### **Button Props**
- `variant`: Button style (`primary`, `secondary`, `outline`, `ghost`, `link`, `destructive`, `text`)
- `size`: Button size (`xs`, `sm`, `md`, `lg`, `xl`)
- `disabled`: Disabled state
- `loading`: Loading state with spinner
- `fullWidth`: Full width button
 - `icon`: Optional leading/trailing icon (Iconoir)
 - `iconPosition`: `leading` or `trailing`

## 🔗 **Integration Notes**

- **Path Aliases**: Components accessible via `@components` and `@design-system`
- **Backward Compatibility**: All existing APIs maintained (`EnhancedButton`, etc.)
- **CSS Variables**: All tokens available as CSS custom properties
- **Build Integration**: Automatic token regeneration in build process
 - **Typography Guidance**: Use semantic HTML (`h1`–`h6`, `p`, `small`, `caption`) with token-backed CSS variables; no `Typography` React component is exported.
