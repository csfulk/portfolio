import React, { useState, useEffect } from 'react';
import '../styles/ProjectViewer.css'; // Optional: for styling
import Button from './button'; // Import the Button component

const FeaturedProjectViewer = ({ title, images, closeModal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="project-viewer">
      {/* Close Button */}
      <Button
        text="X"
        onClick={closeModal}
        variant="text"
        className="close-button"
      />
      <div className="image-container">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="project-image"
        />
      </div>
      <div className="navigation-buttons">
        <Button
          text="Previous"
          onClick={showPrevious}
          variant="text" // Use the text variant
          className="nav-button"
        />
        <span className="image-count">
          {currentIndex + 1} / {images.length}
        </span>
        <Button
          text="Next"
          onClick={showNext}
          variant="text" // Use the text variant
          className="nav-button"
        />
      </div>
    </div>
  );
};

export default FeaturedProjectViewer;

