// src/App.jsx
import React, { Suspense, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';
import Hero from './components/Hero';
import Modal from './components/Modal';
import SectionOne from './components/sections/SectionOne';
import SectionTwo from './components/sections/SectionTwo';
import SectionThree from './components/sections/SectionThree';
import SectionFour from './components/sections/SectionFour';
import useModal from './hooks/useModal';
import useAuth from './hooks/useAuth';
import useCaseStudyViewer from './hooks/useCaseStudyViewer';

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
  } = useModal();

  const { authenticated, openPasswordGate, loadViewer } = useAuth({
    startTransition,
    completeTransition,
    setModalContent: openModal,
    setExpanded, // Pass setExpanded to useAuth
  });

  const viewer = useCaseStudyViewer({
    authenticated,
    openModal,
    closeModal,
    openPasswordGate,
    loadViewer
  });

  console.log('Modal flags →', { isModalOpen, transitioning, isExpanded, loading });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        document.activeElement?.blur();
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (isModalOpen) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
    }
    // Cleanup on unmount or when modal closes
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <ThemeProvider>
      <>
        <Navigation />
        <Hero />
        <Suspense fallback={<div>Loading sections...</div>}>
          <SectionOne handleCaseStudyClick={viewer.handleCaseStudyClick} />
          <SectionTwo handleCaseStudyClick={viewer.handleCaseStudyClick} />
          <SectionThree />
          <SectionFour />
        </Suspense>
        <Footer />
        
        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div
              className={`modal-container ${
                transitioning ? 'transitioning' : ''
              } ${isExpanded ? 'expanded' : ''}`}
              onTransitionEnd={loadViewer}
              onClick={(e) => e.stopPropagation()}
            >
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              ) : (
                modalContent
              )}
            </div>
          </div>
        )}
      </>
    </ThemeProvider>
  );
};

export default App;
