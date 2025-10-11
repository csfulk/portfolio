import { useEffect } from 'react';

const useKeyboardInteractions = ({ onEscape, onArrowLeft, onArrowRight, allowEnterInInputs = true }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Allow Enter key to work within input fields
      if (allowEnterInInputs && e.target.tagName === 'INPUT' && e.key === 'Enter') {
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape?.();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onArrowLeft?.();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onArrowRight?.();
      } else if (['Enter', ' '].includes(e.key) && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        e.preventDefault(); // Prevent unintended actions (but allow in input fields)
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEscape, onArrowLeft, onArrowRight, allowEnterInInputs]);
};

export default useKeyboardInteractions;