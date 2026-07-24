import React, { useRef, useEffect } from 'react';
import { Button } from '@components';
import { scrollToSection } from '@scripts';
import { useExpandable, useLazyImage } from '@hooks';
import { eventTracker } from '@services/core/EventTracker.js';
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

  // Second lazy-load instance bound to the mobile-only copy of the image, rendered
  // inside the text column directly under the title. Only the variant that is visible
  // at the current breakpoint actually fetches — the display:none one never intersects.
  // Uses a low visibility threshold (vs 0.9 desktop): on the compact mobile stack the
  // lower sections never reach 90% visibility before the page bottom, so require only a
  // sliver to trigger the load.
  const { imgRef: mobileImgRef, isLoaded: mobileLoaded, imageSrc: mobileSrc } = useLazyImage(image, 0.01);

  // Section time-on-page tracking
  const sectionRef  = useRef(null);
  const enterTimeRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          enterTimeRef.current = Date.now();
        } else if (enterTimeRef.current !== null) {
          const seconds = Math.round((Date.now() - enterTimeRef.current) / 1000);
          if (seconds >= 2) eventTracker.track('section_view', id, seconds);
          enterTimeRef.current = null;
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return (
    <section ref={sectionRef} id={id} className={`section ${className || ''}`}>
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
          {/* Mobile-only image: sits directly under the title. Hidden >768px via CSS;
              the desktop image lives in .section-right. */}
          {image && (
            <div className="section-image-mobile">
              <img
                ref={mobileImgRef}
                src={mobileSrc || ''}
                alt={title}
                className={`section-image ${mobileLoaded ? 'loaded' : 'loading'}`}
                style={{
                  visibility: mobileSrc ? 'var(--visibility-visible)' : 'var(--visibility-hidden)'
                }}
              />
            </div>
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
                    size="md"
                    variant="ghost"
                    fontWeight="medium"
                    icon={isInteractiveIcon 
                      ? (authenticated ? iconConfig.authenticated : iconConfig.unauthenticated)
                      : iconConfig
                    }
                    iconHover={isInteractiveIcon && authenticated ? iconConfig.hover : undefined}
                    iconActive={isInteractiveIcon && authenticated ? iconConfig.active : undefined}
                    iconPosition="leading"
                    paddingX="0"
                    color="var(--colors-text-inverse)"
                    hoverColor="var(--colors-text-secondary)"
                    hoverBackgroundColor="transparent"
                    className="case-study-button"
                    onClick={() => {
                      eventTracker.track('case_study_click', caseStudy.key);
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