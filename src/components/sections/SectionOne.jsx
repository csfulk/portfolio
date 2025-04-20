import React from 'react';
import Section from './Section'; // Import the reusable Section component

const SectionOne = () => {
  const bulletPoints = [
    { year: "2023", role: "UX Design Manager", text: "YouTube Primetime" },
    { year: "2019", role: "Senior UX Design Lead", text: "YouTube Movies & TV" },
    { year: "2015", role: "TV UX Designer", text: "YouTube on TV" },
    { year: "2014", role: "Production Designer", text: "YouTube UX" },
  ];

  const description = `
    At YouTube, I had the privilege of serving in various capacities, from an independent contributor to a design manager. As a seasoned UX designer with extensive industry knowledge, my contributions have left a significant global footprint on the platform. My role involved crafting top-tier user experiences across numerous devices and platforms, from TV interfaces and web applications to tablets, mobile phones, and voice experiences. 
    In 2018, I spearheaded the design system for YouTube on TV, which remains in use today and helped make it the #1 rated streaming app on Nielsen. My work left a lasting global impact, balancing scale, utility, and delight at every touchpoint.
  `;

  return (
    <Section
      className="first-section" // Add the class for scrolling
      logo="assets/youtube_google_colt.fulk.png" // Replace with the actual path to your logo
      title="User Experience, Design Systems, Management"
      subtitle="Full-time, 9.5 years spanning 2014 to 2023"
      description={description.split('\n').map((paragraph, index) => (
        <p key={index}>{paragraph.trim()}</p>
      ))}
      bulletPoints={bulletPoints.map((point) => (
        <span key={point.year}>
          {point.year} <strong className="role-highlight">{point.role}</strong> {point.text}
        </span>
      ))}
      image="/assets/section_01_colt.fulk.youtube.png" // Use the provided image
    />
  );
};

export default SectionOne;