/**
 * Button Icon Optimization Matrix
 * Visual matrix for optimizing icon size and stroke weight combinations with button sizes
 */

import React, { useState } from 'react';
import { Button } from '../components/index.js';

const ButtonIconMatrix = () => {
  const [selectedIcon, setSelectedIcon] = useState('lock');
  const [showAllVariants, setShowAllVariants] = useState(false);
  
  const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const strokeWeights = [1, 1.5, 2, 2.5, 3];
  const buttonVariants = ['primary', 'secondary', 'outline', 'ghost'];
  
  const iconOptions = [
    'lock', 'user', 'settings', 'search', 'edit', 'check', 'plus', 'home'
  ];

  // Helper to get current button typography info
  const getButtonTypographyInfo = (size) => {
    const info = {
      xs: { fontSize: 'body-sm', fontWeight: 'medium', padding: 'xs/sm' },
      sm: { fontSize: 'body', fontWeight: 'medium', padding: 'sm/md' },
      md: { fontSize: 'body', fontWeight: 'medium', padding: 'sm/xl' },
      lg: { fontSize: 'body', fontWeight: 'medium', padding: 'lg/xl' },
      xl: { fontSize: 'heading-5', fontWeight: 'medium', padding: 'lg/3xl' }
    };
    return info[size] || info.md;
  };

  return (
    <div style={{
      padding: 'var(--spacing-2xl)',
      fontFamily: 'var(--typography-font-family-primary)',
      backgroundColor: 'var(--colors-background-primary)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h1 style={{
            fontSize: 'var(--typography-scales-heading-2-font-size)',
            fontWeight: 'var(--typography-scales-heading-2-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Button Icon Optimization Matrix
          </h1>
          <p style={{
            fontSize: 'var(--typography-scales-body-font-size)',
            color: 'var(--colors-text-secondary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Visual optimization tool for icon size and stroke weight combinations across button sizes.
          </p>

          {/* Controls */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-lg)',
            alignItems: 'center',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            <div>
              <label style={{
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)',
                marginRight: 'var(--spacing-sm)'
              }}>
                Icon:
              </label>
              <select 
                value={selectedIcon}
                onChange={(e) => setSelectedIcon(e.target.value)}
                style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--colors-border-primary)',
                  backgroundColor: 'var(--colors-background-primary)',
                  color: 'var(--colors-text-primary)'
                }}
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-xs)',
              fontSize: 'var(--typography-scales-body-sm-font-size)',
              color: 'var(--colors-text-primary)'
            }}>
              <input 
                type="checkbox"
                checked={showAllVariants}
                onChange={(e) => setShowAllVariants(e.target.checked)}
              />
              Show all button variants
            </label>
          </div>
        </div>

        {/* Button Size Typography Reference */}
        <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Button Typography Reference
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {buttonSizes.map(size => {
              const typography = getButtonTypographyInfo(size);
              return (
                <div key={size} style={{
                  textAlign: 'center',
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--colors-background-primary)',
                  borderRadius: 'var(--radius-sm)'
                }}>
                  <div style={{
                    fontSize: 'var(--typography-scales-body-sm-font-size)',
                    fontWeight: 'var(--typography-font-weight-bold)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: 'var(--spacing-xs)'
                  }}>
                    {size.toUpperCase()}
                  </div>
                  <Button variant="primary" size={size} text={`Sample ${size}`} />
                  <div style={{
                    fontSize: 'var(--typography-scales-body-xs-font-size)',
                    color: 'var(--colors-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                    lineHeight: 1.4
                  }}>
                    Font: {typography.fontSize}<br/>
                    Weight: {typography.fontWeight}<br/>
                    Padding: {typography.padding}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Icon Size Matrix for Each Button Size */}
        {buttonSizes.map(buttonSize => (
          <section key={buttonSize} style={{ marginBottom: 'var(--spacing-4xl)' }}>
            <h2 style={{
              fontSize: 'var(--typography-scales-heading-4-font-size)',
              fontWeight: 'var(--typography-scales-heading-4-font-weight)',
              color: 'var(--colors-text-primary)',
              marginBottom: 'var(--spacing-lg)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Button Size: {buttonSize}
            </h2>

            {/* Icon Sizes for this Button Size */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{
                fontSize: 'var(--typography-scales-heading-6-font-size)',
                fontWeight: 'var(--typography-scales-heading-6-font-weight)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Icon Size Variations
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${iconSizes.length}, 1fr)`,
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--colors-background-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                {iconSizes.map(iconSize => (
                  <div key={iconSize} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 'var(--typography-scales-body-sm-font-size)',
                      fontWeight: 'var(--typography-font-weight-medium)',
                      color: 'var(--colors-text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Icon: {iconSize}
                    </div>
                    <Button 
                      variant="primary"
                      size={buttonSize}
                      icon={selectedIcon}
                      iconSize={iconSize}
                      text={`${buttonSize}/${iconSize}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Stroke Weight Variations */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{
                fontSize: 'var(--typography-scales-heading-6-font-size)',
                fontWeight: 'var(--typography-scales-heading-6-font-weight)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Stroke Weight Variations (with md icon size)
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${strokeWeights.length}, 1fr)`,
                gap: 'var(--spacing-sm)',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--colors-background-secondary)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                {strokeWeights.map(weight => (
                  <div key={weight} style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 'var(--typography-scales-body-sm-font-size)',
                      fontWeight: 'var(--typography-font-weight-medium)',
                      color: 'var(--colors-text-primary)',
                      marginBottom: 'var(--spacing-sm)'
                    }}>
                      Weight: {weight}
                    </div>
                    <Button 
                      variant="primary"
                      size={buttonSize}
                      icon={selectedIcon}
                      iconSize="md"
                      strokeWeight={weight}
                      text={`${buttonSize}/w${weight}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* All Button Variants (if enabled) */}
            {showAllVariants && (
              <div>
                <h3 style={{
                  fontSize: 'var(--typography-scales-heading-6-font-size)',
                  fontWeight: 'var(--typography-scales-heading-6-font-weight)',
                  color: 'var(--colors-text-primary)',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  All Button Variants (md icon, 1.5 stroke)
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${buttonVariants.length}, 1fr)`,
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-lg)',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--radius-md)'
                }}>
                  {buttonVariants.map(variant => (
                    <div key={variant} style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: 'var(--typography-scales-body-sm-font-size)',
                        fontWeight: 'var(--typography-font-weight-medium)',
                        color: 'var(--colors-text-primary)',
                        marginBottom: 'var(--spacing-sm)'
                      }}>
                        {variant}
                      </div>
                      <Button 
                        variant={variant}
                        size={buttonSize}
                        icon={selectedIcon}
                        iconSize="md"
                        strokeWeight={1.5}
                        text={`${variant} ${buttonSize}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}

        {/* Recommendations Section */}
        <section style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--colors-border-primary)'
        }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Optimization Guidelines
          </h2>
          
          <div style={{
            fontSize: 'var(--typography-scales-body-font-size)',
            color: 'var(--colors-text-secondary)',
            lineHeight: 1.6
          }}>
            <p style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>Icon Size Recommendations:</strong>
            </p>
            <ul style={{ marginBottom: 'var(--spacing-md)', paddingLeft: 'var(--spacing-lg)' }}>
              <li>XS/SM buttons: Consider xs or sm icons to avoid overwhelming small buttons</li>
              <li>MD buttons: sm or md icons typically work best</li>
              <li>LG/XL buttons: md or lg icons provide good balance</li>
            </ul>
            
            <p style={{ marginBottom: 'var(--spacing-sm)' }}>
              <strong>Stroke Weight Guidelines:</strong>
            </p>
            <ul style={{ marginBottom: 'var(--spacing-md)', paddingLeft: 'var(--spacing-lg)' }}>
              <li>Lighter strokes (1-1.5) for subtle, secondary actions</li>
              <li>Medium strokes (1.5-2) for standard UI elements</li>
              <li>Heavier strokes (2-3) for primary actions or emphasis</li>
            </ul>
            
            <p style={{ margin: 0 }}>
              <strong>Visual Harmony:</strong> Icon weight should complement button text weight and size for consistent visual hierarchy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ButtonIconMatrix;
