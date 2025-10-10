/**
 * Container Component
 * Provides consistent content width and horizontal centering
 */

import React from 'react';
import PropTypes from 'prop-types';

const containerSizes = {
  xs: '100%',
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%'
};

const Container = ({ 
  children, 
  size = 'xl',
  centerContent = false,
  padding = 'md',
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const containerStyles = {
    width: '100%',
    maxWidth: containerSizes[size] || containerSizes.xl,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: `var(--spacing-${padding})`,
    paddingRight: `var(--spacing-${padding})`,
    ...(centerContent && {
      display: 'var(--display-flex)',
      flexDirection: 'column',
      alignItems: 'center'
    })
  };

  const classes = [
    'container',
    `container--${size}`,
    centerContent && 'container--centered',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={classes}
      style={containerStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  centerContent: PropTypes.bool,
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  className: PropTypes.string,
  as: PropTypes.elementType
};

export default Container;
