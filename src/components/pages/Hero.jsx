import React from 'react';
import { Button } from '@components';
import { scrollToSection } from '@scripts';
import { eventTracker } from '@services/core/EventTracker.js';

const Hero = () => {
  return (
    <section className="hero">
      <div className="content-wrapper">
        <h1 className="title">
        Colt uses design thinking to craft robust solutions for world-class interfaces
        </h1>
        
        <div className='detail-wrapper'>
          <h4 className="role subtitle">
            Product & Design Systems Lead
          </h4>

          <p className="detail">
            Reddit | ex: YouTube, Google and Apple
          </p>

          <p className="detail">
            Los Angeles | San Francisco | Zurich, Switzerland
          </p>
        </div>

        <div className="button-group">
          <Button
            variant="primary"
            size="lg"
            fontWeight="medium"
            onClick={() => { eventTracker.track('hero_cta', 'case_studies'); scrollToSection('.first-section'); }}
          >
            Case Studies
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fontWeight="medium"
            onClick={() => { eventTracker.track('hero_cta', 'resume'); window.open('/resume.pdf', '_blank'); }}
          >
            View Resume
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;