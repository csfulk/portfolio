import React from 'react';
import PropTypes from 'prop-types';
import Button from './button';
import '../styles/button.css';

const ButtonGroup = ({ buttons, direction = 'horizontal' }) => {
  return (
    <div className={`button-group ${direction === 'vertical' ? 'button-group-vertical' : ''}`}>
      {buttons.map((button, index) => (
        <Button key={index} {...button} />
      ))}
    </div>
  );
};

ButtonGroup.propTypes = {
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      icon: PropTypes.string,
      iconPosition: PropTypes.oneOf(['leading', 'trailing']),
      onClick: PropTypes.func,
      className: PropTypes.string,
      variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'text-only', 'destructive']),
      size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']), // Updated size options
      disabled: PropTypes.bool,
    })
  ).isRequired,
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
};

export default ButtonGroup;