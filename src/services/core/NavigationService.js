/**
 * Navigation Service
 * Centralized navigation, scrolling, and routing management
 */

class NavigationService {
  constructor() {
    this.observers = new Map();
    this.scrollBehavior = 'smooth';
    this.offsetAdjustment = 0;
    this.activeSection = null;
    this.navigationHistory = [];
    this.callbacks = {
      onNavigate: [],
      onSectionChange: [],
      onScroll: []
    };
  }

  /**
   * Initialize navigation service
   * @param {Object} options - Configuration options
   */
  initialize(options = {}) {
    const {
      scrollBehavior = 'smooth',
      offsetAdjustment = 0,
      enableHistory = true,
      enableAnalytics = false
    } = options;

    this.scrollBehavior = scrollBehavior;
    this.offsetAdjustment = offsetAdjustment;
    this.enableHistory = enableHistory;
    this.enableAnalytics = enableAnalytics;

    // Set up scroll listener for section tracking
    this._setupScrollListener();
    
    // Set up popstate listener for history management
    if (enableHistory) {
      this._setupHistoryListener();
    }

    console.log('Navigation service initialized', { scrollBehavior, offsetAdjustment });
  }

  /**
   * Scroll to a section or element
   * @param {string|Element} target - CSS selector or DOM element
   * @param {Object} options - Scroll options
   */
  async scrollToSection(target, options = {}) {
    const {
      behavior = this.scrollBehavior,
      offset = this.offsetAdjustment,
      updateHistory = true,
      trackAnalytics = this.enableAnalytics
    } = options;

    try {
      const element = typeof target === 'string' 
        ? document.querySelector(target)
        : target;

      if (!element) {
        console.warn(`Navigation target not found: ${target}`);
        return false;
      }

      const elementRect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset + elementRect.top - offset;

      // Perform scroll
      window.scrollTo({
        top: scrollTop,
        behavior
      });

      // Update active section
      const sectionId = element.id || element.closest('[id]')?.id;
      if (sectionId) {
        this._setActiveSection(sectionId);
      }

      // Update browser history
      if (updateHistory && sectionId) {
        this._updateHistory(sectionId);
      }

      // Track analytics
      if (trackAnalytics) {
        this._trackNavigation(sectionId || target.toString(), 'scroll');
      }

      // Notify callbacks
      this._notifyCallbacks('onNavigate', {
        target: sectionId || target.toString(),
        method: 'scroll',
        timestamp: Date.now()
      });

      return true;
    } catch (error) {
      console.error('Scroll navigation failed:', error);
      return false;
    }
  }

  /**
   * Set up section visibility tracking
   * @param {string[]} sectionIds - Array of section IDs to track
   * @param {Object} options - Observer options
   */
  setupSectionTracking(sectionIds, options = {}) {
    const {
      rootMargin = '-20% 0px -20% 0px',
      threshold = 0.5
    } = options;

    // Clean up existing observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this._setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin, threshold }
    );

    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        this.observers.set(id, observer);
      } else {
        console.warn(`Section not found for tracking: ${id}`);
      }
    });
  }

  /**
   * Navigate to external URL
   * @param {string} url - Target URL
   * @param {Object} options - Navigation options
   */
  navigateToUrl(url, options = {}) {
    const {
      openInNewTab = false,
      trackAnalytics = this.enableAnalytics
    } = options;

    if (trackAnalytics) {
      this._trackNavigation(url, 'external');
    }

    if (openInNewTab) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }

    this._notifyCallbacks('onNavigate', {
      target: url,
      method: 'external',
      newTab: openInNewTab,
      timestamp: Date.now()
    });
  }

  /**
   * Create navigation menu items
   * @param {Array} sections - Section configuration
   * @returns {Array} Navigation items
   */
  createNavigationItems(sections) {
    return sections.map(section => ({
      id: section.id,
      label: section.label || section.title,
      href: `#${section.id}`,
      onClick: (e) => {
        e.preventDefault();
        this.scrollToSection(`#${section.id}`);
      },
      isActive: () => this.activeSection === section.id
    }));
  }

  /**
   * Get navigation breadcrumbs
   * @returns {Array} Breadcrumb items
   */
  getBreadcrumbs() {
    return this.navigationHistory.slice(-5).map((item, index, arr) => ({
      ...item,
      isCurrent: index === arr.length - 1
    }));
  }

  /**
   * Register callback for navigation events
   * @param {string} event - Event type (onNavigate, onSectionChange, onScroll)
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  }

  /**
   * Unregister callback
   * @param {string} event - Event type
   * @param {Function} callback - Callback function to remove
   */
  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  }

  /**
   * Get current active section
   * @returns {string|null} Active section ID
   */
  getActiveSection() {
    return this.activeSection;
  }

  /**
   * Get navigation statistics
   * @returns {Object} Navigation stats
   */
  getStats() {
    const sectionCounts = {};
    this.navigationHistory.forEach(item => {
      sectionCounts[item.target] = (sectionCounts[item.target] || 0) + 1;
    });

    return {
      totalNavigations: this.navigationHistory.length,
      uniqueSections: Object.keys(sectionCounts).length,
      mostVisited: Object.entries(sectionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      recentActivity: this.navigationHistory.slice(-10)
    };
  }

  /**
   * Set active section
   * @private
   */
  _setActiveSection(sectionId) {
    if (this.activeSection !== sectionId) {
      const previousSection = this.activeSection;
      this.activeSection = sectionId;

      this._notifyCallbacks('onSectionChange', {
        current: sectionId,
        previous: previousSection,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Update browser history
   * @private
   */
  _updateHistory(sectionId) {
    if (this.enableHistory) {
      const newUrl = `${window.location.pathname}#${sectionId}`;
      window.history.pushState({ sectionId }, '', newUrl);
      
      this.navigationHistory.push({
        target: sectionId,
        method: 'scroll',
        url: newUrl,
        timestamp: Date.now()
      });

      // Keep history reasonable size
      if (this.navigationHistory.length > 50) {
        this.navigationHistory = this.navigationHistory.slice(-30);
      }
    }
  }

  /**
   * Set up scroll listener
   * @private
   */
  _setupScrollListener() {
    let ticking = false;

    const scrollHandler = () => {
      this._notifyCallbacks('onScroll', {
        scrollY: window.scrollY,
        scrollX: window.scrollX,
        timestamp: Date.now()
      });
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          scrollHandler();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Set up history listener
   * @private
   */
  _setupHistoryListener() {
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.sectionId) {
        this.scrollToSection(`#${event.state.sectionId}`, { updateHistory: false });
      }
    });
  }

  /**
   * Track navigation for analytics
   * @private
   */
  _trackNavigation(target, method) {
    // This would integrate with your analytics service
    console.log('Navigation tracked:', { target, method, timestamp: Date.now() });
  }

  /**
   * Notify registered callbacks
   * @private
   */
  _notifyCallbacks(event, data) {
    this.callbacks[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Navigation callback error (${event}):`, error);
      }
    });
  }

  /**
   * Clean up service
   */
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.callbacks = { onNavigate: [], onSectionChange: [], onScroll: [] };
    this.navigationHistory = [];
  }
}

// Create singleton instance
export const navigationService = new NavigationService();

// Export class for testing or custom instances
export { NavigationService };

export default navigationService;
