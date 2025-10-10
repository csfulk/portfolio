/**
 * Privacy Consent Banner Component
 * EU GDPR compliant privacy consent banner
 */

import React, { useState, useEffect } from 'react';
import { Button, Surface, Typography as Text } from '../index.js';
import './PrivacyBanner.css';

const PrivacyBanner = ({ 
  onAccept, 
  onDecline, 
  onShowDetails,
  autoAcceptDelay = 8000 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(Math.ceil(autoAcceptDelay / 1000));
  const [countdownActive, setCountdownActive] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!countdownActive || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setCountdownActive(false);
          // Auto-accept after countdown
          setTimeout(() => onAccept('auto-countdown'), 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdownActive, timeRemaining, onAccept]);

  const handleUserInteraction = () => {
    setCountdownActive(false);
  };

  const handleAccept = () => {
    handleUserInteraction();
    onAccept('manual');
  };

  const handleDecline = () => {
    handleUserInteraction();
    onDecline('manual');
  };

  const handleShowDetails = () => {
    handleUserInteraction();
    onShowDetails();
  };

  return (
    <div className={`privacy-banner ${isVisible ? 'privacy-banner--visible' : ''}`}>
      <Surface 
        variant="modal" 
        padding="lg"
        radius="xl"
        elevation="4"
        className="privacy-banner__content"
        onMouseEnter={handleUserInteraction}
      >
        <div className="privacy-banner__message">
          <Text variant="body2" color="inverse">
            Hi! I collect basic analytics to improve my portfolio.
          </Text>
        </div>
        
        <div className="privacy-banner__actions">
          <Button 
            variant="secondary" 
            size="xs" 
            onClick={handleAccept}
            className="privacy-banner__accept"
            countdown={timeRemaining}
            countdownActive={countdownActive}
          >
            Allow
          </Button>
          
          <Button 
            variant="outline" 
            size="xs" 
            onClick={handleDecline}
            className="privacy-banner__decline"
            color="var(--textSecondary)"
            hoverColor="var(--textPrimary)"
            backgroundColor="transparent"
            hoverBackgroundColor="rgba(255, 255, 255, 0.05)"
          >
            Decline
          </Button>
          
          <Button 
            variant="text" 
            size="xs" 
            onClick={handleShowDetails}
            className="privacy-banner__details"
            color="var(--textTertiary)"
            hoverColor="var(--textSecondary)"
            paddingX="var(--spacing-sm)"
            paddingY="var(--spacing-xs)"
          >
            Details
          </Button>
        </div>
      </Surface>
    </div>
  );
};

export default PrivacyBanner;
