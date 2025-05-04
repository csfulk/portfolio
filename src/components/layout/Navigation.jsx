import React from 'react';
import { scrollToSection } from '../../scripts/scrollToSection'; // Import the scroll utility
import '../../styles/icon-font.css'; // Import the icon font styles
import '../../styles/navigation.css'; // Import navigation styles
import { useScrollSpy } from '../../features/observer/useScrollSpy';

export const Navigation = () => {
  const isHeroOutOfView = useScrollSpy(0.05); // Trigger fade-in when 95% of the hero is out of view

  return (
    <nav className={`navigation ${isHeroOutOfView ? 'visible' : ''}`}>
      <ul className="nav-list left overlay">
        <li className="nav-item" onClick={() => scrollToSection('.hero')}>Home</li>
        <li className="nav-item" onClick={() => scrollToSection('.first-section')}>YouTube</li>
        <li className="nav-item" onClick={() => scrollToSection('.second-section')}>Apple</li>
        <li className="nav-item" onClick={() => scrollToSection('.third-section')}>Figma</li>
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