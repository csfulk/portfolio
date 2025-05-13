import React from 'react';
import PropTypes from 'prop-types';
import '../styles/button.css'; // Import button styles
import '../styles/icon-font.css'; // Import icon font styles

// Ensure Button component supports all props used in ButtonGroup
const Button = ({
  text,
  icon = null, // Default to no icon
  iconPosition = 'leading', // Default icon position
  onClick = () => {}, // Default click handler
  className = '', // Default to no additional classes
  variant = 'primary', // Default to primary variant
  size = 'md', // Default size
  disabled = false, // Default to enabled
}) => {
  return (
    <button
      className={`button button-${variant} ${variant !== 'text-only' ? `button-${size}` : ''} ${className}`.trim()}
      onClick={onClick}
      aria-label={text}
      disabled={disabled}
    >
      {icon && iconPosition === 'leading' && (
        <i className={`icon ${icon} button-icon leading`} aria-hidden="true"></i>
      )}
      <span>{text}</span>
      {icon && iconPosition === 'trailing' && (
        <i className={`icon ${icon} button-icon trailing`} aria-hidden="true"></i>
      )}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired, // Button text
  icon: PropTypes.string, // Icon class name (e.g., "icon-Lock")
  iconPosition: PropTypes.oneOf(['leading', 'trailing']), // Icon position
  onClick: PropTypes.func, // Click handler
  className: PropTypes.string, // Additional custom classes
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text-only', 'destructive']), // Button variant
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']), // Updated size options
  disabled: PropTypes.bool, // Disabled state
};

export default Button;