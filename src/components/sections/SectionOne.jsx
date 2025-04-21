//sections/SectionOne.jsx
import React from 'react';
import Section from './Section';
import Button from '../Button';
import scrollToSection from '../../scripts/scrollToSection'; // Import the scroll utility
import ProjectViewer from '../projectViewer'; // Import the ProjectViewer component

const SectionOne = ({ authenticated, openModal }) => {
  const description = `At YouTube, I grew from an independent contributor to a design lead, shaping product experiences used by billions. I led design across TV, web, mobile, tablet, and voice—bringing clarity and cohesion to a complex, fast-moving ecosystem.
  One standout chapter was leading the Movies & Shows team, where I scaled design from a single storefront to five globally, helping grow subscriptions from 68 million to over 180 million. It was a mix of strategic thinking and hands-on design—aligning business goals with what people actually enjoy using.
  In 2018, I also led the design system for YouTube on TV. That system still powers the experience today and helped make it the #1 rated streaming app on Nielsen.`;

  const handleCaseStudyClick = (caseStudy) => {
    // Scroll the section to the top of the viewport
    scrollToSection('.first-section');

    if (authenticated) {
      // Define images for "Case Study 1"
      const images = Array.from({ length: 23 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return `/assets/yt_case_study_01/feature_project_ytms_${num}.png`;
      });

      // Pass ProjectViewer to the modal
      openModal(<ProjectViewer title="Case Study 1" images={images} />);
    } else {
      openModal(null); // Trigger password modal
    }
  };

  return (
    <Section
      className="first-section"
      logo="assets/youtube_google_colt.fulk.png"
      title="User Experience, Design Systems, Management"
      subtitle="Full-time, 9.5 years spanning 2014 to 2023"
      description={description} // Pass description as a string
      bulletPoints={[]}
      image="/assets/section_01_colt.fulk.youtube.png"
    >
      <div className="button-group-vertical">
        <Button
          text="Case Study 1"
          icon="icon-Lock"
          iconPosition="leading"
          variant="text"
          className="case-study-button"
          onClick={() => handleCaseStudyClick('Case Study 1')}
        />
        <Button
          text="Case Study 2"
          icon="icon-Lock"
          iconPosition="leading"
          variant="text"
          className="case-study-button"
          onClick={() => handleCaseStudyClick('Case Study 2')}
        />
      </div>
    </Section>
  );
};

export default SectionOne;