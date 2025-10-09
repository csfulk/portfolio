/**
 * UI State Management Hook
 * Manages common UI patterns like loading, error, expanded states
 */

import { useState, useCallback, useReducer, useMemo } from 'react';

// UI State reducer for complex state management
const uiStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_SUCCESS':
      return { ...state, success: action.payload, loading: false, error: null };
    
    case 'SET_EXPANDED':
      return { ...state, expanded: action.payload };
    
    case 'SET_VISIBLE':
      return { ...state, visible: action.payload };
    
    case 'RESET':
      return { loading: false, error: null, success: false, expanded: false, visible: true };
    
    case 'TOGGLE_EXPANDED':
      return { ...state, expanded: !state.expanded };
    
    case 'TOGGLE_VISIBLE':
      return { ...state, visible: !state.visible };
    
    default:
      return state;
  }
};

/**
 * Comprehensive UI state management
 * @param {Object} initialState - Initial UI state
 * @param {Object} options - Configuration options
 * @param {boolean} options.enableTransitions - Enable transition states
 * @param {number} options.successTimeout - Auto-clear success after ms
 * @param {number} options.errorTimeout - Auto-clear error after ms
 * @returns {Object} UI state management interface
 */
export const useUIState = (initialState = {}, options = {}) => {
  const {
    enableTransitions = false,
    successTimeout = 3000,
    errorTimeout = 5000
  } = options;

  // Default initial state
  const defaultState = {
    loading: false,
    error: null,
    success: false,
    expanded: false,
    visible: true,
    ...initialState
  };

  const [state, dispatch] = useReducer(uiStateReducer, defaultState);
  const [transitioning, setTransitioning] = useState(false);

  // Action creators
  const setLoading = useCallback((loading = true) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    
    if (errorTimeout && error) {
      setTimeout(() => {
        dispatch({ type: 'SET_ERROR', payload: null });
      }, errorTimeout);
    }
  }, [errorTimeout]);

  const setSuccess = useCallback((success = true) => {
    dispatch({ type: 'SET_SUCCESS', payload: success });
    
    if (successTimeout && success) {
      setTimeout(() => {
        dispatch({ type: 'SET_SUCCESS', payload: false });
      }, successTimeout);
    }
  }, [successTimeout]);

  const setExpanded = useCallback((expanded) => {
    if (enableTransitions) {
      setTransitioning(true);
      setTimeout(() => {
        dispatch({ type: 'SET_EXPANDED', payload: expanded });
        setTransitioning(false);
      }, 150);
    } else {
      dispatch({ type: 'SET_EXPANDED', payload: expanded });
    }
  }, [enableTransitions]);

  const setVisible = useCallback((visible) => {
    dispatch({ type: 'SET_VISIBLE', payload: visible });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    setTransitioning(false);
  }, []);

  const toggleExpanded = useCallback(() => {
    dispatch({ type: 'TOGGLE_EXPANDED' });
  }, []);

  const toggleVisible = useCallback(() => {
    dispatch({ type: 'TOGGLE_VISIBLE' });
  }, []);

  // Async operation wrapper
  const handleAsyncOperation = useCallback(async (operation, options = {}) => {
    const { 
      loadingMessage = 'Loading...',
      successMessage = 'Success!',
      showSuccess = true,
      onSuccess,
      onError
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      const result = await operation();
      
      if (showSuccess) {
        setSuccess(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const errorMessage = error.message || 'An error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setSuccess]);

  // Computed state values
  const computedState = useMemo(() => ({
    isLoading: state.loading,
    hasError: !!state.error,
    isSuccess: !!state.success,
    isExpanded: state.expanded,
    isVisible: state.visible,
    isTransitioning: transitioning,
    
    // Compound states
    canInteract: !state.loading && !transitioning,
    showContent: state.visible && !state.loading,
    isIdle: !state.loading && !state.error && !state.success,
  }), [state, transitioning]);

  // CSS class helpers
  const getClassNames = useCallback((baseClass = '') => {
    const classes = [baseClass].filter(Boolean);
    
    if (state.loading) classes.push('loading');
    if (state.error) classes.push('error');
    if (state.success) classes.push('success');
    if (state.expanded) classes.push('expanded');
    if (!state.visible) classes.push('hidden');
    if (transitioning) classes.push('transitioning');
    
    return classes.join(' ');
  }, [state, transitioning]);

  return {
    // State
    ...state,
    ...computedState,
    
    // Actions
    setLoading,
    setError,
    setSuccess,
    setExpanded,
    setVisible,
    reset,
    toggleExpanded,
    toggleVisible,
    
    // Advanced operations
    handleAsyncOperation,
    
    // Utilities
    getClassNames,
    
    // Debug info
    debugInfo: {
      state,
      transitioning,
      ...computedState
    }
  };
};
