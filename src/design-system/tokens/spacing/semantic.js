/**
 * Semantic Spacing System
 * Component and layout-specific spacing configurations
 */

import { spacing } from './index.js';

/**
 * Component spacing
 * Spacing specifically for UI component internals
 */
export const componentSpacing = {
  // Button internal spacing
  button: {
    sm: {
      paddingX: spacing.xs,
      paddingY: spacing.xxs,
      gap: spacing.xxs
    },
    md: {
      paddingX: spacing.sm,
      paddingY: spacing.xs,
      gap: spacing.xs
    },
    lg: {
      paddingX: spacing.md,
      paddingY: spacing.sm,
      gap: spacing.sm
    }
  },

  // Input field spacing
  input: {
    padding: spacing.sm,
    gap: spacing.xs,
    marginBottom: spacing.md
  },

  // Card spacing
  card: {
    padding: spacing.lg,
    gap: spacing.md,
    margin: spacing.md
  },

  // Modal spacing
  modal: {
    padding: spacing.xl,
    gap: spacing.lg,
    backdropPadding: spacing['2xl']
  }
};

/**
 * Layout spacing
 * Spacing for layout composition and page structure
 */
export const layoutSpacing = {
  // Section spacing
  section: {
    paddingY: spacing['4xl'],
    paddingX: spacing.lg,
    gap: spacing['2xl']
  },

  // Container spacing
  container: {
    maxWidth: '1200px',
    paddingX: spacing.lg,
    marginY: spacing.xl
  },

  // Grid spacing
  grid: {
    gap: spacing.lg,
    columnGap: spacing.md,
    rowGap: spacing.xl
  },

  // Navigation spacing
  navigation: {
    height: '64px',
    paddingX: spacing.lg,
    itemGap: spacing.md
  }
};

/**
 * Responsive spacing multipliers
 * Scaling factors for different screen sizes
 */
export const responsiveSpacing = {
  mobile: {
    multiplier: 0.75,
    maxPadding: spacing.md
  },
  tablet: {
    multiplier: 0.875,
    maxPadding: spacing.lg
  },
  desktop: {
    multiplier: 1,
    maxPadding: spacing.xl
  },
  wide: {
    multiplier: 1.125,
    maxPadding: spacing['2xl']
  }
};
