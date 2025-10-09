/**
 * Common Interaction Patterns Hook
 * Handles focus management, click outside, drag and drop, etc.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Enhanced interaction patterns for common UI needs
 * @param {Object} options - Configuration options
 * @returns {Object} Interaction utilities and handlers
 */
export const useInteractionPatterns = (options = {}) => {
  const {
    enableFocusTrap = false,
    enableClickOutside = false,
    enableDragAndDrop = false,
    enableHover = false,
    debounceDelay = 300
  } = options;

  // Refs for element tracking
  const containerRef = useRef(null);
  const focusableElementsRef = useRef([]);
  
  // State management
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Debounce utility
  const debounceRef = useRef(null);
  const debounce = useCallback((func, delay = debounceDelay) => {
    return (...args) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => func(...args), delay);
    };
  }, [debounceDelay]);

  // Focus trap implementation
  const setupFocusTrap = useCallback(() => {
    if (!enableFocusTrap || !containerRef.current) return;

    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"]):not([disabled])',
      '[contenteditable]:not([contenteditable="false"])'
    ].join(', ');

    focusableElementsRef.current = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    );

    if (focusableElementsRef.current.length === 0) return;

    const firstElement = focusableElementsRef.current[0];
    const lastElement = focusableElementsRef.current[focusableElementsRef.current.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [enableFocusTrap]);

  // Click outside implementation
  const setupClickOutside = useCallback((callback) => {
    if (!enableClickOutside || !containerRef.current) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        callback(event);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [enableClickOutside]);

  // Drag and drop implementation
  const setupDragAndDrop = useCallback((options = {}) => {
    if (!enableDragAndDrop || !containerRef.current) return;

    const {
      onDragStart,
      onDrag,
      onDragEnd,
      dragConstraints = null // { x: [min, max], y: [min, max] }
    } = options;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // Only left mouse button

      setIsDragging(true);
      
      const rect = containerRef.current.getBoundingClientRect();
      const offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      setDragOffset(offset);
      onDragStart?.(e, offset);

      const handleMouseMove = (moveEvent) => {
        if (!isDragging) return;

        let newX = moveEvent.clientX - offset.x;
        let newY = moveEvent.clientY - offset.y;

        // Apply constraints if provided
        if (dragConstraints) {
          if (dragConstraints.x) {
            newX = Math.max(dragConstraints.x[0], Math.min(dragConstraints.x[1], newX));
          }
          if (dragConstraints.y) {
            newY = Math.max(dragConstraints.y[0], Math.min(dragConstraints.y[1], newY));
          }
        }

        onDrag?.(moveEvent, { x: newX, y: newY });
      };

      const handleMouseUp = (upEvent) => {
        setIsDragging(false);
        onDragEnd?.(upEvent);
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    containerRef.current.addEventListener('mousedown', handleMouseDown);

    return () => {
      containerRef.current?.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enableDragAndDrop, isDragging]);

  // Hover state management
  const setupHoverHandlers = useCallback(() => {
    if (!enableHover || !containerRef.current) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    containerRef.current.addEventListener('mouseenter', handleMouseEnter);
    containerRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enableHover]);

  // Gesture recognition (basic swipe detection)
  const useSwipeGesture = useCallback((onSwipe) => {
    const touchStart = useRef(null);
    const touchEnd = useRef(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
      touchEnd.current = null;
      touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      };
    };

    const onTouchMove = (e) => {
      touchEnd.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY
      };
    };

    const onTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;

      const distanceX = touchStart.current.x - touchEnd.current.x;
      const distanceY = touchStart.current.y - touchEnd.current.y;
      
      const isLeftSwipe = distanceX > minSwipeDistance;
      const isRightSwipe = distanceX < -minSwipeDistance;
      const isUpSwipe = distanceY > minSwipeDistance;
      const isDownSwipe = distanceY < -minSwipeDistance;

      if (isLeftSwipe) onSwipe?.('left', distanceX);
      if (isRightSwipe) onSwipe?.('right', Math.abs(distanceX));
      if (isUpSwipe) onSwipe?.('up', distanceY);
      if (isDownSwipe) onSwipe?.('down', Math.abs(distanceY));
    };

    if (containerRef.current) {
      const element = containerRef.current;
      element.addEventListener('touchstart', onTouchStart);
      element.addEventListener('touchmove', onTouchMove);
      element.addEventListener('touchend', onTouchEnd);

      return () => {
        element.removeEventListener('touchstart', onTouchStart);
        element.removeEventListener('touchmove', onTouchMove);
        element.removeEventListener('touchend', onTouchEnd);
      };
    }
  }, []);

  // Setup effects
  useEffect(() => {
    const cleanupFunctions = [];

    if (enableFocusTrap) {
      const cleanup = setupFocusTrap();
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    if (enableHover) {
      const cleanup = setupHoverHandlers();
      if (cleanup) cleanupFunctions.push(cleanup);
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [setupFocusTrap, setupHoverHandlers, enableFocusTrap, enableHover]);

  return {
    // Ref to attach to container
    containerRef,
    
    // State
    isDragging,
    isHovered,
    dragOffset,
    
    // Utilities
    debounce,
    useSwipeGesture,
    
    // Setup functions for manual control
    setupFocusTrap,
    setupClickOutside,
    setupDragAndDrop,
    
    // Helper methods
    focusFirst: () => focusableElementsRef.current[0]?.focus(),
    focusLast: () => focusableElementsRef.current[focusableElementsRef.current.length - 1]?.focus(),
    
    // Debug info
    debugInfo: {
      focusableCount: focusableElementsRef.current.length,
      isDragging,
      isHovered,
      dragOffset
    }
  };
};
