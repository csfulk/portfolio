/**
 * Privacy Details Modal Component
 * Detailed privacy information modal
 */

import React, { useEffect } from 'react';
import { Surface } from '../../design-system';
import './PrivacyDetailsModal.css';

const PrivacyDetailsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Handle escape key and focus management
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="privacy-modal" onClick={handleBackdropClick}>
      <div className="privacy-modal__backdrop" />
      <Surface 
        variant="modal-light" 
        elevation="4" 
        radius="xl" 
        padding="2xl"
        className="privacy-modal__content"
      >
        <button 
          className="privacy-modal__close-button"
          onClick={onClose}
          aria-label="Close privacy modal"
        >
          ×
        </button>
        
        <h3 className="privacy-modal__title">
          Privacy & Analytics Information
        </h3>
        
        <div className="privacy-modal__body">
          <div className="privacy-modal__section">
            <p className="privacy-modal__section-intro">
              <strong className="privacy-modal__section-title privacy-modal__section-title--collect">
                Data that helps me imporve my portfolio:
              </strong>
            </p>
            <ul className="privacy-modal__list">
              <li>Page load speeds and component render times</li>
              <li>Resource loading performance (images, scripts)</li>
              <li>Memory usage patterns for optimization</li>
              <li>User interaction response times</li>
              <li>General location data (country/region) for visitor analytics</li>
              <li>Referrer information (which site brought you here)</li>
            </ul>
          </div>
          
          <div className="privacy-modal__section">
            <p className="privacy-modal__section-intro">
              <strong className="privacy-modal__section-title privacy-modal__section-title--no-collect">
                Stuff I don't collect:
              </strong>
            </p>
            <ul className="privacy-modal__list">
              <li>Personal identifying information (names, emails)</li>
              <li>Precise location or GPS coordinates</li>
              <li>Browsing history outside this portfolio</li>
              <li>Any form inputs or personal content</li>
              <li>Device identifiers or fingerprinting data</li>
            </ul>
          </div>
        </div>
      </Surface>
    </div>
  );
};

export default PrivacyDetailsModal;
