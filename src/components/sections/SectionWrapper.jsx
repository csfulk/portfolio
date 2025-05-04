import React, { useState, useEffect, useRef } from 'react';
import Button from '../button';
import { toggleDescription } from '../../scripts/toggleDescription';
import { scrollToSection } from '../../scripts/scrollToSection';
import '../../styles/section.css';

const SectionWrapper = ({ section, handleCaseStudyClick, caseStudyData }) => {
  if (!section) {
    console.error('Section data is undefined');
    return null;
  }

  const { id, className, logo, title, subtitle, description, bulletPoints = [], image, buttons = [] } = section;
  const [isExpanded, setIsExpanded] = useState(false);
  const descriptionRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isInitiallyTruncated, setIsInitiallyTruncated] = useState(false);

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, [description]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (descriptionRef.current) {
        const { scrollHeight, clientHeight } = descriptionRef.current;
        const truncated = scrollHeight > clientHeight;
        setIsTruncated(truncated);
      }
    }, 100); // Add a slight delay to ensure layout is rendered

    return () => clearTimeout(timeout);
  }, [description, isExpanded]);

  useEffect(() => {
    if (!isExpanded && descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      const truncated = scrollHeight >= clientHeight; // Adjusted logic to include exact fits
      setIsInitiallyTruncated(truncated);
    }
  }, [description]); // Only recalculate when the description changes

  useEffect(() => {
    if (descriptionRef.current) {
      const { scrollHeight, clientHeight } = descriptionRef.current;
      const truncated = scrollHeight > clientHeight || scrollHeight === clientHeight; // Adjusted logic to include exact fits
      setIsInitiallyTruncated(truncated);
    }
  }, []); // Run only once when the component mounts

  const toggleDescriptionHandler = () => {
    if (descriptionRef.current) {
      const container = descriptionRef.current;
      if (isExpanded) {
        container.classList.remove('expanded');
        container.classList.add('collapsed');
        container.style.overflow = 'hidden';
        container.style.display = '-webkit-box';
        container.style.webkitLineClamp = '3'; // Reapply truncation
        container.style.webkitBoxOrient = 'vertical';
      } else {
        container.classList.remove('collapsed');
        container.classList.add('expanded');
        container.style.overflow = 'visible';
        container.style.display = 'block'; // Remove truncation styles
        container.style.webkitLineClamp = 'unset';
        container.style.webkitBoxOrient = 'unset';
      }
      setIsExpanded(!isExpanded); // Toggle the expanded state
    } else {
      console.error('Description container ref is null');
    }
  };

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
                style={{ maxHeight: isExpanded ? 'none' : '5.4em' }} // 3 lines * 1.8em line height
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
                  onClick={toggleDescriptionHandler}
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
                  onClick={() => {
                    if (caseStudyData[button.action]) {
                      const sectionElement = document.querySelector(`#${id}`);
                      if (sectionElement) {
                        scrollToSection(`#${id}`); // Scroll the section into view
                      }
                      if (caseStudyData[button.action]) {
                        handleCaseStudyClick(button.action); // Open the modal for PasswordGate
                      } else {
                        window.open(button.action, '_blank'); // Open external link if no matching case study
                      }
                    }
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