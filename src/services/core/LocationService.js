/**
 * Location Analytics Service
 * Collects visitor location data for portfolio analytics
 */

import { privacyManager } from './PrivacyManager.js';
import { analyticsTransport } from './analyticsTransport.js';

class LocationService {
  constructor() {
    this.locationData = null;
    this.isEnabled = false;
  }

  /**
   * Initialize location tracking with consent
   */
  async initialize() {
    if (!this._hasConsent()) {
      console.log('Location tracking disabled - no consent');
      return false;
    }
    // Geo is now derived SERVER-SIDE (from the real request IP) in the `ingest`
    // edge function — the client no longer calls IP-geo APIs. We only keep the
    // consent gate here so a declining visitor produces no visit row.
    this.isEnabled = true;
    return true;
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
    if (!this.isEnabled) return; // consent-gated in initialize()

    // Client-only fields; the server adds geo (from real IP) + device/browser/os
    // (from the User-Agent header) + owner tagging before writing the visit row.
    analyticsTransport.enqueueVisit({
      referrer: document.referrer || null,
      page: pageData.page ?? window.location.pathname,
      language: navigator.language || null,
      screen_width: screen.width,
      screen_height: screen.height,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
    });
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
        } catch {
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
   * Check if user has given consent for location tracking.
   * Uses the imported singleton directly so this works even before
   * window.portfolioServices is populated.
   * @private
   */
  _hasConsent() {
    return privacyManager.hasPerformanceConsent();
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
