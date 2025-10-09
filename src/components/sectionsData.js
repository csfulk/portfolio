import { getCaseStudiesBySection } from '../data/caseStudyRegistry';

export const sectionsData = [
  {
    id: 'snapchat-case-study',
    className: 'first-section',
    logo: 'assets/snapchat_logo_colt.fulk.webp',
    title: 'Design Systems & Platform Cohesion at Snapchat',
    subtitle: 'Full-time, February 2024 to Present',
    description: `At Snapchat, I’ve led the evolution of our design system—introducing a unified color primitive and token framework that established light and dark mode parity, elevated accessibility, and reinforced visual consistency across platforms.

I also led end-to-end design for Snapchat’s first iPad launch, reimagining key experiences for larger screens while maintaining the playful familiarity of mobile. The launch drove measurable growth and received coverage from The Verge, TechCrunch, and Vanity Fair.

Beyond product work, I facilitated a series of cross-functional workshops to align design, engineering, and accessibility teams around scalable interaction patterns for Chat, Friends Feed, and onboarding—helping strengthen the foundation of Snapchat’s core experience.`,
    bulletPoints: [],
    image: '/assets/section_00_snapchat_2.webp',
    caseStudies: getCaseStudiesBySection('snapchat'),
  },
  {
    id: 'youtube-case-study',
    className: 'second-section',
    logo: 'assets/youtube_google_colt.fulk.webp',
    title: 'Product Design and User Experience at YouTube',
    subtitle: 'Full-time, 9.5 years spanning 2014 to 2023',
    description: `At YouTube, I went from an IC to a design lead—driving product across TV, mobile, web, tablet, and voice. I helped unify a fast-evolving, multi-surface ecosystem into something clear and consistent.

One of the most impactful chapters was leading design for the Movies & Shows team. I scaled design from one storefront to five globally, helping grow subscriptions from 68M to 180M+. I balanced strategy with hands-on design—aligning business goals with what people actually enjoy using.

In 2018, I also led the design system for YouTube on TV. That system still powers the experience today and helped make YouTube the #1 rated streaming app on Nielsen.`,
    bulletPoints: [],
    image: '/assets/section_01_colt.fulk.youtube.webp',
    caseStudies: getCaseStudiesBySection('youtube'),
  },
  {
    id: 'apple-case-study',
    className: 'third-section',
    logo: 'assets/apple_colt.fulk.webp',
    title: 'UI Production, Technical Design Systems & Team Lead',
    subtitle: 'Full-time, 1.5 years from 2011 through end of 2012',
    description: `At Apple, I led the visual systems for Developer Documentation and Publishing across iOS and macOS, managing a team of four designers in the creation of over 600 technical diagrams featured throughout Apple’s developer ecosystem. I developed and maintained a rigorous style guide and reusable pattern library, ensuring visual clarity and consistency across highly complex, widely-used documentation.
  In addition to documentation, I brought deep technical expertise in the Adobe Creative Suite to produce more than 1,500 pixel-perfect UI assets for Apple’s core software products—including iTunes, GarageBand, Keynote, Pages, and Safari. Each asset adhered to Apple’s exacting brand standards, supporting both internal development workflows and polished public-facing experiences at global scale.`,
    bulletPoints: [],
    image: '/assets/section_02_colt.fulk.apple.webp',
    caseStudies: getCaseStudiesBySection('apple'),
  },
  {
    id: 'figma-case-study',
    className: 'fourth-section',
    logo: 'assets/figma-google.colt.fulk.webp',
    title: 'Figma Evangelist — Systems, Development, Plugins',
    subtitle: '2020—Present',
    description: `Before Figma became the industry standard, Sketch was still the default at companies like Google and YouTube. In 2020, as momentum shifted, I led the transition to Figma across Google Europe—spearheading adoption from the ground up while based in Zurich.

I partnered closely with Figma’s team and senior leadership to develop a scalable rollout strategy. I led hands-on training sessions across disciplines, aligned designers and engineers around shared workflows, and oversaw the migration of YouTube’s design libraries—laying the groundwork for a more collaborative, systematized approach to design at scale.`,
    bulletPoints: [],
    image: '/assets/section_04_colt.fulk.figma.webp',
    caseStudies: getCaseStudiesBySection('figma'),
  },
];