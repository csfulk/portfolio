/**
 * Example Analytics Plugin
 * Demonstrates plugin system architecture with comprehensive analytics tracking
 */

export const analyticsPlugin = {
  name: 'analytics',
  version: '1.0.0',
  dependencies: [], // No dependencies for this example
  
  /**
   * Plugin initialization
   * @param {Object} options - Plugin configuration options
   * @param {Object} api - Plugin API for interaction with plugin manager
   */
  async initialize(options, api) {
    const {
      trackingId = null,
      enableAutoTracking = true,
      enablePerformanceTracking = true,
      enableErrorTracking = true,
      enableUserInteractions = true,
      customDimensions = {},
      samplingRate = 100
    } = options;

    // Store configuration
    this.config = {
      trackingId,
      enableAutoTracking,
      enablePerformanceTracking,
      enableErrorTracking,
      enableUserInteractions,
      customDimensions,
      samplingRate
    };

    this.api = api;
    this.eventQueue = [];
    this.sessionId = this._generateSessionId();
    this.userId = this._getUserId();
    
    console.log('Analytics plugin initializing with config:', this.config);

    // Initialize analytics provider (e.g., Google Analytics, custom analytics)
    if (trackingId) {
      await this._initializeProvider(trackingId);
    }

    // Set up automatic tracking if enabled
    if (enableAutoTracking) {
      this._setupAutoTracking();
    }

    // Set up performance tracking
    if (enablePerformanceTracking) {
      this._setupPerformanceTracking();
    }

    // Set up error tracking
    if (enableErrorTracking) {
      this._setupErrorTracking();
    }

    // Set up user interaction tracking
    if (enableUserInteractions) {
      this._setupInteractionTracking();
    }

    // Register hooks with the plugin manager
    api.addHook('page-view', this.trackPageView.bind(this));
    api.addHook('user-action', this.trackEvent.bind(this));
    api.addHook('performance-metric', this.trackPerformance.bind(this));
    api.addHook('error-occurred', this.trackError.bind(this));

    // Start processing event queue
    this._startEventProcessor();

    console.log('Analytics plugin initialized successfully');
  },

  /**
   * Plugin destruction/cleanup
   */
  async destroy() {
    console.log('Analytics plugin destroying...');

    // Clean up event listeners
    if (this.cleanupFunctions) {
      this.cleanupFunctions.forEach(cleanup => cleanup());
    }

    // Process any remaining events
    await this._flushEventQueue();

    // Clear intervals
    if (this.processorInterval) {
      clearInterval(this.processorInterval);
    }

    console.log('Analytics plugin destroyed');
  },

  /**
   * Track page view
   * @param {Object} data - Page view data
   */
  trackPageView(data) {
    const event = {
      type: 'page_view',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      page: {
        title: document.title,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        ...data
      },
      customDimensions: this.config.customDimensions
    };

    this._queueEvent(event);
    console.debug('Page view tracked:', event);
  },

  /**
   * Track custom event
   * @param {Object} data - Event data
   */
  trackEvent(data) {
    const event = {
      type: 'custom_event',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      action: data.action || 'unknown',
      category: data.category || 'interaction',
      label: data.label || '',
      value: data.value || null,
      customDimensions: { ...this.config.customDimensions, ...data.customDimensions }
    };

    this._queueEvent(event);
    console.debug('Custom event tracked:', event);
  },

  /**
   * Track performance metrics
   * @param {Object} data - Performance data
   */
  trackPerformance(data) {
    if (!this.config.enablePerformanceTracking) return;

    const event = {
      type: 'performance',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      metric: data.metric || 'unknown',
      value: data.value,
      unit: data.unit || 'ms',
      metadata: data.metadata || {}
    };

    this._queueEvent(event);
    console.debug('Performance metric tracked:', event);
  },

  /**
   * Track errors
   * @param {Object} data - Error data
   */
  trackError(data) {
    if (!this.config.enableErrorTracking) return;

    const event = {
      type: 'error',
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      message: data.message || 'Unknown error',
      stack: data.stack || '',
      filename: data.filename || '',
      line: data.line || 0,
      column: data.column || 0,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    this._queueEvent(event);
    console.debug('Error tracked:', event);
  },

  /**
   * Set custom dimension
   * @param {string} key - Dimension key
   * @param {*} value - Dimension value
   */
  setCustomDimension(key, value) {
    this.config.customDimensions[key] = value;
    console.debug(`Custom dimension set: ${key} = ${value}`);
  },

  /**
   * Set user ID
   * @param {string} userId - User identifier
   */
  setUserId(userId) {
    this.userId = userId;
    console.debug(`User ID set: ${userId}`);
  },

  /**
   * Initialize analytics provider
   * @private
   */
  async _initializeProvider(trackingId) {
    // Example: Google Analytics 4 initialization
    if (typeof window !== 'undefined') {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() { window.dataLayer.push(arguments); };
      
      window.gtag('js', new Date());
      window.gtag('config', trackingId, {
        send_page_view: false, // We'll handle page views manually
        custom_map: this.config.customDimensions
      });

      console.log(`Analytics provider initialized with tracking ID: ${trackingId}`);
    }
  },

  /**
   * Set up automatic tracking
   * @private
   */
  _setupAutoTracking() {
    if (typeof window === 'undefined') return;

    const cleanupFunctions = [];

    // Track initial page load
    if (document.readyState === 'complete') {
      this.trackPageView({ loadType: 'initial' });
    } else {
      const onLoad = () => this.trackPageView({ loadType: 'initial' });
      window.addEventListener('load', onLoad);
      cleanupFunctions.push(() => window.removeEventListener('load', onLoad));
    }

    // Track page visibility changes
    const onVisibilityChange = () => {
      this.trackEvent({
        action: 'page_visibility_change',
        category: 'engagement',
        label: document.visibilityState
      });
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    cleanupFunctions.push(() => document.removeEventListener('visibilitychange', onVisibilityChange));

    // Track session duration (heartbeat)
    const heartbeatInterval = setInterval(() => {
      this.trackEvent({
        action: 'session_heartbeat',
        category: 'engagement',
        value: Date.now() - this.sessionStartTime
      });
    }, 30000); // Every 30 seconds

    cleanupFunctions.push(() => clearInterval(heartbeatInterval));

    this.cleanupFunctions = cleanupFunctions;
    this.sessionStartTime = Date.now();
  },

  /**
   * Set up performance tracking
   * @private
   */
  _setupPerformanceTracking() {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals when available
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          this.trackPerformance({
            metric: 'lcp',
            value: entry.startTime,
            unit: 'ms'
          });
        } else if (entry.entryType === 'first-input') {
          this.trackPerformance({
            metric: 'fid',
            value: entry.processingStart - entry.startTime,
            unit: 'ms'
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
    } catch (error) {
      console.warn('Performance observation not supported:', error);
    }

    // Track navigation timing
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        this.trackPerformance({
          metric: 'page_load_time',
          value: navigation.loadEventEnd - navigation.loadEventStart,
          unit: 'ms'
        });

        this.trackPerformance({
          metric: 'dom_content_loaded',
          value: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          unit: 'ms'
        });
      }
    });
  },

  /**
   * Set up error tracking
   * @private
   */
  _setupErrorTracking() {
    if (typeof window === 'undefined') return;

    // Track JavaScript errors
    const onError = (message, filename, line, column, error) => {
      this.trackError({
        message: message,
        filename: filename,
        line: line,
        column: column,
        stack: error ? error.stack : ''
      });
    };

    window.addEventListener('error', (event) => {
      onError(
        event.message,
        event.filename,
        event.lineno,
        event.colno,
        event.error
      );
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason ? event.reason.stack : ''
      });
    });
  },

  /**
   * Set up user interaction tracking
   * @private
   */
  _setupInteractionTracking() {
    if (typeof window === 'undefined') return;

    // Track clicks on important elements
    const onClickCapture = (event) => {
      const element = event.target;
      const tagName = element.tagName.toLowerCase();
      
      // Track button clicks
      if (tagName === 'button' || (tagName === 'a' && element.href)) {
        this.trackEvent({
          action: 'click',
          category: 'interaction',
          label: `${tagName}:${element.textContent?.trim() || element.id || element.className}`
        });
      }
    };

    document.addEventListener('click', onClickCapture, true);

    // Track form submissions
    const onFormSubmit = (event) => {
      const form = event.target;
      this.trackEvent({
        action: 'form_submit',
        category: 'interaction',
        label: form.id || form.className || 'unknown_form'
      });
    };

    document.addEventListener('submit', onFormSubmit);

    // Track scroll depth
    let maxScrollDepth = 0;
    const onScroll = () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollDepth > maxScrollDepth && scrollDepth % 25 === 0) {
        maxScrollDepth = scrollDepth;
        this.trackEvent({
          action: 'scroll_depth',
          category: 'engagement',
          value: scrollDepth
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
  },

  /**
   * Queue event for batch processing
   * @private
   */
  _queueEvent(event) {
    // Apply sampling rate
    if (Math.random() * 100 > this.config.samplingRate) {
      return;
    }

    this.eventQueue.push(event);

    // If queue gets too large, flush immediately
    if (this.eventQueue.length >= 50) {
      this._flushEventQueue();
    }
  },

  /**
   * Start event processor
   * @private
   */
  _startEventProcessor() {
    // Process events every 10 seconds
    this.processorInterval = setInterval(() => {
      this._flushEventQueue();
    }, 10000);
  },

  /**
   * Flush event queue to analytics provider
   * @private
   */
  async _flushEventQueue() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      // Send to analytics provider
      if (typeof window !== 'undefined' && window.gtag && this.config.trackingId) {
        events.forEach(event => {
          window.gtag('event', event.action || event.type, {
            event_category: event.category || event.type,
            event_label: event.label || '',
            value: event.value || undefined,
            custom_parameter_1: JSON.stringify(event.customDimensions || {}),
            session_id: event.sessionId,
            user_id: event.userId
          });
        });
      }

      // Also send to custom analytics endpoint if configured
      if (this.config.customEndpoint) {
        await fetch(this.config.customEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ events })
        });
      }

      console.debug(`Flushed ${events.length} analytics events`);

    } catch (error) {
      console.error('Failed to send analytics events:', error);
      // Re-queue events on failure (with limit to prevent memory issues)
      if (this.eventQueue.length < 100) {
        this.eventQueue.unshift(...events);
      }
    }
  },

  /**
   * Generate session ID
   * @private
   */
  _generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Get or generate user ID
   * @private
   */
  _getUserId() {
    if (typeof window === 'undefined') return 'server-user';
    
    let userId = localStorage.getItem('analytics_user_id');
    if (!userId) {
      userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
      localStorage.setItem('analytics_user_id', userId);
    }
    return userId;
  }
};
