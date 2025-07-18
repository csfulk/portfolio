import React from 'react';
import PropTypes from 'prop-types';
import '../styles/button.css'; // Import button styles
import '../styles/icon-font.css'; // Import icon font styles

const Button = ({
  text,
  icon = null, // Default to no icon
  iconPosition = 'leading', // Default icon position
  onClick = () => {}, // Default click handler
  className = '', // Default to no additional classes
  variant = 'primary', // Default to primary variant
}) => {
  return (
    <button
      className={`button button-${variant} ${className}`.trim()}
      onClick={onClick}
      aria-label={text}
    >
      {/* Render both lock and unlock icons for lock buttons, otherwise render the icon as usual */}
      {icon && iconPosition === 'leading' && (
        icon === 'icon-Lock_light' ? (
          <>
            <i className="icon icon-Lock_light button-icon leading" aria-hidden="true"></i>
            <i className="icon icon-Unlock_light button-icon leading" aria-hidden="true"></i>
          </>
        ) : (
          <i className={`icon ${icon} button-icon leading`} aria-hidden="true"></i>
        )
      )}
      <span className="button-text">{text}</span>
      {icon && iconPosition === 'trailing' && (
        icon === 'icon-Lock_light' ? (
          <>
            <i className="icon icon-Lock_light button-icon trailing" aria-hidden="true"></i>
            <i className="icon icon-Unlock_light button-icon trailing" aria-hidden="true"></i>
          </>
        ) : (
          <i className={`icon ${icon} button-icon trailing`} aria-hidden="true"></i>
        )
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
};

export default Button;