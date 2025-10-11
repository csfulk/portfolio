/**
 * Stroke Weight Test Component
 * Direct test of Iconoir stroke weight functionality
 */

import React from 'react';
import * as Iconoir from 'iconoir-react';
import { Icon } from '../components/index.js';

const StrokeWeightTest = () => {
  const strokeWeights = [1, 1.5, 2, 2.5, 3];
  
  return (
    <div style={{
      padding: 'var(--spacing-2xl)',
      fontFamily: 'var(--typography-font-family-primary)',
      backgroundColor: 'var(--colors-background-primary)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <h1 style={{
          fontSize: 'var(--typography-scales-heading-2-font-size)',
          fontWeight: 'var(--typography-scales-heading-2-font-weight)',
          color: 'var(--colors-text-primary)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          Stroke Weight Debug Test
        </h1>

        {/* Direct Iconoir Component Test */}
        <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Direct Iconoir Components (Lock Icon)
          </h2>
          
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
                <div style={{
                  fontSize: 'var(--typography-scales-body-sm-font-size)',
                  fontWeight: 'var(--typography-font-weight-medium)',
                  color: 'var(--colors-text-primary)'
                }}>
                  strokeWidth: {weight}
                </div>
                <Iconoir.Lock
                  width={32}
                  height={32}
                  strokeWidth={weight}
                  style={{ color: 'var(--colors-text-primary)' }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Our Icon Component Test */}
        <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Our Icon Component (Lock Icon)
          </h2>
          
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
                <div style={{
                  fontSize: 'var(--typography-scales-body-sm-font-size)',
                  fontWeight: 'var(--typography-font-weight-medium)',
                  color: 'var(--colors-text-primary)'
                }}>
                  strokeWidth: {weight}
                </div>
                <Icon
                  name="lock"
                  size="lg"
                  strokeWidth={weight}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Different Icons Test */}
        <section>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Various Icons at Different Stroke Weights
          </h2>
          
          {['lock', 'user', 'settings', 'search', 'edit'].map(iconName => (
            <div key={iconName} style={{ marginBottom: 'var(--spacing-lg)' }}>
              <h3 style={{
                fontSize: 'var(--typography-scales-body-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-md)'
              }}>
                Icon: {iconName}
              </h3>
              
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-lg)',
                alignItems: 'center',
                padding: 'var(--spacing-md)',
                backgroundColor: 'var(--colors-background-secondary)',
                borderRadius: 'var(--radius-sm)'
              }}>
                {strokeWeights.map(weight => (
                  <div key={weight} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)'
                  }}>
                    <span style={{
                      fontSize: 'var(--typography-scales-body-xs-font-size)',
                      color: 'var(--colors-text-secondary)'
                    }}>
                      {weight}
                    </span>
                    <Icon
                      name={iconName}
                      size="md"
                      strokeWidth={weight}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

      </div>
    </div>
  );
};

export default StrokeWeightTest;
