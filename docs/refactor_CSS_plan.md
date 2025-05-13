# CSS Refactor Plan

## Objective
To centralize, simplify, and organize the CSS structure for better maintainability, scalability, and consistency across the project. This plan will ensure proper normalization, browser reset styles, and a clear separation of global, component-specific, and responsive styles.

---

## Key Goals
1. **Normalization and Reset**:
   - Implement a CSS reset to ensure consistent styling across browsers.
   - Normalize global elements like `body`, `html`, `h1-h6`, `p`, and other common tags.

2. **Global Styles**:
   - Create a `global.css` or `base.css` file for global resets and base styles.
   - Move typography, spacing, and other global variables to `primitives.css`.

3. **Component-Specific Styles**:
   - Keep styles specific to components (e.g., buttons, modals) in their respective files.

4. **Responsive Design**:
   - Consolidate all responsive styles into `responsive.css` or use media queries within component-specific files for better context.

5. **Import Structure**:
   - Ensure all component-specific styles import the necessary global styles (e.g., `primitives.css`) to avoid duplication.

---

## Proposed File Structure

```
styles/
  base.css          /* Global resets and base styles */
  primitives.css    /* Variables and design tokens */
  utilities.css     /* Utility classes */
  layout.css        /* Layout and grid styles */
  responsive.css    /* Media queries and responsive styles */
  components/
    button.css      /* Button-specific styles */
    modal.css       /* Modal-specific styles */
    navigation.css  /* Navigation-specific styles */
    ...
```

---

## Implementation Plan

### 1. **Normalization and Reset**
- Use a CSS reset library (e.g., Normalize.css) or create a custom reset in `base.css`.
- Example reset styles:
  ```css
  /* base.css */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: var(--font-family-primary);
    background-color: var(--surface-0);
    color: var(--textPrimary);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 0;
  }
  ```

### 2. **Global Styles**
- Move all global variables (e.g., colors, spacing, typography) to `primitives.css`.
- Ensure `primitives.css` is imported at the top of all other CSS files.

### 3. **Component-Specific Styles**
- Keep styles for each component in its respective file under `styles/components/`.
- Example:
  - `button.css` for button styles.
  - `modal.css` for modal styles.

### 4. **Responsive Design**
- Consolidate all responsive styles into `responsive.css`.
- Use media queries for breakpoints:
  ```css
  @media (max-width: 1024px) {
    /* Tablet styles */
  }

  @media (max-width: 768px) {
    /* Mobile styles */
  }
  ```

### 5. **Import Structure**
- Ensure a consistent import structure in all CSS files:
  ```css
  @import './primitives.css';
  @import './responsive.css';
  ```
- Component-specific files should import only the necessary global styles.

---

## Next Steps
1. Create `base.css` for normalization and reset styles.
2. Refactor `primitives.css` to ensure all global variables are centralized.
3. Move component-specific styles to `styles/components/`.
4. Consolidate responsive styles into `responsive.css`.
5. Update all imports to follow the proposed structure.

---

## Notes
- Ensure all changes are tested for visual consistency across browsers and devices.
- Document the new structure in the project README for future reference.