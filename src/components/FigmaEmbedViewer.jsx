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
      style={{ width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <button
        className="close-button"
        style={{ position: 'absolute', top: 24, right: 32, fontSize: 32, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', zIndex: 2 }}
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
            height: 'calc(100% + 50px)', // 50px extra to cover the bottom bar
            marginBottom: '-50px',
            overflow: 'hidden',
            borderRadius: 8,
            background: '#1D1D1D',
          }}
        >
          <iframe
            style={{
              background: '#1D1D1D',
              border: 0,
              width: '100%',
              height: '100%',
              display: 'block',
              borderRadius: 8,
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
