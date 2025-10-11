/**
 * Icon Component - Design System
 * Iconoir React integration with design token sizing and variable stroke weights
 */
import React from 'react';
import PropTypes from 'prop-types';
import * as Iconoir from 'iconoir-react';

// Icon name mapping for common use cases
const iconNameMap = {
  // Legacy icon font names (for backward compatibility)
  'icon-Lock_light': 'Lock',
  'icon-lock': 'Lock',
  'icon-Lock': 'Lock',
  
  // Common UI icons
  'lock': 'Lock',
  'unlock': 'LockOpen', 
  'down-arrow': 'NavArrowDown',
  'up-arrow': 'NavArrowUp',
  'left-arrow': 'NavArrowLeft',
  'right-arrow': 'NavArrowRight',
  'close': 'Cancel',
  'menu': 'Menu',
  'search': 'Search',
  'user': 'User',
  'home': 'Home',
  'settings': 'Settings',
  'check': 'Check',
  'plus': 'Plus',
  'minus': 'Minus',
  'edit': 'EditPencil',
  'delete': 'Bin',
  'info': 'InfoCircle',
  'warning': 'WarningTriangle',
  'error': 'Cancel',
  'external-link': 'OpenNewWindow',
};

const Icon = ({ 
  name, 
  size = 'md',
  strokeWidth = 1.5, // Iconoir expects strokeWidth
  className = '', 
  'aria-label': ariaLabel,
  ...props 
}) => {
  // Get the actual Iconoir component name
  const iconoirName = iconNameMap[name] || name;
  const IconoirComponent = Iconoir[iconoirName];

  // If icon doesn't exist, show a placeholder
  if (!IconoirComponent) {
    console.warn(`Icon "${name}" (${iconoirName}) not found in Iconoir library`);
    return (
      <Iconoir.QuestionMark
        className={`ds-icon ds-icon--${size} ds-icon--missing ${className}`.trim()}
        strokeWidth={strokeWidth}
        aria-label={ariaLabel || `Missing icon: ${name}`}
        {...props}
      />
    );
  }

  return (
    <IconoirComponent
      className={`ds-icon ds-icon--${size} ${className}`.trim()}
      strokeWidth={strokeWidth}
      aria-label={ariaLabel || name}
      {...props}
    />
  );
};

Icon.propTypes = {
  /** Icon name - uses Iconoir names or common aliases */
  name: PropTypes.string.isRequired,
  /** Icon size based on design tokens */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** Stroke width for variable thickness (1-3 typical range) */
  strokeWidth: PropTypes.number,
  /** Additional CSS classes */
  className: PropTypes.string,
  /** Accessibility label */
  'aria-label': PropTypes.string,
};

export default Icon;