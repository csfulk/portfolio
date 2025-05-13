import React from 'react';
import ButtonGroup from '../ButtonGroup'; // Import the reusable ButtonGroup component
import { scrollToSection } from '../../scripts/scrollToSection';
import useExpandable from '../../hooks/useExpandable';
import '../../styles/section.css';

const SectionWrapper = ({ section, handleCaseStudyClick, caseStudyData }) => {
  if (!section) {
    console.error('Section data is undefined');
    return null;
  }

  const { id, className, logo, title, subtitle, description, bulletPoints = [], image, buttons = [] } = section;
  const { isExpanded, isTruncated, isInitiallyTruncated, toggleExpand, descriptionRef } = useExpandable(description);

  return (
    <section id={id} className={`section ${className || ''}`}>
      <div className="section-content">
        {/* Left Column */}
        <div className="section-left">
          {logo && (
            <div className="logo-title-wrapper">
              <img src={logo} alt="Logo" className="section-logo" />
            </div>
          )}
          {title && <h1 className="section-title">{title}</h1>}
          {subtitle && <h2 className="section-subtitle">{subtitle}</h2>}
          {description && (
            <div className="description-wrapper">
              <div
                className={`section-description-container ${isExpanded ? 'expanded' : 'truncated'}`}
                ref={descriptionRef}
              >
                {description.split('\n').map((paragraph, index) => (
                  <p key={index} className="section-description">{paragraph.trim()}</p>
                ))}
                {bulletPoints.length > 0 && (
                  <ul className="section-bullets">
                    {bulletPoints.map((point, index) => (
                      <li key={index} className="section-bullet">{point}</li>
                    ))}
                  </ul>
                )}
              </div>
              {(isInitiallyTruncated || isExpanded) && (
                <button
                  className="toggle-button"
                  onClick={toggleExpand}
                >
                  {isExpanded ? 'Read less' : 'Read more'}
                </button>
              )}
            </div>
          )}
          {buttons.length > 0 && (
            <ButtonGroup
              buttons={buttons.map(button => ({
                text: button.text,
                variant: button.variant || 'text-only', // Default to primary if not specified
                size: button.size || 'sm', // Default to small size
                icon: button.icon || 'icon-Lock_light', // Add lock icon by default
                className: 'case-study-button', // Add the case-study-button class
                onClick: () => {
                  if (button.onClick) {
                    button.onClick(); // Execute the button's onClick handler
                  }
                  if (button.action) {
                    handleCaseStudyClick(button.action); // Open the modal
                  }
                  scrollToSection(`#${id}`); // Scroll to the section
                },
              }))}
              direction="vertical"
            />
          )}
        </div>

        {/* Right Column */}
        {image && (
          <div className="section-right">
            <img src={image} alt={title} className="section-image" />
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionWrapper;