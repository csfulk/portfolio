import React from 'react';
import PropTypes from 'prop-types';

const Icon = ({ name, className, ...props }) => {
  return (
    <svg className={`icon ${className}`} {...props}>
      <use xlinkHref={`/assets/icons/${name}.svg#icon`} />
    </svg>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired, // Name of the icon file (without extension)
  className: PropTypes.string, // Additional CSS classes
};

Icon.defaultProps = {
  className: '', // Default to no additional classes
};

export default Icon;