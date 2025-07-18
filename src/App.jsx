// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Hero from './components/Hero';
import Modal from './components/Modal';
import useModal from './hooks/useModal';
import useAuth from './hooks/useAuth';
import useCaseStudyViewer, { caseStudyData } from './hooks/useCaseStudyViewer';
import { sectionsData } from './components/sectionsData';
import SectionWrapper from './components/sections/SectionWrapper';
import useKeyboardInteractions from './hooks/useKeyboardInteractions';
import usePreloadImages from './hooks/usePreloadImages';
import useModalStyles from './hooks/useModalStyles';

const preloadCaseStudyImages = () => {
  const images = [];
  Object.values(caseStudyData).forEach(({ folder, count, fileName }) => {
    for (let i = 1; i <= count; i++) {
      images.push(`${folder}/${fileName}_${String(i).padStart(2, '0')}.webp`);
    }
  });
  return images;
};

const preloadCriticalCaseStudyImages = () => {
  const images = [];
  Object.values(caseStudyData).forEach(({ folder, fileName }) => {
    for (let i = 1; i <= 3; i++) {
      images.push(`${folder}/${fileName}_${String(i).padStart(2, '0')}.webp`);
    }
  });
  return images;
};

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

  // Preload critical images immediately, including the first two images of each case study
  usePreloadImages([
    '/assets/section_01_colt.fulk.youtube.webp',
    '/assets/section_02_colt.fulk.apple.webp',
    '/assets/section_04_colt.fulk.figma.webp',
    '/assets/password.laugh2.gif',
    ...preloadCriticalCaseStudyImages(),
  ]);

  // Lazy load case study images
  usePreloadImages(preloadCaseStudyImages(), { lazy: true });

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
              caseStudyData={caseStudyData}
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
