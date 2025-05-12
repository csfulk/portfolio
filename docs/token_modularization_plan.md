# Updated Token Modularization Plan

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
   - Tokens are fully implemented in `primitives.css` and `tokens.js`.
   - All components and CSS files now use tokens consistently.

2. **JavaScript Integration**:
   - `applyTokens.js` dynamically applies tokens to the `:root` element.
   - Tokens are defined in `tokens.js` and fully utilized across the project.

3. **Component Styles**:
   - All components (e.g., `Button`, `Hero`, `SectionWrapper`, `Modal`, `ProjectViewer`) now use tokens consistently.
   - Inline styles have been removed and replaced with CSS variables.

4. **Theming**:
   - A `ThemeProvider` exists but is not yet fully leveraged for dynamic theming.

---

## Implementation Plan

### Phase 1: Audit and Documentation
1. **Audit Tokens**:
   - Completed. Reviewed `tokens.js` and `primitives.css`.
   - Identified and added missing tokens (e.g., z-index, box shadows).

2. **Document Tokens**:
   - Completed. Created a comprehensive list of tokens in `docs/tokens.md`.

3. **Identify Hardcoded Values**:
   - Completed. Replaced all hardcoded values with tokens.

### Phase 2: Token Standardization
1. **Update `tokens.js`**:
   - Completed. Added missing tokens and ensured consistent naming.

2. **Refactor `primitives.css`**:
   - Completed. Synced with `tokens.js` and removed hardcoded values.

3. **Enhance `applyTokens.js`**:
   - Completed. Ensured all tokens are dynamically applied to `:root`.

### Phase 3: Component Refactoring
1. **Refactor CSS Files**:
   - Completed. Replaced hardcoded values with CSS variables in all CSS files.

2. **Refactor Inline Styles**:
   - Completed. Removed inline styles from all components.

3. **Update Components**:
   - Completed. Ensured all components use tokens consistently.

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
- **Phase 1**: Completed
- **Phase 2**: Completed
- **Phase 3**: Completed
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
1. Begin Phase 4: Theming.
2. Schedule weekly check-ins to track progress.