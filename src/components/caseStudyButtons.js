// Centralized button config for all case study sections
// Each key is a section, value is an array of button configs

export const caseStudyButtons = {
  snapchat: [
    {
      text: 'Fostering Design Systems Alignment',
      icon: 'icon-Lock_light',
      action: {
        type: 'FigmaEmbedViewer',
        embedUrl: 'https://embed.figma.com/deck/7bhyglnKVQY3YoEjzvviyp/Snapchat-Design-Systems?node-id=247-2576&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
      }
    },
    {
      text: 'Elevating Design Through History & Perception',
      icon: 'icon-Lock_light',
      action: {
        type: 'FigmaEmbedViewer',
        embedUrl: 'https://embed.figma.com/deck/wADARTo2BiOXWSqNBf0mJQ/Elevating-Design-Through-History---Perception?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
      }
    },
  ],
  youtube: [
    {
      text: 'Strategic Redesign of YouTube on TV',
      icon: 'icon-Lock_light',
      action: {
        type: 'FigmaEmbedViewer',
        embedUrl: 'https://embed.figma.com/deck/xMLIEH8e4KGIyxoTUUCFO6/Strategic-Redesign-of-YouTube-on-TV?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
      }
    },
    {
      text: 'Simplifing Movies & TV Customer Journeys',
      icon: 'icon-Lock_light',
      action: {
        type: 'FeaturedProjectViewer',
        caseStudyKey: 'Case Study 2'
      }
    },
  ],
  apple: [
    {
      text: 'Apple Developer Documentation Design System',
      icon: 'icon-Lock_light',
      action: {
        type: 'FigmaEmbedViewer',
        embedUrl: 'https://embed.figma.com/deck/VUYfRxLN6Is3JehNitrn2e/Apple-Developer-Documentation-Design-System?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
      }
    },
    {
      text: 'iOS & MacOSX Advanced Prodction Art',
      icon: 'icon-Lock_light',
      action: {
        type: 'FeaturedProjectViewer',
        caseStudyKey: 'Apple Case Study 2'
      }
    }
  ],
  figma: [
    {
      text: 'RestAPI: Fetch Figma Data App',
      icon: 'icon-Lock_light',
      action: {
        type: 'FeaturedProjectViewer',
        caseStudyKey: 'Fetch Figma Data'
      }
    },
    // Example Figma embed button (uncomment and edit as needed)
    // {
    //   text: 'View Figma Deck',
    //   icon: 'icon-Lock_light',
    //   action: { type: 'FigmaEmbedViewer', embedUrl: 'https://embed.figma.com/deck/opRN3K7G95Ht4334vOIeQ1/Netflix-Interview?...' },
    // },
  ]
};
