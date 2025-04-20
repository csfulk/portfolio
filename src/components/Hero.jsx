import React from 'react';
import Button from './button'; // Import the reusable Button component
import scrollToSection from '../scripts/scrollToSection'; // Import the scroll utility

const Hero = () => {
  return (
    <section className="hero">
      <div className="overlay">
        <h1 className="title">
          Colt uses design thinking to craft robust UI systems for world-class interfaces
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
            text="Career History"
            variant="primary"
            className="button-primary"
            onClick={() => scrollToSection('.first-section')} // Use the utility function
          />
          <Button
            text="Featured Projects"
            variant="secondary"
            className="button-secondary"
            onClick={() => alert('Secondary Button Clicked')}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;