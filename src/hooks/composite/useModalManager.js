/**
 * Composite Modal Manager Hook
 * Combines modal state, keyboard interactions, and styling into one cohesive hook
 */

import { useCallback } from 'react';
import { useModal, useModalStyles, useKeyboardInteractions } from '@hooks';

/**
 * Enhanced modal management with integrated keyboard and styling
 * @param {Object} options - Configuration options
 * @param {Function} options.onEscape - Custom escape key handler
 * @param {Function} options.onArrowLeft - Custom left arrow handler
 * @param {Function} options.onArrowRight - Custom right arrow handler
 * @param {boolean} options.allowEnterInInputs - Allow enter in input fields
 * @returns {Object} Complete modal management interface
 */
export const useModalManager = (options = {}) => {
  const {
    onEscape,
    onArrowLeft,
    onArrowRight,
    allowEnterInInputs = true
  } = options;

  // Core modal functionality
  const modalState = useModal();
  const {
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
    isExpanded,
    loading,
    transitioning,
    setExpanded,
    setLoading,
    startTransition,
    completeTransition,
    loadViewer,
  } = modalState;

  // Apply modal styles when open
  useModalStyles(isModalOpen);

  // Enhanced close handler
  const handleClose = useCallback(() => {
    // Blur active element and close modal
    document.activeElement?.blur();
    closeModal();
    
    // Call custom escape handler if provided
    if (onEscape) {
      onEscape();
    }
  }, [closeModal, onEscape]);

  // Keyboard interaction setup
  useKeyboardInteractions({
    onEscape: handleClose,
    onArrowLeft: onArrowLeft || (() => {
      // Default: could add navigation logic here
      console.log('Modal: Left arrow pressed');
    }),
    onArrowRight: onArrowRight || (() => {
      // Default: could add navigation logic here  
      console.log('Modal: Right arrow pressed');
    }),
    allowEnterInInputs,
  });

  // Enhanced modal opening with loading states
  const openModalWithLoading = useCallback(async (content, options = {}) => {
    const { 
      expanded = false, 
      showLoading = false,
      onComplete 
    } = options;

    if (showLoading) {
      setLoading(true);
      startTransition();
    }

    try {
      openModal(content, expanded);
      
      if (showLoading) {
        // Simulate loading completion
        await new Promise(resolve => setTimeout(resolve, 300));
        completeTransition();
      }

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Modal opening error:', error);
      setLoading(false);
      closeModal();
    }
  }, [openModal, setLoading, startTransition, completeTransition, closeModal]);

  // Modal state helpers
  const modalHelpers = {
    isLoading: loading || transitioning,
    isFullyOpen: isModalOpen && !loading && !transitioning,
    canInteract: isModalOpen && !loading,
  };

  return {
    // Core state
    isModalOpen,
    modalContent,
    isExpanded,
    loading,
    transitioning,
    
    // Actions
    openModal: openModalWithLoading,
    closeModal: handleClose,
    setExpanded,
    startTransition,
    completeTransition,
    loadViewer,
    
    // Helpers
    ...modalHelpers,
    
    // Advanced features
    toggleExpanded: () => setExpanded(!isExpanded),
    
    // Debug info
    debugInfo: {
      isModalOpen,
      loading,
      transitioning,
      isExpanded,
    }
  };
};
