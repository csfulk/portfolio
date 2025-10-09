/**
 * Privacy Details Modal Component
 * Detailed privacy information modal
 */

import React from 'react';
import { Button, Heading, Surface, Typography as Text } from '../ui-primitives';
import './PrivacyDetailsModal.css';

const PrivacyDetailsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="privacy-modal" onClick={handleBackdropClick}>
      <div className="privacy-modal__backdrop" />
      <Surface variant="primary" className="privacy-modal__content">
        <Heading level={3} className="privacy-modal__title">
          Performance Analytics
        </Heading>
        
        <div className="privacy-modal__body">
          <div className="privacy-modal__section">
            <Text variant="body1" color="secondary">
              <strong className="privacy-modal__section-title privacy-modal__section-title--collect">
                What we collect:
              </strong>
            </Text>
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
            <Text variant="body1" color="secondary">
              <strong className="privacy-modal__section-title privacy-modal__section-title--no-collect">
                What we don't collect:
              </strong>
            </Text>
            <ul className="privacy-modal__list">
              <li>Personal identifying information (names, emails)</li>
              <li>Precise location or GPS coordinates</li>
              <li>Browsing history outside this portfolio</li>
              <li>Any form inputs or personal content</li>
              <li>Device identifiers or fingerprinting data</li>
            </ul>
          </div>
          
          <div className="privacy-modal__footer-info">
            <Text variant="caption" color="tertiary">
              <strong>Purpose:</strong> Performance optimization and professional analytics to understand visitor interest.<br/>
              <strong>Storage:</strong> Performance data stays local (24hr expiry). Location data may be sent to analytics services.<br/>
              <strong>Your Rights:</strong> You can opt out anytime and request data deletion.
            </Text>
          </div>
        </div>
        
        <Button 
          variant="primary" 
          onClick={onClose}
          className="privacy-modal__close-btn"
        >
          Got it
        </Button>
      </Surface>
    </div>
  );
};

export default PrivacyDetailsModal;
