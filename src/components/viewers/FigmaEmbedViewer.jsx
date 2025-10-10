import React, { useState, useEffect, useRef } from 'react';

const FigmaEmbedViewer = ({ embedUrl, onClose }) => {
  const [contentVisible, setContentVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="figma-embed-viewer project-viewer"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'var(--colors-surface-overlay)', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}
    >
      <button
        className="close-button"
        style={{ 
          position: 'absolute', 
          top: 'var(--spacing-xl)', 
          right: 'var(--spacing-3xl)', 
          fontSize: 'var(--typography-scales-heading-2-font-size)', 
          background: 'none', 
          border: 'none', 
          color: 'var(--colors-text-inverse)', 
          cursor: 'pointer', 
          zIndex: 'var(--z-index-tooltip)' 
        }}
        onClick={onClose}
        aria-label="Close dialog"
      >
        ×
      </button>
      <div
        className={`image-container${contentVisible ? ' visible' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: 'calc(100% + var(--spacing-6xl))', // Extra space to cover the bottom bar
            marginBottom: 'calc(-1 * var(--spacing-6xl))',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--colors-surface-modal)',
          }}
        >
          <iframe
            style={{
              background: 'var(--colors-surface-modal)',
              border: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              borderRadius: 'var(--radius-lg)',
            }}
            width="100%"
            height="100%"
            src={embedUrl}
            allowFullScreen
            title="Figma Embed"
          />
        </div>
      </div>
    </div>
  );
};

export default FigmaEmbedViewer;
