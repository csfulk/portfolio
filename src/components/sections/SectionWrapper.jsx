import React from 'react';
import { Button } from '@components';
import { scrollToSection } from '@scripts';
import { useExpandable, useLazyImage } from '@hooks';
import '@styles/section.css';

const SectionWrapper = ({ section, handleCaseStudyClick, authenticated }) => {
  if (!section) {
    console.error('Section data is undefined');
    return null;
  }

  const { id, className, logo, title, subtitle, description, bulletPoints = [], image, caseStudies = [] } = section;
  const { isExpanded, isTruncated, isInitiallyTruncated, toggleExpand, descriptionRef } = useExpandable(description);
  
  // Use lazy loading for the section image with 85% visibility threshold
  const { imgRef, isLoaded, isVisible, imageSrc } = useLazyImage(image, 0.9);

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
          {title && (
            <h3 className="section-title">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="section-subtitle">
              {subtitle}
            </p>
          )}
          {description && (
            <div className="description-wrapper" style={{ display: 'var(--display-flex)', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
              <div
                className={`section-description-container ${isExpanded ? 'expanded' : 'truncated'}`}
                ref={descriptionRef}
                style={{ maxHeight: isExpanded ? 'none' : '5.4em' }}
              >
                {description.split('\n').map((paragraph, index) => (
                  <p key={index} className="section-description">
                    {paragraph.trim()}
                  </p>
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
          {caseStudies.length > 0 && (
            <div className="button-group-vertical">
              {caseStudies.map((caseStudy) => {
                // Handle both old string format and new interactive object format
                const iconConfig = caseStudy.button.icon;
                const isInteractiveIcon = typeof iconConfig === 'object' && iconConfig !== null;
                
                return (
                  <Button
                    key={caseStudy.key}
                    text={caseStudy.button.text}
                    icon={isInteractiveIcon 
                      ? (authenticated ? iconConfig.authenticated : iconConfig.unauthenticated)
                      : iconConfig
                    }
                    iconHover={isInteractiveIcon && authenticated ? iconConfig.hover : undefined}
                    iconActive={isInteractiveIcon && authenticated ? iconConfig.active : undefined}
                    iconPosition="leading"
                    variant="text"
                    noPadding={true}
                    color="var(--colors-text-inverse)"
                    hoverColor="var(--colors-text-secondary)"
                    className="case-study-button"
                    onClick={() => {
                      handleCaseStudyClick({
                        type: caseStudy.viewer.type,
                        caseStudyKey: caseStudy.key,
                        ...caseStudy.viewer
                      });
                      scrollToSection(`#${id}`);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column */}
        {image && (
          <div className="section-right">
            <img 
              ref={imgRef}
              src={imageSrc || ''} 
              alt={title} 
              className={`section-image ${isLoaded ? 'loaded' : 'loading'}`}
              style={{ 
                visibility: imageSrc ? 'var(--visibility-visible)' : 'var(--visibility-hidden)' 
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default SectionWrapper;