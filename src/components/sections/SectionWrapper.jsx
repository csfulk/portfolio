import React from 'react';
import Button from '../button';
import { scrollToSection } from '../../scripts/scrollToSection';
import useExpandable from '../../hooks/useExpandable';
import '../../styles/section.css';

const SectionWrapper = ({ section, handleCaseStudyClick, caseStudyData, authenticated }) => {
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
            <div className="description-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <div
                className={`section-description-container ${isExpanded ? 'expanded' : 'truncated'}`}
                ref={descriptionRef}
                style={{ maxHeight: isExpanded ? 'none' : '5.4em' }}
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
            <div className="button-group-vertical">
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  text={button.text}
                  icon={button.icon}
                  iconPosition="leading"
                  variant="text"
                  className="case-study-button"
                  authenticated={authenticated}
                  onClick={() => {
                    handleCaseStudyClick(button.action);
                    scrollToSection(`#${id}`);
                  }}
                />
              ))}
            </div>
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