import { useState, useRef } from 'react';
import FeaturedProjectViewer from '../components/projectViewer';
import PasswordGate from '../components/passwordGate';

const useAuth = ({ startTransition, completeTransition, setModalContent, setExpanded }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const pendingViewerPropsRef = useRef(null);
  const spinnerStartRef = useRef(0);

  const handleAuth = () => {
    console.log('Authentication successful');
    console.log('Pending Viewer Props:', pendingViewerPropsRef.current);
    console.log("handleAuth: calling startTransition & setExpanded");

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
    console.log('openPasswordGate called with viewerProps:', viewerProps);
    console.log('Setting pendingViewerProps:', viewerProps);
    pendingViewerPropsRef.current = viewerProps;
    setModalContent(
      <PasswordGate
        onAuth={handleAuth}
        onClose={() => setModalContent(null)}
      />
    );
  };

  const loadViewer = () => {
    console.log('loadViewer invoked, pending props:', pendingViewerPropsRef.current);
    if (pendingViewerPropsRef.current) {
      const elapsed = Date.now() - spinnerStartRef.current;
      const minDuration = 2000; // minimum spinner time in ms
      const delay = Math.max(0, minDuration - elapsed);
      setTimeout(() => {
        console.log('loadViewer: setting FeaturedProjectViewer with:', pendingViewerPropsRef.current);
        setModalContent(
          <FeaturedProjectViewer {...pendingViewerPropsRef.current} />,
          true
        );
        pendingViewerPropsRef.current = null;
        completeTransition();
      }, delay);
    } else {

    }
  };

  return {
    authenticated,
    handleAuth,
    openPasswordGate,
    loadViewer,
  };
};

export default useAuth;