/**
 * Typography Components
 * Semantic text components with design system integration
 */

import React from 'react';
import PropTypes from 'prop-types';

// Unified typography configuration - maps variants to design token CSS variables
const typographyVariants = {
  display1: { 
    element: 'h1',
    styles: {
      fontSize: 'var(--typography-scales-display-1-font-size)',
      fontWeight: 'var(--typography-scales-display-1-font-weight)',
      lineHeight: 'var(--typography-scales-display-1-line-height)',
      letterSpacing: 'var(--typography-scales-display-1-letter-spacing)'
    }
  },
  display2: { 
    element: 'h2',
    styles: {
      fontSize: 'var(--typography-scales-display-2-font-size)',
      fontWeight: 'var(--typography-scales-display-2-font-weight)',
      lineHeight: 'var(--typography-scales-display-2-line-height)',
      letterSpacing: 'var(--typography-scales-display-2-letter-spacing)'
    }
  },
  h1: { 
    element: 'h1',
    styles: {
      fontSize: 'var(--typography-scales-heading-1-font-size)',
      fontWeight: 'var(--typography-scales-heading-1-font-weight)',
      lineHeight: 'var(--typography-scales-heading-1-line-height)',
      letterSpacing: 'var(--typography-scales-heading-1-letter-spacing)'
    }
  },
  h2: { 
    element: 'h2',
    styles: {
      fontSize: 'var(--typography-scales-heading-2-font-size)',
      fontWeight: 'var(--typography-scales-heading-2-font-weight)',
      lineHeight: 'var(--typography-scales-heading-2-line-height)',
      letterSpacing: 'var(--typography-scales-heading-2-letter-spacing)'
    }
  },
  h3: { 
    element: 'h3',
    styles: {
      fontSize: 'var(--typography-scales-heading-3-font-size)',
      fontWeight: 'var(--typography-scales-heading-3-font-weight)',
      lineHeight: 'var(--typography-scales-heading-3-line-height)',
      letterSpacing: 'var(--typography-scales-heading-3-letter-spacing)'
    }
  },
  h4: { 
    element: 'h4',
    styles: {
      fontSize: 'var(--typography-scales-heading-4-font-size)',
      fontWeight: 'var(--typography-scales-heading-4-font-weight)',
      lineHeight: 'var(--typography-scales-heading-4-line-height)',
      letterSpacing: 'var(--typography-scales-heading-4-letter-spacing)'
    }
  },
  h5: { 
    element: 'h5',
    styles: {
      fontSize: 'var(--typography-scales-heading-5-font-size)',
      fontWeight: 'var(--typography-scales-heading-5-font-weight)',
      lineHeight: 'var(--typography-scales-heading-5-line-height)',
      letterSpacing: 'var(--typography-scales-heading-5-letter-spacing)'
    }
  },
  h6: { 
    element: 'h6',
    styles: {
      fontSize: 'var(--typography-scales-heading-6-font-size)',
      fontWeight: 'var(--typography-scales-heading-6-font-weight)',
      lineHeight: 'var(--typography-scales-heading-6-line-height)',
      letterSpacing: 'var(--typography-scales-heading-6-letter-spacing)'
    }
  },
  body1: { 
    element: 'p',
    styles: {
      fontSize: 'var(--typography-scales-body-lg-font-size)',
      fontWeight: 'var(--typography-scales-body-lg-font-weight)',
      lineHeight: 'var(--typography-scales-body-lg-line-height)',
      letterSpacing: 'var(--typography-scales-body-lg-letter-spacing)'
    }
  },
  body2: { 
    element: 'p',
    styles: {
      fontSize: 'var(--typography-scales-body-font-size)',
      fontWeight: 'var(--typography-scales-body-font-weight)',
      lineHeight: 'var(--typography-scales-body-line-height)',
      letterSpacing: 'var(--typography-scales-body-letter-spacing)'
    }
  },
  subtitle1: { 
    element: 'p',
    styles: {
      fontSize: 'var(--typography-scales-body-lg-font-size)',
      fontWeight: 'var(--typography-font-weight-medium)',
      lineHeight: 'var(--typography-scales-body-lg-line-height)',
      letterSpacing: 'var(--typography-scales-body-lg-letter-spacing)'
    }
  },
  subtitle2: { 
    element: 'p',
    styles: {
      fontSize: 'var(--typography-scales-body-font-size)',
      fontWeight: 'var(--typography-font-weight-medium)',
      lineHeight: 'var(--typography-scales-body-line-height)',
      letterSpacing: 'var(--typography-scales-body-letter-spacing)'
    }
  },
  caption: { 
    element: 'span',
    styles: {
      fontSize: 'var(--typography-scales-caption-font-size)',
      fontWeight: 'var(--typography-scales-caption-font-weight)',
      lineHeight: 'var(--typography-scales-caption-line-height)',
      letterSpacing: 'var(--typography-scales-caption-letter-spacing)'
    }
  },
  overline: { 
    element: 'span',
    styles: {
      fontSize: 'var(--typography-scales-caption-font-size)',
      fontWeight: 'var(--typography-font-weight-medium)',
      lineHeight: 'var(--typography-scales-caption-line-height)',
      letterSpacing: 'var(--typography-scales-caption-letter-spacing)'
    }
  },
};

const Text = ({ 
  children,
  variant = 'body1',
  color = 'primary',
  align = 'left',
  transform = 'none',
  decoration = 'none',
  truncate = false,
  className = '',
  as,
  style = {},
  ...props 
}) => {
  const variantConfig = typographyVariants[variant] || typographyVariants.body1;
  const Component = as || variantConfig.element;

  // Color mapping to design token CSS variables
  const colorMap = {
    primary: 'var(--colors-text-primary)',
    secondary: 'var(--colors-text-secondary)', 
    tertiary: 'var(--colors-text-tertiary)',
    inverse: 'var(--colors-text-inverse)'
  };

  // Build inline styles using design tokens
  const inlineStyles = {
    fontFamily: 'var(--typography-font-family-primary)',
    margin: 0, // Reset default margins for consistent spacing
    ...variantConfig.styles,
    color: colorMap[color] || `var(--colors-text-${color})`,
    textAlign: align !== 'left' ? align : undefined,
    textTransform: transform !== 'none' ? transform : undefined,
    textDecoration: decoration !== 'none' ? decoration : undefined,
    overflow: truncate ? 'hidden' : undefined,
    textOverflow: truncate ? 'ellipsis' : undefined,
    whiteSpace: truncate ? 'nowrap' : undefined,
    ...style // Allow custom style overrides
  };

  return (
    <Component 
      className={className}
      style={inlineStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

// Specific Typography Components
const Heading = ({ level = 1, children, ...props }) => (
  <Text variant={`h${level}`} {...props}>
    {children}
  </Text>
);

const Display = ({ level = 1, children, ...props }) => (
  <Text variant={`display${level}`} {...props}>
    {children}
  </Text>
);

const Body = ({ size = 1, children, ...props }) => (
  <Text variant={`body${size}`} {...props}>
    {children}
  </Text>
);

const Subtitle = ({ level = 1, children, ...props }) => (
  <Text variant={`subtitle${level}`} {...props}>
    {children}
  </Text>
);

const Caption = ({ children, ...props }) => (
  <Text variant="caption" {...props}>
    {children}
  </Text>
);

const Overline = ({ children, ...props }) => (
  <Text variant="overline" {...props}>
    {children}
  </Text>
);

// PropTypes
const commonPropTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'inverse']),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  className: PropTypes.string,
  as: PropTypes.elementType
};

Text.propTypes = {
  ...commonPropTypes,
  variant: PropTypes.oneOf(Object.keys(typographyVariants)),
  transform: PropTypes.oneOf(['none', 'uppercase', 'lowercase', 'capitalize']),
  decoration: PropTypes.oneOf(['none', 'underline', 'line-through']),
  truncate: PropTypes.bool,
  style: PropTypes.object
};

Heading.propTypes = {
  ...commonPropTypes,
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6])
};

Display.propTypes = {
  ...commonPropTypes,
  level: PropTypes.oneOf([1, 2])
};

Body.propTypes = {
  ...commonPropTypes,
  size: PropTypes.oneOf([1, 2])
};

Subtitle.propTypes = {
  ...commonPropTypes,
  level: PropTypes.oneOf([1, 2])
};

Caption.propTypes = commonPropTypes;
Overline.propTypes = commonPropTypes;

// Attach sub-components
Text.Heading = Heading;
Text.Display = Display;
Text.Body = Body;
Text.Subtitle = Subtitle;
Text.Caption = Caption;
Text.Overline = Overline;

export { Heading, Display, Body, Subtitle, Caption, Overline };
export default Text;
