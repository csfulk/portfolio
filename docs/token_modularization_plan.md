# Token Modularization Plan

## Objective
To refactor the project to use a centralized, token-based design system for managing colors, spacing, typography, and other design properties. This will ensure consistency, scalability, and maintainability across the codebase.

---

## Key Benefits
1. **Consistency**: All components will use the same design values, reducing visual inconsistencies.
2. **Scalability**: Adding new themes or updating existing styles will be easier.
3. **Maintainability**: Centralized tokens make it easier to debug and update styles.
4. **Dynamic Theming**: Enables light/dark mode or other theme variations with minimal effort.

---

## Current State Analysis

### Observations from the Codebase
1. **CSS Variables**:
   - Tokens are partially implemented in `primitives.css` and `tokens.js`.
   - Some components (e.g., `button.css`, `section.css`) use hardcoded values instead of tokens.

2. **JavaScript Integration**:
   - `applyTokens.js` dynamically applies tokens to the `:root` element.
   - Tokens are defined in `tokens.js` but not fully utilized across the project.

3. **Component Styles**:
   - Many components (e.g., `Button`, `Hero`, `SectionWrapper`) use inline styles or hardcoded CSS values.
   - Some components (e.g., `Modal`, `ProjectViewer`) rely on CSS files that mix tokens and hardcoded values.

4. **Theming**:
   - A `ThemeProvider` exists but is not fully leveraged for dynamic theming.

---

## Implementation Plan

### Phase 1: Audit and Documentation
1. **Audit Tokens**:
   - Review `tokens.js` and `primitives.css`.
   - Identify missing tokens (e.g., z-index, box shadows, animations).

2. **Document Tokens**:
   - Create a comprehensive list of tokens in `docs/tokens.md`.
   - Categorize tokens (e.g., colors, spacing, typography).

3. **Identify Hardcoded Values**:
   - Search for hardcoded values in CSS and JavaScript files.
   - Document where tokens should replace these values.

### Phase 2: Token Standardization
1. **Update `tokens.js`**:
   - Add missing tokens (e.g., `zIndex`, `boxShadow`, `animation`).
   - Ensure all tokens are named consistently (e.g., `fontSize-sm` instead of `font-size-sm`).

2. **Refactor `primitives.css`**:
   - Sync `primitives.css` with `tokens.js`.
   - Remove any hardcoded values.

3. **Enhance `applyTokens.js`**:
   - Ensure all tokens from `tokens.js` are applied to `:root`.
   - Add support for dynamic theming (e.g., light/dark mode).

### Phase 3: Component Refactoring
1. **Refactor CSS Files**:
   - Replace hardcoded values with CSS variables (e.g., `var(--spacing-sm)`).
   - Ensure all components use tokens for colors, spacing, and typography.

2. **Refactor Inline Styles**:
   - Replace inline styles in components (e.g., `Hero`, `Button`) with CSS variables.

3. **Update Components**:
   - Ensure all components (e.g., `Button`, `Modal`, `SectionWrapper`) use tokens consistently.

### Phase 4: Theming
1. **Implement Dynamic Theming**:
   - Update `ThemeProvider` to support multiple themes (e.g., light, dark).
   - Create a `themes.js` file to define theme variations.

2. **Test Theming**:
   - Ensure all components respond correctly to theme changes.

### Phase 5: Testing and Validation
1. **Unit Tests**:
   - Add tests to ensure tokens are applied correctly.
   - Test dynamic theming functionality.

2. **Visual Regression Testing**:
   - Use tools like Percy or Chromatic to catch visual inconsistencies.

3. **Performance Testing**:
   - Ensure the refactor does not negatively impact performance.

---

## Deliverables
1. Updated `tokens.js` and `primitives.css`.
2. Refactored CSS and JavaScript files.
3. Comprehensive documentation in `docs/tokens.md`.
4. Dynamic theming support.
5. Unit and visual regression tests.

---

## Timeline
- **Phase 1**: 1 week
- **Phase 2**: 1 week
- **Phase 3**: 2 weeks
- **Phase 4**: 1 week
- **Phase 5**: 1 week

---

## Risks and Mitigation
1. **Breaking Changes**:
   - Mitigation: Use feature branches and thorough testing.

2. **Inconsistent Adoption**:
   - Mitigation: Create clear guidelines and examples for using tokens.

3. **Performance Issues**:
   - Mitigation: Test performance after each phase.

---

## Next Steps
1. Approve this plan.
2. Begin Phase 1: Audit and Documentation.
3. Schedule weekly check-ins to track progress.