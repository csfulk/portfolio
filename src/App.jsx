// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Hero from './components/Hero';
import Modal from './components/Modal';
import useModal from './hooks/useModal';
import useAuth from './hooks/useAuth';
import useCaseStudyViewer from './hooks/useCaseStudyViewer';
import { sectionsData } from './components/sectionsData';
import SectionWrapper from './components/sections/SectionWrapper';
import useKeyboardInteractions from './hooks/useKeyboardInteractions';
import { useImageHandling } from './hooks/useImageHandling';
import { getCaseStudyImages } from './data/caseStudyRegistry';
import useModalStyles from './hooks/useModalStyles';

const App = () => {
  const {
    isModalOpen,
    modalContent,
    openModal,
    closeModal,
    isExpanded,
    loading,
    transitioning,
    setExpanded,
    setLoading,
    startTransition,
    completeTransition,
    loadViewer,
  } = useModal();

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
  
  // Use unified image handling (only for enabled case studies)
  useImageHandling(criticalImages, { preload: true });
  useImageHandling(caseStudyAllImages, { lazy: true });

  // Apply modal styles using the custom hook
  useModalStyles(isModalOpen);

  useKeyboardInteractions({
    onEscape: () => {
      document.activeElement?.blur();
      closeModal();
    },
    onArrowLeft: () => {
      // Add logic to navigate to the previous item if applicable
    },
    onArrowRight: () => {
      // Add logic to navigate to the next item if applicable
    },
    allowEnterInInputs: true,
  });

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
