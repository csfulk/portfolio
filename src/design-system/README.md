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
│   ├── Typography.jsx  # Text components and semantic variants
│   ├── Button.jsx      # Button component with design system integration
│   ├── Surface.jsx     # Surface/container component
│   └── index.js        # Component exports
├── styles/          # CSS implementations from tokens
│   ├── typography.css  # Typography CSS variables and utilities
│   └── button.css      # Button component styles
├── generators/      # Build tools and CSS generation
│   └── cssGenerator.js # Converts tokens to CSS variables
└── index.js         # Main design system export
```

## 🚀 **Usage**

### **Import Components**
```jsx
// From main components barrel (PREFERRED)
import { Typography, Button, Surface } from '@components';

// From design system directly
import { Typography, Button } from '@design-system';
```

### **Typography Components**
```jsx
// Semantic text components
<Typography variant="h1">Main Heading</Typography>
<Typography variant="body2" color="secondary">Body text</Typography>

// Convenience components
<Typography.Heading level={2}>Section Title</Typography.Heading>
<Typography.Body size={1}>Paragraph text</Typography.Body>
<Typography.Caption>Small text</Typography.Caption>
```

### **Button Component**
```jsx
// Enhanced button with design system integration
<Button variant="primary" size="lg">Primary Action</Button>
<Button variant="secondary" disabled>Secondary Action</Button>
```

### **Design Tokens**
```jsx
// Access tokens programmatically
import { tokens } from '@design-system';

const customStyles = {
  fontSize: tokens.typography.fontSize.lg,
  color: tokens.colors.primary[600],
  spacing: tokens.spacing.component.md
};
```

## 🎯 **Design Token Architecture**

### **Typography System**
- **Major Third Scale (1.25x)**: Consistent sizing progression
- **Semantic Variants**: `h1-h6`, `body1-body2`, `caption`, etc.
- **CSS Utility Classes**: `.text-heading-1`, `.text-body`, `.text-color-primary`

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
- `variant`: Button style (`primary`, `secondary`, `tertiary`)
- `size`: Button size (`sm`, `md`, `lg`, `xl`)
- `disabled`: Disabled state
- `loading`: Loading state with spinner
- `fullWidth`: Full width button

## 🔗 **Integration Notes**

- **Path Aliases**: Components accessible via `@components` and `@design-system`
- **Backward Compatibility**: All existing APIs maintained (`EnhancedButton`, etc.)
- **CSS Variables**: All tokens available as CSS custom properties
- **Build Integration**: Automatic token regeneration in build process
