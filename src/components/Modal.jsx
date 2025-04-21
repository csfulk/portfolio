import React, { useEffect } from 'react';
import '../styles/modal.css';

const Modal = ({ children, onClose }) => {
  useEffect(() => {
    // Disable scrolling on both <html> and <body>
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      // Restore original overflow styles when the modal is closed
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
    };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Remove or comment out the close button */}
        {/* <button className="modal-close" onClick={onClose}>
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;