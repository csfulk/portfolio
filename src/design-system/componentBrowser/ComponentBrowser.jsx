/**
 * Component Browser - Main Navigation App
 * Design system development dashboard with sidebar navigation
 */

import React, { useState } from 'react';
import IconoirBrowser from './IconoirBrowserWorking.jsx';
import ButtonDocumentation from './ButtonDocumentation.jsx';
import SystemDocumentation from './SystemDocumentation.jsx';

const ComponentBrowser = () => {
  // Get initial demo from URL parameter
  const getInitialDemo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const demoParam = urlParams.get('demo');
    const validDemos = ['home', 'icons', 'docs', 'system', 'browse'];
    return validDemos.includes(demoParam) ? (demoParam === 'browse' ? 'icons' : demoParam) : 'home';
  };

  const [activeDemo, setActiveDemo] = useState(getInitialDemo);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Update URL when demo changes
  const handleDemoChange = (demoId) => {
    setActiveDemo(demoId);
    const url = new URL(window.location);
    if (demoId === 'home') {
      url.searchParams.delete('demo');
    } else {
      // Map internal IDs to URL parameters
      const urlMapping = {
        'icons': 'browse',
        'docs': 'docs',
        'system': 'system'
      };
      url.searchParams.set('demo', urlMapping[demoId] || demoId);
    }
    window.history.pushState({}, '', url);
  };

  const demos = [
    {
      id: 'home',
      title: 'Design System Overview',
      icon: '🏠',
      description: 'Welcome to the component browser'
    },
    {
      id: 'icons',
      title: 'Icon Library',
      icon: '🔍',
      description: 'Browse 1,600+ Iconoir icons'
    },
    {
      id: 'docs',
      title: 'Button Documentation',
      icon: '📚',
      description: 'Interactive button code generator'
    },
    {
      id: 'system',
      title: 'System Documentation',
      icon: '📖',
      description: 'How the design system works'
    }
  ];

  const renderContent = () => {
    switch (activeDemo) {
      case 'icons':
        return <IconoirBrowser />;
      case 'docs':
        return <ButtonDocumentation />;
      case 'system':
        return <SystemDocumentation />;
      default:
        return <HomePage onNavigate={handleDemoChange} />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      fontFamily: 'var(--typography-font-family-primary, Arial, sans-serif)',
      backgroundColor: 'var(--colors-background-primary, #ffffff)',
      color: 'var(--colors-text-primary, #000000)'
    }}>
      
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '280px' : '60px',
        backgroundColor: 'var(--colors-background-secondary, #f8f9fa)',
        borderRight: '1px solid var(--colors-border-primary, #e0e0e0)',
        transition: 'width 0.3s ease',
        position: 'relative',
        flexShrink: 0
      }}>
        
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid var(--colors-border-primary, #e0e0e0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {sidebarOpen && (
            <div>
              <h2 style={{
                margin: '0 0 4px 0',
                fontSize: '18px',
                fontWeight: '600',
                color: 'var(--colors-text-primary, #000000)'
              }}>
                Component Browser
              </h2>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: 'var(--colors-text-secondary, #666666)'
              }}>
                Design System Tools
              </p>
            </div>
          )}
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              color: 'var(--colors-text-secondary, #666666)',
              fontSize: '18px'
            }}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ padding: sidebarOpen ? '20px 0' : '20px 0 0 0' }}>
          {demos.map(demo => (
            <button
              key={demo.id}
              onClick={() => handleDemoChange(demo.id)}
              style={{
                width: '100%',
                padding: sidebarOpen ? '12px 20px' : '12px 15px',
                border: 'none',
                backgroundColor: activeDemo === demo.id ? 
                  'var(--colors-accent-primary, #007bff)' : 'transparent',
                color: activeDemo === demo.id ? 
                  'white' : 'var(--colors-text-primary, #000000)',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: sidebarOpen ? '12px' : '0',
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                transition: 'all 0.2s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                if (activeDemo !== demo.id) {
                  e.target.style.backgroundColor = 'var(--colors-background-tertiary, #f0f0f0)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeDemo !== demo.id) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{demo.icon}</span>
              {sidebarOpen && (
                <div>
                  <div style={{ fontWeight: '500' }}>{demo.title}</div>
                  <div style={{ 
                    fontSize: '11px', 
                    opacity: 0.8,
                    marginTop: '2px'
                  }}>
                    {demo.description}
                  </div>
                </div>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        overflow: 'auto'
      }}>
        {renderContent()}
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = ({ onNavigate }) => {
  return (
    <div style={{
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontSize: 'var(--typography-scales-heading-1-font-size, 2.5rem)',
          fontWeight: 'var(--typography-scales-heading-1-font-weight, 700)',
          color: 'var(--colors-text-primary, #000000)',
          marginBottom: '16px',
          margin: '0 0 16px 0'
        }}>
          Design System Component Browser
        </h1>
        
        <p style={{
          fontSize: 'var(--typography-scales-body-lg-font-size, 1.125rem)',
          color: 'var(--colors-text-secondary, #666666)',
          lineHeight: 1.6,
          margin: '0 0 32px 0'
        }}>
          Development tools for testing, optimizing, and browsing design system components.
          Built with Iconoir React library featuring 1,600+ icons with variable stroke weights.
        </p>
      </div>

      {/* Key Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        
        <FeatureCard
          icon="🔍"
          title="Icon Library Browser"
          description="Search and browse all 1,600+ Iconoir icons with real-time size and stroke weight controls. Click any icon to copy its name."
        />
        
        <FeatureCard
          icon="🎯"
          title="Button Optimization Matrix"
          description="Visual tool for optimizing icon-button combinations across all sizes. Test different icon sizes and stroke weights."
        />

        <FeatureCard
          icon="📚"
          title="Interactive Button Documentation"
          description="Complete button documentation with live controls, code generation, and copy-paste snippets for engineering teams."
        />
        
        <FeatureCard
          icon="⚡"
          title="Automatic Icon Defaults"
          description="Smart defaults that automatically optimize icon size and stroke weight based on button size for perfect visual harmony."
        />

      </div>

      {/* System Overview */}
      <div style={{
        backgroundColor: 'var(--colors-background-secondary, #f8f9fa)',
        padding: '32px',
        borderRadius: 'var(--radius-lg, 12px)',
        border: '1px solid var(--colors-border-primary, #e0e0e0)',
        marginBottom: '40px'
      }}>
        <h2 style={{
          fontSize: 'var(--typography-scales-heading-3-font-size, 1.5rem)',
          fontWeight: 'var(--typography-scales-heading-3-font-weight, 600)',
          color: 'var(--colors-text-primary, #000000)',
          marginBottom: '16px'
        }}>
          Icon System Overview
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <StatCard label="Available Icons" value="1,600+" />
          <StatCard label="Icon Sizes" value="5 Sizes" />
          <StatCard label="Stroke Weights" value="1.0 - 3.0" />
          <StatCard label="Button Sizes" value="5 Sizes" />
        </div>

        <div style={{
          fontSize: 'var(--typography-scales-body-sm-font-size, 0.875rem)',
          color: 'var(--colors-text-secondary, #666666)',
          lineHeight: 1.5
        }}>
          <strong>Optimized Defaults:</strong> xs→md/2.0, sm→lg/2.25, md→lg/2.25, lg→xl/2.25, xl→xl/2.5
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '16px'
      }}>
        
        <QuickActionCard
          title="Browse Icons"
          description="Search through the complete icon library"
          action="icons"
          onNavigate={onNavigate}
        />
        
        <QuickActionCard
          title="Button Documentation"
          description="Generate button code with interactive controls"
          action="docs"
          onNavigate={onNavigate}
        />

        <QuickActionCard
          title="System Documentation"
          description="Learn how the design system works"
          action="system"
          onNavigate={onNavigate}
        />

      </div>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, description }) => (
  <div style={{
    padding: '24px',
    backgroundColor: 'var(--colors-background-secondary, #f8f9fa)',
    borderRadius: 'var(--radius-md, 8px)',
    border: '1px solid var(--colors-border-primary, #e0e0e0)'
  }}>
    <div style={{ fontSize: '32px', marginBottom: '16px' }}>{icon}</div>
    <h3 style={{
      fontSize: 'var(--typography-scales-heading-5-font-size, 1.125rem)',
      fontWeight: 'var(--typography-scales-heading-5-font-weight, 600)',
      color: 'var(--colors-text-primary, #000000)',
      marginBottom: '8px'
    }}>
      {title}
    </h3>
    <p style={{
      fontSize: 'var(--typography-scales-body-sm-font-size, 0.875rem)',
      color: 'var(--colors-text-secondary, #666666)',
      lineHeight: 1.5,
      margin: 0
    }}>
      {description}
    </p>
  </div>
);

const StatCard = ({ label, value }) => (
  <div style={{
    padding: '16px',
    backgroundColor: 'var(--colors-background-primary, #ffffff)',
    borderRadius: 'var(--radius-sm, 6px)',
    border: '1px solid var(--colors-border-secondary, #d0d0d0)',
    textAlign: 'center'
  }}>
    <div style={{
      fontSize: 'var(--typography-scales-heading-4-font-size, 1.25rem)',
      fontWeight: 'var(--typography-scales-heading-4-font-weight, 700)',
      color: 'var(--colors-accent-primary, #007bff)',
      marginBottom: '4px'
    }}>
      {value}
    </div>
    <div style={{
      fontSize: 'var(--typography-scales-body-xs-font-size, 0.75rem)',
      color: 'var(--colors-text-secondary, #666666)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    }}>
      {label}
    </div>
  </div>
);

const QuickActionCard = ({ title, description, action, onNavigate }) => (
  <div style={{
    padding: '20px',
    backgroundColor: 'var(--colors-background-primary, #ffffff)',
    borderRadius: 'var(--radius-md, 8px)',
    border: '2px solid var(--colors-border-primary, #e0e0e0)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }}
  onMouseEnter={(e) => {
    e.target.style.borderColor = 'var(--colors-accent-primary, #007bff)';
    e.target.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.target.style.borderColor = 'var(--colors-border-primary, #e0e0e0)';
    e.target.style.transform = 'translateY(0)';
  }}
  onClick={() => onNavigate && onNavigate(action)}
  >
    <h4 style={{
      fontSize: 'var(--typography-scales-heading-6-font-size, 1rem)',
      fontWeight: 'var(--typography-scales-heading-6-font-weight, 600)',
      color: 'var(--colors-text-primary, #000000)',
      marginBottom: '8px'
    }}>
      {title}
    </h4>
    <p style={{
      fontSize: 'var(--typography-scales-body-sm-font-size, 0.875rem)',
      color: 'var(--colors-text-secondary, #666666)',
      margin: 0,
      lineHeight: 1.4
    }}>
      {description}
    </p>
  </div>
);

export default ComponentBrowser;
