import React, { useState, useEffect, useRef } from 'react';

/**
 * Generic full-screen iframe viewer for self-contained HTML presentations
 * (e.g. exported Keynote decks). Unlike FigmaEmbedViewer, it does NOT crop the
 * bottom of the frame, so the full slide is always visible.
 *
 * Props:
 * - url (string): URL of the HTML presentation to embed
 * - title (string): Optional iframe title for accessibility
 * - onClose (function): Callback to close the modal
 */
const HtmlEmbedViewer = ({ url, title = 'Presentation', onClose }) => {
  const [contentVisible, setContentVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="html-embed-viewer project-viewer"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--colors-surface-overlay)',
        display: 'var(--display-flex)',
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
          src={url}
          allowFullScreen
          title={title}
        />
      </div>
    </div>
  );
};

export default HtmlEmbedViewer;
