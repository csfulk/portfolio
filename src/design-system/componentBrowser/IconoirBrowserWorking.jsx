/**
 * Iconoir Icon Browser - Working Version
 * Searchable browser for all Iconoir icons
 */

import React, { useState, useMemo } from 'react';
import * as Iconoir from 'iconoir-react';

const IconoirBrowser = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSize, setSelectedSize] = useState(24);

  // Get all available Iconoir icons
  const allIcons = useMemo(() => {
    try {
      const icons = Object.keys(Iconoir)
        .filter(key => {
          // Filter for actual icon components
          return key !== 'default' && 
                 key !== 'IconoirProvider' && 
                 !key.startsWith('_') &&
                 key.charAt(0) === key.charAt(0).toUpperCase() &&
                 Iconoir[key];
        })
        .sort();
      
      console.log('Found icons:', icons.length);
      return icons;
    } catch (error) {
      console.error('Error getting icons:', error);
      return [];
    }
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!searchQuery) return allIcons.slice(0, 100); // Show first 100 by default
    
    return allIcons
      .filter(icon => icon.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 50); // Limit search results
  }, [allIcons, searchQuery]);

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      minHeight: '100vh',
      color: 'black'
    }}>
      
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ color: 'black', marginBottom: '10px' }}>
          Iconoir Icon Browser ({allIcons.length} icons)
        </h1>
        
        {/* Search */}
        <input
          type="text"
          placeholder="Search icons... (e.g., lock, user, arrow)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '300px',
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        />
        
        {/* Size Control */}
        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(Number(e.target.value))}
          style={{
            padding: '8px',
            fontSize: '14px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value={16}>16px</option>
          <option value={20}>20px</option>
          <option value={24}>24px</option>
          <option value={32}>32px</option>
          <option value={48}>48px</option>
        </select>
        
        <p style={{ color: '#666', fontSize: '14px', margin: '10px 0' }}>
          Showing {filteredIcons.length} icons
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Icon Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '10px',
        marginBottom: '40px'
      }}>
        {filteredIcons.map(iconName => {
          const IconComponent = Iconoir[iconName];
          
          return (
            <div
              key={iconName}
              onClick={() => {
                navigator.clipboard.writeText(iconName);
                console.log(`Copied: ${iconName}`);
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                backgroundColor: '#fafafa',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e6f3ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fafafa';
              }}
            >
              {/* Icon */}
              <div style={{
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: `${selectedSize + 16}px`,
                width: `${selectedSize + 16}px`
              }}>
                {IconComponent ? (
                  <IconComponent
                    width={selectedSize}
                    height={selectedSize}
                    strokeWidth={1.5}
                    style={{ color: '#333' }}
                  />
                ) : (
                  <div style={{
                    width: selectedSize,
                    height: selectedSize,
                    backgroundColor: '#ddd',
                    borderRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px'
                  }}>
                    ?
                  </div>
                )}
              </div>

              {/* Icon Name */}
              <div style={{
                fontSize: '11px',
                color: '#666',
                textAlign: 'center',
                wordBreak: 'break-word',
                lineHeight: 1.2
              }}>
                {iconName}
              </div>
            </div>
          );
        })}
      </div>

      {/* Usage Examples */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <h3 style={{ color: 'black', marginBottom: '10px' }}>Usage Examples</h3>
        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#333' }}>
          <div style={{ marginBottom: '5px' }}>
            <strong>Import:</strong> import {'{ Lock }'} from 'iconoir-react';
          </div>
          <div style={{ marginBottom: '5px' }}>
            <strong>Use:</strong> {'<Lock width={24} height={24} strokeWidth={1.5} />'}
          </div>
          <div>
            <strong>With our Icon component:</strong> {'<Icon name="Lock" size="lg" strokeWidth={2} />'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconoirBrowser;
