import React, { useRef, useEffect } from 'react';
import { Button } from '@components';
import { scrollToSection } from '@scripts';
import { useExpandable, useLazyImage } from '@hooks';
import { eventTracker } from '@services/core/EventTracker.js';
import { analyticsTransport } from '@services/core/analyticsTransport.js';
import '@styles/section.css';

// Module-level active-section tracker shared across all section instances. The
// IntersectionObserver only logs `section_view` on scroll-OUT, so the section a
// visitor is on at tab-close would otherwise never be recorded. A single
// before-unload hook flushes the in-progress dwell of whichever section is active.
let activeSection = null; // { id, enterTime }
let sectionUnloadHookRegistered = false;

function registerSectionUnloadHook() {
  if (sectionUnloadHookRegistered) return;
  sectionUnloadHookRegistered = true;
  analyticsTransport.onBeforeFlush(() => {
    if (!activeSection) return;
    const seconds = Math.round((Date.now() - activeSection.enterTime) / 1000);
    if (seconds >= 2) {
      eventTracker.track('section_view', activeSection.id, seconds);
      // Reset the timer so returning to a backgrounded tab doesn't double-count.
      activeSection.enterTime = Date.now();
    }
  });
}

const SectionWrapper = ({ section, handleCaseStudyClick, authenticated }) => {
  const { id, className, logo, title, subtitle, description, bulletPoints = [], image, caseStudies = [] } = section || {};
  const { isExpanded, isInitiallyTruncated, toggleExpand, descriptionRef } = useExpandable(description);

  // Use lazy loading for the section image with 85% visibility threshold
  const { imgRef, isLoaded, imageSrc } = useLazyImage(image, 0.9);

  // Mobile-only copy of the image renders directly under the title (the desktop image
  // lives in .section-right, hidden on mobile). It uses the browser's native lazy
  // loading rather than the IntersectionObserver hook: the observer proved unreliable on
  // real mobile browsers — it worked in Chrome device emulation but images failed to
  // appear on-device (iOS Safari). It's kept always-visible via CSS (no JS load gating),
  // so a cached image that loads before any handler runs can never end up hidden.

  // Section time-on-page tracking
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    registerSectionUnloadHook();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activeSection = { id, enterTime: Date.now() };
        } else if (activeSection && activeSection.id === id) {
          const seconds = Math.round((Date.now() - activeSection.enterTime) / 1000);
          if (seconds >= 2) eventTracker.track('section_view', id, seconds);
          activeSection = null;
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  if (!section) {
    console.error('Section data is undefined');
    return null;
  }

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
              the desktop image lives in .section-right. Native lazy loading (not the
              IntersectionObserver hook) so it appears reliably on real mobile browsers. */}
          {image && (
            <div className="section-image-mobile">
              <img
                src={image}
                alt={title}
                loading="lazy"
                decoding="async"
                className="section-image"
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
                // Placeholder entries stay visible so the section still advertises the
                // work, but they carry no viewer — no click handler, no auth-dependent
                // icon swap, and Button blocks the click via `disabled`.
                const comingSoon = Boolean(caseStudy.comingSoon);

                return (
                  <Button
                    key={caseStudy.key}
                    text={caseStudy.button.text}
                    size="md"
                    variant="ghost"
                    fontWeight="medium"
                    disabled={comingSoon}
                    icon={isInteractiveIcon
                      ? (authenticated ? iconConfig.authenticated : iconConfig.unauthenticated)
                      : iconConfig
                    }
                    iconHover={!comingSoon && isInteractiveIcon && authenticated ? iconConfig.hover : undefined}
                    iconActive={!comingSoon && isInteractiveIcon && authenticated ? iconConfig.active : undefined}
                    iconPosition="leading"
                    paddingX="0"
                    color="var(--colors-text-inverse)"
                    hoverColor="var(--colors-text-secondary)"
                    hoverBackgroundColor="transparent"
                    className="case-study-button"
                    onClick={comingSoon ? undefined : () => {
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