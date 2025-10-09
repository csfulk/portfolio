/**
 * Image Service
 * Centralized image optimization, loading, and caching
 */

class ImageService {
  constructor() {
    this.cache = new Map();
    this.preloadQueue = new Set();
    this.loadingPromises = new Map();
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      failedLoads: 0,
      totalLoadTime: 0
    };
  }

  /**
   * Preload images with priority and caching
   * @param {string|string[]} urls - Image URL(s) to preload
   * @param {Object} options - Preload options
   * @returns {Promise} Promise that resolves when images are loaded
   */
  async preloadImages(urls, options = {}) {
    const {
      priority = 'low',
      timeout = 10000,
      retries = 3,
      onProgress,
      onError
    } = options;

    const urlArray = Array.isArray(urls) ? urls : [urls];
    const startTime = performance.now();

    this.stats.totalRequests += urlArray.length;

    try {
      const results = await Promise.allSettled(
        urlArray.map((url, index) => 
          this._loadSingleImage(url, { 
            priority, 
            timeout, 
            retries,
            onProgress: onProgress ? (progress) => onProgress(progress, index, urlArray.length) : null
          })
        )
      );

      const loadTime = performance.now() - startTime;
      this.stats.totalLoadTime += loadTime;

      const successful = results.filter(r => r.status === 'fulfilled');
      const failed = results.filter(r => r.status === 'rejected');

      if (failed.length > 0 && onError) {
        failed.forEach(failure => onError(failure.reason));
      }

      this.stats.failedLoads += failed.length;

      return {
        successful: successful.map(r => r.value),
        failed: failed.map(r => r.reason),
        totalTime: loadTime,
        stats: this.getStats()
      };
    } catch (error) {
      console.error('Image preloading failed:', error);
      throw error;
    }
  }

  /**
   * Load a single image with caching and retries
   * @private
   */
  async _loadSingleImage(url, options = {}) {
    const { priority = 'low', timeout = 10000, retries = 3, onProgress } = options;

    // Check cache first
    if (this.cache.has(url)) {
      this.stats.cacheHits++;
      onProgress?.(100);
      return this.cache.get(url);
    }

    this.stats.cacheMisses++;

    // Check if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const loadPromise = this._attemptImageLoad(url, { priority, timeout, retries, onProgress });
    this.loadingPromises.set(url, loadPromise);

    try {
      const result = await loadPromise;
      this.cache.set(url, result);
      return result;
    } finally {
      this.loadingPromises.delete(url);
    }
  }

  /**
   * Attempt to load image with retries
   * @private
   */
  async _attemptImageLoad(url, { priority, timeout, retries, onProgress }) {
    let lastError;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await this._createImagePromise(url, { priority, timeout, onProgress });
      } catch (error) {
        lastError = error;
        
        if (attempt < retries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Create promise for image loading
   * @private
   */
  _createImagePromise(url, { priority, timeout, onProgress }) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Set loading priority if supported
      if ('loading' in img) {
        img.loading = priority === 'high' ? 'eager' : 'lazy';
      }

      // Set crossorigin if needed
      if (url.includes('http') && !url.includes(window.location.origin)) {
        img.crossOrigin = 'anonymous';
      }

      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        onProgress?.(100);
        resolve({
          url,
          element: img,
          width: img.naturalWidth,
          height: img.naturalHeight,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          loadTime: performance.now()
        });
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error(`Failed to load image: ${url}`));
      };

      // Simulate progress for demonstration (in real app, you'd use fetch with progress)
      if (onProgress) {
        let progress = 0;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 30;
          if (progress >= 90) {
            clearInterval(progressInterval);
            return;
          }
          onProgress(Math.min(progress, 90));
        }, 100);
      }

      img.src = url;
    });
  }

  /**
   * Generate optimized image URLs
   * @param {string} baseUrl - Base image URL
   * @param {Object} options - Optimization options
   * @returns {string} Optimized URL
   */
  getOptimizedUrl(baseUrl, options = {}) {
    const {
      width,
      height,
      quality = 80,
      format = 'webp',
      fit = 'cover'
    } = options;

    // This would integrate with your image optimization service
    // For demo purposes, we'll return the original URL
    // In production, you'd use Cloudinary, ImageKit, etc.
    
    if (!width && !height) return baseUrl;

    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality !== 80) params.set('q', quality.toString());
    if (format !== 'webp') params.set('f', format);
    if (fit !== 'cover') params.set('fit', fit);

    return `${baseUrl}?${params.toString()}`;
  }

  /**
   * Generate responsive image set
   * @param {string} baseUrl - Base image URL
   * @param {number[]} breakpoints - Width breakpoints
   * @returns {string} srcSet string
   */
  generateSrcSet(baseUrl, breakpoints = [400, 800, 1200, 1600]) {
    return breakpoints
      .map(width => `${this.getOptimizedUrl(baseUrl, { width })} ${width}w`)
      .join(', ');
  }

  /**
   * Clear cache and reset stats
   */
  clearCache() {
    this.cache.clear();
    this.preloadQueue.clear();
    this.loadingPromises.clear();
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      failedLoads: 0,
      totalLoadTime: 0
    };
  }

  /**
   * Get performance statistics
   * @returns {Object} Performance stats
   */
  getStats() {
    const total = this.stats.cacheHits + this.stats.cacheMisses;
    return {
      ...this.stats,
      cacheHitRate: total > 0 ? (this.stats.cacheHits / total * 100).toFixed(2) : 0,
      averageLoadTime: this.stats.totalRequests > 0 ? (this.stats.totalLoadTime / this.stats.totalRequests).toFixed(2) : 0,
      cacheSize: this.cache.size
    };
  }

  /**
   * Set up intersection observer for lazy loading
   * @param {Object} options - Observer options
   * @returns {IntersectionObserver} Observer instance
   */
  createLazyObserver(options = {}) {
    const {
      rootMargin = '50px',
      threshold = 0.1,
      onIntersect
    } = options;

    return new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            
            if (src) {
              try {
                await this.preloadImages(src, { priority: 'high' });
                img.src = src;
                img.removeAttribute('data-src');
                onIntersect?.(img, entry);
              } catch (error) {
                console.error('Lazy load failed:', error);
                img.alt = 'Failed to load image';
              }
            }
          }
        });
      },
      { rootMargin, threshold }
    );
  }
}

// Create singleton instance
export const imageService = new ImageService();

// Export class for testing or custom instances
export { ImageService };

export default imageService;
