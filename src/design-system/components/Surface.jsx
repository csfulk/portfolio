/**
 * Surface Component
 * Provides background surfaces with elevation and styling
 */

import React from 'react';
import PropTypes from 'prop-types';

const surfaceVariants = {
  primary: 'var(--colors-surface-primary)',
  secondary: 'var(--colors-surface-secondary)', 
  tertiary: 'var(--colors-surface-tertiary)',
  section: 'var(--colors-surface-section)',
  modal: 'var(--colors-surface-modal)',
  'modal-light': 'var(--colors-surface-modal-light)',
  'modal-dark': 'var(--colors-surface-modal-dark)',
};

const elevationLevels = {
  0: 'none',
  1: 'var(--shadows-sm)',
  2: 'var(--shadows-md)',
  3: 'var(--shadows-lg)',
  4: 'var(--shadows-xl)'
};

const Surface = ({ 
  children,
  variant = 'primary',
  elevation = 0,
  padding = 'none',
  radius = 'none',
  border = false,
  className = '',
  as: Component = 'div',
  ...props 
}) => {
  const surfaceStyles = {
    backgroundColor: surfaceVariants[variant] || surfaceVariants.primary,
    boxShadow: elevationLevels[elevation] || 'none',
    borderRadius: radius === 'none' ? '0' : `var(--radius-${radius})`,
    padding: padding === 'none' ? '0' : `var(--spacing-${padding})`,
    ...(border && {
      border: '1px solid var(--colors-interactive-outline)'
    }),
    position: 'relative'
  };

  const classes = [
    'surface',
    `surface--${variant}`,
    `surface--elevation-${elevation}`,
    padding !== 'none' && `surface--padding-${padding}`,
    radius !== 'none' && `surface--radius-${radius}`,
    border && 'surface--border',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component 
      className={classes}
      style={surfaceStyles}
      {...props}
    >
      {children}
    </Component>
  );
};

Surface.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'section', 'modal', 'modal-light', 'modal-dark']),
  elevation: PropTypes.oneOf([0, 1, 2, 3, 4]),
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  radius: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']),
  border: PropTypes.bool,
  className: PropTypes.string,
  as: PropTypes.elementType
};

export default Surface;
