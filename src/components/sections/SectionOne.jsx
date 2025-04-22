import React from 'react';
import Section from './Section';
import Button from '../button';
import scrollToSection from '../../scripts/scrollToSection'; // Import the scroll utility
import ProjectViewer from '../projectViewer'; // Import the ProjectViewer component
import PasswordGate from '../PasswordGate'; // Import PasswordGate

const SectionOne = ({ authenticated, openModal, openPasswordGate, closeModal }) => {
  const description = `At YouTube, I grew from an independent contributor to a design lead, shaping product experiences used by billions. I led design across TV, web, mobile, tablet, and voice—bringing clarity and cohesion to a complex, fast-moving ecosystem.
  One standout chapter was leading the Movies & Shows team, where I scaled design from a single storefront to five globally, helping grow subscriptions from 68 million to over 180 million. It was a mix of strategic thinking and hands-on design—aligning business goals with what people actually enjoy using.
  In 2018, I also led the design system for YouTube on TV. That system still powers the experience today and helped make it the #1 rated streaming app on Nielsen.`;

  const handleCaseStudyClick = (caseStudy) => {
    scrollToSection('.first-section');
    console.log('Scrolling to .first-section');
    console.log('Authenticated:', authenticated);

    let title = '';
    let folder = '';
    let images = [];

    if (caseStudy === 'Case Study 1') {
      title = 'YouTube Living Room Case Study';
      folder = '/assets/yt_case_study_00';
      images = Array.from({ length: 18 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return `${folder}/featured_ytlr_${num}.webp`;
      });
    } else if (caseStudy === 'Case Study 2') {
      title = 'YouTube Movies & Shows Case Study';
      folder = '/assets/yt_case_study_01';
      images = Array.from({ length: 23 }, (_, i) => {
        const num = String(i + 1).padStart(2, '0');
        return `${folder}/feature_project_ytms_${num}.webp`;
      });
    }

    const viewerProps = { title, images, onClose: closeModal };
    console.log('Viewer Props:', viewerProps);

    if (authenticated) {
      openModal(<ProjectViewer {...viewerProps} />, true); // Pass true for expanded state
    } else {
      openPasswordGate(viewerProps);
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
          icon="icon-Lock_light"
          iconPosition="leading"
          variant="text"
          className="case-study-button"
          onClick={() => handleCaseStudyClick('Case Study 1')}
        />
        <Button
          text="Case Study 2"
          icon="icon-Lock_light"
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