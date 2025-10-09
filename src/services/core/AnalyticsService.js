/**
 * Analytics Service
 * Performance monitoring, user interaction tracking, and error reporting
 */

class AnalyticsService {
  constructor() {
    this.enabled = false;
    this.events = [];
    this.performanceMetrics = new Map();
    this.userSession = {
      sessionId: this._generateSessionId(),
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      errors: 0
    };
    this.providers = new Map();
    this.config = {
      batchSize: 10,
      flushInterval: 5000,
      maxEvents: 1000,
      enablePerformanceTracking: true,
      enableUserTracking: true,
      enableErrorTracking: true
    };
  }

  /**
   * Initialize analytics service
   * @param {Object} options - Configuration options
   */
  initialize(options = {}) {
    this.config = { ...this.config, ...options };
    this.enabled = true;

    // Set up performance monitoring
    if (this.config.enablePerformanceTracking) {
      this._setupPerformanceTracking();
    }

    // Set up error tracking
    if (this.config.enableErrorTracking) {
      this._setupErrorTracking();
    }

    // Set up automatic flushing
    this._setupAutoFlush();

    // Track page view
    this.trackPageView();

    console.log('Analytics service initialized', this.config);
  }

  /**
   * Add analytics provider
   * @param {string} name - Provider name
   * @param {Object} provider - Provider implementation
   */
  addProvider(name, provider) {
    if (!provider.track || typeof provider.track !== 'function') {
      throw new Error(`Provider ${name} must implement track() method`);
    }
    
    this.providers.set(name, provider);
    console.log(`Analytics provider added: ${name}`);
  }

  /**
   * Track custom event
   * @param {string} category - Event category
   * @param {string} action - Event action
   * @param {Object} data - Additional event data
   */
  trackEvent(category, action, data = {}) {
    if (!this.enabled) return;

    const event = {
      id: this._generateId(),
      type: 'event',
      category,
      action,
      data,
      timestamp: Date.now(),
      sessionId: this.userSession.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this._addEvent(event);
    this.userSession.interactions++;

    // Track with providers
    this.providers.forEach(provider => {
      try {
        provider.track('event', event);
      } catch (error) {
        console.error('Provider tracking failed:', error);
      }
    });
  }

  /**
   * Track page view
   * @param {string} path - Optional custom path
   */
  trackPageView(path = window.location.pathname) {
    if (!this.enabled) return;

    const pageView = {
      id: this._generateId(),
      type: 'pageView',
      path,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: this.userSession.sessionId
    };

    this._addEvent(pageView);
    this.userSession.pageViews++;

    this.providers.forEach(provider => {
      try {
        provider.track('pageView', pageView);
      } catch (error) {
        console.error('Provider tracking failed:', error);
      }
    });
  }

  /**
   * Track performance metric
   * @param {string} name - Metric name
   * @param {number} value - Metric value
   * @param {Object} context - Additional context
   */
  trackPerformance(name, value, context = {}) {
    if (!this.enabled || !this.config.enablePerformanceTracking) return;

    const metric = {
      id: this._generateId(),
      type: 'performance',
      name,
      value,
      context,
      timestamp: Date.now(),
      sessionId: this.userSession.sessionId
    };

    this.performanceMetrics.set(name, metric);
    this._addEvent(metric);

    this.providers.forEach(provider => {
      try {
        provider.track('performance', metric);
      } catch (error) {
        console.error('Provider tracking failed:', error);
      }
    });
  }

  /**
   * Track error
   * @param {Error|string} error - Error object or message
   * @param {Object} context - Additional context
   */
  trackError(error, context = {}) {
    if (!this.enabled || !this.config.enableErrorTracking) return;

    const errorEvent = {
      id: this._generateId(),
      type: 'error',
      message: error.message || error.toString(),
      stack: error.stack,
      context,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: this.userSession.sessionId
    };

    this._addEvent(errorEvent);
    this.userSession.errors++;

    this.providers.forEach(provider => {
      try {
        provider.track('error', errorEvent);
      } catch (error) {
        console.error('Provider tracking failed:', error);
      }
    });
  }

  /**
   * Track user interaction timing
   * @param {string} action - Action name
   * @param {Function} fn - Function to time
   * @returns {*} Function result
   */
  async trackTiming(action, fn) {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      this.trackPerformance(`timing_${action}`, duration, {
        action,
        success: true
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.trackPerformance(`timing_${action}`, duration, {
        action,
        success: false,
        error: error.message
      });
      
      this.trackError(error, { action, timing: true });
      throw error;
    }
  }

  /**
   * Create timing decorator
   * @param {string} name - Timer name
   * @returns {Function} Decorator function
   */
  createTimer(name) {
    const startTime = performance.now();
    
    return {
      end: (context = {}) => {
        const duration = performance.now() - startTime;
        this.trackPerformance(name, duration, context);
        return duration;
      }
    };
  }

  /**
   * Get analytics summary
   * @returns {Object} Analytics summary
   */
  getSummary() {
    const sessionDuration = Date.now() - this.userSession.startTime;
    
    const eventsByType = {};
    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    });

    const performanceStats = {};
    this.performanceMetrics.forEach((metric, name) => {
      performanceStats[name] = {
        value: metric.value,
        timestamp: metric.timestamp
      };
    });

    return {
      session: {
        ...this.userSession,
        duration: sessionDuration,
        durationFormatted: this._formatDuration(sessionDuration)
      },
      events: {
        total: this.events.length,
        byType: eventsByType
      },
      performance: performanceStats,
      config: this.config,
      providers: Array.from(this.providers.keys())
    };
  }

  /**
   * Export analytics data
   * @param {string} format - Export format ('json', 'csv')
   * @returns {string} Exported data
   */
  exportData(format = 'json') {
    const data = {
      summary: this.getSummary(),
      events: this.events,
      performanceMetrics: Array.from(this.performanceMetrics.values())
    };

    switch (format) {
      case 'csv':
        return this._exportToCsv(data.events);
      case 'json':
      default:
        return JSON.stringify(data, null, 2);
    }
  }

  /**
   * Flush events to providers
   */
  flush() {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    this.providers.forEach(provider => {
      try {
        if (provider.flush) {
          provider.flush(eventsToFlush);
        }
      } catch (error) {
        console.error('Provider flush failed:', error);
      }
    });
  }

  /**
   * Clear all data
   */
  clear() {
    this.events = [];
    this.performanceMetrics.clear();
    this.userSession = {
      sessionId: this._generateSessionId(),
      startTime: Date.now(),
      pageViews: 0,
      interactions: 0,
      errors: 0
    };
  }

  /**
   * Disable analytics
   */
  disable() {
    this.enabled = false;
    this.flush();
  }

  /**
   * Setup performance tracking
   * @private
   */
  _setupPerformanceTracking() {
    // Track Web Vitals if available
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.trackPerformance(entry.name, entry.duration, {
              entryType: entry.entryType,
              startTime: entry.startTime
            });
          }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'paint'] });
      } catch (error) {
        console.warn('Performance observer setup failed:', error);
      }
    }

    // Track basic metrics
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
          this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          this.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
        }
      }, 0);
    });
  }

  /**
   * Setup error tracking
   * @private
   */
  _setupErrorTracking() {
    window.addEventListener('error', (event) => {
      this.trackError(event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        type: 'javascript'
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason, {
        type: 'promise_rejection'
      });
    });
  }

  /**
   * Setup automatic flushing
   * @private
   */
  _setupAutoFlush() {
    setInterval(() => {
      if (this.events.length >= this.config.batchSize) {
        this.flush();
      }
    }, this.config.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  /**
   * Add event to queue
   * @private
   */
  _addEvent(event) {
    this.events.push(event);
    
    // Prevent memory overflow
    if (this.events.length > this.config.maxEvents) {
      this.events = this.events.slice(-this.config.maxEvents);
    }
  }

  /**
   * Generate unique ID
   * @private
   */
  _generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate session ID
   * @private
   */
  _generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format duration
   * @private
   */
  _formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Export events to CSV
   * @private
   */
  _exportToCsv(events) {
    if (events.length === 0) return '';
    
    const headers = Object.keys(events[0]).join(',');
    const rows = events.map(event => 
      Object.values(event).map(value => 
        typeof value === 'object' ? JSON.stringify(value) : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }
}

// Create singleton instance
export const analyticsService = new AnalyticsService();

// Export class for testing or custom instances
export { AnalyticsService };

export default analyticsService;
