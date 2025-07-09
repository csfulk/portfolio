import { useState, useRef } from 'react';
import PasswordGate from '../components/PasswordGate';

const useAuth = ({ startTransition, completeTransition, setModalContent, setExpanded }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const pendingViewerPropsRef = useRef(null);

  const authenticateAndOpenViewer = (viewerProps) => {
    console.log('Setting modalContent in authenticateAndOpenViewer:', viewerProps);
    // Always require authentication for all viewer types, but only once per session
    if (authenticated) {
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
                setExpanded(true); // Ensure setExpanded is called correctly
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