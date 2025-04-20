import React from 'react';
import Section from './Section'; // Import the reusable Section component
import Button from '../button'; // Import the Button component

const SectionOne = () => {
  const bulletPoints = [
    { year: "2023", role: "UX Design Manager", text: "YouTube Primetime" },
    { year: "2019", role: "Senior UX Design Lead", text: "YouTube Movies & TV" },
    { year: "2015", role: "TV UX Designer", text: "YouTube on TV" },
    { year: "2014", role: "Production Designer", text: "YouTube UX" },
  ];

  const description = `At YouTube, I grew from an independent contributor to a design lead, shaping product experiences used by billions. I led design across TV, web, mobile, tablet, and voice—bringing clarity and cohesion to a complex, fast-moving ecosystem.
  One standout chapter was leading the Movies & Shows team, where I scaled design from a single storefront to five globally, helping grow subscriptions from 68 million to over 180 million. It was a mix of strategic thinking and hands-on design—aligning business goals with what people actually enjoy using.
  In 2018, I also led the design system for YouTube on TV. That system still powers the experience today and helped make it the #1 rated streaming app on Nielsen.
  `;

  const LockIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="icon"
    >
      <circle cx="12" cy="15" r="2" fill="currentColor" />
      <path
        d="M4.5 13.5C4.5 11.6144 4.5 10.6716 5.08579 10.0858C5.67157 9.5 6.61438 9.5 8.5 9.5H15.5C17.3856 9.5 18.3284 9.5 18.9142 10.0858C19.5 10.6716 19.5 11.6144 19.5 13.5V14.5C19.5 17.3284 19.5 18.7426 18.6213 19.6213C17.7426 20.5 16.3284 20.5 13.5 20.5H10.5C7.67157 20.5 6.25736 20.5 5.37868 19.6213C4.5 18.7426 4.5 17.3284 4.5 14.5V13.5Z"
        stroke="currentColor"
      />
      <path
        d="M16.5 9.5V8C16.5 5.51472 14.4853 3.5 12 3.5V3.5C9.51472 3.5 7.5 5.51472 7.5 8V9.5"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <Section
      className="first-section" // Add the class for scrolling
      logo="assets/youtube_google_colt.fulk.png" // Replace with the actual path to your logo
      title="User Experience, Design Systems, Management"
      subtitle="Full-time, 9.5 years spanning 2014 to 2023"
      description={description.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph.trim()}</p>
      ))}
      bulletPoints={[]} // Pass an empty array to hide the bullet points
      image="/assets/section_01_colt.fulk.youtube.png" // Use the provided image
    >
      {/* Buttons Section */}
      <div className="button-group-vertical">
        <Button
          text="Case Study 1"
          variant="text" // Use the text-only variant
          leadingIcon={LockIcon}
          className="button-case-study" // Optional custom class for additional styling
          onClick={() => alert('Case Study 1 clicked')}
        />
        <Button
          text="Case Study 2"
          variant="text" // Use the text-only variant
          leadingIcon={LockIcon}
          className="button-case-study" // Optional custom class for additional styling
          onClick={() => alert('Case Study 2 clicked')}
        />
      </div>
    </Section>
  );
};

export default SectionOne;