import React from 'react';
import ButtonGroup from './ButtonGroup'; // Import the reusable ButtonGroup component
import { scrollToSection } from '../scripts/scrollToSection'; // Import the scroll utility

const Hero = () => {
  const buttons = [
    {
      text: 'Case Studies',
      variant: 'primary',
      size: 'sm',
      onClick: () => scrollToSection('.first-section'),
    },
    {
      text: 'Open Resume',
      variant: 'secondary',
      size: 'sm',
      onClick: () => window.open('/assets/resume/Colt_Fulk_Resume_2025.pdf', '_blank'),
    },
  ];

  return (
    <section className="hero">
      <div className="content-wrapper">
        <h1 className="title">
          Colt uses design thinking to craft world-class UI systems
        </h1>
        
        <div className="detail-wrapper">
          <h5 className="role subtitle">
            Sr. Product & UX Design Systems Lead
          </h5>

          <p className="detail">
            Snapchat | ex: YouTube, Google and Apple
          </p>

          <p className="detail">
            Los Angeles | San Francisco | Zurich, Switzerland
          </p>
        </div>

        <ButtonGroup buttons={buttons} />
      </div>
    </section>
  );
};

export default Hero;