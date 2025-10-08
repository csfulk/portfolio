import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for lazy loading images with fade-in effect
 * @param {string} src - Image source URL
 * @param {number} threshold - Intersection threshold (default: 0.8 for 80%)
 * @returns {object} - { imgRef, isLoaded, isVisible }
 */
const useLazyImage = (src, threshold = 0.8) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const currentRef = imgRef.current;
    if (!currentRef || !src) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          
          // Start loading the image
          const img = new Image();
          img.onload = () => {
            setImageSrc(src);
            // Add a small delay to ensure smooth fade-in
            setTimeout(() => {
              setIsLoaded(true);
            }, 100);
          };
          img.onerror = () => {
            console.error(`Failed to load image: ${src}`);
            setImageSrc(src); // Still set the src to show broken image
            setIsLoaded(true);
          };
          img.src = src;
          
          // Stop observing once we've started loading
          observer.unobserve(currentRef);
        }
      },
      { 
        threshold,
        rootMargin: '0px 0px -20px 0px' // Slight margin to trigger just before fully visible
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, threshold]);

  return {
    imgRef,
    isLoaded,
    isVisible,
    imageSrc
  };
};

export default useLazyImage;
