import { useState, useRef } from 'react';
import FeaturedProjectViewer from '../components/projectViewer';
import PasswordGate from '../components/PasswordGate';

const useAuth = ({ startTransition, completeTransition, setModalContent, setExpanded }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const pendingViewerPropsRef = useRef(null);

  const handleAuth = () => {
    console.log('Authentication successful');
    console.log('Pending Viewer Props:', pendingViewerPropsRef.current);

    if (pendingViewerPropsRef.current) {
      setAuthenticated(true);
      startTransition(); // show spinner & begin transition
      setModalContent(
        <FeaturedProjectViewer {...pendingViewerPropsRef.current} />,
        true
      );
      pendingViewerPropsRef.current = null;
    } else {
      console.error('No pendingViewerProps found!');
    }
  };

  const openPasswordGate = (viewerProps) => {
    console.log('Setting pendingViewerProps:', viewerProps);
    pendingViewerPropsRef.current = viewerProps;
    setModalContent(
      <PasswordGate
        onAuth={handleAuth}
        onClose={() => setModalContent(null)}
      />
    );
  };

  return {
    authenticated,
    handleAuth,
    openPasswordGate,
  };
};

export default useAuth;