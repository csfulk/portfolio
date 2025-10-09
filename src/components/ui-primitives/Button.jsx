/**
 * Enhanced Button Component
 * Comprehensive button with design system integration and variants
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const buttonVariants = {
  primary: {
    backgroundColor: 'var(--colors-interactive-primary)',
    color: 'var(--colors-text-inverse)',
    border: 'none',
    '&:hover': {
      backgroundColor: 'var(--colors-interactive-hover)',
      color: 'var(--colors-interactive-primary)'
    }
  },
  secondary: {
    backgroundColor: 'var(--colors-interactive-secondary)',
    color: 'var(--colors-interactive-primary)',
    border: 'none',
    '&:hover': {
      backgroundColor: 'var(--colors-interactive-hover)',
      color: 'var(--colors-text-inverse)'
    }
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--colors-interactive-primary)',
    border: '1px solid var(--colors-interactive-outline)',
    '&:hover': {
      backgroundColor: 'var(--colors-interactive-primary)',
      color: 'var(--colors-text-inverse)'
    }
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--colors-interactive-primary)',
    border: 'none',
    '&:hover': {
      backgroundColor: 'var(--colors-interactive-secondary)'
    }
  },
  link: {
    backgroundColor: 'transparent',
    color: 'var(--colors-interactive-accent)',
    border: 'none',
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none'
    }
  }
};

const buttonSizes = {
  xs: {
    padding: 'var(--spacing-xs) var(--spacing-sm)',
    fontSize: 'var(--typography-font-size-xs)',
    minHeight: '24px'
  },
  sm: {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    fontSize: 'var(--typography-font-size-sm)',
    minHeight: '32px'
  },
  md: {
    padding: 'var(--spacing-sm) var(--spacing-xl)',
    fontSize: 'var(--typography-font-size-sm)',
    minHeight: '40px'
  },
  lg: {
    padding: 'var(--spacing-md) var(--spacing-2xl)',
    fontSize: 'var(--typography-font-size-md)',
    minHeight: '48px'
  },
  xl: {
    padding: 'var(--spacing-lg) var(--spacing-3xl)',
    fontSize: 'var(--typography-font-size-lg)',
    minHeight: '56px'
  }
};

const ButtonComponent = forwardRef(({ 
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'leading',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  as: Component = 'button',
  ...props 
}, ref) => {
  const variantStyles = buttonVariants[variant] || buttonVariants.primary;
  const sizeStyles = buttonSizes[size] || buttonSizes.md;

  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-xs)',
    fontFamily: 'var(--typography-font-family-primary)',
    fontWeight: 'var(--typography-font-weight-medium)',
    borderRadius: 'var(--radius-full)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    transition: 'var(--transitions-hover)',
    textDecoration: 'none',
    userSelect: 'none',
    position: 'relative',
    overflow: 'hidden',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || isLoading ? 0.6 : 1,
    ...variantStyles,
    ...sizeStyles,
  };

  const classes = [
    'button-enhanced',
    `button-enhanced--${variant}`,
    `button-enhanced--${size}`,
    fullWidth && 'button-enhanced--full-width',
    isLoading && 'button-enhanced--loading',
    disabled && 'button-enhanced--disabled',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <span 
          className="button-spinner"
          style={{
            width: '1em',
            height: '1em',
            border: '2px solid currentColor',
            borderRightColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
          aria-hidden="true"
        />
      );
    }

    if (icon) {
      return (
        <span 
          className={`button-icon button-icon--${iconPosition}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '1em',
            height: '1em',
            fontSize: 'var(--typography-font-size-lg)',
            flexShrink: 0
          }}
          aria-hidden="true"
        >
          {typeof icon === 'string' ? (
            <i className={`icon ${icon}`} />
          ) : (
            icon
          )}
        </span>
      );
    }

    return null;
  };

  const renderContent = () => {
    const iconElement = renderIcon();
    const textElement = (
      <span className="button-text">
        {children}
      </span>
    );

    if (!iconElement) return textElement;

    return iconPosition === 'leading' 
      ? [iconElement, textElement]
      : [textElement, iconElement];
  };

  return (
    <Component 
      ref={ref}
      className={classes}
      style={buttonStyles}
      onClick={handleClick}
      disabled={disabled || isLoading}
      type={Component === 'button' ? type : undefined}
      aria-disabled={disabled || isLoading}
      aria-label={isLoading ? 'Loading...' : undefined}
      {...props}
    >
      {renderContent()}
      
      {/* Add keyframes for spinner animation via style tag */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Component>
  );
});

ButtonComponent.displayName = 'Button';

ButtonComponent.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'link']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['leading', 'trailing']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  as: PropTypes.elementType
};

export default ButtonComponent;
