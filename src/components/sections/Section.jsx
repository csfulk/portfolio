import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/section.css'; // Import styles for the section

const Section = ({ 
  className, 
  logo, 
  title, 
  subtitle, 
  description, 
  bulletPoints, 
  image, 
  children // Allow custom content to be passed as children
}) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to toggle description

  const toggleDescription = () => {
    setIsExpanded(!isExpanded); // Toggle between expanded and truncated
  };

  return (
    <section className={`section ${className}`}>
      <div className="section-content">
        {/* Left Column */}
        <div className="section-left">
          <div className='logo-title-wrapper'>
            <img src={logo} alt="Logo" className="section-logo" />
            <h1 className="section-title">{title}</h1>
          </div>
          <h2 className="section-subtitle">{subtitle}</h2>
          <div className={`section-description-container ${isExpanded ? 'expanded' : 'truncated'}`}>
            <p className={`section-description ${isExpanded ? 'expanded' : 'truncated'}`}>{description}</p>
            <ul className="section-bullets">
              {bulletPoints.map((point, index) => (
                <li key={index} className="section-bullet">
                  {point}
                </li>
              ))}
            </ul>
            <button className="toggle-button" onClick={toggleDescription}>
              {isExpanded ? 'Less' : '...more'}
            </button>
          </div>
          {children /* Render any custom content passed as children */}
        </div>

        {/* Right Column */}
        <div className="section-right">
          <img src={image} alt="Section Visual" className="section-image" />
        </div>
      </div>
    </section>
  );
};

Section.propTypes = {
  className: PropTypes.string, // Add className prop
  logo: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  bulletPoints: PropTypes.arrayOf(PropTypes.string).isRequired,
  image: PropTypes.string.isRequired,
  children: PropTypes.node, // Allow custom content as children
};

Section.defaultProps = {
  className: '', // Default to an empty string
  children: null, // Default to no custom content
};

export default Section;