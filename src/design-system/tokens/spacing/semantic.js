/**
 * Semantic Spacing System
 * Component and layout-specific spacing configurations
 */

import { spacing } from './index.js';
import { containers } from '../layout/index.js';

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
 * Mobile-first responsive values
 */
export const layoutSpacing = {
  // Section spacing - responsive breakpoints
  section: {
    paddingY: {
      mobile: spacing.xl,      // ~24px - Comfortable mobile spacing
      tablet: spacing['2xl'],  // ~31px - Tablet spacing
      desktop: spacing['4xl']  // ~49px - Full desktop spacing
    },
    paddingX: {
      mobile: spacing.md,      // ~16px - Mobile edge padding
      tablet: spacing.lg,      // ~20px - Tablet edge padding
      desktop: spacing.lg      // ~20px - Desktop edge padding
    },
    gap: {
      mobile: spacing.md,      // ~16px - Tighter mobile gap
      tablet: spacing.lg,      // ~20px - Tablet gap
      desktop: spacing['2xl']  // ~31px - Desktop gap
    },
    contentOffset: {
      mobile: spacing['3xl'],  // ~39px - Reduced mobile top offset
      tablet: spacing['5xl'],  // ~47px - Tablet offset
      desktop: spacing['10xl'] // ~95px - Full desktop offset (original 11.5rem)
    }
  },

  // Container spacing
  container: {
    maxWidth: containers.xl,
    paddingX: {
      mobile: spacing.md,
      tablet: spacing.lg,
      desktop: spacing.lg
    },
    marginY: {
      mobile: spacing.lg,
      tablet: spacing.xl,
      desktop: spacing.xl
    }
  },

  // Grid spacing - responsive
  grid: {
    gap: {
      mobile: spacing.md,
      tablet: spacing.lg,
      desktop: spacing.lg
    },
    columnGap: {
      mobile: spacing.sm,
      tablet: spacing.md,
      desktop: spacing.md
    },
    rowGap: {
      mobile: spacing.lg,
      tablet: spacing.xl,
      desktop: spacing.xl
    }
  },

  // Navigation spacing - responsive
  navigation: {
    height: {
      mobile: '56px',          // Compact mobile nav
      tablet: '64px',          // Standard tablet/desktop
      desktop: '64px'
    },
    paddingX: {
      mobile: spacing.md,      // ~16px mobile padding
      tablet: spacing.lg,      // ~20px tablet padding
      desktop: spacing.lg      // ~20px desktop padding
    },
    itemGap: {
      mobile: spacing.sm,      // Tighter mobile spacing
      tablet: spacing.md,      // Standard spacing
      desktop: spacing.md
    }
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
