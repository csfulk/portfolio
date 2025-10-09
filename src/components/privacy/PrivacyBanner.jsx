/**
 * Privacy Consent Banner Component
 * EU GDPR compliant privacy consent banner
 */

import React, { useState, useEffect } from 'react';
import { Button, Surface, Typography as Text } from '../index.js';
import './PrivacyBanner.css';

const CountdownCircle = ({ timeRemaining, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="countdown-container">
      <svg width="16" height="16" viewBox="0 0 32 32" className="countdown-svg">
        <circle 
          cx="16" cy="16" r="14" 
          className="countdown-bg"
        />
        <circle 
          cx="16" cy="16" r="14" 
          className={`countdown-progress ${isActive ? 'countdown-active' : ''}`}
        />
      </svg>
      <div className="countdown-number">
        {timeRemaining > 0 ? timeRemaining : '✓'}
      </div>
    </div>
  );
};

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
            size="sm" 
            onClick={handleAccept}
            className="privacy-banner__accept"
          >
            <span>Allow</span>
            <CountdownCircle 
              timeRemaining={timeRemaining}
              isActive={countdownActive}
            />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDecline}
            className="privacy-banner__decline"
          >
            Decline
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShowDetails}
            className="privacy-banner__details"
          >
            Details
          </Button>
        </div>
      </Surface>
    </div>
  );
};

export default PrivacyBanner;
