import React from 'react';
import Section from './Section';


const SectionOne = ({ handleCaseStudyClick }) => {
  const description = `Before Figma became the industry standard, Sketch was the go-to tool at companies like Google and YouTube. In 2020, as Figma gained traction, I spearheaded Google Europe’s transition to the platform—driving adoption from the ground up while based in Zurich. I worked directly with Figma’s team and partnered with senior leadership to craft a scalable rollout strategy. I led hands-on training across disciplines, aligning designers and engineers, and took point on migrating YouTube’s design libraries from Sketch to Figma—laying the foundation for a new era of collaborative design at scale.`;

  return (
    <>
      <Section
        className="third-section"
        id="figma-case-study" // Add a unique id for this section
        logo="assets/figma-google.colt.fulk.webp"
        title="Figma Evangelist & Partnership Specialist"
        subtitle="2020—2022"
        description={description}
        bulletPoints={[]}
        image="/assets/section_04_colt.fulk.figma.webp"
      >
        
      </Section>
    </>
  );
};

export default SectionOne;