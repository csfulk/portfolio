import { useEffect, useCallback } from 'react';

/**
 * Unified image handling hook that consolidates preloading and lazy loading functionality
 * 
 * @param {string[]} images - Array of image URLs to handle
 * @param {Object} options - Configuration options
 * @param {boolean} options.preload - Whether to preload images immediately
 * @param {boolean} options.lazy - Whether to set up lazy loading with Intersection Observer
 * @param {boolean} options.logProgress - Whether to log loading progress (default: false)
 * @param {number} options.rootMargin - Intersection Observer root margin (default: '50px')
 * @param {number} options.threshold - Intersection Observer threshold (default: 0.1)
 */
export const useImageHandling = (images, options = {}) => {
  const {
    preload = false,
    lazy = false,
    logProgress = false,
    rootMargin = '50px',
    threshold = 0.1
  } = options;

  // Preload images immediately
  const preloadImages = useCallback((imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return;

    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
      
      if (logProgress) {
        img.onload = () => console.log(`✓ Preloaded: ${url}`);
        img.onerror = () => console.warn(`✗ Failed to preload: ${url}`);
      }
    });

    if (logProgress) {
      console.log(`🚀 Preloading ${imageUrls.length} images...`);
    }
  }, [logProgress]);

  // Set up lazy loading with Intersection Observer
  const setupLazyLoading = useCallback((imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const imgElement = entry.target;
            const src = imgElement.dataset.src;
            
            if (src) {
              const img = new Image();
              img.src = src;
              
              img.onload = () => {
                imgElement.src = src;
                imgElement.classList.remove('lazy-loading');
                imgElement.classList.add('lazy-loaded');
                observer.unobserve(imgElement);
                
                if (logProgress) {
                  console.log(`🔄 Lazy loaded: ${src}`);
                }
              };
              
              img.onerror = () => {
                imgElement.classList.add('lazy-error');
                observer.unobserve(imgElement);
                
                if (logProgress) {
                  console.warn(`✗ Failed to lazy load: ${src}`);
                }
              };
            }
          }
        });
      },
      {
        rootMargin,
        threshold
      }
    );

    // Observe all images with data-src attribute matching our URLs
    imageUrls.forEach((url) => {
      const imgElements = document.querySelectorAll(`[data-src="${url}"]`);
      imgElements.forEach((imgElement) => {
        imgElement.classList.add('lazy-loading');
        observer.observe(imgElement);
      });
    });

    if (logProgress && imageUrls.length > 0) {
      console.log(`👁️ Setting up lazy loading for ${imageUrls.length} images...`);
    }

    return observer;
  }, [rootMargin, threshold, logProgress]);

  useEffect(() => {
    let observer = null;

    if (preload && images) {
      preloadImages(images);
    }

    if (lazy && images) {
      observer = setupLazyLoading(images);
    }

    // Cleanup function
    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [images, preload, lazy, preloadImages, setupLazyLoading]);

  // Return utility functions for manual control if needed
  return {
    preloadImages,
    setupLazyLoading
  };
};

/**
 * Utility function to generate image URLs for case studies
 * Replaces the manual loop patterns used throughout the codebase
 * 
 * @param {string} folder - The folder path (e.g., '/assets/yt_case_study_00')
 * @param {number} count - Number of images
 * @param {string} fileName - Base filename (e.g., 'featured_ytlr')
 * @param {string} extension - File extension (default: 'webp')
 * @returns {string[]} Array of generated image URLs
 */
export const generateImageUrls = (folder, count, fileName, extension = 'webp') => {
  if (!folder || !count || !fileName) {
    console.warn('generateImageUrls: Missing required parameters', { folder, count, fileName });
    return [];
  }

  return Array.from({ length: count }, (_, i) => 
    `${folder}/${fileName}_${String(i + 1).padStart(2, '0')}.${extension}`
  );
};

/**
 * @deprecated Use getCaseStudyImages from caseStudyRegistry instead
 */
export const getCriticalImages = () => {
  console.warn('getCriticalImages is deprecated. Use getCaseStudyImages from caseStudyRegistry instead.');
  return [];
};

/**
 * @deprecated Use getCaseStudyImages from caseStudyRegistry instead
 */
export const getAllCaseStudyImages = () => {
  console.warn('getAllCaseStudyImages is deprecated. Use getCaseStudyImages from caseStudyRegistry instead.');
  return [];
};

export default useImageHandling;
