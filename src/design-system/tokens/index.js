/**
 * Unified Design System Tokens
 * Single source of truth for all design tokens
 */

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius, shadows, zIndex, breakpoints, transitions } from './layout';

export const tokens = {
  colors,
  spacing,
  typography,
  radius,
  shadows,
  zIndex,
  breakpoints,
  transitions
};

// Legacy support - maintain backward compatibility
export const legacyTokens = {
  colors: {
    'surface-0': colors.surface.primary,
    'surface-1': colors.surface.secondary,
    'surface-2': colors.surface.tertiary,
    surfaceSection: colors.surface.section,
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
    buttonPrimaryHover: colors.interactive.hover,
    buttonTextHover: colors.text.primary,
    primary: colors.brand.primary,
    accent: colors.brand.accent
  },
  spacing,
  fontSizes: typography.fontSize,
  radius,
  fontFamily: typography.fontFamily,
  zIndex,
  boxShadow: shadows
};

export default tokens;
