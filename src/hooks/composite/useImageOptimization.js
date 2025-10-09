/**
 * Enhanced Image Optimization Hook
 * Combines image handling, lazy loading, and performance optimizations
 */

import { useCallback, useMemo, useRef } from 'react';
import { useImageHandling, useLazyImage } from '@hooks';

/**
 * Advanced image management with performance optimizations
 * @param {Object} options - Configuration options
 * @param {Array} options.criticalImages - Images to preload immediately
 * @param {Array} options.lazyImages - Images to lazy load
 * @param {string} options.primaryImage - Main image for lazy loading
 * @param {Object} options.lazyOptions - Lazy loading configuration
 * @param {boolean} options.enablePreloading - Enable preloading (default: true)
 * @param {boolean} options.logProgress - Log loading progress (default: false)
 * @returns {Object} Enhanced image management interface
 */
export const useImageOptimization = (options = {}) => {
  const {
    criticalImages = [],
    lazyImages = [],
    primaryImage,
    lazyOptions = {},
    enablePreloading = true,
    logProgress = false
  } = options;

  const loadingStates = useRef(new Map());
  const errorStates = useRef(new Map());

  // Enhanced lazy loading configuration
  const enhancedLazyOptions = {
    rootMargin: '50px',
    threshold: 0.1,
    ...lazyOptions
  };

  // Critical image preloading
  useImageHandling(criticalImages, {
    preload: enablePreloading && criticalImages.length > 0,
    logProgress
  });

  // Lazy image setup for non-critical images
  useImageHandling(lazyImages, {
    lazy: lazyImages.length > 0,
    ...enhancedLazyOptions,
    logProgress
  });

  // Primary image lazy loading (for hero images, etc.)
  const primaryImageState = useLazyImage(
    primaryImage,
    enhancedLazyOptions.threshold
  );

  // Image loading state management
  const trackImageLoading = useCallback((imageUrl, isLoading) => {
    loadingStates.current.set(imageUrl, isLoading);
  }, []);

  const trackImageError = useCallback((imageUrl, hasError) => {
    errorStates.current.set(imageUrl, hasError);
  }, []);

  // Batch image operations
  const preloadImageBatch = useCallback((imageUrls, options = {}) => {
    if (!imageUrls || imageUrls.length === 0) return Promise.resolve([]);

    const { timeout = 10000, priority = 'low' } = options;

    return Promise.allSettled(
      imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          
          // Set priority if supported
          if ('loading' in img) {
            img.loading = priority === 'high' ? 'eager' : 'lazy';
          }
          
          const timeoutId = setTimeout(() => {
            reject(new Error(`Image loading timeout: ${url}`));
          }, timeout);

          img.onload = () => {
            clearTimeout(timeoutId);
            trackImageLoading(url, false);
            resolve(url);
          };

          img.onerror = () => {
            clearTimeout(timeoutId);
            trackImageError(url, true);
            reject(new Error(`Failed to load image: ${url}`));
          };

          trackImageLoading(url, true);
          img.src = url;
        });
      })
    );
  }, [trackImageLoading, trackImageError]);

  // Image URL utilities
  const generateResponsiveUrls = useCallback((basePath, sizes = [400, 800, 1200], format = 'webp') => {
    return sizes.map(size => `${basePath}_${size}w.${format}`);
  }, []);

  const getOptimizedImageUrl = useCallback((url, options = {}) => {
    const { width, height, quality = 80, format = 'webp' } = options;
    
    // This would integrate with your image optimization service
    // For now, return the original URL
    // In production, you might use services like Cloudinary, ImageKit, etc.
    
    if (!width && !height) return url;
    
    // Mock implementation - replace with your actual image optimization service
    const params = new URLSearchParams();
    if (width) params.set('w', width);
    if (height) params.set('h', height);
    if (quality) params.set('q', quality);
    if (format) params.set('f', format);
    
    return `${url}?${params.toString()}`;
  }, []);

  // Performance monitoring
  const imageStats = useMemo(() => {
    const totalImages = criticalImages.length + lazyImages.length + (primaryImage ? 1 : 0);
    const loadingCount = Array.from(loadingStates.current.values()).filter(Boolean).length;
    const errorCount = Array.from(errorStates.current.values()).filter(Boolean).length;
    
    return {
      totalImages,
      loadingCount,
      errorCount,
      loadedCount: totalImages - loadingCount - errorCount,
      loadProgress: totalImages > 0 ? ((totalImages - loadingCount) / totalImages) * 100 : 100
    };
  }, [criticalImages.length, lazyImages.length, primaryImage]);

  return {
    // Primary image state (for hero images, etc.)
    primaryImage: {
      ...primaryImageState,
      isOptimized: !!primaryImage
    },
    
    // Batch operations
    preloadImageBatch,
    
    // URL utilities
    generateResponsiveUrls,
    getOptimizedImageUrl,
    
    // State tracking
    trackImageLoading,
    trackImageError,
    
    // Performance stats
    imageStats,
    
    // Utilities
    isImageLoading: (url) => loadingStates.current.get(url) || false,
    hasImageError: (url) => errorStates.current.get(url) || false,
    
    // Debug helpers
    debugInfo: {
      criticalCount: criticalImages.length,
      lazyCount: lazyImages.length,
      ...imageStats
    }
  };
};
