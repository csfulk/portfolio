import React, { useEffect, useRef } from 'react';
import '../styles/modal.css';

const Modal = ({ children, onClose, onTransitionEnd }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    // Disable scrolling on both <html> and <body>
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    containerRef.current?.focus();

    return () => {
      // Restore original overflow styles when the modal is closed
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={onTransitionEnd}
      >
        <button
          type="button"
          className="modal-close"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
        {console.log('Modal Children:', children)}
        {children}
      </div>
    </div>
  );
};

export default Modal;