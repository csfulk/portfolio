/**
 * System Documentation
 * Comprehensive documentation showing how the design system works
 * Consolidates: IconDefaultsTest, ButtonIconMatrix, StrokeWeightTest
 */

import React, { useState } from 'react';
import { Button, Icon } from '../components/index.js';

const SystemDocumentation = () => {
  const [activeSection, setActiveSection] = useState('optimization');

  const sections = [
    { id: 'optimization', title: 'Automatic Optimization', icon: '⚡' },
    { id: 'combinations', title: 'Button-Icon Combinations', icon: '🎯' },
    { id: 'stroke-weights', title: 'Stroke Weight Reference', icon: '🎨' }
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'optimization':
        return <AutomaticOptimizationSection />;
      case 'combinations':
        return <ButtonIconCombinationsSection />;
      case 'stroke-weights':
        return <StrokeWeightReferenceSection />;
      default:
        return <AutomaticOptimizationSection />;
    }
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
            Design System Documentation
          </h1>
          <p style={{
            fontSize: 'var(--typography-scales-body-font-size)',
            color: 'var(--colors-text-secondary)',
            marginBottom: 'var(--spacing-lg)',
            lineHeight: 1.6
          }}>
            Comprehensive guide to how the design system works, including automatic optimizations, 
            visual combinations, and technical references for developers.
          </p>
        </div>

        {/* Section Navigation */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-3xl)',
          borderBottom: '2px solid var(--colors-border-primary)',
          paddingBottom: 'var(--spacing-lg)'
        }}>
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: 'var(--spacing-md) var(--spacing-xl)',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: activeSection === section.id 
                  ? 'var(--colors-interactive-primary)' 
                  : 'var(--colors-surface-secondary)',
                color: activeSection === section.id 
                  ? 'white' 
                  : 'var(--colors-text-primary)',
                fontSize: 'var(--typography-scales-body-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              <span>{section.icon}</span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Section Content */}
        {renderSection()}
      </div>
    </div>
  );
};

// Section 1: Automatic Optimization (from IconDefaultsTest)
const AutomaticOptimizationSection = () => {
  const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const testIcon = 'settings';

  // Optimized defaults for reference
  const iconDefaults = {
    xs: { size: 'md', strokeWeight: 2 },
    sm: { size: 'lg', strokeWeight: 2.25 },
    md: { size: 'lg', strokeWeight: 2.25 },
    lg: { size: 'xl', strokeWeight: 2.25 },
    xl: { size: 'xl', strokeWeight: 2.5 }
  };

  return (
    <div>
      <h2 style={{
        fontSize: 'var(--typography-scales-heading-3-font-size)',
        fontWeight: 'var(--typography-scales-heading-3-font-weight)',
        color: 'var(--colors-text-primary)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        ⚡ Automatic Icon Optimization
      </h2>
      
      <p style={{
        fontSize: 'var(--typography-scales-body-font-size)',
        color: 'var(--colors-text-secondary)',
        marginBottom: 'var(--spacing-xl)',
        lineHeight: 1.6
      }}>
        The design system automatically optimizes icon size and stroke weight for each button size, 
        creating perfect visual harmony without manual configuration.
      </p>

      {/* Smart Defaults Info */}
      <div style={{
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--colors-surface-secondary)',
        borderRadius: 'var(--radius-md)',
        marginBottom: 'var(--spacing-xl)',
        borderLeft: '4px solid var(--colors-accent-primary)'
      }}>
        <p style={{
          fontSize: 'var(--typography-scales-body-sm-font-size)',
          color: 'var(--colors-text-primary)',
          margin: 0,
          lineHeight: 1.5
        }}>
          <strong>✨ Smart Defaults:</strong> xs→md/2.0, sm→lg/2.25, md→lg/2.25, lg→xl/2.25, xl→xl/2.5
        </p>
      </div>

      {/* Automatic Optimization Demo */}
      <div style={{
        marginBottom: 'var(--spacing-3xl)'
      }}>
        <h3 style={{
          fontSize: 'var(--typography-scales-heading-4-font-size)',
          fontWeight: 'var(--typography-scales-heading-4-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          ✨ Automatic Optimization (No Props Needed)
        </h3>
        
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xl)',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          {buttonSizes.map(size => (
            <div key={size} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <div style={{
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {size}
              </div>
              <Button 
                variant="primary"
                size={size}
                icon={testIcon}
                text={`Button ${size}`}
              />
              <div style={{
                fontSize: 'var(--typography-scales-body-xs-font-size)',
                color: 'var(--colors-text-tertiary)',
                textAlign: 'center',
                lineHeight: 1.3
              }}>
                {iconDefaults[size].size} / {iconDefaults[size].strokeWeight} (auto)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Override Example */}
      <div style={{
        marginBottom: 'var(--spacing-3xl)'
      }}>
        <h3 style={{
          fontSize: 'var(--typography-scales-heading-4-font-size)',
          fontWeight: 'var(--typography-scales-heading-4-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          🎛️ Manual Override (When Needed)
        </h3>
        
        <p style={{
          fontSize: 'var(--typography-scales-body-font-size)',
          color: 'var(--colors-text-secondary)',
          marginBottom: 'var(--spacing-lg)',
          lineHeight: 1.6
        }}>
          When you need to override the automatic defaults, you can specify custom iconSize and strokeWeight props:
        </p>

        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xl)',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--radius-lg)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <div style={{
              fontSize: 'var(--typography-scales-body-sm-font-size)',
              fontWeight: 'var(--typography-font-weight-medium)',
              color: 'var(--colors-text-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              Auto Defaults
            </div>
            <Button 
              variant="primary"
              size="md"
              icon={testIcon}
              text="Auto Optimized"
            />
            <div style={{
              fontSize: 'var(--typography-scales-body-xs-font-size)',
              color: 'var(--colors-text-tertiary)',
              textAlign: 'center',
              lineHeight: 1.3
            }}>
              lg / 2.25 (auto)
            </div>
          </div>

          <div style={{
            fontSize: '24px',
            color: 'var(--colors-text-tertiary)',
            fontWeight: 'bold'
          }}>
            →
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <div style={{
              fontSize: 'var(--typography-scales-body-sm-font-size)',
              fontWeight: 'var(--typography-font-weight-medium)',
              color: 'var(--colors-text-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              Manual Override
            </div>
            <Button 
              variant="primary"
              size="md"
              icon={testIcon}
              iconSize="xs"
              strokeWeight={3}
              text="Custom Icon"
            />
            <div style={{
              fontSize: 'var(--typography-scales-body-xs-font-size)',
              color: 'var(--colors-text-tertiary)',
              textAlign: 'center',
              lineHeight: 1.3
            }}>
              xs / 3.0 (manual)
            </div>
          </div>
        </div>

        {/* Code Example */}
        <div style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--colors-background-tertiary, #f8f9fa)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--colors-border-primary)',
          fontFamily: 'monospace',
          fontSize: 'var(--typography-scales-body-sm-font-size)'
        }}>
          <div style={{ color: 'var(--colors-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
            // Automatic optimization (recommended)
          </div>
          <div style={{ color: 'var(--colors-text-primary)' }}>
            {'<Button variant="primary" size="md" icon="settings" text="Auto" />'}
          </div>
          <div style={{ color: 'var(--colors-text-secondary)', marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-xs)' }}>
            // Manual override (when needed)
          </div>
          <div style={{ color: 'var(--colors-text-primary)' }}>
            {'<Button variant="primary" size="md" icon="settings" iconSize="xs" strokeWeight={3} text="Custom" />'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Section 2: Button-Icon Combinations (from ButtonIconMatrix)
const ButtonIconCombinationsSection = () => {
  const [selectedIcon, setSelectedIcon] = useState('lock');
  
  const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const iconSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const strokeWeights = [1, 1.5, 2, 2.5, 3];
  
  const iconOptions = [
    'lock', 'user', 'settings', 'search', 'edit', 'check', 'plus', 'home'
  ];

  return (
    <div>
      <h2 style={{
        fontSize: 'var(--typography-scales-heading-3-font-size)',
        fontWeight: 'var(--typography-scales-heading-3-font-weight)',
        color: 'var(--colors-text-primary)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        🎯 Button-Icon Combinations
      </h2>
      
      <p style={{
        fontSize: 'var(--typography-scales-body-font-size)',
        color: 'var(--colors-text-secondary)',
        marginBottom: 'var(--spacing-xl)',
        lineHeight: 1.6
      }}>
        Visual matrix for understanding how different icon sizes and stroke weights work with button sizes. 
        Use this reference when you need to manually override the automatic defaults.
      </p>

      {/* Icon Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'var(--colors-surface-secondary)',
        borderRadius: 'var(--radius-md)'
      }}>
        <span style={{
          fontSize: 'var(--typography-scales-body-font-size)',
          fontWeight: 'var(--typography-font-weight-medium)',
          color: 'var(--colors-text-primary)'
        }}>
          Test Icon:
        </span>
        {iconOptions.map(icon => (
          <button
            key={icon}
            onClick={() => setSelectedIcon(icon)}
            style={{
              padding: 'var(--spacing-sm)',
              border: selectedIcon === icon ? '2px solid var(--colors-interactive-primary)' : '2px solid transparent',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--colors-surface-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name={icon} size="md" />
          </button>
        ))}
      </div>

      {/* Button Size Matrix */}
      {buttonSizes.map(buttonSize => (
        <div key={buttonSize} style={{ marginBottom: 'var(--spacing-4xl)' }}>
          <h3 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Button Size: {buttonSize}
          </h3>

          {/* Icon Sizes for this Button Size */}
          <div style={{ marginBottom: 'var(--spacing-xl)' }}>
            <h4 style={{
              fontSize: 'var(--typography-scales-heading-6-font-size)',
              fontWeight: 'var(--typography-scales-heading-6-font-weight)',
              color: 'var(--colors-text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Icon Size Variations
            </h4>
            
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
          <div>
            <h4 style={{
              fontSize: 'var(--typography-scales-heading-6-font-size)',
              fontWeight: 'var(--typography-scales-heading-6-font-weight)',
              color: 'var(--colors-text-primary)',
              marginBottom: 'var(--spacing-md)'
            }}>
              Stroke Weight Variations (with optimal icon size)
            </h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${strokeWeights.length}, 1fr)`,
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--colors-background-secondary)',
              borderRadius: 'var(--radius-md)'
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
                    strokeWeight={weight}
                    text={`${buttonSize}/${weight}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Optimization Guidelines */}
      <div style={{
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--colors-surface-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--colors-border-primary)'
      }}>
        <h3 style={{
          fontSize: 'var(--typography-scales-heading-4-font-size)',
          fontWeight: 'var(--typography-scales-heading-4-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          Optimization Guidelines
        </h3>
        
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
          <ul style={{ paddingLeft: 'var(--spacing-lg)' }}>
            <li>1.0-1.5: Light, minimal aesthetic</li>
            <li>2.0-2.25: Balanced, recommended for most cases</li>
            <li>2.5-3.0: Bold, high-emphasis actions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Section 3: Stroke Weight Reference (from StrokeWeightTest)
const StrokeWeightReferenceSection = () => {
  const strokeWeights = [1, 1.5, 2, 2.5, 3];
  
  return (
    <div>
      <h2 style={{
        fontSize: 'var(--typography-scales-heading-3-font-size)',
        fontWeight: 'var(--typography-scales-heading-3-font-weight)',
        color: 'var(--colors-text-primary)',
        marginBottom: 'var(--spacing-lg)'
      }}>
        🎨 Stroke Weight Reference
      </h2>
      
      <p style={{
        fontSize: 'var(--typography-scales-body-font-size)',
        color: 'var(--colors-text-secondary)',
        marginBottom: 'var(--spacing-xl)',
        lineHeight: 1.6
      }}>
        Technical reference showing how different stroke weights affect icon appearance. 
        Use this guide to understand the visual impact of stroke weight adjustments.
      </p>

      {/* Direct Icon Component Test */}
      <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h3 style={{
          fontSize: 'var(--typography-scales-heading-4-font-size)',
          fontWeight: 'var(--typography-scales-heading-4-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          Icon Component Stroke Weights
        </h3>
        
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xl)',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          {strokeWeights.map(weight => (
            <div key={weight} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Icon name="lock" size="xl" strokeWidth={weight} />
              <div style={{
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)'
              }}>
                {weight}
              </div>
              <div style={{
                fontSize: 'var(--typography-scales-body-xs-font-size)',
                color: 'var(--colors-text-secondary)',
                textAlign: 'center'
              }}>
                strokeWidth={weight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button Context */}
      <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
        <h3 style={{
          fontSize: 'var(--typography-scales-heading-4-font-size)',
          fontWeight: 'var(--typography-scales-heading-4-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          Stroke Weights in Button Context
        </h3>
        
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-xl)',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          {strokeWeights.map(weight => (
            <div key={weight} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <Button 
                variant="primary"
                size="md"
                icon="lock"
                strokeWeight={weight}
                text={`Weight ${weight}`}
              />
              <div style={{
                fontSize: 'var(--typography-scales-body-xs-font-size)',
                color: 'var(--colors-text-secondary)',
                textAlign: 'center'
              }}>
                strokeWeight={weight}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines */}
      <div style={{
        padding: 'var(--spacing-xl)',
        backgroundColor: 'var(--colors-surface-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--colors-border-primary)'
      }}>
        <h3 style={{
          fontSize: 'var(--typography-scales-heading-4-font-size)',
          fontWeight: 'var(--typography-scales-heading-4-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          Usage Guidelines
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--spacing-lg)'
        }}>
          {[
            { weight: '1.0', use: 'Minimal, delicate interfaces', context: 'Large icons, subtle accents' },
            { weight: '1.5', use: 'Light, clean aesthetic', context: 'Default for ghost buttons' },
            { weight: '2.0', use: 'Balanced, versatile', context: 'Most button contexts' },
            { weight: '2.5', use: 'Emphasized, bold', context: 'Primary actions, alerts' },
            { weight: '3.0', use: 'Maximum emphasis', context: 'Critical actions, warnings' }
          ].map(({ weight, use, context }) => (
            <div key={weight} style={{
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--colors-surface-primary)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--colors-border-primary)'
            }}>
              <div style={{
                fontSize: 'var(--typography-scales-body-font-size)',
                fontWeight: 'var(--typography-font-weight-semibold)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-sm)'
              }}>
                Weight {weight}
              </div>
              <div style={{
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                color: 'var(--colors-text-secondary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                {use}
              </div>
              <div style={{
                fontSize: 'var(--typography-scales-body-xs-font-size)',
                color: 'var(--colors-text-tertiary)',
                fontStyle: 'italic'
              }}>
                {context}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemDocumentation;