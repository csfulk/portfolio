/**
 * Unified Design System Tokens
 * Single source of truth for all design tokens
 */

import { colors } from './colors.js';
import { spacing } from './spacing.js';
import { typography } from './typography.js';
import { radius, shadows, zIndex, breakpoints, transitions, responsiveScaling } from './layout.js';

export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  zIndex,
  breakpoints,
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
    buttonTextHover: colors.interactive.hover.text,
    success: colors.interactive.success,
    primary: colors.brand.primary,
    accent: colors.brand.accent,
    // Legacy layout spacing
    'horizontal-padding': spacing.layout.horizontal
  },
  spacing,
  fontSizes: typography.fontSize,
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
