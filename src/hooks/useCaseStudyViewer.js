import React from 'react';
import { ProjectViewer } from '@components';
import { useImageHandling, generateImageUrls } from '@hooks';
import { getCaseStudyByKey } from '@data';


export function useCaseStudyViewer({ authenticateAndOpenViewer }) {
  const { preloadImages } = useImageHandling();
  
  const handleCaseStudyClick = React.useCallback((action) => {
    if (!action || typeof action !== 'object' || !action.type) {
      console.error('Invalid action passed to handleCaseStudyClick:', action);
      return;
    }

    switch (action.type) {
      case 'FeaturedProjectViewer': {
        const key = action.caseStudyKey;
        const caseStudy = getCaseStudyByKey(key);
        
        if (!caseStudy) {
          console.warn(`Case study ${key} is not found or disabled.`);
          return;
        }
        
        const { title, folder, count, fileName } = caseStudy.viewer;
        const images = generateImageUrls(folder, count, fileName);
        if (!images || images.length === 0) {
          console.error(`No images generated for key: ${key}. Check caseStudyData or image generation logic.`);
          return;
        }
        
        // Use unified image handling for preloading
        preloadImages(images);
        
        const viewerProps = { title, images };
        authenticateAndOpenViewer(viewerProps);
        break;
      }
      case 'FigmaEmbedViewer': {
        // The embed URL is held server-side, so the key is what has to survive
        // this hop — useAuth trades it for a URL once a session exists.
        if (!action.caseStudyKey) {
          console.error('FigmaEmbedViewer action is missing caseStudyKey:', action);
          return;
        }
        authenticateAndOpenViewer({
          type: 'FigmaEmbedViewer',
          caseStudyKey: action.caseStudyKey,
        });
        break;
      }
      case 'HtmlEmbedViewer': {
        // Open a self-contained HTML presentation (e.g. exported Keynote deck)
        authenticateAndOpenViewer({
          type: 'HtmlEmbedViewer',
          url: action.url,
          title: action.title,
        });
        break;
      }
      default:
        console.error('Unknown action type in handleCaseStudyClick:', action.type);
    }
  }, [authenticateAndOpenViewer, preloadImages]);

  return {
    handleCaseStudyClick,
  };
}

export default useCaseStudyViewer;