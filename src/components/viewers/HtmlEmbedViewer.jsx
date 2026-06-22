import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Icon } from '@components';

/**
 * Generic full-screen iframe viewer for self-contained HTML presentations
 * (e.g. exported Keynote decks). Unlike FigmaEmbedViewer, it does NOT crop the
 * bottom of the frame, so the full slide is always visible.
 *
 * Slide orientation (prev / count / next) tracks the deck's TRUE position by
 * listening to the Keynote player's own slide-change event, so the counter
 * stays correct no matter how the user navigates (our arrows, keyboard,
 * click-to-advance, number-jump, the slide navigator). This is agnostic across
 * re-exports and resilient to in-slide builds — no assumptions per deck.
 *
 * Props:
 * - url (string): URL of the HTML presentation's index.html
 * - title (string): Optional iframe title for accessibility
 * - onClose (function): Callback to close the modal
 */

// Event the Apple Keynote HTML player fires on document whenever the displayed
// slide changes; detail.slideIndex is the 0-based current slide.
const SLIDE_CHANGE_EVENT = 'ShowController:SlideIndexDidChangeEvent';

const HtmlEmbedViewer = ({ url, title = 'Presentation', onClose }) => {
  const [contentVisible, setContentVisible] = useState(false);
  const [index, setIndex] = useState(0);     // 0-based current slide (from the player)
  const [total, setTotal] = useState(null);  // total slides, once header loads

  const iframeRef = useRef(null);
  const iframeCleanupRef = useRef(null);

  // Fade-in once mounted
  useEffect(() => {
    const timer = setTimeout(() => setContentVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Read the slide count straight from the deck's own header.json
  useEffect(() => {
    let cancelled = false;
    const headerUrl = url.replace(/index\.html?(\?.*)?$/i, 'assets/header.json');
    fetch(headerUrl)
      .then((r) => (r.ok ? r.json() : null))
      .then((h) => {
        if (!cancelled && h && h.slideCount) setTotal(h.slideCount);
      })
      .catch(() => { /* counter still works, just without a total */ });
    return () => { cancelled = true; };
  }, [url]);

  // Drive the deck's native navigation with a synthetic arrow key. We don't
  // update the counter here — the player will emit SLIDE_CHANGE_EVENT and the
  // counter follows that (single source of truth).
  const sendKey = useCallback((forward) => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    const keyCode = forward ? 39 : 37;
    const key = forward ? 'ArrowRight' : 'ArrowLeft';
    const make = (type) => {
      const ev = new KeyboardEvent(type, { key, code: key, bubbles: true, cancelable: true });
      Object.defineProperty(ev, 'keyCode', { get: () => keyCode });
      Object.defineProperty(ev, 'which', { get: () => keyCode });
      return ev;
    };
    const target = doc.activeElement || doc.body || doc.documentElement || doc;
    target.dispatchEvent(make('keydown'));
    target.dispatchEvent(make('keyup'));
  }, []);

  const go = useCallback((forward) => sendKey(forward), [sendKey]);

  // Parent-level keyboard (when focus is outside the iframe)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); }
      else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); go(true); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); go(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, onClose]);

  // Wire into the (same-origin) iframe: follow the player's true slide index,
  // disable its absolute-jump controls (number-jump, navigator, Home/End), and
  // let Escape close even when the deck has keyboard focus. All of this keys off
  // stable Apple-player internals, so it holds across deck re-exports.
  const handleIframeLoad = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      // Hide the player's native jump UI (number-entry box + swipe navigator).
      const style = doc.createElement('style');
      style.textContent =
        '#slideshowNavigator,#slideNumberControl,#slideNumberDisplay{display:none !important;}';
      doc.head?.appendChild(style);

      // Counter follows the player's true current slide.
      const onSlideChange = (e) => {
        const i = e?.detail?.slideIndex;
        if (typeof i === 'number' && i >= 0) setIndex(i);
      };

      // Capture phase fires before the player's bubble-phase keydown handler on
      // document, so we can swallow number-jump (digits) and first/last (Home/
      // End) before it acts, and close on Escape. Arrows/space/click pass through.
      const onKeyCapture = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault(); e.stopImmediatePropagation(); onClose();
        } else if (e.key === 'Home' || e.key === 'End' || /^[0-9]$/.test(e.key)) {
          e.preventDefault(); e.stopImmediatePropagation();
        }
      };

      doc.addEventListener(SLIDE_CHANGE_EVENT, onSlideChange);
      doc.addEventListener('keydown', onKeyCapture, true);
      iframeCleanupRef.current = () => {
        doc.removeEventListener(SLIDE_CHANGE_EVENT, onSlideChange);
        doc.removeEventListener('keydown', onKeyCapture, true);
        style.remove();
      };
    } catch { /* cross-origin: arrows still drive via buttons; counter holds at 1 */ }
  }, [onClose]);

  useEffect(() => () => { iframeCleanupRef.current?.(); }, []);

  const arrowStyle = {
    display: 'var(--display-flex)',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    color: 'var(--colors-text-secondary)',
    cursor: 'pointer',
    padding: '0 var(--spacing-xs)',
  };

  return (
    <div
      className="html-embed-viewer project-viewer"
      role="dialog"
      aria-modal="true"
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--colors-surface-overlay)',
        display: 'var(--display-flex)',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <button
        className="close-button"
        style={{
          position: 'absolute',
          top: 'var(--spacing-xl)',
          right: 'var(--spacing-3xl)',
          display: 'var(--display-flex)',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          border: 'none',
          color: 'var(--colors-text-inverse)',
          cursor: 'pointer',
          zIndex: 'var(--z-index-tooltip)'
        }}
        onClick={onClose}
        aria-label="Close dialog"
      >
        <Icon name="Xmark" size="xl" strokeWidth={2} aria-label="Close dialog" />
      </button>

      <div
        className={`image-container${contentVisible ? ' visible' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <iframe
          ref={iframeRef}
          onLoad={handleIframeLoad}
          style={{
            background: 'var(--colors-surface-modal)',
            border: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            borderRadius: 'var(--radius-lg)',
          }}
          width="100%"
          height="100%"
          src={url}
          allowFullScreen
          title={title}
        />
      </div>

      {/* Minimal slide-orientation controls */}
      <div
        className="html-embed-controls"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 'var(--spacing-xl)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'var(--display-flex)',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: 'var(--spacing-xs) var(--spacing-md)',
          borderRadius: 'var(--radius-full, 999px)',
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(8px)',
          color: 'var(--colors-text-inverse)',
          zIndex: 'var(--z-index-tooltip)',
          userSelect: 'none',
        }}
      >
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(false)}
          style={arrowStyle}
        >
          <Icon name="NavArrowLeft" size="md" strokeWidth={2} aria-label="Previous slide" />
        </button>
        <span
          aria-live="polite"
          style={{
            fontSize: 'var(--typography-scales-body-font-size)',
            fontVariantNumeric: 'tabular-nums',
            minWidth: '3.5em',
            textAlign: 'center',
          }}
        >
          {index + 1}{total ? ` / ${total}` : ''}
        </span>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(true)}
          style={arrowStyle}
        >
          <Icon name="NavArrowRight" size="md" strokeWidth={2} aria-label="Next slide" />
        </button>
      </div>
    </div>
  );
};

export default HtmlEmbedViewer;
