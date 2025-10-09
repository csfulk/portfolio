/**
 * Typography Components
 * Semantic text components with design system integration
 */

import React from 'react';
import PropTypes from 'prop-types';

// Unified typography configuration - maps variants to CSS classes and fallback styles
const typographyVariants = {
  display1: { element: 'h1', size: 'display1', weight: 'bold', cssClass: 'text-display-1' },
  display2: { element: 'h2', size: 'display2', weight: 'bold', cssClass: 'text-display-2' },
  h1: { element: 'h1', size: '4xl', weight: 'bold', cssClass: 'text-heading-1' },
  h2: { element: 'h2', size: '3xl', weight: 'semibold', cssClass: 'text-heading-2' },
  h3: { element: 'h3', size: '2xl', weight: 'semibold', cssClass: 'text-heading-3' },
  h4: { element: 'h4', size: 'xl', weight: 'medium', cssClass: 'text-heading-4' },
  h5: { element: 'h5', size: 'lg', weight: 'medium', cssClass: 'text-heading-5' },
  h6: { element: 'h6', size: 'md', weight: 'medium', cssClass: 'text-heading-6' },
  body1: { element: 'p', size: 'md', weight: 'normal', cssClass: 'text-body-lg' },
  body2: { element: 'p', size: 'sm', weight: 'normal', cssClass: 'text-body' },
  subtitle1: { element: 'p', size: 'lg', weight: 'medium', cssClass: 'text-body-lg font-medium' },
  subtitle2: { element: 'p', size: 'md', weight: 'medium', cssClass: 'text-body-lg font-medium' },
  caption: { element: 'span', size: 'xs', weight: 'normal', cssClass: 'text-caption' },
  overline: { element: 'span', size: 'xxs', weight: 'medium', cssClass: 'text-caption font-medium' },
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
  ...props 
}) => {
  const variantConfig = typographyVariants[variant] || typographyVariants.body1;
  const Component = as || variantConfig.element;

  // Use CSS classes exclusively for consistency and performance
  const colorMap = {
    primary: 'text-color-primary',
    secondary: 'text-color-secondary', 
    tertiary: 'text-color-tertiary',
    inverse: 'text-color-inverse'
  };

  const classes = [
    'text',                                    // Base text class
    variantConfig.cssClass,                    // Typography scale CSS class
    color && (colorMap[color] || `text-color-${color}`), // Mapped color class
    align && align !== 'left' && `text-${align}`,        // Text alignment
    transform && transform !== 'none' && `text-${transform}`, // Text transform
    decoration && decoration !== 'none' && `text-${decoration}`, // Text decoration
    truncate && 'text-truncate',               // Truncation utility
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={classes}
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
  truncate: PropTypes.bool
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
