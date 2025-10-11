/**
 * Icon Defaults Test Component
 * Displays buttons with optimized icon defaults vs manual overrides
 */

import React from 'react';
import { Button } from '../components/index.js';

const IconDefaultsTest = () => {
  const buttonSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  const testIcon = 'settings';

  // Your optimized defaults for reference
  const iconDefaults = {
    xs: { size: 'md', strokeWeight: 2 },
    sm: { size: 'lg', strokeWeight: 2.25 },
    md: { size: 'lg', strokeWeight: 2.25 },
    lg: { size: 'xl', strokeWeight: 2.25 },
    xl: { size: 'xl', strokeWeight: 2.5 }
  };

  return (
    <div style={{
      padding: 'var(--spacing-2xl)',
      fontFamily: 'var(--typography-font-family-primary)',
      backgroundColor: 'var(--colors-background-primary)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <h1 style={{
          fontSize: 'var(--typography-scales-heading-2-font-size)',
          fontWeight: 'var(--typography-scales-heading-2-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-lg)'
        }}>
          Automatic Icon Optimization
        </h1>
        
        <p style={{
          fontSize: 'var(--typography-scales-body-font-size)',
          color: 'var(--colors-text-secondary)',
          marginBottom: 'var(--spacing-lg)',
          lineHeight: 1.6
        }}>
          The design system automatically optimizes icon size and stroke weight for each button size, 
          creating perfect visual harmony without manual configuration.
        </p>

        <div style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-3xl)',
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

        {/* Optimized Defaults Section */}
        <section style={{ marginBottom: 'var(--spacing-4xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-3-font-size)',
            fontWeight: 'var(--typography-scales-heading-3-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            ✨ New: Automatic Optimization (No Props Needed)
          </h2>
          
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
                  Auto: {iconDefaults[size].size} / {iconDefaults[size].strokeWeight}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Manual Override Example */}
        <section style={{ marginBottom: 'var(--spacing-4xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-3-font-size)',
            fontWeight: 'var(--typography-scales-heading-3-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            � Manual Override Example
          </h2>
          
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
        </section>

        {/* All Variants with Optimized Icons */}
        <section>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-3-font-size)',
            fontWeight: 'var(--typography-scales-heading-3-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            🎨 All Button Variants (With Optimized Icons)
          </h2>
          
          {buttonSizes.map(size => (
            <div key={size} style={{ marginBottom: 'var(--spacing-xl)' }}>
              <h3 style={{
                fontSize: 'var(--typography-scales-heading-6-font-size)',
                fontWeight: 'var(--typography-scales-heading-6-font-weight)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-md)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Size: {size} (Auto: {iconDefaults[size].size} icon, {iconDefaults[size].strokeWeight} weight)
              </h3>
              
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-md)',
                alignItems: 'center',
                flexWrap: 'wrap',
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--colors-background-secondary)',
                borderRadius: 'var(--radius-md)'
              }}>
                {['primary', 'secondary', 'outline', 'ghost'].map(variant => (
                  <Button 
                    key={variant}
                    variant={variant}
                    size={size}
                    icon={testIcon}
                    text={`${variant} ${size}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default IconDefaultsTest;
