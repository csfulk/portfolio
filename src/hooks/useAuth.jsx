import { useState, useRef } from 'react';
import ProjectViewer from '../components/projectViewer';
import PasswordGate from '../components/PasswordGate';

const useAuth = ({ setLoading, setModalContent, setExpanded }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const pendingViewerPropsRef = useRef(null);

  const handleAuth = () => {
    console.log('Authentication successful');
    console.log('Pending Viewer Props:', pendingViewerPropsRef.current);

    if (pendingViewerPropsRef.current) {
      setAuthenticated(true);
      setLoading(true);

      setTimeout(() => {
        console.log('Updating modal content with ProjectViewer');
        setModalContent(<ProjectViewer {...pendingViewerPropsRef.current} />);
        pendingViewerPropsRef.current = null;
        setLoading(false);
        setExpanded(true);
      }, 1000);
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
        onExpand={() => setExpanded(true)}
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