// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from '@theme';
import { 
  Navigation, 
  Footer, 
  Hero, 
  Modal, 
  SectionWrapper, 
  sectionsData 
} from '@components';
import { 
  useAuth, 
  useCaseStudyViewer, 
  useModalManager,
  useImageOptimization
} from '@hooks';
import { getCaseStudyImages } from '@data';

const App = () => {
  // Enhanced modal management with integrated keyboard interactions and styling
  const modalManager = useModalManager({
    onEscape: () => {
      console.log('Modal escaped via keyboard');
    },
    allowEnterInInputs: true
  });

  const {
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
    isExpanded,
    loading,
    transitioning,
    setExpanded,
    startTransition,
    completeTransition,
    loadViewer,
    debugInfo: modalDebugInfo
  } = modalManager;

  const { authenticated, authenticateAndOpenViewer } = useAuth({
    startTransition,
    completeTransition,
    setModalContent: openModal,
    setExpanded,
  });

  const viewer = useCaseStudyViewer({
    authenticateAndOpenViewer,
  });

  console.log('Modal flags →', { isModalOpen, transitioning, isExpanded, loading });

  // Get images from enabled case studies
  const { criticalImages: caseStudyCriticalImages, allImages: caseStudyAllImages } = getCaseStudyImages(3);
  
  // Preload critical images immediately (only from enabled case studies)
  const criticalImages = [
    '/assets/section_01_colt.fulk.youtube.webp',
    '/assets/section_02_colt.fulk.apple.webp',
    '/assets/section_04_colt.fulk.figma.webp',
    '/assets/password.laugh2.gif',
    ...caseStudyCriticalImages
  ];
  
  // Enhanced image optimization with performance monitoring
  const imageOptimization = useImageOptimization({
    criticalImages,
    lazyImages: caseStudyAllImages,
    logProgress: false // Set to true for debugging
  });

  // Console log modal state for debugging (remove in production)
  console.log('Modal State →', modalDebugInfo);
  console.log('Image Stats →', imageOptimization.imageStats);

  return (
    <ThemeProvider>
      <>
        <Navigation />
        <Hero />
        <Suspense fallback={<div>Loading sections...</div>}>
          {sectionsData.map((section) => (
            <SectionWrapper
              key={section.id}
              section={section}
              handleCaseStudyClick={viewer.handleCaseStudyClick}
              authenticated={authenticated}
            />
          ))}
        </Suspense>

        <Modal
          isModalOpen={isModalOpen}
          modalContent={modalContent}
          closeModal={closeModal}
          transitioning={transitioning}
          isExpanded={isExpanded}
          loadViewer={loadViewer}
          loading={loading}
        />
        <Footer />
      </>
    </ThemeProvider>
  );
};

export default App;
