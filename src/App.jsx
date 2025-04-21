// src/App.jsx
import React, { Suspense, useEffect, useState } from 'react';
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
import FeaturedProjectViewer from './components/projectViewer';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log('Closing modal...');
    setIsModalOpen(false);
    setModalContent(null);
  };

  const {
    isExpanded,
    loading,
    transitioning,
    setExpanded,
    setLoading,
    startTransition,
    completeTransition,
  } = useModal();

  const { authenticated, openPasswordGate } = useAuth({
    startTransition,
    completeTransition,
    setModalContent: openModal,
    setExpanded, // Pass setExpanded to useAuth
  });

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

  return (
    <ThemeProvider>
      <>
        <Navigation />
        <Hero />
        <Suspense fallback={<div>Loading sections...</div>}>
          <SectionOne
            authenticated={authenticated}
            openModal={openModal}
            openPasswordGate={openPasswordGate}
          />
          <SectionTwo />
          <SectionThree />
          <SectionFour />
        </Suspense>
        <Footer />
        <button
          onClick={() =>
            openModal(
              <FeaturedProjectViewer
                closeModal={closeModal}
                title="Project"
                images={['image1.jpg', 'image2.jpg']}
              />
            )
          }
        >
          Open Project Viewer
        </button>
        {isModalOpen && (
          <div className="modal-overlay">
            <div
              className={`modal-container ${
                transitioning ? 'transitioning' : ''
              } ${isExpanded ? 'expanded' : ''}`}
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
