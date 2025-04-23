import React from 'react';
import Section from './Section';
import Button from '../button';
import { scrollToSection } from '../../scripts/scrollToSection'; // Import the scrollToSection function

const SectionTwo = ({ handleCaseStudyClick }) => {
  const description = `At Apple, I led the visual systems for Developer Documentation and Publishing across iOS and macOS, managing a team of four designers in the creation of over 600 technical diagrams featured throughout Apple’s developer ecosystem. I developed and maintained a rigorous style guide and reusable pattern library, ensuring visual clarity and consistency across highly complex, widely-used documentation.
  In addition to documentation, I brought deep technical expertise in the Adobe Creative Suite to produce more than 1,500 pixel-perfect UI assets for Apple’s core software products—including iTunes, GarageBand, Keynote, Pages, and Safari. Each asset adhered to Apple’s exacting brand standards, supporting both internal development workflows and polished public-facing experiences at global scale.`;

  return (
    <>
      <Section
        className="second-section"
        id="apple-case-study" // Add a unique id for this section
        logo="assets/apple_colt.fulk.webp"
        title="UI Production, Technical Design Systems & Team Lead"
        subtitle="Full-time, 1.5 years from 2011 through end of 2012"
        description={description}
        bulletPoints={[]}
        image="/assets/section_02_colt.fulk.apple.webp"
      >
        <div className="button-group-vertical">
          <Button
            text="Case Study 1"
            icon="icon-Lock_light"
            iconPosition="leading"
            variant="text"
            className="case-study-button"
            onClick={() => {
              scrollToSection('.second-section'); // Scroll to this section
              handleCaseStudyClick('Apple Case Study 1'); // Trigger the existing click handler
            }}
          />
          <Button
            text="Case Study 2"
            icon="icon-Lock_light"
            iconPosition="leading"
            variant="text"
            className="case-study-button"
            onClick={() => {
              scrollToSection('.second-section'); // Scroll to this section
              handleCaseStudyClick('Apple Case Study 2'); // Trigger the existing click handler
            }}
          />
        </div>
      </Section>
    </>
  );
};

export default SectionTwo;