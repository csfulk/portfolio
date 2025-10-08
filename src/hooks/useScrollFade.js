import { useState, useEffect, useRef } from 'react';

export const useScrollFade = (delay = 150) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef(null);
  const isManualScrollRef = useRef(false);

  useEffect(() => {
    const handleUserInput = () => {
      isManualScrollRef.current = true;
    };

    const handleScroll = () => {
      // Only trigger fade if this is manual scrolling
      if (isManualScrollRef.current) {
        if (!isScrolling) {
          setIsScrolling(true);
        }

        // Clear existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        // Set timeout to fade navigation back in after user stops scrolling
        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
          isManualScrollRef.current = false; // Reset manual scroll flag
        }, delay);
      }
    };

    // Listen for manual input events that would cause scrolling
    window.addEventListener('wheel', handleUserInput, { passive: true });
    window.addEventListener('touchstart', handleUserInput, { passive: true });
    window.addEventListener('keydown', handleUserInput, { passive: true }); // Arrow keys, page up/down, etc.
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('wheel', handleUserInput);
      window.removeEventListener('touchstart', handleUserInput);
      window.removeEventListener('keydown', handleUserInput);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [delay, isScrolling]);

  return isScrolling;
};
