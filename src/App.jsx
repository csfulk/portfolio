// src/App.jsx
import React, { Suspense, useState, useEffect } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Navigation from './components/layout/Navigation'; // Default export
import Footer from './components/layout/Footer'; // Default export
import Hero from './components/Hero'; // Default export
import PasswordGate from './components/PasswordGate'; // Default export
import Modal from './components/Modal'; // Import the Modal component
import FeaturedProjectViewer from './components/projectViewer'; // Import the FeaturedProjectViewer component

// Lazy-loaded sections
const SectionOne = React.lazy(() => import('./components/sections/SectionOne'));
const SectionTwo = React.lazy(() => import('./components/sections/SectionTwo'));
const SectionThree = React.lazy(() => import('./components/sections/SectionThree'));
const SectionFour = React.lazy(() => import('./components/sections/SectionFour'));

const App = () => {
  const [authenticated, setAuthenticated] = useState(false); // Tracks if the user is authenticated
  const [isModalOpen, setModalOpen] = useState(false); // Tracks if the modal is open
  const [modalContent, setModalContent] = useState(null); // Tracks the content to display in the modal
  const [isExpanded, setExpanded] = useState(false); // Tracks if the modal is expanded

  const handleAuth = () => {
    console.log('Authentication successful');
    setAuthenticated(true); // Set the user as authenticated

    // Expand the modal after authentication
    setTimeout(() => {
      setExpanded(true);
    }, 100); // Adjust the delay as needed
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);

    if (isExpanded) {
      setTimeout(() => {
        setExpanded(true);
      }, 100);
    } else {
      setExpanded(false);
    }
  };

  const expandModal = () => {
    console.log('Expanding modal');
    setExpanded(true); // Expand the modal
  };

  console.log('Authenticated:', authenticated);
  console.log('Is Modal Open:', isModalOpen);
  console.log('Modal Content:', modalContent);
  console.log('Is Expanded:', isExpanded);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        document.activeElement?.blur(); // Blur the focused element
        setModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ThemeProvider>
      <>
        <Navigation />
        <Hero />
        <Suspense fallback={<div>Loading sections...</div>}>
          <SectionOne
            authenticated={authenticated}
            openModal={openModal}
          />
          <SectionTwo />
          <SectionThree />
          <SectionFour />
        </Suspense>
        <Footer />
        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            {authenticated ? (
              <div className={`modal-content ${isExpanded ? 'expanded' : ''}`}>
                {modalContent}
              </div>
            ) : (
              <PasswordGate onAuth={handleAuth} onExpand={expandModal} />
            )}
          </Modal>
        )}
      </>
    </ThemeProvider>
  );
};

export default App;
