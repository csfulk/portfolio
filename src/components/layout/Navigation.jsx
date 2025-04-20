import React from 'react';
import { useScrollSpy } from '../../features/observer/useScrollSpy';

export const Navigation = () => {
  const isHeroOutOfView = useScrollSpy(0.05); // Trigger fade-in when 95% of the hero is out of view

  return (
    <nav className={`navigation ${isHeroOutOfView ? 'visible' : ''}`}>
      <ul className="nav-list">
        <li className="nav-item">Home</li>
        <li className="nav-item">About</li>
        <li className="nav-item">Contact</li>
      </ul>
    </nav>
  );
};

export default Navigation;