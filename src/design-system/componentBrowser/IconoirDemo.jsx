/**
 * Iconoir Integration Demo
 * Showcases the new Iconoir React integration with design system
 */

import React from 'react';
import { Button, Icon } from '../components/index.js';

const IconoirDemo = () => {
  const iconExamples = [
    'lock', 'unlock', 'down-arrow', 'up-arrow', 'close', 'menu', 
    'search', 'user', 'home', 'settings', 'check', 'plus', 'edit', 'delete'
  ];

  return (
    <div style={{
      padding: 'var(--spacing-2xl)',
      fontFamily: 'var(--typography-font-family-primary)',
      backgroundColor: 'var(--colors-background-primary)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h1 style={{
            fontSize: 'var(--typography-scales-heading-2-font-size)',
            fontWeight: 'var(--typography-scales-heading-2-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Iconoir React Integration
          </h1>
          <p style={{
            fontSize: 'var(--typography-scales-body-font-size)',
            color: 'var(--colors-text-secondary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            1,300+ icons with variable stroke weights and design system integration.
          </p>
        </div>

        {/* Icon Sizes Demo */}
        <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Icon Sizes
          </h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
              <div key={size} style={{ textAlign: 'center' }}>
                <Icon name="lock" size={size} />
                <div style={{ 
                  fontSize: 'var(--typography-scales-body-sm-font-size)',
                  color: 'var(--colors-text-secondary)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  {size}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stroke Weight Demo */}
        <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)', 
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Variable Stroke Weights
          </h2>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {[1, 1.5, 2, 2.5, 3].map(weight => (
              <div key={weight} style={{ textAlign: 'center' }}>
                <Icon name="lock" size="lg" strokeWidth={weight} />
                <div style={{ 
                  fontSize: 'var(--typography-scales-body-sm-font-size)',
                  color: 'var(--colors-text-secondary)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  {weight}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Icon Gallery */}
        <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Available Icons
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 'var(--spacing-xl)'
          }}>
            {iconExamples.map(iconName => (
              <div key={iconName} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--colors-background-primary)',
                border: '1px solid var(--colors-border-secondary)'
              }}>
                <Icon name={iconName} size="lg" />
                <div style={{
                  fontSize: 'var(--typography-scales-body-xs-font-size)',
                  color: 'var(--colors-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                  textAlign: 'center'
                }}>
                  {iconName}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Button Integration Demo */}
        <section style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-4-font-size)',
            fontWeight: 'var(--typography-scales-heading-4-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Button Integration
          </h2>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--radius-md)'
          }}>
            <Button variant="primary" icon="lock" text="Locked Content" />
            <Button variant="secondary" icon="user" text="Profile" />
            <Button variant="outline" icon="settings" text="Settings" />
            <Button variant="ghost" icon="search" text="Search" />
            <Button variant="text" icon="edit" text="Edit" />
          </div>
        </section>

      </div>
    </div>
  );
};

export default IconoirDemo;
