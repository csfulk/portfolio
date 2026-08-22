import React, { useState, useEffect } from 'react';
import '@styles/Nedry.css';
import { eventTracker } from '@services/core/EventTracker.js';

/**
 * Reached only by submitting the decoy password planted in the client bundle
 * (see src/components/modals/PasswordGate.jsx). Anyone landing here went
 * looking through the JavaScript for a credential and found the bait.
 */
const NEDRY_IMAGE = '/assets/nedry.webp';

export const Nedry = () => {
  const [hasImage, setHasImage] = useState(true);

  useEffect(() => {
    eventTracker.track('easter_egg_nedry_view');
  }, []);

  return (
    <main className="nedry-page">
      {hasImage && (
        <img
          src={NEDRY_IMAGE}
          alt="Dennis Nedry wagging a finger"
          className="nedry-image"
          onError={() => setHasImage(false)}
        />
      )}

      <h1 className="nedry-title">
        Ah ah ah!
        <em>You didn’t say the magic word</em>
      </h1>

      <hr className="nedry-rule" />

      <p className="nedry-body">
        Nice work finding that in the bundle — that is genuinely the right instinct.
        It just wasn’t the password. The real one never reaches your browser; it’s
        checked on the server, and the string you found was left in the JavaScript
        for exactly this moment.
      </p>

      <p className="nedry-body">
        If you actually want in, <a href="mailto:hello@colt.fyi">say hello</a> and
        I’ll send you one.
      </p>

      <div className="nedry-actions">
        <a className="nedry-link primary" href="/">Back to the portfolio</a>
        <a
          className="nedry-link"
          href="https://www.linkedin.com/in/coltfulk/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
    </main>
  );
};

export default Nedry;
