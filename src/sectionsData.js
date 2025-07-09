export const sectionsData = [
  {
    id: 'youtube-case-study',
    className: 'first-section',
    logo: 'assets/youtube_google_colt.fulk.webp',
    title: 'User Experience, Design Systems, Management',
    subtitle: 'Full-time, 9.5 years spanning 2014 to 2023',
    description: `At YouTube, I went from an IC to a design lead—driving product across TV, mobile, web, tablet, and voice. I helped unify a fast-evolving, multi-surface ecosystem into something clear and consistent.

One of the most impactful chapters was leading design for the Movies & Shows team. I scaled design from one storefront to five globally, helping grow subscriptions from 68M to 180M+. I balanced strategy with hands-on design—aligning business goals with what people actually enjoy using.

In 2018, I also led the design system for YouTube on TV. That system still powers the experience today and helped make YouTube the #1 rated streaming app on Nielsen.`,
    bulletPoints: [],
    image: '/assets/section_01_colt.fulk.youtube.webp',
    buttons: [
      {
        text: 'Case Study 1',
        icon: 'icon-Lock_light',
        action: {
          type: 'FigmaEmbedViewer',
          embedUrl: 'https://embed.figma.com/deck/xMLIEH8e4KGIyxoTUUCFO6/Strategic-Redesign-of-YouTube-on-TV?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
        },
      },
      {
        text: 'Case Study 2',
        icon: 'icon-Lock_light',
        action: { type: 'FeaturedProjectViewer', caseStudyKey: 'Case Study 2' },
      },
      {
        text: 'Design Systems Case Study',
        icon: 'icon-Lock_light',
        action: { type: 'FeaturedProjectViewer', caseStudyKey: 'Case Study 3' },
      },
    ],
  },
  {
    id: 'apple-case-study',
    className: 'second-section',
    logo: 'assets/apple_colt.fulk.webp',
    title: 'UI Production, Technical Design Systems & Team Lead',
    subtitle: 'Full-time, 1.5 years from 2011 through end of 2012',
    description: `At Apple, I led the visual systems for Developer Documentation and Publishing across iOS and macOS, managing a team of four designers in the creation of over 600 technical diagrams featured throughout Apple’s developer ecosystem. I developed and maintained a rigorous style guide and reusable pattern library, ensuring visual clarity and consistency across highly complex, widely-used documentation.
  In addition to documentation, I brought deep technical expertise in the Adobe Creative Suite to produce more than 1,500 pixel-perfect UI assets for Apple’s core software products—including iTunes, GarageBand, Keynote, Pages, and Safari. Each asset adhered to Apple’s exacting brand standards, supporting both internal development workflows and polished public-facing experiences at global scale.`,
    bulletPoints: [],
    image: '/assets/section_02_colt.fulk.apple.webp',
    buttons: [
      {
        text: 'Design Systems Case Study',
        icon: 'icon-Lock_light',
        action: { type: 'FeaturedProjectViewer', caseStudyKey: 'Apple Case Study 1' },
      },
      {
        text: 'Production Artist Case Study',
        icon: 'icon-Lock_light',
        action: { type: 'FeaturedProjectViewer', caseStudyKey: 'Apple Case Study 2' },
      },
    ],
  },
  {
    id: 'figma-case-study',
    className: 'third-section',
    logo: 'assets/figma-google.colt.fulk.webp',
    title: 'Figma Evangelist — Systems, Development, Plugins',
    subtitle: '2020—Present',
    description: `Before Figma became the industry standard, Sketch was still the default at companies like Google and YouTube. In 2020, as momentum shifted, I led the transition to Figma across Google Europe—spearheading adoption from the ground up while based in Zurich.

I partnered closely with Figma’s team and senior leadership to develop a scalable rollout strategy. I led hands-on training sessions across disciplines, aligned designers and engineers around shared workflows, and oversaw the migration of YouTube’s design libraries—laying the groundwork for a more collaborative, systematized approach to design at scale.`,
    bulletPoints: [],
    image: '/assets/section_04_colt.fulk.figma.webp',
    buttons: [
      {
        text: 'RestAPI: Fetch Figma Data App',
        icon: 'icon-Lock_light',
        action: { type: 'FeaturedProjectViewer', caseStudyKey: 'Fetch Figma Data' },
      },
      // Example Figma embed button (uncomment and edit as needed)
      // {
      //   text: 'View Figma Deck',
      //   icon: 'icon-Lock_light',
      //   action: { type: 'FigmaEmbedViewer', embedUrl: 'https://embed.figma.com/deck/opRN3K7G95Ht4334vOIeQ1/Netflix-Interview?...' },
      // },
    ],
  },
];