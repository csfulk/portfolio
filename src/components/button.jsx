import React from 'react';
import PropTypes from 'prop-types';
import '../styles/button.css'; // Import button styles
import '../styles/icon-font.css'; // Import icon font styles

const Button = ({
  text,
  icon = null,
  iconPosition = 'leading',
  onClick = () => {},
  className = '',
  variant = 'primary',
  authenticated = false, // Accept authenticated state as prop
}) => {
  // Dynamic icon selection for lock/unlock
  let dynamicIcon = icon;
  if (icon === 'icon-Lock_light' || icon === 'icon-Unlock_light') {
    dynamicIcon = authenticated ? 'icon-Unlock_light' : 'icon-Lock_light';
  }

  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      onClick={onClick}
      aria-label={text}
    >
      {dynamicIcon && iconPosition === 'leading' && (
        <i className={`icon ${dynamicIcon} button-icon leading`} aria-hidden="true"></i>
      )}
      <span className="button-text">{text}</span>
      {dynamicIcon && iconPosition === 'trailing' && (
        <i className={`icon ${dynamicIcon} button-icon trailing`} aria-hidden="true"></i>
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
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text', 'destructive', 'rounded']), // Button variant
  authenticated: PropTypes.bool, // Authentication state for dynamic icon switching
};

export default Button;