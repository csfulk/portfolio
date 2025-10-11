/**
 * Button Documentation & Code Generator
 * Interactive tool for exploring button options and generating code snippets
 */

import React, { useState, useMemo } from 'react';
import { Button, Icon } from '../components/index.js';
import * as Iconoir from 'iconoir-react';

// Custom Toggle Switch Component
const Toggle = ({ checked, onChange, size = 'md' }) => {
  const sizeStyles = {
    sm: {
      width: '32px',
      height: '18px',
      padding: '2px',
      dotSize: '14px'
    },
    md: {
      width: '44px',
      height: '24px',
      padding: '2px',
      dotSize: '20px'
    }
  };

  const currentSize = sizeStyles[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative',
        width: currentSize.width,
        height: currentSize.height,
        padding: currentSize.padding,
        border: 'none',
        borderRadius: '999px',
        backgroundColor: checked 
          ? 'var(--colors-interactive-primary, #0066cc)' 
          : 'var(--colors-interactive-outline, #e0e0e0)',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
        boxShadow: checked 
          ? '0 0 0 2px var(--colors-interactive-primary-alpha, rgba(0, 102, 204, 0.2))' 
          : 'none'
      }}
      onFocus={(e) => {
        e.target.style.boxShadow = checked 
          ? '0 0 0 2px var(--colors-interactive-primary-alpha, rgba(0, 102, 204, 0.2)), 0 0 0 4px var(--colors-interactive-focus, rgba(0, 102, 204, 0.1))' 
          : '0 0 0 2px var(--colors-interactive-focus, rgba(0, 102, 204, 0.3))';
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = checked 
          ? '0 0 0 2px var(--colors-interactive-primary-alpha, rgba(0, 102, 204, 0.2))' 
          : 'none';
      }}
    >
      <div
        style={{
          width: currentSize.dotSize,
          height: currentSize.dotSize,
          backgroundColor: 'white',
          borderRadius: '50%',
          transition: 'transform 0.2s ease',
          transform: checked 
            ? `translateX(${parseInt(currentSize.width.replace('px', '')) - parseInt(currentSize.dotSize.replace('px', '')) - 4}px)` 
            : 'translateX(0)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
        }}
      />
    </button>
  );
};

const ButtonDocumentation = () => {
  // Button configuration state
  const [config, setConfig] = useState({
    variant: 'primary',
    size: 'md',
    text: 'Button Text',
    hasIcon: false,
    icon: '',
    iconPosition: 'leading',
    iconSize: 'auto',
    strokeWeight: 'auto',
    disabled: false,
    loading: false,
    fullWidth: false,
    href: '',
    target: '_self'
  });

  // Search state for icon browser
  const [iconSearch, setIconSearch] = useState('');

  // Available options
  const variants = [
    { value: 'primary', label: 'Primary', description: 'Main call-to-action' },
    { value: 'secondary', label: 'Secondary', description: 'Supporting action' },
    { value: 'outline', label: 'Outline', description: 'Secondary with border' },
    { value: 'ghost', label: 'Ghost', description: 'Minimal styling' }
  ];
  
  const sizes = [
    { value: 'xs', label: 'XS', description: 'Extra small' },
    { value: 'sm', label: 'SM', description: 'Small' },
    { value: 'md', label: 'MD', description: 'Medium (default)' },
    { value: 'lg', label: 'LG', description: 'Large' },
    { value: 'xl', label: 'XL', description: 'Extra large' }
  ];

  const iconPositions = [
    { value: 'leading', label: 'Leading', description: 'Icon before text' },
    { value: 'trailing', label: 'Trailing', description: 'Icon after text' },
    { value: 'only', label: 'Icon Only', description: 'No text, just icon' }
  ];

  const iconSizes = ['auto', 'xs', 'sm', 'md', 'lg', 'xl'];
  const strokeWeights = ['auto', '1', '1.5', '2', '2.25', '2.5', '3'];

  // Get all available icons from Iconoir (like the working IconBrowser)
  const allIcons = useMemo(() => {
    try {
      return Object.keys(Iconoir)
        .filter(key => {
          // Filter for actual icon components (same logic as working IconBrowser)
          return key !== 'default' && 
                 key !== 'IconoirProvider' && 
                 !key.startsWith('_') &&
                 key.charAt(0) === key.charAt(0).toUpperCase() &&
                 Iconoir[key];
        })
        .sort();
    } catch (error) {
      console.error('Error getting icons:', error);
      return [];
    }
  }, []);

  // Filter icons based on search (separate from allIcons)
  const filteredIcons = useMemo(() => {
    if (!iconSearch) return allIcons.slice(0, 100); // Show first 100 by default
    
    return allIcons
      .filter(icon => icon.toLowerCase().includes(iconSearch.toLowerCase()))
      .slice(0, 50); // Limit search results for performance
  }, [allIcons, iconSearch]);

  // Generate code snippet
  const generateCode = useMemo(() => {
    const props = [];
    
    // Always include variant and size
    props.push(`variant="${config.variant}"`);
    props.push(`size="${config.size}"`);
    
    // Add text if not icon-only
    if (config.iconPosition !== 'only') {
      props.push(`text="${config.text}"`);
    }
    
    // Add icon props
    if (config.icon) {
      props.push(`icon="${config.icon}"`);
      
      if (config.iconPosition === 'trailing') {
        props.push(`iconPosition="trailing"`);
      }
      
      if (config.iconSize !== 'auto') {
        props.push(`iconSize="${config.iconSize}"`);
      }
      
      if (config.strokeWeight !== 'auto') {
        props.push(`strokeWeight={${config.strokeWeight}}`);
      }
    }
    
    // Add state props
    if (config.disabled) props.push(`disabled`);
    if (config.loading) props.push(`loading`);
    if (config.fullWidth) props.push(`fullWidth`);
    
    // Add link props
    if (config.href) {
      props.push(`href="${config.href}"`);
      if (config.target !== '_self') {
        props.push(`target="${config.target}"`);
      }
    }
    
    return `<Button ${props.join(' ')} />`;
  }, [config]);

  // Update configuration
  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'var(--typography-font-family-primary)',
      backgroundColor: 'var(--colors-background-primary)',
      minHeight: '100vh'
    }}>
      
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        textAlign: 'left'
      }}>
        <h1 style={{
          fontSize: 'var(--typography-scales-heading-2-font-size)',
          fontWeight: 'var(--typography-scales-heading-2-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: '8px'
        }}>
          Button Documentation & Code Generator
        </h1>
        <p style={{
          fontSize: 'var(--typography-scales-body-font-size)',
          color: 'var(--colors-text-secondary)',
          margin: 0
        }}>
          Configure your button and copy the generated code
        </p>
      </div>

      {/* Three Column Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '350px 1fr 400px',
        gap: '24px',
        maxWidth: '1600px',
        margin: '0 auto',
        height: 'calc(100vh - 200px)', // Fixed height for sticky columns
        alignItems: 'start'
      }}>

        {/* Left Column - Controls */}
        <div style={{
          backgroundColor: 'var(--colors-surface-secondary, #f5f5f5)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--colors-interactive-outline, #e0e0e0)',
          padding: '24px',
          overflowY: 'auto',
          height: '100%'
        }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginTop: 0,
            marginBottom: '24px',
            textAlign: 'left'
          }}>
            ⚙️ Configuration
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            
            {/* Button Text Input */}
            <FormSection title="Button Text">
              <input
                type="text"
                value={config.text}
                onChange={(e) => updateConfig('text', e.target.value)}
                disabled={config.iconPosition === 'only'}
                placeholder="Enter button text..."
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                  backgroundColor: config.iconPosition === 'only' ? 'var(--colors-surface-tertiary, #e0e0e0)' : 'var(--colors-surface-primary, #ffffff)',
                  color: 'var(--colors-text-primary)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  opacity: config.iconPosition === 'only' ? 0.6 : 1,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </FormSection>

            {/* Variant Dropdown */}
            <FormSection title="Button Type">
              <select
                value={config.variant}
                onChange={(e) => updateConfig('variant', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                  backgroundColor: 'var(--colors-surface-primary, #ffffff)',
                  color: 'var(--colors-text-primary)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px',
                  paddingRight: '40px',
                  outline: 'none'
                }}
              >
                {variants.map(variant => (
                  <option key={variant.value} value={variant.value}>
                    {variant.label} - {variant.description}
                  </option>
                ))}
              </select>
            </FormSection>

            {/* Size Dropdown */}
            <FormSection title="Size">
              <select
                value={config.size}
                onChange={(e) => updateConfig('size', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                  backgroundColor: 'var(--colors-surface-primary, #ffffff)',
                  color: 'var(--colors-text-primary)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 12px center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '16px',
                  paddingRight: '40px',
                  outline: 'none'
                }}
              >
                {sizes.map(size => (
                  <option key={size.value} value={size.value}>
                    {size.label} - {size.description}
                  </option>
                ))}
              </select>
            </FormSection>

            {/* Icon Toggle */}
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start'
            }}>
              {/* Icon Section */}
              <div style={{ flex: '0 0 auto' }}>
                <FormSection title="Icon">
                  <div style={{
                    position: 'relative',
                    width: '48px',
                    height: '24px',
                    backgroundColor: config.hasIcon ? 'var(--colors-interactive-accent, #F09)' : 'var(--colors-interactive-outline, #e0e0e0)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    const hasIcon = !config.hasIcon;
                    updateConfig('hasIcon', hasIcon);
                    if (!hasIcon) {
                      updateConfig('icon', '');
                    }
                  }}>
                    <input
                      type="checkbox"
                      checked={config.hasIcon}
                      onChange={() => {}} // Handled by div onClick
                      style={{ 
                        opacity: 0,
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '2px',
                      left: config.hasIcon ? '26px' : '2px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                </FormSection>
              </div>

              {/* Position Section - Always present but conditionally visible */}
              <div style={{ flex: 1, opacity: config.hasIcon ? 1 : 0, pointerEvents: config.hasIcon ? 'auto' : 'none' }}>
                <FormSection title="Position">
                  <select
                    value={config.iconPosition}
                    onChange={(e) => updateConfig('iconPosition', e.target.value)}
                    disabled={!config.hasIcon}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                      backgroundColor: config.hasIcon ? 'var(--colors-surface-primary, #ffffff)' : 'var(--colors-surface-tertiary, #f0f0f0)',
                      color: 'var(--colors-text-primary)',
                      fontSize: 'var(--typography-scales-body-sm-font-size)',
                      cursor: config.hasIcon ? 'pointer' : 'not-allowed',
                      boxSizing: 'border-box',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: '40px',
                      outline: 'none',
                      transition: 'opacity 0.3s ease, background-color 0.3s ease'
                    }}
                  >
                    {iconPositions.map(position => (
                      <option key={position.value} value={position.value}>
                        {position.label} - {position.description}
                      </option>
                    ))}
                  </select>
                </FormSection>
              </div>
            </div>

            {/* Icon Search Field */}
            {config.hasIcon && (
              <FormSection title="">
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Search icons..."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                    backgroundColor: 'var(--colors-surface-primary, #ffffff)',
                    color: 'var(--colors-text-primary)',
                    fontSize: 'var(--typography-scales-body-sm-font-size)',
                    boxSizing: 'border-box',
                    outline: 'none'
                  }}
                />
              </FormSection>
            )}

            {/* Icon Selection */}
            {config.hasIcon && (
              <>
                <FormSection title="">
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(6, 1fr)',
                      gap: '8px',
                      maxHeight: '150px', // 2.5 rows: ~60px per row
                      overflowY: 'auto',
                      padding: '12px',
                      backgroundColor: 'var(--colors-surface-primary, #ffffff)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--colors-interactive-outline, #e0e0e0)'
                    }}>
                      {filteredIcons.slice(0, 15).map(iconName => {
                        const IconComponent = Iconoir[iconName];
                        return (
                          <button
                            key={iconName}
                            onClick={() => updateConfig('icon', iconName)}
                            style={{
                              padding: '8px',
                              border: `2px solid ${config.icon === iconName ? 'var(--colors-interactive-accent, #F09)' : 'var(--colors-interactive-outline, #e0e0e0)'}`,
                              backgroundColor: config.icon === iconName ? 'var(--colors-interactive-accent, #F09)' : 'var(--colors-surface-primary, #ffffff)',
                              color: config.icon === iconName ? 'white' : 'var(--colors-text-primary)',
                              borderRadius: 'var(--radius-sm)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: '40px',
                              minWidth: '40px',
                              fontSize: '16px',
                              transition: 'all 0.2s ease'
                            }}
                            title={iconName}
                            onMouseEnter={(e) => {
                              if (config.icon !== iconName) {
                                e.target.style.backgroundColor = 'var(--colors-surface-secondary, #f5f5f5)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (config.icon !== iconName) {
                                e.target.style.backgroundColor = 'var(--colors-surface-primary, #ffffff)';
                              }
                            }}
                          >
                            {IconComponent ? (
                              <IconComponent 
                                width={20} 
                                height={20}
                                strokeWidth={1.5}
                              />
                            ) : (
                              <span style={{ fontSize: '10px' }}>?</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    
                    {config.icon && (
                      <div style={{
                        padding: '8px 12px',
                        backgroundColor: 'var(--colors-surface-secondary, #f5f5f5)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--typography-scales-body-xs-font-size)',
                        color: 'var(--colors-text-secondary)',
                        fontFamily: 'monospace'
                      }}>
                        Selected: {config.icon}
                      </div>
                    )}
                  </div>
                </FormSection>

                {/* Icon Size Dropdown */}
                <FormSection title="Icon Size">
                  <select
                    value={config.iconSize}
                    onChange={(e) => updateConfig('iconSize', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                      backgroundColor: 'var(--colors-surface-primary, #ffffff)',
                      color: 'var(--colors-text-primary)',
                      fontSize: 'var(--typography-scales-body-font-size)',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: '40px',
                      outline: 'none'
                    }}
                  >
                    {iconSizes.map(size => (
                      <option key={size} value={size}>
                        {size === 'auto' ? 'Auto (matches button size)' : `${size.toUpperCase()}`}
                      </option>
                    ))}
                  </select>
                </FormSection>

                {/* Stroke Weight Dropdown */}
                <FormSection title="Icon Stroke Weight">
                  <select
                    value={config.strokeWeight}
                    onChange={(e) => updateConfig('strokeWeight', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                      backgroundColor: 'var(--colors-surface-primary, #ffffff)',
                      color: 'var(--colors-text-primary)',
                      fontSize: 'var(--typography-scales-body-font-size)',
                      cursor: 'pointer',
                      boxSizing: 'border-box',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23666' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 12px center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '16px',
                      paddingRight: '40px',
                      outline: 'none'
                    }}
                  >
                    {strokeWeights.map(weight => (
                      <option key={weight} value={weight}>
                        {weight === 'auto' ? 'Auto (default)' : `${weight}px`}
                      </option>
                    ))}
                  </select>
                </FormSection>
              </>
            )}

            {/* State Toggles */}
            <FormSection title="States">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {[
                  { key: 'disabled', label: 'Disabled' },
                  { key: 'loading', label: 'Loading State' },
                  { key: 'fullWidth', label: 'Full Width' }
                ].map(({ key, label }) => (
                  <div key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    minHeight: '32px'
                  }}>
                    <Toggle
                      checked={config[key]}
                      onChange={(checked) => updateConfig(key, checked)}
                      size="sm"
                    />
                    <span style={{
                      fontSize: 'var(--typography-scales-body-sm-font-size)',
                      color: 'var(--colors-text-primary)',
                      fontWeight: '500'
                    }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </FormSection>

            {/* Link URL */}
            <FormSection title="Link (Optional)">
              <input
                type="url"
                value={config.href}
                onChange={(e) => updateConfig('href', e.target.value)}
                placeholder="https://example.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--colors-interactive-outline, #e0e0e0)',
                  backgroundColor: 'var(--colors-surface-primary, #ffffff)',
                  color: 'var(--colors-text-primary)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </FormSection>
          </div>
        </div>

        {/* Center Column - Preview */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          height: '100%',
          position: 'sticky',
          top: 0
        }}>
          
          {/* Live Preview */}
          <div style={{
            backgroundColor: 'var(--colors-surface-secondary, #f5f5f5)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--colors-interactive-outline, #e0e0e0)',
            padding: '32px',
            flex: 1
          }}>
            <h2 style={{
              fontSize: 'var(--typography-scales-heading-4-font-size)',
              fontWeight: 'var(--typography-scales-heading-4-font-weight)',
              color: 'var(--colors-text-primary)',
              marginTop: 0,
              marginBottom: '32px',
              textAlign: 'left'
            }}>
              📱 Live Preview
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: config.fullWidth ? 'stretch' : 'center',
              alignItems: 'center',
              minHeight: '200px',
              backgroundColor: 'var(--colors-surface-primary, #ffffff)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed var(--colors-interactive-outline, #e0e0e0)',
              padding: '40px'
            }}>
              <Button
                variant={config.variant}
                size={config.size}
                text={config.iconPosition === 'only' ? undefined : config.text}
                icon={config.hasIcon && config.icon ? config.icon : undefined}
                iconPosition={config.iconPosition === 'leading' ? undefined : config.iconPosition}
                iconSize={config.iconSize === 'auto' ? undefined : config.iconSize}
                strokeWeight={config.strokeWeight === 'auto' ? undefined : parseFloat(config.strokeWeight)}
                disabled={config.disabled}
                loading={config.loading}
                fullWidth={config.fullWidth}
                href={config.href || undefined}
                target={config.target === '_self' ? undefined : config.target}
              />
            </div>
          </div>

          {/* Quick Examples */}
          <div style={{
            backgroundColor: 'var(--colors-surface-secondary, #f5f5f5)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--colors-interactive-outline, #e0e0e0)',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: 'var(--typography-scales-heading-5-font-size)',
              fontWeight: 'var(--typography-scales-heading-5-font-weight)',
              color: 'var(--colors-text-primary)',
              marginTop: 0,
              marginBottom: '16px',
              textAlign: 'left'
            }}>
              ⚡ Quick Examples
            </h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              {[
                { variant: 'primary', size: 'md', text: 'Primary', icon: 'arrow-right', iconPosition: 'trailing' },
                { variant: 'secondary', size: 'md', text: 'Secondary' },
                { variant: 'outline', size: 'sm', text: 'Outline', icon: 'settings' },
                { variant: 'ghost', size: 'lg', icon: 'user', iconPosition: 'only' }
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    Object.keys(example).forEach(key => {
                      updateConfig(key, example[key]);
                    });
                    updateConfig('hasIcon', !!example.icon);
                  }}
                  style={{
                    padding: '12px',
                    backgroundColor: 'var(--colors-background-primary)',
                    border: '1px solid var(--colors-border-primary)',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '48px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--colors-background-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--colors-background-primary)';
                  }}
                >
                  <Button
                    variant={example.variant}
                    size={example.size}
                    text={example.iconPosition === 'only' ? undefined : example.text}
                    icon={example.icon}
                    iconPosition={example.iconPosition}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Code Generation */}
        <div style={{
          backgroundColor: 'var(--colors-surface-secondary, #f5f5f5)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--colors-interactive-outline, #e0e0e0)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'sticky',
          top: 0
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h2 style={{
              fontSize: 'var(--typography-scales-heading-4-font-size)',
              fontWeight: 'var(--typography-scales-heading-4-font-weight)',
              color: 'var(--colors-text-primary)',
              margin: 0,
              textAlign: 'left'
            }}>
              💻 Generated Code
            </h2>
            <button
              onClick={() => {
                const fullCode = `import { Button } from '@components';\n\n${generateCode}`;
                navigator.clipboard.writeText(fullCode);
                // Visual feedback
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.style.backgroundColor = 'var(--colors-interactive-success, #28a745)';
                setTimeout(() => {
                  button.textContent = originalText;
                  button.style.backgroundColor = 'var(--colors-interactive-accent, #F09)';
                }, 1000);
              }}
              style={{
                padding: '10px 16px',
                backgroundColor: 'var(--colors-interactive-accent, #F09)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📋 Copy All
            </button>
          </div>

          {/* Import Statement */}
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: 'var(--colors-surface-primary, #ffffff)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--colors-interactive-outline, #e0e0e0)'
          }}>
            <div style={{
              fontSize: 'var(--typography-scales-body-xs-font-size)',
              color: 'var(--colors-text-secondary)',
              marginBottom: '8px'
            }}>
              Import statement:
            </div>
            <div style={{
              fontFamily: 'Monaco, Consolas, monospace',
              fontSize: 'var(--typography-scales-body-xs-font-size)',
              color: 'var(--colors-text-primary)',
              backgroundColor: 'var(--colors-surface-tertiary, #e0e0e0)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)'
            }}>
              import &#123; Button &#125; from '@components';
            </div>
          </div>

          {/* Generated Component Code */}
          <div style={{
            backgroundColor: 'var(--colors-surface-primary, #ffffff)',
            padding: '20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--colors-interactive-outline, #e0e0e0)',
            fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '14px',
            lineHeight: 1.5,
            color: 'var(--colors-text-primary)',
            overflow: 'auto',
            flex: 1,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {generateCode}
          </div>
        </div>

      </div>
    </div>
  );
};

// Helper Components
const FormSection = ({ title, children }) => (
  <div>
    <div style={{
      fontSize: 'var(--typography-scales-body-sm-font-size)',
      fontWeight: '600',
      color: 'var(--colors-text-primary)',
      marginBottom: '8px'
    }}>
      {title}
    </div>
    {children}
  </div>
);



export default ButtonDocumentation;
