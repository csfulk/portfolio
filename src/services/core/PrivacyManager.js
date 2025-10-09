/**
 * Privacy Manager - Refactored
 * Handles EU privacy compliance with proper React integration
 */

import { tokens } from '@design-system/tokens';

class PrivacyManager {
  constructor() {
    this.consentKey = 'portfolio_performance_consent';
    this.consentVersion = '1.0';
    this.euDetectionKey = 'portfolio_eu_detection';
    this.hasConsent = false;
    this.isEUUser = null;
    this.consentChecked = false;
    
    // React integration
    this.bannerInstance = null;
    this.modalInstance = null;
    
    this._initializeConsent();
  }

  /**
   * Check if user has given consent for performance monitoring
   */
  hasPerformanceConsent() {
    return this.hasConsent;
  }

  /**
   * Initialize consent checking - main entry point
   */
  async initializeConsent() {
    console.log('🔒 PrivacyManager.initializeConsent() called');
    
    if (this.consentChecked) {
      console.log('🔒 Consent already checked, returning:', this.hasConsent);
      return this.hasConsent;
    }
    
    console.log('🔒 Detecting EU user...');
    const isEU = await this.detectEUUser();
    
    if (!isEU) {
      // Non-EU users: Enable by default, no banner needed
      console.log('🌍 Non-EU user detected - auto-enabling monitoring');
      this.hasConsent = true;
      this._saveConsent({ 
        granted: true, 
        timestamp: Date.now(), 
        auto: true, 
        reason: 'non-eu-default' 
      });
      console.log('✅ Performance monitoring enabled (non-EU user)');
    } else {
      // EU users: Check for existing consent or request it
      console.log('🇪🇺 EU user detected - checking consent...');
      const existingConsent = this._getStoredConsent();
      
      if (existingConsent && existingConsent.version === this.consentVersion) {
        this.hasConsent = existingConsent.granted;
        console.log(`📋 Stored consent found: ${this.hasConsent ? 'granted' : 'denied'}`);
      } else {
        // No valid consent - show banner via React
        console.log('📋 No valid consent found - requesting banner...');
        this.hasConsent = await this._requestEUConsent();
      }
    }
    
    this.consentChecked = true;
    return this.hasConsent;
  }

  /**
   * Detect if user is likely in EU using multiple methods
   */
  async detectEUUser() {
    // Check cached result first
    const cached = localStorage.getItem(this.euDetectionKey);
    if (cached) {
      try {
        const detection = JSON.parse(cached);
        // Cache for 24 hours
        if (Date.now() - detection.timestamp < 24 * 60 * 60 * 1000) {
          this.isEUUser = detection.isEU;
          return this.isEUUser;
        }
      } catch (error) {
        console.warn('Invalid EU detection cache:', error);
      }
    }

    // Multiple detection methods
    const detectionResults = await Promise.all([
      this._detectByTimezone(),
      this._detectByLanguage(),
      this._detectByDateFormat()
    ]);

    // EU if any method indicates EU
    const isEU = detectionResults.some(result => result);
    
    // Cache the result
    localStorage.setItem(this.euDetectionKey, JSON.stringify({
      isEU,
      timestamp: Date.now(),
      methods: {
        timezone: detectionResults[0],
        language: detectionResults[1], 
        dateFormat: detectionResults[2]
      }
    }));

    this.isEUUser = isEU;
    console.log(`EU detection: ${isEU ? 'EU' : 'Non-EU'} user detected`);
    
    return isEU;
  }

  /**
   * Revoke consent and clear data
   */
  revokeConsent() {
    this.hasConsent = false;
    localStorage.removeItem(this.consentKey);
    
    // Clear existing performance data
    if (window.performanceMonitor) {
      window.performanceMonitor.clear();
      console.log('Performance data cleared due to consent revocation');
    }
    
    console.log('Performance monitoring consent revoked');
  }

  /**
   * Get consent information
   */
  getConsentInfo() {
    return this._getStoredConsent();
  }

  /**
   * Manual consent granting (for settings page)
   */
  async grantConsent() {
    this.hasConsent = true;
    this._saveConsent({ 
      granted: true, 
      timestamp: Date.now(), 
      manual: true 
    });
    
    // Enable performance monitoring
    if (window.performanceMonitor) {
      window.performanceMonitor.setEnabled(true);
      window.performanceMonitor.trackWebVitals();
      window.performanceMonitor.monitorResources();
      window.performanceMonitor.monitorMemory();
    }
    
    return true;
  }

  /**
   * Request consent from EU users - React integration point
   * @private
   */
  async _requestEUConsent() {
    return new Promise((resolve) => {
      // Dispatch custom event for React to handle
      const event = new CustomEvent('privacy:showBanner', {
        detail: {
          onAccept: (reason = 'manual') => {
            this.hasConsent = true;
            this._saveConsent({ 
              granted: true, 
              timestamp: Date.now(), 
              manual: reason === 'manual',
              autoCountdown: reason === 'auto-countdown'
            });
            
            console.log(`🇪🇺 EU user granted performance monitoring consent (${reason})`);
            resolve(true);
          },
          onDecline: (reason = 'manual') => {
            this.hasConsent = false;
            this._saveConsent({ 
              granted: false, 
              timestamp: Date.now(), 
              manual: reason === 'manual'
            });
            
            console.log(`🇪🇺 EU user declined performance monitoring consent (${reason})`);
            resolve(false);
          },
          onShowDetails: () => {
            // Dispatch event for details modal
            document.dispatchEvent(new CustomEvent('privacy:showDetails'));
          }
        }
      });
      
      document.dispatchEvent(event);
    });
  }

  // ... (keep all the detection methods unchanged)
  _detectByTimezone() {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const euTimezones = [
        'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome',
        'Europe/Madrid', 'Europe/Amsterdam', 'Europe/Brussels', 'Europe/Vienna',
        'Europe/Stockholm', 'Europe/Copenhagen', 'Europe/Helsinki', 'Europe/Warsaw',
        'Europe/Prague', 'Europe/Budapest', 'Europe/Bucharest', 'Europe/Sofia',
        'Europe/Zagreb', 'Europe/Ljubljana', 'Europe/Bratislava', 'Europe/Vilnius',
        'Europe/Riga', 'Europe/Tallinn', 'Europe/Dublin', 'Europe/Lisbon',
        'Europe/Athens', 'Europe/Nicosia', 'Europe/Malta', 'Europe/Luxembourg'
      ];
      
      return euTimezones.includes(timezone);
    } catch (error) {
      console.warn('Timezone detection failed:', error);
      return false;
    }
  }

  _detectByLanguage() {
    try {
      const languages = navigator.languages || [navigator.language];
      const euLanguages = [
        'bg', 'hr', 'cs', 'da', 'nl', 'en-GB', 'en-IE', 'et', 'fi', 'fr',
        'de', 'el', 'hu', 'ga', 'it', 'lv', 'lt', 'lu', 'mt', 'pl', 'pt',
        'ro', 'sk', 'sl', 'es', 'sv'
      ];
      
      return languages.some(lang => {
        const baseLang = lang.split('-')[0];
        const fullLang = lang.toLowerCase();
        return euLanguages.includes(baseLang) || euLanguages.includes(fullLang);
      });
    } catch (error) {
      console.warn('Language detection failed:', error);
      return false;
    }
  }

  _detectByDateFormat() {
    try {
      const formatter = new Intl.DateTimeFormat();
      const parts = formatter.formatToParts(new Date());
      
      // EU typically uses day/month/year or day.month.year format
      const order = parts.map(part => part.type).join(',');
      return order.startsWith('day,literal,month') || order.startsWith('day,month');
    } catch (error) {
      console.warn('Date format detection failed:', error);
      return false;
    }
  }

  _getStoredConsent() {
    const stored = localStorage.getItem(this.consentKey);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Invalid consent data:', error);
      return null;
    }
  }

  _initializeConsent() {
    const consent = this._getStoredConsent();
    
    if (consent && consent.version === this.consentVersion) {
      this.hasConsent = consent.granted;
    } else {
      this.hasConsent = false;
    }
  }

  _saveConsent(consentData) {
    const consent = {
      granted: consentData.granted,
      timestamp: consentData.timestamp || Date.now(),
      version: this.consentVersion,
      auto: consentData.auto || false,
      manual: consentData.manual || false,
      autoCountdown: consentData.autoCountdown || false,
      reason: consentData.reason || 'user-action'
    };
    
    localStorage.setItem(this.consentKey, JSON.stringify(consent));
    
    // Log consent method for analytics
    console.log('💾 Consent saved:', {
      granted: consent.granted,
      method: consent.autoCountdown ? 'auto-countdown' : 
              consent.manual ? 'manual-click' : 
              consent.auto ? 'auto-enable' : 'unknown'
    });
  }
}

// Create singleton instance
export const privacyManager = new PrivacyManager();
export default privacyManager;
