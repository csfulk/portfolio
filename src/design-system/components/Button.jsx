/**
 * Enhanced Button Component
 * Comprehensive button with design system integration and variants
 * 
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, link, destructive, text)
 * - Size options (xs, sm, md, lg, xl)
 * - Icon support with positioning
 * - Loading states with spinner
 * - Countdown feature with circular progress indicator
 * - Full customization with style overrides
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import '../styles/button.css';

const buttonVariants = {
  primary: {
    backgroundColor: 'var(--colors-interactive-primary)',
    color: 'var(--colors-text-inverse)',
    border: 'none',
    '--button-hover-bg': 'var(--colors-interactive-hover-primary)',
    '--button-hover-color': 'var(--colors-text-inverse)'
  },
  secondary: {
    backgroundColor: 'var(--colors-interactive-secondary)',
    color: 'var(--colors-interactive-primary)',
    border: 'none',
    '--button-hover-bg': 'var(--colors-interactive-hover-secondary)',
    '--button-hover-color': 'var(--colors-interactive-primary)'
  },
  outline: {
    backgroundColor: 'transparent',
    color: 'var(--colors-interactive-primary)',
    border: '1px solid var(--colors-interactive-outline)',
    '--button-hover-bg': 'var(--colors-interactive-hover-outline)',
    '--button-hover-color': 'var(--colors-text-inverse)'
  },
  ghost: {
    backgroundColor: 'transparent',
    color: 'var(--colors-interactive-primary)',
    border: 'none',
    '--button-hover-bg': 'var(--colors-interactive-hover-ghost)',
    '--button-hover-color': 'var(--colors-interactive-primary)'
  },
  link: {
    backgroundColor: 'transparent',
    color: 'var(--colors-interactive-accent)',
    border: 'none',
    textDecoration: 'underline',
    '--button-hover-bg': 'transparent',
    '--button-hover-color': 'var(--colors-interactive-hover-link)',
    '--button-hover-decoration': 'none'
  },
  destructive: {
    backgroundColor: 'var(--colors-interactive-destructive)',
    color: 'var(--colors-text-inverse)',
    border: 'none',
    '--button-hover-bg': 'var(--colors-interactive-hover-destructive)',
    '--button-hover-color': 'var(--colors-text-inverse)'
  },
  text: {
    backgroundColor: 'transparent',
    color: 'var(--colors-text-primary)',
    border: 'none',
    textDecoration: 'none',
    '--button-hover-bg': 'transparent',
    '--button-hover-color': 'var(--colors-text-secondary)',
    '--button-hover-decoration': 'none'
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
    padding: 'var(--spacing-lg) var(--spacing-xl)',
    fontSize: 'var(--typography-font-size-sm)',
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
  text, // Backward compatibility - use text prop if children not provided
  variant = 'primary',
  size = 'md',
  fontWeight, // Now optional - defaults to medium if not provided
  icon,
  iconPosition = 'leading',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  // Countdown feature props
  countdown,
  countdownActive = false,
  // Style override props
  noPadding = false,
  paddingX,
  paddingY, 
  padding,
  color,
  backgroundColor,
  hoverColor,
  hoverBackgroundColor,
  className = '',
  onClick,
  type = 'button',
  as: Component = 'button',
  ...props 
}, ref) => {
  const variantStyles = buttonVariants[variant] || buttonVariants.primary;
  const sizeStyles = buttonSizes[size] || buttonSizes.md;

  // Handle padding overrides
  const getPadding = () => {
    if (noPadding) return '0';
    if (padding) return padding;
    if (paddingX || paddingY) {
      const x = paddingX || '0';
      const y = paddingY || '0';
      return `${y} ${x}`;
    }
    return sizeStyles.padding;
  };

  const buttonStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--spacing-xs)',
    fontFamily: 'var(--typography-font-family-primary)',
    // Simple font weight logic - use prop or default to medium
    fontWeight: fontWeight ? `var(--typography-font-weight-${fontWeight})` : 'var(--typography-font-weight-medium)',
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
    // Override with custom styles if provided
    padding: getPadding(),
    ...(color && { color }),
    ...(backgroundColor && { backgroundColor }),
    // Set custom properties for hover states
    ...(hoverColor && { '--button-hover-color': hoverColor }),
    ...(hoverBackgroundColor && { '--button-hover-bg': hoverBackgroundColor }),
  };

  const classes = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    fullWidth && 'button--full-width',
    isLoading && 'button--loading',
    disabled && 'button--disabled',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || isLoading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderCountdown = () => {
    if (!countdown || !countdownActive) return null;

    return (
      <span 
        className="button-countdown"
        style={{
          position: 'relative',
          width: '18px',
          height: '18px',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-hidden="true"
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 32 32" 
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle 
            cx="16" 
            cy="16" 
            r="14" 
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2.5"
          />
          <circle 
            cx="16" 
            cy="16" 
            r="14" 
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeDasharray="87.96"
            strokeDashoffset="87.96"
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 8s linear',
              strokeDashoffset: countdownActive ? '0' : '87.96'
            }}
          />
        </svg>
        <span 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 'var(--typography-font-size-xs)',
            fontWeight: 'var(--typography-font-weight-semibold)',
            color: 'currentColor',
            lineHeight: 1
          }}
        >
          {countdown > 0 ? countdown : '✓'}
        </span>
      </span>
    );
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
    const countdownElement = renderCountdown();
    const buttonContent = children || text; // Support both children and text prop
    const textElement = (
      <span className="button-text">
        {buttonContent}
      </span>
    );

    // Build content array based on what elements exist
    const contentElements = [];
    
    // Add icon if it exists and should be leading
    if (iconElement && iconPosition === 'leading') {
      contentElements.push(iconElement);
    }
    
    // Always add text content
    contentElements.push(textElement);
    
    // Add countdown if it exists (always trailing)
    if (countdownElement) {
      contentElements.push(countdownElement);
    }
    
    // Add icon if it exists and should be trailing
    if (iconElement && iconPosition === 'trailing') {
      contentElements.push(iconElement);
    }

    return contentElements;
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
  children: PropTypes.node,
  text: PropTypes.string, // Backward compatibility
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'link', 'destructive', 'text']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  fontWeight: PropTypes.oneOf(['light', 'normal', 'medium', 'semibold', 'bold', 'extrabold']),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['leading', 'trailing']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  // Countdown feature props
  countdown: PropTypes.number,
  countdownActive: PropTypes.bool,
  // Style override props
  noPadding: PropTypes.bool,
  paddingX: PropTypes.string,
  paddingY: PropTypes.string,
  padding: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  as: PropTypes.elementType
};

export default ButtonComponent;
