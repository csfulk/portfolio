import { useState, useRef } from 'react';
import FeaturedProjectViewer from '../components/projectViewer';
import PasswordGate from '../components/passwordGate';

const useAuth = ({ startTransition, completeTransition, setModalContent, setExpanded }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const pendingViewerPropsRef = useRef(null);
  const spinnerStartRef = useRef(0);

  const handleAuth = () => {
    if (pendingViewerPropsRef.current) {
      spinnerStartRef.current = Date.now();
      setAuthenticated(true);
      startTransition();         // show spinner & begin transition
      setExpanded(true);         // animate the gate to full screen
      // Viewer will be loaded on transition end in App.jsx
    } else {
      console.error('No pendingViewerProps found!');
    }
  };

  const openPasswordGate = (viewerProps) => {
    pendingViewerPropsRef.current = viewerProps;
    setModalContent(
      <PasswordGate
        onAuth={handleAuth}
        onClose={() => setModalContent(null)}
      />
    );
  };

  const loadViewer = () => {
    if (!pendingViewerPropsRef.current) {
      console.warn('loadViewer called but no pendingViewerProps found. Skipping.');
      return;
    }

    console.log('Setting modalContent in loadViewer:', pendingViewerPropsRef.current);
    setModalContent(
      <FeaturedProjectViewer
        title={pendingViewerPropsRef.current.title}
        images={pendingViewerPropsRef.current.images}
        onClose={() => {
          setModalContent(null);
        }}
      />
    );
    pendingViewerPropsRef.current = null;
    completeTransition();
  };

  return {
    authenticated,
    handleAuth,
    openPasswordGate,
    loadViewer,
  };
};

export default useAuth;