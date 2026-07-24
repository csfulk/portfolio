import React from 'react';
import { Button } from '@components';
import { scrollToSection } from '@scripts';
import '@styles/icon-font.css';
import '@styles/navigation.css';
import { useScrollSpy } from '@features';
import { useScrollFade } from '@hooks';
import { eventTracker } from '@services/core/EventTracker.js';

// Select Projects deck — password-gated Figma embed opened from the nav bar.
// Mirrors the interactive icon pattern used by the section case-study buttons:
// Lock while gated, then the emoji set once the password gate is unlocked.
const selectProjects = {
  key: 'select-projects',
  embedUrl:
    'https://embed.figma.com/deck/4u9UmVjECH20l1Q7xQSw82/Colt-Fulk---Select-Projects?node-id=2-1341&viewport=-95%2C-25%2C0.46&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share',
  icon: {
    unauthenticated: 'Lock',
    authenticated: 'Emoji',
    hover: 'EmojiSingRightNote',
    active: 'EmojiSingLeftNote'
  }
};

export const Navigation = ({ handleCaseStudyClick, authenticated }) => {
  const isHeroOutOfView = useScrollSpy(0.05); // Trigger fade-in when 95% of the hero is out of view
  const isScrolling = useScrollFade(150); // Fade out when scrolling, fade in 150ms after scroll stops

  const navClasses = `navigation ${isHeroOutOfView ? 'visible' : ''} ${isScrolling ? 'scrolling' : ''}`.trim();

  const { icon } = selectProjects;

  return (
    <nav className={navClasses}>
      <ul className="nav-list left overlay">
        <li className="nav-item" onClick={() => scrollToSection('.hero')}>Home</li>
        <li className="nav-item" onClick={() => scrollToSection('.first-section')}>YouTube</li>
        <li className="nav-item" onClick={() => scrollToSection('.second-section')}>Snapchat</li>
        <li className="nav-item" onClick={() => scrollToSection('.third-section')}>Apple</li>
        <li className="nav-item" onClick={() => scrollToSection('.fourth-section')}>Figma Dev</li>
      </ul>
      <ul className="nav-list right">
        <li className="nav-item">
          <Button
            variant="secondary"
            size="sm"
            text="Select Projects"
            icon={authenticated ? icon.authenticated : icon.unauthenticated}
            iconHover={authenticated ? icon.hover : undefined}
            iconActive={authenticated ? icon.active : undefined}
            iconPosition="leading"
            onClick={() => {
              eventTracker.track('case_study_click', selectProjects.key);
              handleCaseStudyClick({
                type: 'FigmaEmbedViewer',
                caseStudyKey: selectProjects.key,
                embedUrl: selectProjects.embedUrl
              });
            }}
          />
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
    </nav>
  );
};

export default Navigation;
