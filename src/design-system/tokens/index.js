/**
 * Design System Tokens - Unified Export
 * Centralized token system with clean organization
 */

// Import from organized token folders (NEW STRUCTURE)
import { colors } from './colors/index.js';
import { spacing } from './spacing/index.js';
import { typography } from './typography/index.js';
import { radius, shadows, zIndex, breakpoints, containers, transitions, responsiveScaling } from './layout/index.js';

export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  zIndex,
  breakpoints,
  containers,
  transitions,
  responsiveScaling
};

// Legacy support - maintain backward compatibility
export const legacyTokens = {
  colors: {
    'surface-0': colors.surface.primary,
    'surface-1': colors.surface.secondary,
    'surface-2': colors.surface.tertiary,
    surfaceSection: colors.surface.section,
    surfaceModal: colors.surface.modal,
    surfaceOverlay: colors.surface.overlay,
    textPrimary: colors.text.primary,
    textSecondary: colors.text.secondary,
    textTertiary: colors.text.tertiary,
    textNeutralPrimary: colors.text.inverse,
    textPrimarySection: colors.text.section.primary,
    textSecondarySection: colors.text.section.secondary,
    buttonPrimary: colors.interactive.primary,
    buttonSecondary: colors.interactive.secondary,
    buttonAccent: colors.interactive.accent,
    buttonOutline: colors.interactive.outline,
    buttonDestructive: colors.interactive.destructive,
    buttonPrimaryHover: colors.interactive.hover.primary,
    buttonSecondaryHover: colors.interactive.hover.secondary,
    buttonOutlineHover: colors.interactive.hover.outline,
    buttonGhostHover: colors.interactive.hover.ghost,
    buttonLinkHover: colors.interactive.hover.link,
    buttonDestructiveHover: colors.interactive.hover.destructive,
    buttonTextHover: colors.interactive.hover.text,
    buttonAccentHover: colors.interactive.hover.accent,
    success: colors.interactive.success,
    primary: colors.brand.primary,
    accent: colors.brand.accent,
    // Legacy layout spacing - backwards compatibility
    'horizontal-padding': spacing.layout.horizontal.desktop,
    // Additional semantic spacing mappings
    'navigation-height': spacing.semantic.navigation.height,
    'navigation-offset': spacing.semantic.navigation.offset,
    'section-content-offset': spacing.semantic.section.contentOffset,
    'modal-padding': spacing.semantic.modal.padding,
    'form-field-gap': spacing.semantic.form.fieldGap
  },
  spacing,
  fontSizes: typography.fontSize,
  // Icon sizes based on spacing scale
  iconSizes: {
    xs: spacing.xs,    // 0.5rem - 8px
    sm: spacing.sm,    // 0.75rem - 12px  
    md: spacing.md,    // 1rem - 16px
    lg: spacing.lg,    // 1.25rem - 20px
    xl: spacing.xl     // 1.563rem - 25px
  },
  radius,
  fontFamily: typography.fontFamily,
  zIndex,
  boxShadow: shadows,
  // Explicit legacy shadow mappings
  shadows: {
    'box-shadow-sm': shadows.sm,
    'box-shadow-md': shadows.md,
    'box-shadow-lg': shadows.lg,
    'box-shadow-xl': shadows.xl,
    'box-shadow-modal': shadows.modal
  }
};

export default tokens;
