/**
 * Privacy Manager - GDPR Compliance for EU Visitors Only
 */

class PrivacyManager {
  constructor() {
    this.consentKey = 'portfolio_performance_consent';
    this.consentVersion = '1.0';
    this.euDetectionKey = 'portfolio_eu_detection';
    this.hasConsent = false;
    this.isEUUser = null;
    this.consentChecked = false;
    
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
        // No valid consent - show banner
        console.log('📋 No valid consent found - showing banner...');
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
   * Detect EU by timezone
   * @private
   */
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

  /**
   * Detect EU by language preferences
   * @private
   */
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

  /**
   * Detect EU by date format preferences
   * @private
   */
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

  /**
   * Get stored consent
   * @private
   */
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

  /**
   * Initialize consent from storage
   * @private
   */
  _initializeConsent() {
    const consent = this._getStoredConsent();
    
    if (consent && consent.version === this.consentVersion) {
      this.hasConsent = consent.granted;
    } else {
      this.hasConsent = false;
    }
  }

  /**
   * Save consent to localStorage
   * @private
   */
  _saveConsent(consentData) {
    const consent = {
      granted: consentData.granted,
      timestamp: consentData.timestamp || Date.now(),
      version: this.consentVersion,
      auto: consentData.auto || false,
      manual: consentData.manual || false,
      reason: consentData.reason || 'user-action'
    };
    
    localStorage.setItem(this.consentKey, JSON.stringify(consent));
  }

  /**
   * Request consent from EU users
   * @private
   */
  async _requestEUConsent() {
    return new Promise((resolve) => {
      this._showConsentBanner(resolve);
    });
  }

  /**
   * Show ultra-lightweight EU consent banner
   * @private
   */
  _showConsentBanner(resolve) {
    console.log('🎨 Creating privacy consent banner...');
    
    // Prevent multiple banners
    if (document.getElementById('privacy-banner')) {
      console.log('⚠️ Banner already exists, not creating duplicate');
      return;
    }

    console.log('🎨 Creating banner DOM element...');
    const banner = document.createElement('div');
    banner.id = 'privacy-banner';
    banner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        color: white;
        padding: 1rem 1.25rem;
        border-radius: 8px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        font-size: 0.875rem;
        line-height: 1.4;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        max-width: 360px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        animation: slideIn 0.3s ease-out;
      ">
        <style>
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(100%); }
            to { opacity: 1; transform: translateY(0); }
          }
        </style>
        <div style="margin-bottom: 0.75rem; color: rgba(255, 255, 255, 0.9);">
          This portfolio collects performance data and visitor analytics (including general location) to optimize the experience and understand professional interest.
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center;">
          <button id="privacy-accept" style="
            background: #ffffff;
            color: #000000;
            border: none;
            padding: 0.5rem 0.875rem;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
          ">Allow</button>
          <button id="privacy-decline" style="
            background: transparent;
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.5rem 0.875rem;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.15s ease;
          ">Decline</button>
          <button id="privacy-info" style="
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.75rem;
            cursor: pointer;
            padding: 0.25rem;
            text-decoration: underline;
            margin-left: 0.25rem;
          ">Details</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Add hover effects
    const acceptBtn = document.getElementById('privacy-accept');
    const declineBtn = document.getElementById('privacy-decline');
    
    acceptBtn.onmouseover = () => acceptBtn.style.background = '#f0f0f0';
    acceptBtn.onmouseout = () => acceptBtn.style.background = '#ffffff';
    
    declineBtn.onmouseover = () => {
      declineBtn.style.borderColor = 'rgba(255, 255, 255, 0.5)';
      declineBtn.style.color = 'rgba(255, 255, 255, 1)';
    };
    declineBtn.onmouseout = () => {
      declineBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      declineBtn.style.color = 'rgba(255, 255, 255, 0.8)';
    };

    // Handle user choice with smooth animation
    const handleChoice = (granted) => {
      banner.style.animation = 'slideOut 0.3s ease-in';
      banner.style.animationFillMode = 'forwards';
      
      // Add slide out animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(100%); }
        }
      `;
      document.head.appendChild(style);
      
      setTimeout(() => {
        if (banner.parentNode) {
          document.body.removeChild(banner);
        }
        document.head.removeChild(style);
      }, 300);

      this.hasConsent = granted;
      this._saveConsent({ granted, timestamp: Date.now(), manual: true });
      
      console.log(`EU user ${granted ? 'granted' : 'declined'} performance monitoring consent`);
      resolve(granted);
    };

    // Event listeners
    document.getElementById('privacy-accept').onclick = () => handleChoice(true);
    document.getElementById('privacy-decline').onclick = () => handleChoice(false);
    document.getElementById('privacy-info').onclick = () => this._showDetails();
  }

  /**
   * Show minimal privacy details
   * @private
   */
  _showDetails() {
    // Create lightweight modal
    const modal = document.createElement('div');
    modal.id = 'privacy-details';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(4px);
        z-index: 10002;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        animation: fadeIn 0.2s ease-out;
      ">
        <style>
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        </style>
        <div style="
          background: #ffffff;
          border-radius: 12px;
          padding: 1.5rem;
          max-width: 480px;
          width: 100%;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.3s ease-out;
        ">
          <style>
            @keyframes slideUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          </style>
          <h3 style="margin: 0 0 1rem 0; color: #1f2937; font-size: 1.125rem; font-weight: 600;">
            Performance Analytics
          </h3>
          
          <div style="color: #4b5563; font-size: 0.875rem; line-height: 1.5; margin-bottom: 1rem;">
            <p style="margin: 0 0 0.75rem 0;">
              <strong style="color: #059669;">What we collect:</strong><br>
              • Page load speeds and component render times<br>
              • Resource loading performance (images, scripts)<br>
              • Memory usage patterns for optimization<br>
              • User interaction response times<br>
              • General location data (country/region) for visitor analytics<br>
              • Referrer information (which site brought you here)
            </p>
            
            <p style="margin: 0 0 0.75rem 0;">
              <strong style="color: #dc2626;">What we don't collect:</strong><br>
              • Personal identifying information (names, emails)<br>
              • Precise location or GPS coordinates<br>
              • Browsing history outside this portfolio<br>
              • Any form inputs or personal content<br>
              • Device identifiers or fingerprinting data
            </p>
            
            <p style="margin: 0; font-size: 0.8rem; color: #6b7280;">
              <strong>Purpose:</strong> Performance optimization and professional analytics to understand visitor interest.<br>
              <strong>Storage:</strong> Performance data stays local (24hr expiry). Location data may be sent to analytics services.<br>
              <strong>Your Rights:</strong> You can opt out anytime and request data deletion.
            </p>
          </div>
          
          <button onclick="document.body.removeChild(document.getElementById('privacy-details'))" style="
            background: #3b82f6;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.15s ease;
          " onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
            Got it
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
  }
}

// Create singleton instance
export const privacyManager = new PrivacyManager();
export default privacyManager;
