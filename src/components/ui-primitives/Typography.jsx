/**
 * Typography Components
 * Semantic text components with design system integration
 */

import React from 'react';
import PropTypes from 'prop-types';

const typographyVariants = {
  display1: { element: 'h1', size: 'display1', weight: 'bold' },
  display2: { element: 'h2', size: 'display2', weight: 'bold' },
  h1: { element: 'h1', size: '4xl', weight: 'bold' },
  h2: { element: 'h2', size: '3xl', weight: 'semibold' },
  h3: { element: 'h3', size: '2xl', weight: 'semibold' },
  h4: { element: 'h4', size: 'xl', weight: 'medium' },
  h5: { element: 'h5', size: 'lg', weight: 'medium' },
  h6: { element: 'h6', size: 'md', weight: 'medium' },
  body1: { element: 'p', size: 'md', weight: 'normal' },
  body2: { element: 'p', size: 'sm', weight: 'normal' },
  subtitle1: { element: 'p', size: 'lg', weight: 'medium' },
  subtitle2: { element: 'p', size: 'md', weight: 'medium' },
  caption: { element: 'span', size: 'xs', weight: 'normal' },
  overline: { element: 'span', size: 'xxs', weight: 'medium' },
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

  const textStyles = {
    fontSize: `var(--typography-font-size-${variantConfig.size})`,
    fontWeight: `var(--typography-font-weight-${variantConfig.weight})`,
    color: `var(--colors-text-${color})`,
    textAlign: align,
    textTransform: transform,
    textDecoration: decoration,
    fontFamily: 'var(--typography-font-family-primary)',
    lineHeight: 'var(--typography-line-height-normal)',
    margin: 0,
    ...(truncate && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    })
  };

  const classes = [
    'text',
    `text--${variant}`,
    `text--color-${color}`,
    `text--align-${align}`,
    truncate && 'text--truncate',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={classes}
      style={textStyles}
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
