import React from 'react';
import Button from './button'; // Import the reusable Button component
import { scrollToSection } from '../scripts/scrollToSection'; // Import the scroll utility

const Hero = () => {
  return (
    <section className="hero">
      <div className="content-wrapper">
        <h1 className="title">
          Colt uses design thinking to craft robust, world-class UI systems
        </h1>
        
        <div className='detail-wrapper'>
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

        <div className="button-group">
          <Button
            text="Case Studies"
            variant="primary"
            className="button-primary"
            onClick={() => scrollToSection('.first-section')} // Use the utility function
          />
          <Button
            text="Open Resume"
            variant="secondary"
            className="button-secondary"
            onClick={() => window.open('/assets/resume/Colt_Fulk_Resume_2025.pdf', '_blank')}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;