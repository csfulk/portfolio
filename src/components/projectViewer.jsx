import React, { useState } from 'react';
import '../styles/ProjectViewer.css'; // Optional: for styling

const FeaturedProjectViewer = ({ title, images }) => {
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

  return (
    <div className="project-viewer">
      <h2 className="project-title">{title}</h2>
      <div className="image-container">
        <img
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          className="project-image"
        />
      </div>
      <div className="navigation-buttons">
        <button onClick={showPrevious} className="nav-button">Previous</button>
        <span className="image-count">
          {currentIndex + 1} / {images.length}
        </span>
        <button onClick={showNext} className="nav-button">Next</button>
      </div>
    </div>
  );
};

export default FeaturedProjectViewer;