import React from 'react';
import PropTypes from 'prop-types';
import '../styles/button.css'; // Import styles for the button

const Button = ({ text, leadingIcon, trailingIcon, onClick, rounded, className, variant }) => {
  return (
    <button
      className={`button button-${variant} ${rounded ? 'button-rounded' : ''} ${className}`}
      onClick={onClick}
    >
      {leadingIcon && <span className="button-icon leading">{leadingIcon}</span>}
      <span className="button-text">{text}</span>
      {trailingIcon && <span className="button-icon trailing">{trailingIcon}</span>}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired, // Button text
  leadingIcon: PropTypes.node, // Icon to display before the text
  trailingIcon: PropTypes.node, // Icon to display after the text
  onClick: PropTypes.func, // Click handler
  rounded: PropTypes.bool, // Whether the button has rounded corners
  className: PropTypes.string, // Additional custom classes
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text', 'destructive']), // Button variant
};

Button.defaultProps = {
  leadingIcon: null,
  trailingIcon: null,
  onClick: () => {},
  rounded: false,
  className: '',
  variant: 'primary', // Default to primary variant
};

export default Button;