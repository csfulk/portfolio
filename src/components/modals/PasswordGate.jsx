
import React, { useState, useRef, useEffect } from 'react';
import '@styles/PasswordGate.css';
import { eventTracker } from '@services/core/EventTracker.js';

const LOCKOUT_AFTER  = 5;   // failures before each lockout
const LOCKOUT_SECS   = 60;  // lockout duration in seconds
const REDIRECT_URL   = 'https://www.linkedin.com/in/coltfulk/';

/**
 * DECOY — deliberately the only password-shaped string in the bundle.
 *
 * The real check now happens in netlify/functions/login.mjs against SITE_PASSWORD,
 * which never reaches the browser. Anyone who inspects the JS looking for a
 * credential finds this instead; submitting it lands them on /nedry rather than
 * granting access. Comments are stripped at build time, so the shipped bundle
 * shows only the bare comparison — which is exactly the bait.
 */
const SITE_PASSWORD = 'LemonDrops';

const PasswordGate = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const inputRef = useRef(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Countdown timer during lockout
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setCaption('');
        inputRef.current?.focus();
      } else {
        setCaption(`Too many attempts — try again in ${remaining}s`);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null;

  // Live validation. The browser no longer knows the password, so the green
  // state comes from a debounced server probe instead of a local comparison.
  // Probes issue no cookie and don't count toward the lockout.
  useEffect(() => {
    if (isLocked || !password) { setIsSuccess(false); return; }
    if (password.length < 3) { setIsSuccess(false); return; }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/login', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          credentials: 'same-origin',
          signal: controller.signal,
          body: JSON.stringify({ password, scope: 'site', probe: true }),
        });
        if (!res.ok) return;                       // 429 or similar — stay neutral
        const { match } = await res.json();
        setIsSuccess(Boolean(match));
        if (match) setCaption('Press Enter');
      } catch {
        /* aborted or offline — leave the field as-is */
      }
    }, 250);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [password, isLocked]);

  const registerFailure = () => {
    const newCount = failCount + 1;
    setFailCount(newCount);
    setIsError(true);
    setIsSuccess(false);

    if (newCount % LOCKOUT_AFTER === 0) {
      if (newCount / LOCKOUT_AFTER >= 2) {
        window.location.href = REDIRECT_URL;
        return;
      }
      setLockedUntil(Date.now() + LOCKOUT_SECS * 1000);
    } else {
      setCaption('Incorrect password. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked || isChecking) return;

    if (password === SITE_PASSWORD) {
      eventTracker.track('easter_egg_nedry');
      window.location.href = '/nedry';
      return;
    }

    setIsChecking(true);
    setCaption('Checking…');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password, scope: 'site' }),
      });
      const data = await res.json().catch(() => ({}));

      if (data?.decoy) {
        eventTracker.track('easter_egg_nedry');
        window.location.href = '/nedry';
        return;
      }

      if (res.ok && data?.ok) {
        eventTracker.track('password_success');
        setIsError(false);
        setIsSuccess(true);
        setCaption('Authentication successful! Redirecting...');
        await onAuth(password);
        setTimeout(() => setCaption(''), 2000);
        return;
      }

      if (res.status === 429) {
        setCaption('Too many attempts — please wait a moment.');
        setIsError(true);
        return;
      }

      eventTracker.track('password_fail');
      registerFailure();
    } catch {
      setCaption('Could not reach the server. Please try again.');
      setIsError(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    setIsError(false);
    setCaption('Press Enter');
  };

  return (
    <div className="password-gate">
      <img
        src="/assets/password.laugh2.gif"
        alt="Password Laugh"
        className="password-gate-image"
      />
      <form onSubmit={handleSubmit} className="password-form">
        <div className="password-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder={isLocked ? 'Locked…' : 'Enter password'}
            value={password}
            onChange={handleInputChange}
            disabled={isLocked || isChecking}
            className={`password-input ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''} ${isLocked ? 'locked' : ''}`}
          />
          {!isLocked && (
            <span className={`password-caption ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}>
              {caption}
            </span>
          )}
        </div>
        {isLocked && (
          <p className="password-lockout-message">{caption}</p>
        )}
      </form>
      <p className="small-text">
        Don’t have a password? <a href="mailto:hello@colt.fyi">Say hello</a>, and I can send you one.
      </p>
    </div>
  );
};

export default PasswordGate;
