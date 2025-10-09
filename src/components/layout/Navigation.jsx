import React from 'react';
import { scrollToSection } from '@scripts';
import '@styles/icon-font.css';
import '@styles/navigation.css';
import { useScrollSpy } from '@features';
import { useScrollFade } from '@hooks';

export const Navigation = () => {
  const isHeroOutOfView = useScrollSpy(0.05); // Trigger fade-in when 95% of the hero is out of view
  const isScrolling = useScrollFade(150); // Fade out when scrolling, fade in 150ms after scroll stops

  const navClasses = `navigation ${isHeroOutOfView ? 'visible' : ''} ${isScrolling ? 'scrolling' : ''}`.trim();

  return (
    <nav className={navClasses}>
      <ul className="nav-list left overlay">
        <li className="nav-item" onClick={() => scrollToSection('.hero')}>Home</li>
        <li className="nav-item" onClick={() => scrollToSection('.first-section')}>Snapchat</li>
        <li className="nav-item" onClick={() => scrollToSection('.second-section')}>YouTube</li>
        <li className="nav-item" onClick={() => scrollToSection('.third-section')}>Apple</li>
        <li className="nav-item" onClick={() => scrollToSection('.fourth-section')}>Figma</li>
      </ul>
      <ul className="nav-list right">
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