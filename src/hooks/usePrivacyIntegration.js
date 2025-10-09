/**
 * Privacy Integration Hook
 * Handles privacy banner and details modal integration with PrivacyManager events
 */

import { useState, useEffect } from 'react';

export const usePrivacyIntegration = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [bannerCallbacks, setBannerCallbacks] = useState(null);

  useEffect(() => {
    // Listen for privacy banner show event
    const handleShowBanner = (event) => {
      console.log('🔒 Privacy banner requested by PrivacyManager');
      setBannerCallbacks(event.detail);
      setShowBanner(true);
    };

    // Listen for privacy details show event  
    const handleShowDetails = () => {
      console.log('📋 Privacy details requested');
      setShowDetails(true);
    };

    document.addEventListener('privacy:showBanner', handleShowBanner);
    document.addEventListener('privacy:showDetails', handleShowDetails);

    return () => {
      document.removeEventListener('privacy:showBanner', handleShowBanner);
      document.removeEventListener('privacy:showDetails', handleShowDetails);
    };
  }, []);

  const handleBannerAccept = (reason) => {
    console.log('✅ Privacy banner accepted:', reason);
    setShowBanner(false);
    if (bannerCallbacks?.onAccept) {
      bannerCallbacks.onAccept(reason);
    }
  };

  const handleBannerDecline = (reason) => {
    console.log('❌ Privacy banner declined:', reason);
    setShowBanner(false);
    if (bannerCallbacks?.onDecline) {
      bannerCallbacks.onDecline(reason);
    }
  };

  const handleShowBannerDetails = () => {
    console.log('📋 Show privacy details from banner');
    if (bannerCallbacks?.onShowDetails) {
      bannerCallbacks.onShowDetails();
    }
  };

  const handleCloseDetails = () => {
    console.log('📋 Privacy details closed');
    setShowDetails(false);
  };

  return {
    // State
    showBanner,
    showDetails,
    
    // Banner handlers
    onBannerAccept: handleBannerAccept,
    onBannerDecline: handleBannerDecline,
    onBannerShowDetails: handleShowBannerDetails,
    
    // Details handlers
    onDetailsClose: handleCloseDetails
  };
};
