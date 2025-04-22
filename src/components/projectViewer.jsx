import React, { useState, useEffect, useRef } from 'react';
import Button from './button';
import '../styles/ProjectViewer.css'; // Optional: for styling


const FeaturedProjectViewer = ({ title, images, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);

  const containerRef = useRef(null);

  const showPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const showNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const resetToFirstImage = () => {
    setCurrentIndex(0); // Reset to the first image
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        showPrevious();
      } else if (e.key === 'ArrowRight') {
        showNext();
      } else if (e.key === 'r' || e.key === 'R') {
        resetToFirstImage(); // Reset to the first image when "R" is pressed
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]); // Dependency ensures the effect updates with the current index

  useEffect(() => {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(focusableSelectors);
    if (elements.length === 0) return;
    const firstEl = elements[0];
    const lastEl = elements[elements.length - 1];
    firstEl.focus();
    const handleTrap = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    containerRef.current.addEventListener('keydown', handleTrap);
    return () => containerRef.current?.removeEventListener('keydown', handleTrap);
  }, []);

  useEffect(() => {
    // trigger fade-in once the viewer mounts
    const timer = setTimeout(() => setContentVisible(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="project-viewer"
      ref={containerRef}
      role="dialog"
      aria-modal="true"
    >
      {/* Close Button */}
      <button
        type="button"
        className="close-button"
        aria-label="Close dialog"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ×
      </button>
      <div className={`image-container${contentVisible ? ' visible' : ''}`}>
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="project-image"
        />
      </div>
      <div className="navigation-buttons">
        <Button
          text="←"
          onClick={showPrevious}
          variant="text" // Use the text variant
          className="nav-button"
        />
        <span className="image-count">
          {currentIndex + 1} / {images.length}
        </span>
        <Button
          text="→"
          onClick={showNext}
          variant="text" // Use the text variant
          className="nav-button"
        />
      </div>
    </div>
  );
};

export default FeaturedProjectViewer;
