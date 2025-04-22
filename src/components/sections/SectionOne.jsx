import React from 'react';
import Section from './Section';
import Button from '../button';

const SectionOne = ({ handleCaseStudyClick }) => {
  const description = `At YouTube, I grew from an independent contributor to a design lead, shaping product experiences used by billions. I led design across TV, web, mobile, tablet, and voice—bringing clarity and cohesion to a complex, fast-moving ecosystem.
One standout chapter was leading the Movies & Shows team, where I scaled design from a single storefront to five globally, helping grow subscriptions from 68 million to over 180 million. It was a mix of strategic thinking and hands-on design—aligning business goals with what people actually enjoy using.
In 2018, I also led the design system for YouTube on TV. That system still powers the experience today and helped make it the #1 rated streaming app on Nielsen.`;

  return (
    <>
      <Section
        className="first-section"
        logo="assets/youtube_google_colt.fulk.webp"
        title="User Experience, Design Systems, Management"
        subtitle="Full-time, 9.5 years spanning 2014 to 2023"
        description={description}
        bulletPoints={[]}
        image="/assets/section_01_colt.fulk.youtube.webp"
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
    </>
  );
};

export default SectionOne;