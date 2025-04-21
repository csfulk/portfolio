import { useState, useRef } from 'react';
import ProjectViewer from '../components/projectViewer';
import PasswordGate from '../components/PasswordGate';

const useAuth = ({ startTransition, completeTransition, setModalContent, setExpanded }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const pendingViewerPropsRef = useRef(null);

  const handleAuth = () => {
    console.log('Authentication successful');
    console.log('Pending Viewer Props:', pendingViewerPropsRef.current);

    if (pendingViewerPropsRef.current) {
      setAuthenticated(true);
      startTransition(); // Show spinner and start transition

      setTimeout(() => {
        console.log('Expanding modal...');
        setExpanded(true); // Expand the modal to full screen

        setTimeout(() => {
          console.log('Loading ProjectViewer...');
          setModalContent(<ProjectViewer {...pendingViewerPropsRef.current} />);
          pendingViewerPropsRef.current = null;

          completeTransition(); // Complete the transition
        }, 500); // Delay to allow the expansion animation to complete
      }, 1000); // Spinner duration before expanding
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