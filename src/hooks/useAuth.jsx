import { useState, useRef, useEffect, useCallback } from 'react';
import { PasswordGate } from '@components';

// UI-only toggle: it hides the gate during local development. It cannot grant
// access to anything, because the content itself is gated server-side.
const PASSWORD_GATE_ENABLED = import.meta.env.VITE_PASSWORD_GATE_ENABLED !== 'false';

/**
 * Turns a click action into the props the modal needs.
 *
 * Figma decks are the one case that requires a round trip: their embed URLs
 * live on embed.figma.com, so they are held server-side and only released to an
 * authenticated session. Keynote decks and image sequences are ordinary
 * /assets/* paths — the edge function gates those, so the URL alone is inert.
 */
async function resolveViewer(viewerProps) {
  if (viewerProps.type !== 'FigmaEmbedViewer') return viewerProps;

  const id = viewerProps.caseStudyKey;
  const res = await fetch(`/api/case-study?id=${encodeURIComponent(id)}`, {
    credentials: 'same-origin',
  });
  if (!res.ok) return null;

  const { embedUrl } = await res.json();
  return { ...viewerProps, embedUrl };
}

function toModalContent(props) {
  switch (props.type) {
    case 'FigmaEmbedViewer':
      return { type: 'FigmaEmbedViewer', embedUrl: props.embedUrl };
    case 'HtmlEmbedViewer':
      return { type: 'HtmlEmbedViewer', url: props.url, title: props.title };
    default:
      return { type: 'FeaturedProjectViewer', title: props.title, images: props.images };
  }
}

const useAuth = ({ startTransition, setModalContent, setExpanded }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const pendingViewerPropsRef = useRef(null);

  // Restore an existing session on load. The cookie is HttpOnly, so the only
  // way to know whether we hold one is to ask the server.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/session', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d?.authenticated) setAuthenticated(true); })
      .catch(() => { /* offline or function unavailable — stay gated */ });
    return () => { cancelled = true; };
  }, []);

  const openResolved = useCallback(async (viewerProps) => {
    const resolved = await resolveViewer(viewerProps);
    if (!resolved) {
      // Session expired or content unavailable — send them back through the gate.
      setAuthenticated(false);
      return false;
    }
    setModalContent(toModalContent(resolved));
    return true;
  }, [setModalContent]);

  const authenticateAndOpenViewer = useCallback(async (viewerProps) => {
    if (!PASSWORD_GATE_ENABLED || authenticated) {
      const ok = await openResolved(viewerProps);
      if (ok) return;
      // fall through to the gate if the session turned out to be stale
    }

    pendingViewerPropsRef.current = viewerProps;
    setModalContent({
      type: 'PasswordGate',
      component: (
        <PasswordGate
          onAuth={async () => {
            setAuthenticated(true);
            startTransition();
            if (typeof setExpanded === 'function') {
              setExpanded(true);
            } else {
              console.error('setExpanded is not a function. Ensure it is passed correctly from useModal.');
            }
            await openResolved(pendingViewerPropsRef.current);
          }}
          onClose={() => setModalContent(null)}
        />
      ),
    });
  }, [authenticated, openResolved, setModalContent, startTransition, setExpanded]);

  return {
    authenticated,
    authenticateAndOpenViewer,
  };
};

export default useAuth;
