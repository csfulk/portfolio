/**
 * Semantic Typography Scales
 * Component and context-specific typography configurations
 */

import { typography } from './index.js';

/**
 * Component-specific typography scales
 * Pre-configured combinations for common UI patterns
 */
export const componentScales = {
  // Navigation typography
  navigation: {
    brand: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight
    },
    menu: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal
    }
  },

  // Button typography
  button: {
    sm: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.tight
    },
    md: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.tight
    },
    lg: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.tight
    }
  },

  // Modal typography
  modal: {
    title: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight
    },
    body: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed
    }
  },

  // Card typography
  card: {
    title: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.tight
    },
    description: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal
    }
  }
};

/**
 * Content-specific typography scales
 * Typography for different content types and contexts
 */
export const contentScales = {
  // Article content
  article: {
    headline: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight
    },
    subheadline: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.normal
    },
    body: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed
    }
  },

  // Case study content
  caseStudy: {
    title: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight
    },
    subtitle: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal
    },
    body: {
      fontSize: typography.fontSize.md,
      fontWeight: typography.fontWeight.normal,
      lineHeight: typography.lineHeight.relaxed
    }
  }
};
