/**
 * Spacer Component
 * Creates consistent spacing between elements
 */

import React from 'react';
import PropTypes from 'prop-types';

const Spacer = ({ 
  size = 'md',
  direction = 'vertical',
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const spacerStyles = {
    [direction === 'vertical' ? 'height' : 'width']: `var(--spacing-${size})`,
    [direction === 'vertical' ? 'width' : 'height']: '100%',
    flexShrink: 0,
  };

  const classes = [
    'spacer',
    `spacer--${direction}`,
    `spacer--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={classes}
      style={spacerStyles}
      aria-hidden="true"
      {...props}
    />
  );
};

Spacer.propTypes = {
  size: PropTypes.oneOf(['xxxs', 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl']),
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  className: PropTypes.string,
  as: PropTypes.elementType
};

export default Spacer;
