/**
 * Single source of truth for all case study data
 * Add/remove/enable case studies here only
 */

export const caseStudyRegistry = {
  // Snapchat Case Studies
  'snapchat-design-systems': {
    enabled: true,
    section: 'snapchat',
    button: {
      text: 'Fostering Design Systems Alignment',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FigmaEmbedViewer',
      embedUrl: 'https://embed.figma.com/deck/7bhyglnKVQY3YoEjzvviyp/Snapchat-Design-Systems?node-id=247-2576&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
    }
  },
  
  'snapchat-history-perception': {
    enabled: true,
    section: 'snapchat',
    button: {
      text: 'Elevating Design Through History & Perception',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FigmaEmbedViewer',
      embedUrl: 'https://embed.figma.com/deck/wADARTo2BiOXWSqNBf0mJQ/Elevating-Design-Through-History---Perception?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
    }
  },

  // YouTube Case Studies
  'youtube-tv-redesign': {
    enabled: true,
    section: 'youtube',
    button: {
      text: 'Strategic Redesign of YouTube on TV',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FigmaEmbedViewer',
      embedUrl: 'https://embed.figma.com/deck/xMLIEH8e4KGIyxoTUUCFO6/Strategic-Redesign-of-YouTube-on-TV?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
    }
  },

  'youtube-living-room': {
    enabled: false, // DISABLED per your request
    section: 'youtube',
    button: {
      text: 'YouTube Living Room Case Study',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FeaturedProjectViewer',
      title: 'YouTube Living Room Case Study',
      folder: '/assets/yt_case_study_00',
      count: 18,
      fileName: 'featured_ytlr'
    }
  },

  'youtube-movies-shows': {
    enabled: true,
    section: 'youtube',
    button: {
      text: 'Simplifying Movies & TV Customer Journeys',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FeaturedProjectViewer',
      title: 'YouTube Movies & Shows Case Study',
      folder: '/assets/yt_case_study_01',
      count: 24,
      fileName: 'feature_project_ytms'
    }
  },

  'youtube-design-systems': {
    enabled: false, // DISABLED per your request
    section: 'youtube',
    button: {
      text: 'Design Systems Case Study',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FeaturedProjectViewer',
      title: 'Design Systems Case Study',
      folder: '/assets/yt_case_study_03',
      count: 11,
      fileName: 'yt_ds'
    }
  },

  // Apple Case Studies
  'apple-dev-docs-figma': {
    enabled: true,
    section: 'apple',
    button: {
      text: 'Apple Developer Documentation Design System',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FigmaEmbedViewer',
      embedUrl: 'https://embed.figma.com/deck/VUYfRxLN6Is3JehNitrn2e/Apple-Developer-Documentation-Design-System?node-id=1-42&viewport=-104%2C-47%2C0.5&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&embed-host=share'
    }
  },

  'apple-dev-docs': {
    enabled: false, // DISABLED per your request
    section: 'apple',
    button: {
      text: 'Apple Developer Documentation Case Study',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FeaturedProjectViewer',
      title: 'Apple Developer Documentation Case Study',
      folder: '/assets/apple_case_study_01',
      count: 13,
      fileName: 'apple_dev_doc'
    }
  },

  'apple-production': {
    enabled: true,
    section: 'apple',
    button: {
      text: 'iOS & MacOSX Advanced Production Art',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FeaturedProjectViewer',
      title: 'Apple Production Artist Case Study',
      folder: '/assets/apple_case_study_02',
      count: 10,
      fileName: 'apple_production'
    }
  },

  // Figma Case Studies
  'fetch-figma-data': {
    enabled: true,
    section: 'figma',
    button: {
      text: 'RestAPI: Fetch Figma Data App',
      icon: {
        unauthenticated: 'Lock',
        authenticated: 'Emoji',
        hover: 'EmojiSingRightNote',
        active: 'EmojiSingLeftNote'
      }
    },
    viewer: {
      type: 'FeaturedProjectViewer',
      title: 'Fetch Figma Data App',
      folder: '/assets/fetch_figma',
      count: 12,
      fileName: 'fetch_figma'
    }
  }
};

/**
 * Get all enabled case studies
 * @returns {Object} Object containing only enabled case studies
 */
export const getEnabledCaseStudies = () => {
  return Object.entries(caseStudyRegistry)
    .filter(([_, caseStudy]) => caseStudy.enabled)
    .reduce((acc, [key, caseStudy]) => ({ ...acc, [key]: caseStudy }), {});
};

/**
 * Get enabled case studies for a specific section
 * @param {string} section - Section name (snapchat, youtube, apple, figma)
 * @returns {Array} Array of case study objects with keys
 */
export const getCaseStudiesBySection = (section) => {
  return Object.entries(caseStudyRegistry)
    .filter(([_, caseStudy]) => caseStudy.section === section && caseStudy.enabled)
    .map(([key, caseStudy]) => ({ key, ...caseStudy }));
};

/**
 * Get a specific case study by key if it's enabled
 * @param {string} key - Case study key
 * @returns {Object|null} Case study object or null if disabled/not found
 */
export const getCaseStudyByKey = (key) => {
  const caseStudy = caseStudyRegistry[key];
  return caseStudy?.enabled ? caseStudy : null;
};

/**
 * Get all image URLs for enabled case studies (for preloading)
 * @param {number} criticalCount - Number of critical images per case study
 * @returns {Object} Object with critical and all image arrays
 */
export const getCaseStudyImages = (criticalCount = 3) => {
  const criticalImages = [];
  const allImages = [];

  Object.entries(caseStudyRegistry).forEach(([key, caseStudy]) => {
    if (caseStudy.enabled && caseStudy.viewer.type === 'FeaturedProjectViewer') {
      const { folder, fileName, count } = caseStudy.viewer;
      
      // Generate all images for this case study
      const caseStudyImages = Array.from({ length: count }, (_, i) => 
        `${folder}/${fileName}_${String(i + 1).padStart(2, '0')}.webp`
      );
      
      // Add critical images (first N)
      criticalImages.push(...caseStudyImages.slice(0, Math.min(criticalCount, count)));
      
      // Add all images
      allImages.push(...caseStudyImages);
    }
  });

  return { criticalImages, allImages };
};
