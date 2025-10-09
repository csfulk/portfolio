/**
 * Location Analytics Service
 * Collects visitor location data for portfolio analytics
 */

class LocationService {
  constructor() {
    this.locationData = null;
    this.isEnabled = false;
    this.apis = {
      // Enhanced IP geolocation APIs with more granular data
      primary: 'https://ipapi.co/json/',           // Provides postal code, district
      fallback1: 'https://freegeoip.app/json/',   // Provides zip code
      fallback2: 'https://ipwhois.app/json/',     // Provides detailed location
      fallback3: 'https://ip-api.com/json/',      // Provides district, zip, lat/lng
      fallback4: 'https://api.ipbase.com/v2/info', // Provides neighborhood data
      // Backup simple API
      simple: 'https://httpbin.org/ip'
    };
  }

  /**
   * Initialize location tracking with consent
   */
  async initialize() {
    if (!this._hasConsent()) {
      console.log('Location tracking disabled - no consent');
      return false;
    }

    try {
      this.isEnabled = true;
      await this._detectLocation();
      console.log('✅ Location service initialized');
      return true;
    } catch (error) {
      console.warn('Location detection failed:', error);
      return false;
    }
  }

  /**
   * Get visitor location data
   * @returns {Object|null} Location information
   */
  getLocationData() {
    return this.locationData;
  }

  /**
   * Get summary location info for analytics
   * @returns {Object} Safe location data for analytics
   */
  getAnalyticsData() {
    if (!this.locationData) return null;

    return {
      // Country level
      country: this.locationData.country_name || this.locationData.country,
      countryCode: this.locationData.country_code || this.locationData.country_code,
      
      // Regional level
      region: this.locationData.region || this.locationData.region_name || this.locationData.regionName,
      regionCode: this.locationData.region_code || this.locationData.regionCode,
      
      // City/Town level
      city: this.locationData.city,
      district: this.locationData.district,
      
      // Postal/Zip code (most granular safe identifier)
      postalCode: this.locationData.postal || this.locationData.zip || this.locationData.zipcode,
      
      // Additional granular data when available
      neighborhood: this.locationData.neighbourhood || this.locationData.neighborhood,
      suburb: this.locationData.suburb,
      county: this.locationData.county,
      
      // Network information
      isp: this.locationData.org || this.locationData.isp || this.locationData.organization,
      asn: this.locationData.asn,
      
      // Geographic coordinates (rounded for privacy)
      latitude: this.locationData.latitude ? parseFloat(this.locationData.latitude).toFixed(2) : null,
      longitude: this.locationData.longitude ? parseFloat(this.locationData.longitude).toFixed(2) : null,
      
      // Time and language
      timezone: this.locationData.timezone,
      
      // API source for debugging
      source: this.locationData.source || 'ip-geolocation',
      timestamp: Date.now()
    };
  }

  /**
   * Track page visit with location
   * @param {Object} pageData - Page information
   */
  trackVisit(pageData = {}) {
    if (!this.isEnabled || !this.locationData) return;

    const visitData = {
      ...pageData,
      location: this.getAnalyticsData(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      language: navigator.language,
      screen: {
        width: screen.width,
        height: screen.height
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      timestamp: Date.now(),
      sessionId: this._getSessionId()
    };

    // Store visit data locally
    this._storeVisit(visitData);

    // Send to analytics if configured
    this._sendToAnalytics(visitData);

    console.log('📍 Visit tracked with location:', this.getAnalyticsData());
  }

  /**
   * Get visitor statistics
   * @returns {Object} Visitor analytics summary
   */
  getVisitorStats() {
    const visits = this._getStoredVisits();
    
    if (visits.length === 0) return null;

    const countries = {};
    const regions = {};
    const cities = {};
    const postalCodes = {};
    const neighborhoods = {};
    const referrers = {};
    const isps = {};
    
    visits.forEach(visit => {
      if (visit.location) {
        const { country, region, city, postalCode, neighborhood, isp } = visit.location;
        
        // Country breakdown
        if (country) countries[country] = (countries[country] || 0) + 1;
        
        // Regional breakdown (state/province)
        if (region) regions[region] = (regions[region] || 0) + 1;
        
        // City breakdown
        if (city) cities[city] = (cities[city] || 0) + 1;
        
        // Postal code breakdown (most granular safe identifier)
        if (postalCode) postalCodes[postalCode] = (postalCodes[postalCode] || 0) + 1;
        
        // Neighborhood breakdown (when available)
        if (neighborhood) neighborhoods[neighborhood] = (neighborhoods[neighborhood] || 0) + 1;
        
        // ISP breakdown (can indicate business visits)
        if (isp) isps[isp] = (isps[isp] || 0) + 1;
      }
      
      // Referrer tracking
      if (visit.referrer) {
        try {
          const domain = new URL(visit.referrer).hostname;
          referrers[domain] = (referrers[domain] || 0) + 1;
        } catch (e) {
          referrers['direct'] = (referrers['direct'] || 0) + 1;
        }
      } else {
        referrers['direct'] = (referrers['direct'] || 0) + 1;
      }
    });

    return {
      totalVisits: visits.length,
      uniqueCountries: Object.keys(countries).length,
      uniqueRegions: Object.keys(regions).length,
      uniqueCities: Object.keys(cities).length,
      uniquePostalCodes: Object.keys(postalCodes).length,
      
      // Top locations by granularity
      topCountries: this._sortAndLimit(countries, 10),
      topRegions: this._sortAndLimit(regions, 10),
      topCities: this._sortAndLimit(cities, 15),
      topPostalCodes: this._sortAndLimit(postalCodes, 20),
      topNeighborhoods: this._sortAndLimit(neighborhoods, 10),
      
      // Network and referrer data
      topISPs: this._sortAndLimit(isps, 10),
      topReferrers: this._sortAndLimit(referrers, 10),
      
      timeRange: {
        first: Math.min(...visits.map(v => v.timestamp)),
        last: Math.max(...visits.map(v => v.timestamp))
      }
    };
  }

  /**
   * Get hyper-local analytics (postal code and neighborhood level)
   * @returns {Object} Detailed local visitor breakdown
   */
  getHyperLocalAnalytics() {
    const visits = this._getStoredVisits();
    if (visits.length === 0) return null;

    const localData = {};
    
    visits.forEach(visit => {
      if (visit.location) {
        const { city, postalCode, neighborhood, district, county } = visit.location;
        
        if (city || postalCode) {
          const locationKey = `${city || 'Unknown City'} (${postalCode || 'No ZIP'})`;
          
          if (!localData[locationKey]) {
            localData[locationKey] = {
              city: city,
              postalCode: postalCode,
              neighborhood: neighborhood,
              district: district,
              county: county,
              visits: 0,
              timestamps: []
            };
          }
          
          localData[locationKey].visits += 1;
          localData[locationKey].timestamps.push(visit.timestamp);
        }
      }
    });

    // Sort by visit count and add analytics
    const sortedLocations = Object.entries(localData)
      .sort(([,a], [,b]) => b.visits - a.visits)
      .map(([location, data]) => ({
        location,
        ...data,
        firstVisit: Math.min(...data.timestamps),
        lastVisit: Math.max(...data.timestamps)
      }));

    return {
      totalLocalAreas: sortedLocations.length,
      locations: sortedLocations
    };
  }

  /**
   * Export location analytics data
   * @returns {string} JSON data for external analytics
   */
  exportAnalytics() {
    const visits = this._getStoredVisits();
    const stats = this.getVisitorStats();
    const hyperLocal = this.getHyperLocalAnalytics();
    
    return JSON.stringify({
      summary: stats,
      hyperLocal: hyperLocal,
      visits: visits.map(visit => ({
        timestamp: visit.timestamp,
        location: visit.location,
        referrer: visit.referrer,
        page: visit.page || window.location.pathname
      }))
    }, null, 2);
  }

  /**
   * Detect visitor location with enhanced granularity
   * @private
   */
  async _detectLocation() {
    const locationData = {};
    let successfulAPIs = 0;

    // Try multiple APIs and merge their data for maximum granularity
    for (const [name, url] of Object.entries(this.apis)) {
      if (name === 'simple') continue; // Skip simple IP-only API for location
      
      try {
        console.log(`🔍 Trying ${name} API for location data...`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; PortfolioAnalytics/1.0)'
          },
          signal: AbortSignal.timeout(8000) // 8 second timeout
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Merge data from this API
          this._mergeLocationData(locationData, data, name);
          successfulAPIs++;
          
          console.log(`✅ ${name} API provided additional location data`);
          
          // If we have good granular data, we can stop early
          if (locationData.postalCode && locationData.city && successfulAPIs >= 2) {
            break;
          }
        }
      } catch (error) {
        console.warn(`❌ ${name} location API failed:`, error.message);
        continue;
      }
    }

    // Use merged data or fallback
    if (successfulAPIs > 0) {
      this.locationData = locationData;
      console.log(`📍 Location detected via ${successfulAPIs} APIs with granularity:`, {
        country: !!locationData.country_name,
        region: !!locationData.region,
        city: !!locationData.city,
        postalCode: !!locationData.postal,
        neighborhood: !!(locationData.neighbourhood || locationData.neighborhood)
      });
    } else {
      // If all APIs fail, create minimal location data
      this.locationData = {
        country_name: 'Unknown',
        country_code: 'XX',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        source: 'browser-fallback'
      };
      console.log('📍 Using fallback location detection');
    }
  }

  /**
   * Merge location data from different APIs
   * @private
   */
  _mergeLocationData(target, source, apiName) {
    // Country data
    target.country_name = target.country_name || source.country_name || source.country;
    target.country_code = target.country_code || source.country_code || source.countryCode;
    
    // Regional data
    target.region = target.region || source.region || source.region_name || source.regionName;
    target.region_code = target.region_code || source.region_code || source.regionCode;
    
    // City/local data
    target.city = target.city || source.city;
    target.district = target.district || source.district;
    target.county = target.county || source.county;
    
    // Postal/ZIP code (key for granular tracking)
    target.postal = target.postal || source.postal || source.zip || source.zipcode || source.zip_code;
    
    // Neighborhood data (most granular)
    target.neighbourhood = target.neighbourhood || source.neighbourhood || source.neighborhood;
    target.suburb = target.suburb || source.suburb;
    
    // Network/ISP data
    target.org = target.org || source.org || source.isp || source.organization;
    target.asn = target.asn || source.asn;
    
    // Coordinates (for distance calculations)
    target.latitude = target.latitude || source.latitude || source.lat;
    target.longitude = target.longitude || source.longitude || source.lon || source.lng;
    
    // Time zone
    target.timezone = target.timezone || source.timezone;
    
    // Keep track of API sources
    target.sources = target.sources || [];
    target.sources.push(apiName);
  }

  /**
   * Check if user has given consent for location tracking
   * @private
   */
  _hasConsent() {
    // Use the same privacy manager consent
    return window.services?.privacy?.hasPerformanceConsent() || 
           window.portfolioServices?.privacy?.hasPerformanceConsent() || 
           false;
  }

  /**
   * Get or create session ID
   * @private
   */
  _getSessionId() {
    let sessionId = sessionStorage.getItem('portfolio_session_id');
    
    if (!sessionId) {
      sessionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      sessionStorage.setItem('portfolio_session_id', sessionId);
    }
    
    return sessionId;
  }

  /**
   * Store visit data locally
   * @private
   */
  _storeVisit(visitData) {
    const visits = this._getStoredVisits();
    
    // Add new visit
    visits.push(visitData);
    
    // Keep only last 100 visits to manage storage
    const recentVisits = visits.slice(-100);
    
    localStorage.setItem('portfolio_visits', JSON.stringify(recentVisits));
  }

  /**
   * Get stored visits
   * @private
   */
  _getStoredVisits() {
    try {
      const stored = localStorage.getItem('portfolio_visits');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Failed to parse stored visits:', error);
      return [];
    }
  }

  /**
   * Send visit data to analytics service
   * @private
   */
  _sendToAnalytics(visitData) {
    // Send to Google Analytics if configured
    if (typeof gtag === 'function') {
      gtag('event', 'portfolio_visit', {
        country: visitData.location?.country,
        region: visitData.location?.region,
        referrer_domain: visitData.referrer ? new URL(visitData.referrer).hostname : 'direct',
        custom_parameter_location: JSON.stringify(visitData.location)
      });
    }

    // You could also send to other analytics services here
    // Example: Plausible, Mixpanel, custom analytics endpoint
  }

  /**
   * Sort and limit object entries
   * @private
   */
  _sortAndLimit(obj, limit) {
    return Object.entries(obj)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  }

  /**
   * Clear all location data
   */
  clearData() {
    localStorage.removeItem('portfolio_visits');
    sessionStorage.removeItem('portfolio_session_id');
    this.locationData = null;
    console.log('📍 Location data cleared');
  }
}

// Create singleton instance
export const locationService = new LocationService();

// Export class for custom instances
export { LocationService };

export default locationService;
