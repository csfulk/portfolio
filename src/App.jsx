// src/App.jsx
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import Navigation from './components/layout/Navigation'; // Default export
import Footer from './components/layout/Footer'; // Default export
import Hero from './components/Hero'; // Default export
import PasswordGate from './components/PasswordGate'; // Default export
import Modal from './components/Modal'; // Import the Modal component
import ProjectViewer from './components/projectViewer'; // Import the ProjectViewer component

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

  // Use a ref to store pendingViewerProps
  const pendingViewerPropsRef = useRef(null);

  const handleAuth = () => {
    console.log('Authentication successful');
    console.log('Pending Viewer Props:', pendingViewerPropsRef.current);

    if (pendingViewerPropsRef.current) {
      setAuthenticated(true); // Set the user as authenticated

      // Update the modal content with ProjectViewer
      setTimeout(() => {
        console.log('Updating modal content with ProjectViewer');
        setModalContent(<ProjectViewer {...pendingViewerPropsRef.current} />);
        pendingViewerPropsRef.current = null; // Clear the pending content AFTER updating modalContent
      }, 100); // Add a slight delay to ensure state updates are processed
    } else {
      console.error('No pendingViewerProps found!');
    }
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const openPasswordGate = (viewerProps) => {
    console.log('Setting pendingViewerProps:', viewerProps);
    pendingViewerPropsRef.current = viewerProps; // Store the expected modal content in the ref
    setModalContent(
      <PasswordGate
        onAuth={handleAuth}
        onExpand={() => setExpanded(true)}
        onClose={() => setModalOpen(false)}
      />
    );
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const sitePassword = import.meta.env.VITE_SITE_PASSWORD;
  
    if (password === sitePassword) {
      console.log('Password correct, calling onAuth...');
      onAuth(); // Call onAuth without arguments
      onExpand();
    } else {
      setCaption('Wrong password. Try again.');
      setIsError(true);
    }
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
            openPasswordGate={openPasswordGate} // Pass the new function
          />
          <SectionTwo />
          <SectionThree />
          <SectionFour />
        </Suspense>
        <Footer />
        {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <div className={`modal-content ${isExpanded ? 'expanded' : ''}`}>
              {modalContent}
            </div>
          </Modal>
        )}
      </>
    </ThemeProvider>
  );
};

export default App;
