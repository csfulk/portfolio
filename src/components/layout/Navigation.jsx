import React, { useState, useEffect, useRef } from 'react';
import { Button, Icon } from '@components';
import { scrollToSection } from '@scripts';
import '@styles/icon-font.css';
import '@styles/navigation.css';
import { useScrollSpy } from '@features';
import { useScrollFade, useModalStyles } from '@hooks';
import { eventTracker } from '@services/core/EventTracker.js';

// Select Projects deck — password-gated Figma embed opened from the nav bar.
// Mirrors the interactive icon pattern used by the section case-study buttons:
// Lock while gated, then the emoji set once the password gate is unlocked.
const selectProjects = {
  key: 'select-projects',
  icon: {
    unauthenticated: 'Lock',
    authenticated: 'Emoji',
    hover: 'EmojiSingRightNote',
    active: 'EmojiSingLeftNote'
  }
};

// Section links shared by the desktop bar and the mobile drawer.
const sectionLinks = [
  { label: 'Home', selector: '.hero' },
  { label: 'YouTube', selector: '.first-section' },
  { label: 'Snapchat', selector: '.second-section' },
  { label: 'Apple', selector: '.third-section' },
  { label: 'Figma Dev', selector: '.fourth-section' }
];

// Keep in sync with the .mobile-nav-drawer / .mobile-nav-backdrop CSS transition (0.3s):
// on mobile we collapse the drawer first, then run the action once it has visually closed.
const DRAWER_ANIM_MS = 300;

export const Navigation = ({ handleCaseStudyClick, authenticated }) => {
  const isHeroOutOfView = useScrollSpy(0.05); // Trigger fade-in when the hero is out of view
  const isScrolling = useScrollFade(150); // Fade out when scrolling, fade in 150ms after scroll stops
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeButtonRef = useRef(null);

  // Lock body scroll while the drawer is open; released the moment it closes.
  useModalStyles(isDrawerOpen);

  const navClasses = `navigation ${isHeroOutOfView ? 'visible' : ''} ${isScrolling ? 'scrolling' : ''}`.trim();

  const { icon } = selectProjects;

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Collapse the drawer first, then scroll — so the smooth scroll isn't fighting the
  // open drawer or the (about-to-release) body scroll lock.
  const handleSectionNav = (selector) => {
    setIsDrawerOpen(false);
    window.setTimeout(() => scrollToSection(selector), DRAWER_ANIM_MS);
  };

  const openSelectProjects = () => {
    eventTracker.track('case_study_click', selectProjects.key);
    handleCaseStudyClick({
      type: 'FigmaEmbedViewer',
      caseStudyKey: selectProjects.key
    });
  };

  // Same collapse-then-act sequencing, so the drawer's scroll lock and the modal's
  // scroll lock don't toggle on the same frame.
  const handleSelectProjectsMobile = () => {
    setIsDrawerOpen(false);
    window.setTimeout(openSelectProjects, DRAWER_ANIM_MS);
  };

  // Escape closes the drawer; focus the close button on open for basic a11y.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDrawerOpen]);

  const selectProjectsButton = (extraProps = {}) => (
    <Button
      variant="secondary"
      size="sm"
      text="Select Projects"
      icon={authenticated ? icon.authenticated : icon.unauthenticated}
      iconHover={authenticated ? icon.hover : undefined}
      iconActive={authenticated ? icon.active : undefined}
      iconPosition="leading"
      {...extraProps}
    />
  );

  return (
    <>
      <nav className={navClasses}>
        <ul className="nav-list left overlay">
          {sectionLinks.map(({ label, selector }) => (
            <li key={selector} className="nav-item" onClick={() => scrollToSection(selector)}>
              {label}
            </li>
          ))}
        </ul>
        <ul className="nav-list right">
          <li className="nav-item">
            {selectProjectsButton({ onClick: openSelectProjects })}
          </li>
          <li className="nav-item">
            <a
              href="https://www.linkedin.com/in/coltfulk/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <i className="icon icon-linkedin" aria-hidden="true"></i>
            </a>
          </li>
        </ul>

        {/* Mobile-only trigger; hidden >768px via CSS. */}
        <button
          type="button"
          className="nav-hamburger"
          onClick={openDrawer}
          aria-label="Open menu"
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-nav-drawer"
        >
          <Icon name="menu" size="lg" aria-label="Open menu" />
        </button>
      </nav>

      {/* Mobile drawer + backdrop — siblings of <nav> so the scroll-fade opacity can't
          hide them. Both are display:none >768px. */}
      <div
        className={`mobile-nav-backdrop${isDrawerOpen ? ' open' : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <aside
        id="mobile-nav-drawer"
        className={`mobile-nav-drawer${isDrawerOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
      >
        <button
          type="button"
          ref={closeButtonRef}
          className="mobile-nav-close"
          onClick={closeDrawer}
          aria-label="Close menu"
        >
          <Icon name="Xmark" size="lg" aria-label="Close menu" />
        </button>

        <nav className="mobile-nav-links">
          {sectionLinks.map(({ label, selector }) => (
            <button
              key={selector}
              type="button"
              className="mobile-nav-link"
              onClick={() => handleSectionNav(selector)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mobile-nav-footer">
          {selectProjectsButton({ onClick: handleSelectProjectsMobile, fullWidth: true })}
          <a
            className="mobile-nav-linkedin"
            href="https://www.linkedin.com/in/coltfulk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="icon icon-linkedin" aria-hidden="true"></i>
            <span>My LinkedIn</span>
          </a>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
