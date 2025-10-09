/**
 * Privacy Test Utilities
 * Helper functions for testing privacy banner behavior in development
 */

/**
 * Force EU detection for testing
 * Run this in browser console to test EU privacy banner
 */
export const forceEUDetection = () => {
  localStorage.setItem('portfolio_eu_detection', JSON.stringify({
    isEU: true,
    timestamp: Date.now(),
    methods: {
      timezone: true,
      language: true,
      dateFormat: true
    }
  }));
  
  // Clear consent to trigger banner
  localStorage.removeItem('portfolio_performance_consent');
  
  console.log('✅ EU detection forced. Reload page to see privacy banner.');
  console.log('To revert: forceNonEUDetection()');
};

/**
 * Force non-EU detection for testing
 * Run this in browser console to test auto-enabled monitoring
 */
export const forceNonEUDetection = () => {
  localStorage.setItem('portfolio_eu_detection', JSON.stringify({
    isEU: false,
    timestamp: Date.now(),
    methods: {
      timezone: false,
      language: false,
      dateFormat: false
    }
  }));
  
  // Clear consent to test auto-enable
  localStorage.removeItem('portfolio_performance_consent');
  
  console.log('✅ Non-EU detection forced. Reload page - monitoring should auto-enable.');
  console.log('To revert: forceEUDetection()');
};

/**
 * Clear all privacy data
 */
export const clearPrivacyData = () => {
  localStorage.removeItem('portfolio_eu_detection');
  localStorage.removeItem('portfolio_performance_consent');
  
  console.log('✅ All privacy data cleared. Reload to test fresh detection.');
};

/**
 * Show current privacy status
 */
export const getPrivacyStatus = () => {
  const euDetection = localStorage.getItem('portfolio_eu_detection');
  const consent = localStorage.getItem('portfolio_performance_consent');
  
  const status = {
    euDetection: euDetection ? JSON.parse(euDetection) : null,
    consent: consent ? JSON.parse(consent) : null,
    currentConsent: window.services?.privacy?.hasPerformanceConsent() || false,
    monitoringActive: window.services?.performance?.isEnabled || false,
    servicesAvailable: !!window.services,
    privacyManagerExists: !!window.services?.privacy,
    portfolioServicesExists: !!window.portfolioServices
  };
  
  console.table(status);
  return status;
};

/**
 * Manually show privacy banner for testing
 */
export const showBannerManually = () => {
  if (window.portfolioServices?.privacy) {
    console.log('🧪 Manually triggering privacy banner...');
    window.portfolioServices.privacy._showConsentBanner((granted) => {
      console.log(`Test banner result: ${granted ? 'granted' : 'declined'}`);
    });
  } else {
    console.error('❌ Privacy manager not found. Services available:', !!window.portfolioServices);
  }
};

/**
 * Get location analytics data
 */
export const getLocationData = () => {
  const locationService = window.portfolioServices?.location;
  
  if (locationService) {
    const data = {
      locationData: locationService.getLocationData(),
      analyticsData: locationService.getAnalyticsData(),
      visitorStats: locationService.getVisitorStats(),
      hyperLocal: locationService.getHyperLocalAnalytics()
    };
    
    console.log('📍 Location Analytics:', data);
    return data;
  } else {
    console.log('❌ Location service not available');
    return null;
  }
};

/**
 * Show granular location breakdown
 */
export const showLocationGranularity = () => {
  const locationService = window.portfolioServices?.location;
  
  if (!locationService) {
    console.log('❌ Location service not available');
    return;
  }

  const locationData = locationService.getLocationData();
  const analytics = locationService.getAnalyticsData();
  
  console.log('🌍 Location Granularity Analysis:');
  console.log('================================');
  
  if (analytics) {
    console.log(`🏳️  Country: ${analytics.country} (${analytics.countryCode})`);
    console.log(`🏛️  Region/State: ${analytics.region || 'Not detected'}`);
    console.log(`🏙️  City: ${analytics.city || 'Not detected'}`);
    console.log(`📮 Postal Code: ${analytics.postalCode || 'Not detected'}`);
    console.log(`🏘️  Neighborhood: ${analytics.neighborhood || 'Not detected'}`);
    console.log(`🏢 District: ${analytics.district || 'Not detected'}`);
    console.log(`🌐 ISP: ${analytics.isp || 'Not detected'}`);
    
    if (analytics.latitude && analytics.longitude) {
      console.log(`📍 Coordinates: ${analytics.latitude}, ${analytics.longitude} (rounded)`);
    }
    
    console.log(`⏰ Timezone: ${analytics.timezone}`);
    console.log(`🔗 API Sources: ${locationData?.sources?.join(', ') || 'Unknown'}`);
  } else {
    console.log('❌ No location data available');
  }
  
  return analytics;
};

/**
 * Show hyper-local visitor analytics
 */
export const showHyperLocalStats = () => {
  const locationService = window.portfolioServices?.location;
  
  if (!locationService) {
    console.log('❌ Location service not available');
    return;
  }

  const hyperLocal = locationService.getHyperLocalAnalytics();
  
  if (!hyperLocal) {
    console.log('📊 No visitor data available yet');
    return;
  }

  console.log('🎯 Hyper-Local Visitor Analytics:');
  console.log('=================================');
  console.log(`📍 Total unique areas: ${hyperLocal.totalLocalAreas}`);
  console.log('');
  console.log('Top locations by visits:');
  
  hyperLocal.locations.slice(0, 10).forEach((loc, index) => {
    console.log(`${index + 1}. ${loc.location}`);
    console.log(`   └── Visits: ${loc.visits}`);
    if (loc.neighborhood) console.log(`   └── Neighborhood: ${loc.neighborhood}`);
    if (loc.district) console.log(`   └── District: ${loc.district}`);
    console.log(`   └── First visit: ${new Date(loc.firstVisit).toLocaleDateString()}`);
    console.log(`   └── Last visit: ${new Date(loc.lastVisit).toLocaleDateString()}`);
    console.log('');
  });
  
  return hyperLocal;
};

/**
 * Export visitor analytics
 */
export const exportVisitorData = () => {
  const locationService = window.portfolioServices?.location;
  
  if (locationService) {
    const data = locationService.exportAnalytics();
    console.log('📊 Visitor Analytics Export:');
    console.log(data);
    
    // Create downloadable file
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visitor-analytics-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    return data;
  } else {
    console.log('❌ Location service not available');
    return null;
  }
};

// Make functions globally available in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.privacyTest = {
    forceEU: forceEUDetection,
    forceNonEU: forceNonEUDetection,
    clear: clearPrivacyData,
    status: getPrivacyStatus,
    showBanner: showBannerManually,
    location: getLocationData,
    granularity: showLocationGranularity,
    hyperLocal: showHyperLocalStats,
    export: exportVisitorData
  };
  
  console.log('🔧 Privacy & Analytics test utilities available:');
  console.log('• privacyTest.forceEU() - Test EU privacy banner');
  console.log('• privacyTest.forceNonEU() - Test non-EU auto-enable');  
  console.log('• privacyTest.clear() - Clear all privacy data');
  console.log('• privacyTest.status() - Show current privacy status');
  console.log('• privacyTest.showBanner() - Manually show banner for testing');
  console.log('• privacyTest.location() - Show all location analytics data');
  console.log('• privacyTest.granularity() - Show location detection granularity');
  console.log('• privacyTest.hyperLocal() - Show hyper-local visitor breakdown');
  console.log('• privacyTest.export() - Export visitor analytics as JSON');
}
