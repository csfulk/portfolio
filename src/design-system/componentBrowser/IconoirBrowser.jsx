/**
 * Iconoir Icon Browser
 * Searchable, categorized browser for all 1,300+ Iconoir icons
 */

import React, { useState, useMemo } from 'react';
import * as Iconoir from 'iconoir-react';

// Simple test component first
const SimpleTest = () => {
  console.log('SimpleTest rendering...');
  console.log('Iconoir keys:', Object.keys(Iconoir).slice(0, 5));
  
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'black' }}>Icon Browser Test</h1>
      <p style={{ color: 'black' }}>Testing Iconoir import...</p>
      
      {/* Test basic icons */}
      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        {Iconoir.Lock && <Iconoir.Lock width={24} height={24} style={{ color: 'black' }} />}
        {Iconoir.User && <Iconoir.User width={24} height={24} style={{ color: 'black' }} />}
        {Iconoir.Settings && <Iconoir.Settings width={24} height={24} style={{ color: 'black' }} />}
      </div>
      
      <p style={{ color: 'black' }}>Icons found: {Object.keys(Iconoir).length}</p>
      <p style={{ color: 'black' }}>Sample icons: {Object.keys(Iconoir).slice(0, 10).join(', ')}</p>
    </div>
  );
};

const IconoirBrowserFull = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('lg');
  const [selectedStroke, setSelectedStroke] = useState(1.5);
  const [copiedIcon, setCopiedIcon] = useState('');

  // Get all available Iconoir icons
  const allIcons = useMemo(() => {
    const icons = Object.keys(Iconoir)
      .filter(key => {
        // Filter out non-icon exports
        const isNotDefault = key !== 'default';
        const isNotPrivate = !key.startsWith('_');
        const isPascalCase = key.charAt(0) === key.charAt(0).toUpperCase();
        const isNotProvider = key !== 'IconoirProvider';
        const hasComponent = Iconoir[key] && typeof Iconoir[key] === 'object';
        
        return isNotDefault && isNotPrivate && isPascalCase && isNotProvider && hasComponent;
      })
      .sort();
    
    console.log('Iconoir object keys sample:', Object.keys(Iconoir).slice(0, 20));
    console.log('Found Iconoir icons:', icons.length, icons.slice(0, 10));
    console.log('Lock component type:', typeof Iconoir.Lock, Iconoir.Lock);
    
    return icons;
  }, []);

  // Categorize icons based on common patterns
  const categorizeIcon = (iconName) => {
    const name = iconName.toLowerCase();
    
    if (name.includes('nav') || name.includes('arrow') || name.includes('chevron')) return 'Navigation';
    if (name.includes('user') || name.includes('profile') || name.includes('account')) return 'User';
    if (name.includes('file') || name.includes('folder') || name.includes('document')) return 'Files';
    if (name.includes('media') || name.includes('play') || name.includes('pause') || name.includes('video') || name.includes('audio')) return 'Media';
    if (name.includes('social') || name.includes('share') || name.includes('like') || name.includes('heart')) return 'Social';
    if (name.includes('device') || name.includes('phone') || name.includes('computer') || name.includes('desktop')) return 'Devices';
    if (name.includes('edit') || name.includes('pen') || name.includes('pencil') || name.includes('brush')) return 'Edit';
    if (name.includes('time') || name.includes('clock') || name.includes('calendar') || name.includes('date')) return 'Time';
    if (name.includes('location') || name.includes('map') || name.includes('pin') || name.includes('place')) return 'Location';
    if (name.includes('shopping') || name.includes('cart') || name.includes('bag') || name.includes('store')) return 'Shopping';
    if (name.includes('weather') || name.includes('sun') || name.includes('cloud') || name.includes('rain')) return 'Weather';
    if (name.includes('transport') || name.includes('car') || name.includes('plane') || name.includes('train')) return 'Transport';
    if (name.includes('health') || name.includes('medical') || name.includes('hospital')) return 'Health';
    if (name.includes('security') || name.includes('lock') || name.includes('key') || name.includes('shield')) return 'Security';
    if (name.includes('settings') || name.includes('gear') || name.includes('config') || name.includes('tool')) return 'Settings';
    if (name.includes('communication') || name.includes('message') || name.includes('mail') || name.includes('chat')) return 'Communication';
    
    return 'General';
  };

  // Group icons by category
  const iconsByCategory = useMemo(() => {
    const grouped = {};
    allIcons.forEach(icon => {
      const category = categorizeIcon(icon);
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(icon);
    });
    return grouped;
  }, [allIcons]);

  // Get available categories
  const categories = useMemo(() => {
    return ['all', ...Object.keys(iconsByCategory).sort()];
  }, [iconsByCategory]);

  // Filter icons based on search and category
  const filteredIcons = useMemo(() => {
    let icons = selectedCategory === 'all' ? allIcons : iconsByCategory[selectedCategory] || [];
    
    if (searchQuery) {
      icons = icons.filter(icon =>
        icon.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log('Search query:', searchQuery, 'Found icons:', icons.length, icons.slice(0, 5)); // Debug log
    }
    
    console.log('Filtered icons count:', icons.length); // Debug log
    return icons;
  }, [allIcons, iconsByCategory, selectedCategory, searchQuery]);

  // Copy icon name to clipboard
  const copyIconName = (iconName) => {
    navigator.clipboard.writeText(iconName);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(''), 2000);
  };

  return (
    <div style={{
      padding: 'var(--spacing-xl)',
      fontFamily: 'var(--typography-font-family-primary)',
      backgroundColor: 'var(--colors-background-primary)',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{
            fontSize: 'var(--typography-scales-heading-1-font-size)',
            fontWeight: 'var(--typography-scales-heading-1-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-md)'
          }}>
            Iconoir Icon Browser
          </h1>
          <p style={{
            fontSize: 'var(--typography-scales-body-font-size)',
            color: 'var(--colors-text-secondary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Browse and search through {allIcons.length} Iconoir icons. Click any icon to copy its name.
          </p>

          {/* Controls */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            
            {/* Search */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Search Icons
              </label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  color: 'var(--colors-text-primary)',
                  backgroundColor: 'var(--colors-background-primary)',
                  border: '1px solid var(--colors-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  color: 'var(--colors-text-primary)',
                  backgroundColor: 'var(--colors-background-primary)',
                  border: '1px solid var(--colors-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none'
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? `All (${allIcons.length})` : `${category} (${iconsByCategory[category]?.length || 0})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Size Control */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Icon Size
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  color: 'var(--colors-text-primary)',
                  backgroundColor: 'var(--colors-background-primary)',
                  border: '1px solid var(--colors-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none'
                }}
              >
                <option value="xs">XS</option>
                <option value="sm">SM</option>
                <option value="md">MD</option>
                <option value="lg">LG</option>
                <option value="xl">XL</option>
              </select>
            </div>

            {/* Stroke Weight */}
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontWeight: 'var(--typography-font-weight-medium)',
                color: 'var(--colors-text-primary)',
                marginBottom: 'var(--spacing-xs)'
              }}>
                Stroke Weight
              </label>
              <select
                value={selectedStroke}
                onChange={(e) => setSelectedStroke(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-scales-body-font-size)',
                  color: 'var(--colors-text-primary)',
                  backgroundColor: 'var(--colors-background-primary)',
                  border: '1px solid var(--colors-border-primary)',
                  borderRadius: 'var(--radius-md)',
                  outline: 'none'
                }}
              >
                <option value={1}>1.0</option>
                <option value={1.5}>1.5</option>
                <option value={2}>2.0</option>
                <option value={2.5}>2.5</option>
                <option value={3}>3.0</option>
              </select>
            </div>

          </div>

          {/* Results Count & Debug */}
          <div style={{
            fontSize: 'var(--typography-scales-body-sm-font-size)',
            color: 'var(--colors-text-secondary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            <div>
              Showing {filteredIcons.length} icons
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
            </div>
            <div style={{ fontSize: '12px', marginTop: '4px', color: 'var(--colors-text-tertiary)' }}>
              Total available: {allIcons.length} icons | Categories: {categories.length}
            </div>
          </div>
        </div>

        {/* Icon Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 'var(--spacing-md)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          {filteredIcons.map(iconName => {
            const IconComponent = Iconoir[iconName];
            
            return (
              <div
                key={iconName}
                onClick={() => copyIconName(iconName)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'var(--transitions-hover)',
                  border: copiedIcon === iconName ? '2px solid var(--colors-accent-primary)' : '1px solid transparent',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--colors-background-tertiary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--colors-background-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Icon */}
                <div style={{
                  marginBottom: 'var(--spacing-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '48px',
                  width: '48px'
                }}>
                  {IconComponent ? (
                    <IconComponent
                      width={selectedSize === 'xs' ? 16 : selectedSize === 'sm' ? 20 : selectedSize === 'md' ? 24 : selectedSize === 'lg' ? 32 : 40}
                      height={selectedSize === 'xs' ? 16 : selectedSize === 'sm' ? 20 : selectedSize === 'md' ? 24 : selectedSize === 'lg' ? 32 : 40}
                      strokeWidth={selectedStroke}
                      style={{
                        color: 'var(--colors-text-primary)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: 'var(--colors-text-tertiary)',
                      borderRadius: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: 'var(--colors-background-primary)'
                    }}>
                      ?
                    </div>
                  )}
                </div>

                {/* Icon Name */}
                <div style={{
                  fontSize: 'var(--typography-scales-body-xs-font-size)',
                  fontWeight: 'var(--typography-font-weight-medium)',
                  color: 'var(--colors-text-primary)',
                  textAlign: 'center',
                  wordBreak: 'break-word',
                  lineHeight: 1.3
                }}>
                  {iconName}
                </div>

                {/* Category Badge */}
                <div style={{
                  fontSize: 'var(--typography-scales-body-xs-font-size)',
                  color: 'var(--colors-text-tertiary)',
                  backgroundColor: 'var(--colors-background-primary)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-sm)',
                  marginTop: 'var(--spacing-xs)'
                }}>
                  {categorizeIcon(iconName)}
                </div>

                {/* Copy Feedback */}
                {copiedIcon === iconName && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    fontSize: 'var(--typography-scales-body-xs-font-size)',
                    color: 'var(--colors-accent-primary)',
                    fontWeight: 'var(--typography-font-weight-bold)'
                  }}>
                    ✓ Copied!
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Usage Examples */}
        <div style={{
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--radius-lg)',
          marginTop: 'var(--spacing-2xl)'
        }}>
          <h2 style={{
            fontSize: 'var(--typography-scales-heading-3-font-size)',
            fontWeight: 'var(--typography-scales-heading-3-font-weight)',
            color: 'var(--colors-text-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Usage Examples
          </h2>
          
          <div style={{
            display: 'grid',
            gap: 'var(--spacing-md)'
          }}>
            <div>
              <strong>Using Our Icon Component (Recommended):</strong>
              <code style={{
                display: 'block',
                backgroundColor: 'var(--colors-background-primary)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontFamily: 'monospace',
                marginTop: 'var(--spacing-xs)'
              }}>
                &lt;Icon name="Lock" /&gt;
              </code>
            </div>
            
            <div>
              <strong>Direct Iconoir Component:</strong>
              <code style={{
                display: 'block',
                backgroundColor: 'var(--colors-background-primary)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontFamily: 'monospace',
                marginTop: 'var(--spacing-xs)'
              }}>
                import {'{Lock}'} from 'iconoir-react';<br/>
                &lt;Lock strokeWidth={'{2.5}'} /&gt;
              </code>
            </div>
            
            <div>
              <strong>In Button (Auto-Optimized):</strong>
              <code style={{
                display: 'block',
                backgroundColor: 'var(--colors-background-primary)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                fontFamily: 'monospace',
                marginTop: 'var(--spacing-xs)'
              }}>
                &lt;Button icon="User" text="Profile" /&gt;
              </code>
            </div>
            
            <div>
              <strong>Note:</strong>
              <div style={{
                backgroundColor: 'var(--colors-background-primary)',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--typography-scales-body-sm-font-size)',
                marginTop: 'var(--spacing-xs)',
                color: 'var(--colors-text-secondary)'
              }}>
                Click any icon above to copy its exact Iconoir name. Use these names directly with our Icon component or import them from 'iconoir-react' for direct usage.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Export simple test first to debug
const IconoirBrowser = () => {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightblue',
      minHeight: '100vh',
      color: 'black'
    }}>
      <h1>Basic Test Page</h1>
      <p>This should show up if routing works</p>
      <SimpleTest />
    </div>
  );
};

export default IconoirBrowser;
