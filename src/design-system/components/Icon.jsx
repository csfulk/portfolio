/**
 * Icon Component - Design System
 * SVG sprite-based icon system with design token integration
 */
import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ 
  name, 
  size = 'md',
  className = '', 
  'aria-label': ariaLabel,
  role = 'img',
  ...props 
}) => {
  const iconClasses = [
    'ds-icon',
    `ds-icon--${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <svg 
      className={iconClasses}
      aria-label={ariaLabel || name}
      role={role}
      {...props}
    >
      <use xlinkHref={`/assets/icons/${name}.svg#icon`} />
    </svg>
  );
};

Icon.propTypes = {
  /** Name of the icon file (without extension) */
  name: PropTypes.string.isRequired,
  /** Icon size based on design tokens */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accessibility label */
  'aria-label': PropTypes.string,
  /** ARIA role */
  role: PropTypes.string,
};

export default Icon;