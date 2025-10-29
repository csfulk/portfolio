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

import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon.jsx';
import { typography } from '../tokens/typography/index.js';
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
    color: 'var(--colors-text-primary)',
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
    fontSize: 'var(--typography-scales-body-sm-font-size)',
    minHeight: 'var(--min-height-button-xs)'
  },
  sm: {
    padding: 'var(--spacing-sm) var(--spacing-md)',
    fontSize: 'var(--typography-scales-body-font-size)',
    minHeight: 'var(--min-height-button-sm)'
  },
  md: {
    padding: 'var(--spacing-sm) var(--spacing-xl)',
    fontSize: 'var(--typography-scales-body-font-size)',
    minHeight: 'var(--min-height-button-md)'
  },
  lg: {
    padding: 'var(--spacing-lg) var(--spacing-xl)',
    fontSize: 'var(--typography-scales-body-font-size)',
    minHeight: 'var(--min-height-button-lg)'
  },
  xl: {
    padding: 'var(--spacing-lg) var(--spacing-3xl)',
    fontSize: 'var(--typography-scales-heading-5-font-size)',
    minHeight: 'var(--min-height-button-xl)'
  }
};

// Import design system tokens for unified weight mapping and icon defaults
const { weightMapping, iconDefaults } = typography;

const ButtonComponent = forwardRef(({ 
  children,
  text, // Backward compatibility - use text prop if children not provided
  variant = 'primary',
  size = 'md',
  fontWeight, // Controls both text and icon weight - defaults to medium if not provided
  icon,
  iconPosition = 'leading',
  iconSize, // Override icon size (uses optimized default if not provided)
  // Interactive icon states
  iconHover, // Icon to show on hover
  iconActive, // Icon to show when pressed/active
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
  borderColor,
  hoverColor,
  hoverBackgroundColor,
  hoverBorderColor,
  className = '',
  onClick,
  type = 'button',
  as: Component = 'button',
  ...props 
}, ref) => {
  const variantStyles = buttonVariants[variant] || buttonVariants.primary;
  const sizeStyles = buttonSizes[size] || buttonSizes.md;
  
  // State for interactive icons
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Get optimized icon defaults for this button size
  const iconConfig = iconDefaults[size] || iconDefaults.md;
  
  // Get unified weight (defaults to medium for consistent design)
  const currentWeight = fontWeight || 'medium';
  const weightConfig = weightMapping[currentWeight] || weightMapping.medium;

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
    // Unified weight system - controls both text and icon weight
    fontWeight: `var(--typography-font-weight-${currentWeight})`,
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
    ...(borderColor && { borderColor }),
    // Set custom properties for hover states
    ...(hoverColor && { '--button-hover-color': hoverColor }),
    ...(hoverBackgroundColor && { '--button-hover-bg': hoverBackgroundColor }),
    ...(hoverBorderColor && { '--button-hover-border-color': hoverBorderColor }),
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
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--typography-scales-body-sm-font-size)',
          fontWeight: 'var(--typography-scales-heading-6-font-weight)',
          color: 'currentColor',
          lineHeight: 1
        }}
        aria-hidden="true"
      >
        {countdown > 0 ? countdown : '✓'}
      </span>
    );
  };

  // Determine current icon based on state and interactive options
  const getCurrentIcon = () => {
    if (isPressed && iconActive) return iconActive;
    if (isHovered && iconHover) return iconHover;
    return icon;
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

    const currentIcon = getCurrentIcon();
    
    if (currentIcon) {
      return (
        <span 
          className={`button-icon button-icon--${iconPosition}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          aria-hidden="true"
        >
          {typeof currentIcon === 'string' ? (
            <Icon 
              name={currentIcon} 
              size={iconSize || iconConfig.size} 
              strokeWidth={weightConfig.iconStroke}
            />
          ) : (
            currentIcon
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onBlur={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onDragLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
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
  fontWeight: PropTypes.oneOf(['light', 'normal', 'medium', 'semibold', 'bold']),
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconPosition: PropTypes.oneOf(['leading', 'trailing']),
  iconSize: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']), // Optional - uses optimized default based on button size
  // Interactive icon states
  iconHover: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  iconActive: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
  borderColor: PropTypes.string,
  hoverColor: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
  hoverBorderColor: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  as: PropTypes.elementType
};

export default ButtonComponent;
