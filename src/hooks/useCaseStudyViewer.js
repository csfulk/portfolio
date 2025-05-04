import React from 'react';
import ProjectViewer from '../components/projectViewer';

// Mapping of case study data
const caseStudyData = {
  'Case Study 1': {
    title: 'YouTube Living Room Case Study',
    folder: '/assets/yt_case_study_00',
    count: 18,
    fileName: 'featured_ytlr'
  },
  'Case Study 2': {
    title: 'YouTube Movies & Shows Case Study',
    folder: '/assets/yt_case_study_01',
    count: 24,
    fileName: 'feature_project_ytms'
  },
  'Case Study 3': {
    title: 'Design Systems Case Study',
    folder: '/assets/yt_case_study_03',
    count: 11,
    fileName: 'yt_ds'
  },
  'Apple Case Study 1': {
    title: 'Apple Developer Documentation Case Study',
    folder: '/assets/apple_case_study_01',
    count: 13,
    fileName: 'apple_dev_doc'
  },
  'Apple Case Study 2': {
    title: 'Apple Production Artist Case Study',
    folder: '/assets/apple_case_study_02',
    count: 10,
    fileName: 'apple_production'
  },
  'Fetch Figma Data': {
    title: 'Fetch Figma Data App',
    folder: '/assets/fetch_figma',
    count: 12,
    fileName: 'fetch_figma'
  }
};

export function useCaseStudyViewer({ authenticateAndOpenViewer }) {
  const handleCaseStudyClick = React.useCallback((key) => {
    console.log('handleCaseStudyClick called with key:', key);
    const cs = caseStudyData[key];
    if (!cs) {
      console.error(`Invalid key passed to handleCaseStudyClick: ${key}. No matching case study found.`);
      return;
    }

    const { title, folder, count, fileName } = cs;
    const images = Array.from({ length: count }, (_, i) =>
      `${folder}/${fileName}_${String(i + 1).padStart(2, '0')}.webp`
    );

    if (!images || images.length === 0) {
      console.error(`No images generated for key: ${key}. Check caseStudyData or image generation logic.`);
      return;
    }

    const viewerProps = { title, images };

    console.log('Generated viewerProps:', { title, images });

    authenticateAndOpenViewer(viewerProps);
  }, [authenticateAndOpenViewer]);

  return {
    handleCaseStudyClick,
  };
}

export { caseStudyData };
export default useCaseStudyViewer;