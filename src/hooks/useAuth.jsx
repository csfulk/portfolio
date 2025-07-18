import { useState, useRef } from 'react';
import PasswordGate from '../components/PasswordGate';

// Read the password gate toggle from environment variables
const PASSWORD_GATE_ENABLED = import.meta.env.VITE_PASSWORD_GATE_ENABLED !== 'false';

const useAuth = ({ startTransition, completeTransition, setModalContent, setExpanded }) => {
  // If the password gate is disabled, always start authenticated
  const [authenticated, setAuthenticated] = useState(!PASSWORD_GATE_ENABLED ? true : false);
  const pendingViewerPropsRef = useRef(null);

  const authenticateAndOpenViewer = (viewerProps) => {
    // If password gate is disabled, always allow access
    if (!PASSWORD_GATE_ENABLED || authenticated) {
      if (viewerProps.type === 'FigmaEmbedViewer') {
        setModalContent({
          type: 'FigmaEmbedViewer',
          embedUrl: viewerProps.embedUrl,
        });
      } else {
        setModalContent({
          type: 'FeaturedProjectViewer',
          title: viewerProps.title,
          images: viewerProps.images,
        });
      }
    } else {
      pendingViewerPropsRef.current = viewerProps;
      setModalContent({
        type: 'PasswordGate',
        component: (
          <PasswordGate
            onAuth={() => {
              setAuthenticated(true);
              startTransition();
              if (typeof setExpanded === 'function') {
                setExpanded(true);
              } else {
                console.error('setExpanded is not a function. Ensure it is passed correctly from useModal.');
              }
              // After authentication, open the correct viewer type
              if (pendingViewerPropsRef.current.type === 'FigmaEmbedViewer') {
                setModalContent({
                  type: 'FigmaEmbedViewer',
                  embedUrl: pendingViewerPropsRef.current.embedUrl,
                });
              } else {
                setModalContent({
                  type: 'FeaturedProjectViewer',
                  title: pendingViewerPropsRef.current.title,
                  images: pendingViewerPropsRef.current.images,
                });
              }
            }}
            onClose={() => setModalContent(null)}
          />
        ),
      });
    }
  };

  return {
    authenticated,
    authenticateAndOpenViewer,
  };
};

export default useAuth;