/**
 * Performance Monitor
 * Comprehensive performance monitoring and optimization system
 */

import { privacyManager } from './PrivacyManager.js';

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.thresholds = new Map();
    this.callbacks = new Map();
    this.measurements = [];
    this.resourceTimings = [];
    this.vitals = new Map();
    
    this.isEnabled = false; // Start disabled until consent
    this.consentInitialized = false;
    this.maxMeasurements = 1000;
    this.reportingInterval = 30000; // 30 seconds
    
    // Don't initialize observers immediately - wait for consent
  }

  /**
   * Initialize with privacy consent check
   */
  async initializeWithConsent() {
    if (this.consentInitialized) return this.isEnabled;
    
    const hasConsent = await privacyManager.initializeConsent();
    
    if (hasConsent) {
      this.isEnabled = true;
      this._initializeObservers();
      this._startReporting();
      console.log('Performance monitoring initialized with consent');
    } else {
      this.isEnabled = false;
      console.log('Performance monitoring disabled - no consent');
    }
    
    this.consentInitialized = true;
    return this.isEnabled;
  }

  /**
   * Start measuring performance
   * @param {string} name - Measurement name
   * @param {Object} metadata - Additional metadata
   */
  startMeasurement(name, metadata = {}) {
    if (!this.isEnabled || !this._hasConsent()) return null;

    const id = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const measurement = {
      id,
      name,
      startTime: performance.now(),
      metadata,
      status: 'active'
    };

    this.metrics.set(id, measurement);
    
    console.debug(`Performance measurement started: ${name} (${id})`);
    
    return id;
  }

  /**
   * End measurement
   * @param {string} id - Measurement ID
   * @param {Object} additionalData - Additional measurement data
   */
  endMeasurement(id, additionalData = {}) {
    if (!this.isEnabled || !id) return null;

    const measurement = this.metrics.get(id);
    if (!measurement || measurement.status !== 'active') {
      console.warn(`Measurement not found or already ended: ${id}`);
      return null;
    }

    const endTime = performance.now();
    const duration = endTime - measurement.startTime;

    const completedMeasurement = {
      ...measurement,
      endTime,
      duration,
      status: 'completed',
      ...additionalData
    };

    this.metrics.set(id, completedMeasurement);
    this._recordMeasurement(completedMeasurement);

    console.debug(`Performance measurement completed: ${measurement.name} - ${duration.toFixed(2)}ms`);

    return completedMeasurement;
  }

  /**
   * Measure function execution time
   * @param {Function} fn - Function to measure
   * @param {string} name - Measurement name
   * @param {Object} metadata - Additional metadata
   */
  async measureFunction(fn, name, metadata = {}) {
    const id = this.startMeasurement(name, { type: 'function', ...metadata });
    
    try {
      const result = await fn();
      this.endMeasurement(id, { success: true });
      return result;
    } catch (error) {
      this.endMeasurement(id, { success: false, error: error.message });
      throw error;
    }
  }

  /**
   * Measure React component render time
   * @param {string} componentName - Component name
   * @returns {Object} Measurement hooks
   */
  measureComponent(componentName) {
    let measurementId = null;

    return {
      onRenderStart: (props = {}) => {
        measurementId = this.startMeasurement(`component:${componentName}`, {
          type: 'component',
          props: Object.keys(props)
        });
      },
      onRenderEnd: (additionalData = {}) => {
        if (measurementId) {
          this.endMeasurement(measurementId, additionalData);
        }
      }
    };
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals() {
    if (typeof window === 'undefined' || !this._hasConsent()) return;

    // Largest Contentful Paint (LCP)
    this._observeLCP();
    
    // First Input Delay (FID)
    this._observeFID();
    
    // Cumulative Layout Shift (CLS)
    this._observeCLS();
    
    // First Contentful Paint (FCP)
    this._observeFCP();
    
    // Time to First Byte (TTFB)
    this._observeTTFB();
  }

  /**
   * Monitor resource loading performance
   */
  monitorResources() {
    if (typeof window === 'undefined' || !this._hasConsent()) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          this._recordResourceTiming(entry);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
      this.observers.set('resource', observer);
    } catch (error) {
      console.warn('Resource performance monitoring not supported:', error);
    }
  }

  /**
   * Monitor memory usage
   */
  monitorMemory() {
    if (typeof window === 'undefined' || !window.performance.memory || !this._hasConsent()) {
      return;
    }

    const recordMemory = () => {
      const memory = window.performance.memory;
      
      this._recordMetric('memory', {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      });
    };

    // Record immediately and then every 10 seconds
    recordMemory();
    const interval = setInterval(recordMemory, 10000);
    
    this.observers.set('memory', () => clearInterval(interval));
  }

  /**
   * Set performance threshold
   * @param {string} metric - Metric name
   * @param {number} threshold - Threshold value (ms)
   * @param {Function} callback - Callback when threshold is exceeded
   */
  setThreshold(metric, threshold, callback) {
    this.thresholds.set(metric, { threshold, callback });
    console.log(`Performance threshold set: ${metric} > ${threshold}ms`);
  }

  /**
   * Get performance summary
   * @param {Object} options - Query options
   * @returns {Object} Performance summary
   */
  getSummary(options = {}) {
    const {
      timeframe = 300000, // 5 minutes default
      includeDetails = false
    } = options;

    const now = Date.now();
    const measurements = this.measurements.filter(
      m => now - m.startTime <= timeframe
    );

    const summary = {
      totalMeasurements: measurements.length,
      averageDuration: this._calculateAverage(measurements, 'duration'),
      medianDuration: this._calculateMedian(measurements, 'duration'),
      p95Duration: this._calculatePercentile(measurements, 'duration', 95),
      slowestMeasurements: measurements
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10),
      webVitals: Object.fromEntries(this.vitals),
      resourceSummary: this._summarizeResources(),
      memorySummary: this._summarizeMemory()
    };

    if (includeDetails) {
      summary.allMeasurements = measurements;
      summary.resourceTimings = this.resourceTimings;
    }

    return summary;
  }

  /**
   * Export performance data
   * @param {Object} options - Export options
   * @returns {string} JSON data
   */
  export(options = {}) {
    const {
      format = 'json',
      timeframe = null,
      includeRaw = false
    } = options;

    const summary = this.getSummary({ 
      timeframe: timeframe || 3600000, // 1 hour default
      includeDetails: includeRaw 
    });

    if (format === 'json') {
      return JSON.stringify(summary, null, 2);
    }

    // Could add other formats like CSV
    throw new Error(`Unsupported export format: ${format}`);
  }

  /**
   * Clear performance data
   */
  clear() {
    this.measurements = [];
    this.resourceTimings = [];
    this.vitals.clear();
    this.metrics.clear();
    
    console.log('Performance data cleared');
  }

  /**
   * Enable/disable performance monitoring
   * @param {boolean} enabled - Enable flag
   */
  setEnabled(enabled) {
    // Only allow enabling if we have consent
    if (enabled && !this._hasConsent()) {
      console.warn('Cannot enable performance monitoring without consent');
      return;
    }
    
    this.isEnabled = enabled;
    console.log(`Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Check if user has given consent
   * @private
   */
  _hasConsent() {
    return privacyManager.hasPerformanceConsent();
  }

  /**
   * Initialize performance observers
   * @private
   */
  _initializeObservers() {
    if (typeof window === 'undefined') return;

    // Monitor navigation timing
    this._observeNavigation();
    
    // Monitor long tasks
    this._observeLongTasks();
    
    // Monitor paint timing
    this._observePaintTiming();
  }

  /**
   * Start performance reporting
   * @private
   */
  _startReporting() {
    if (this.reportingInterval > 0) {
      const interval = setInterval(() => {
        this._generateReport();
      }, this.reportingInterval);

      this.observers.set('reporting', () => clearInterval(interval));
    }
  }

  /**
   * Record completed measurement
   * @private
   */
  _recordMeasurement(measurement) {
    // Add to measurements array
    this.measurements.push(measurement);
    
    // Trim array if it gets too large
    if (this.measurements.length > this.maxMeasurements) {
      this.measurements = this.measurements.slice(-this.maxMeasurements);
    }

    // Check thresholds
    this._checkThresholds(measurement);

    // Record as metric
    this._recordMetric(measurement.name, measurement);
  }

  /**
   * Record resource timing
   * @private
   */
  _recordResourceTiming(entry) {
    const timing = {
      name: entry.name,
      type: this._getResourceType(entry.name),
      duration: entry.duration,
      size: entry.transferSize,
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
      timestamp: Date.now()
    };

    this.resourceTimings.push(timing);
    
    // Trim array
    if (this.resourceTimings.length > this.maxMeasurements) {
      this.resourceTimings = this.resourceTimings.slice(-this.maxMeasurements);
    }

    // Check for slow resources
    if (timing.duration > 1000) { // 1 second threshold
      console.warn(`Slow resource detected: ${timing.name} (${timing.duration.toFixed(2)}ms)`);
    }
  }

  /**
   * Record general metric
   * @private
   */
  _recordMetric(name, value) {
    const metric = {
      name,
      value,
      timestamp: Date.now()
    };

    // Store in appropriate collection based on metric type
    if (name.startsWith('vital:')) {
      this.vitals.set(name, value);
    }
  }

  /**
   * Check performance thresholds
   * @private
   */
  _checkThresholds(measurement) {
    const threshold = this.thresholds.get(measurement.name);
    
    if (threshold && measurement.duration > threshold.threshold) {
      console.warn(`Performance threshold exceeded: ${measurement.name} (${measurement.duration.toFixed(2)}ms > ${threshold.threshold}ms)`);
      
      if (threshold.callback) {
        try {
          threshold.callback(measurement);
        } catch (error) {
          console.error('Threshold callback error:', error);
        }
      }
    }
  }

  /**
   * Observe Largest Contentful Paint
   * @private
   */
  _observeLCP() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this._recordMetric('vital:lcp', {
        value: lastEntry.startTime,
        element: lastEntry.element?.tagName,
        url: lastEntry.url
      });
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.set('lcp', observer);
    } catch (error) {
      console.warn('LCP observation not supported:', error);
    }
  }

  /**
   * Observe First Input Delay
   * @private
   */
  _observeFID() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this._recordMetric('vital:fid', {
          value: entry.processingStart - entry.startTime,
          eventType: entry.name
        });
      });
    });

    try {
      observer.observe({ entryTypes: ['first-input'] });
      this.observers.set('fid', observer);
    } catch (error) {
      console.warn('FID observation not supported:', error);
    }
  }

  /**
   * Observe Cumulative Layout Shift
   * @private
   */
  _observeCLS() {
    if (typeof window === 'undefined') return;

    let clsValue = 0;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          this._recordMetric('vital:cls', { value: clsValue });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['layout-shift'] });
      this.observers.set('cls', observer);
    } catch (error) {
      console.warn('CLS observation not supported:', error);
    }
  }

  /**
   * Observe First Contentful Paint
   * @private
   */
  _observeFCP() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this._recordMetric('vital:fcp', { value: entry.startTime });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('fcp', observer);
    } catch (error) {
      console.warn('FCP observation not supported:', error);
    }
  }

  /**
   * Observe Time to First Byte
   * @private
   */
  _observeTTFB() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const ttfb = entry.responseStart - entry.requestStart;
          this._recordMetric('vital:ttfb', { value: ttfb });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.set('ttfb', observer);
    } catch (error) {
      console.warn('TTFB observation not supported:', error);
    }
  }

  /**
   * Observe navigation timing
   * @private
   */
  _observeNavigation() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const navigation = {
          domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
          loadComplete: entry.loadEventEnd - entry.loadEventStart,
          domInteractive: entry.domInteractive - entry.navigationStart,
          totalTime: entry.loadEventEnd - entry.navigationStart
        };

        this._recordMetric('navigation', navigation);
      });
    });

    try {
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.set('navigation', observer);
    } catch (error) {
      console.warn('Navigation observation not supported:', error);
    }
  }

  /**
   * Observe long tasks
   * @private
   */
  _observeLongTasks() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
        
        this._recordMetric('longtask', {
          duration: entry.duration,
          startTime: entry.startTime
        });
      });
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.set('longtask', observer);
    } catch (error) {
      console.warn('Long task observation not supported:', error);
    }
  }

  /**
   * Observe paint timing
   * @private
   */
  _observePaintTiming() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this._recordMetric(`paint:${entry.name}`, {
          value: entry.startTime
        });
      });
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
      this.observers.set('paint', observer);
    } catch (error) {
      console.warn('Paint timing observation not supported:', error);
    }
  }

  /**
   * Get resource type from URL
   * @private
   */
  _getResourceType(url) {
    if (url.match(/\.(js|jsx|ts|tsx)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    if (url.match(/\.(json|xml)$/)) return 'xhr';
    return 'other';
  }

  /**
   * Calculate average of measurements
   * @private
   */
  _calculateAverage(measurements, field) {
    if (measurements.length === 0) return 0;
    
    const sum = measurements.reduce((acc, m) => acc + (m[field] || 0), 0);
    return sum / measurements.length;
  }

  /**
   * Calculate median of measurements
   * @private
   */
  _calculateMedian(measurements, field) {
    if (measurements.length === 0) return 0;
    
    const sorted = measurements
      .map(m => m[field] || 0)
      .sort((a, b) => a - b);
      
    const mid = Math.floor(sorted.length / 2);
    
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  /**
   * Calculate percentile of measurements
   * @private
   */
  _calculatePercentile(measurements, field, percentile) {
    if (measurements.length === 0) return 0;
    
    const sorted = measurements
      .map(m => m[field] || 0)
      .sort((a, b) => a - b);
      
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  /**
   * Summarize resource performance
   * @private
   */
  _summarizeResources() {
    if (this.resourceTimings.length === 0) return {};

    const byType = {};
    let totalSize = 0;
    let totalDuration = 0;

    this.resourceTimings.forEach(resource => {
      if (!byType[resource.type]) {
        byType[resource.type] = { count: 0, size: 0, duration: 0 };
      }
      
      byType[resource.type].count++;
      byType[resource.type].size += resource.size || 0;
      byType[resource.type].duration += resource.duration;
      
      totalSize += resource.size || 0;
      totalDuration += resource.duration;
    });

    return {
      totalResources: this.resourceTimings.length,
      totalSize,
      totalDuration,
      averageDuration: totalDuration / this.resourceTimings.length,
      byType
    };
  }

  /**
   * Summarize memory usage
   * @private
   */
  _summarizeMemory() {
    const memoryMetrics = this.measurements.filter(m => m.name === 'memory');
    
    if (memoryMetrics.length === 0) return {};

    const latest = memoryMetrics[memoryMetrics.length - 1];
    const peak = memoryMetrics.reduce((max, m) => 
      m.value.used > max.value.used ? m : max, memoryMetrics[0]);

    return {
      current: latest.value,
      peak: peak.value,
      measurements: memoryMetrics.length
    };
  }

  /**
   * Generate periodic performance report
   * @private
   */
  _generateReport() {
    const summary = this.getSummary();
    
    console.group('Performance Report');
    console.log('Measurements:', summary.totalMeasurements);
    console.log('Average Duration:', `${summary.averageDuration.toFixed(2)}ms`);
    console.log('95th Percentile:', `${summary.p95Duration.toFixed(2)}ms`);
    
    if (summary.webVitals && Object.keys(summary.webVitals).length > 0) {
      console.log('Web Vitals:', summary.webVitals);
    }
    
    console.groupEnd();
  }

  /**
   * Cleanup all observers
   */
  destroy() {
    this.observers.forEach((observer, name) => {
      if (typeof observer === 'function') {
        observer(); // Cleanup function
      } else if (observer && observer.disconnect) {
        observer.disconnect();
      }
    });
    
    this.observers.clear();
    this.clear();
    
    console.log('Performance monitor destroyed');
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export class for testing or custom instances  
export { PerformanceMonitor };

export default performanceMonitor;
