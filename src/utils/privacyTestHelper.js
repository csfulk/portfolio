/**
 * Privacy Testing Helper
 * Adds window functions to test privacy functionality in development
 */

if (import.meta.env.DEV) {
  // Make privacy manager available globally for testing
  import('@services').then(({ privacyManager }) => {
    window.privacyManager = privacyManager;
    
    // Test functions for privacy banner
    window.testPrivacyBanner = () => {
      console.log('🧪 Testing privacy banner...');
      // Force EU detection for testing
      localStorage.setItem('portfolio_eu_detection', JSON.stringify({
        isEU: true,
        timestamp: Date.now(),
        methods: { timezone: true, language: false, dateFormat: false }
      }));
      
      // Clear existing consent to trigger banner
      localStorage.removeItem('portfolio_performance_consent');
      
      // Trigger consent check
      privacyManager.initializeConsent();
      
      console.log('📋 Privacy banner should appear if user is detected as EU');
    };
    
    window.testNonEUUser = () => {
      console.log('🧪 Testing non-EU user...');
      // Force non-EU detection
      localStorage.setItem('portfolio_eu_detection', JSON.stringify({
        isEU: false,
        timestamp: Date.now(),
        methods: { timezone: false, language: false, dateFormat: false }
      }));
      
      localStorage.removeItem('portfolio_performance_consent');
      privacyManager.initializeConsent();
      
      console.log('🌍 Non-EU user - should auto-enable without banner');
    };
    
    window.clearPrivacyData = () => {
      console.log('🧹 Clearing all privacy data...');
      localStorage.removeItem('portfolio_performance_consent');
      localStorage.removeItem('portfolio_eu_detection');
      console.log('✅ Privacy data cleared - refresh to see fresh behavior');
    };
    
    console.log('🔒 Privacy test functions available:');
    console.log('  - testPrivacyBanner() - Force show privacy banner');
    console.log('  - testNonEUUser() - Test non-EU user behavior');
    console.log('  - clearPrivacyData() - Reset all privacy settings');
  });
}
