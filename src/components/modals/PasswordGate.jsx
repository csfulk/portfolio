
import React, { useState, useRef, useEffect } from 'react';
import '@styles/PasswordGate.css';
import { eventTracker } from '@services/core/EventTracker.js';

// Read the password gate toggle from environment variables
const PASSWORD_GATE_ENABLED = import.meta.env.VITE_PASSWORD_GATE_ENABLED !== 'false';

const LOCKOUT_AFTER  = 5;   // failures before each lockout
const LOCKOUT_SECS   = 60;  // lockout duration in seconds
const REDIRECT_URL   = 'https://www.google.com';

const PasswordGate = ({ onAuth }) => {
  // If password gate is disabled, render nothing (should never be shown)
  if (!PASSWORD_GATE_ENABLED) return null;

  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [countdown, setCountdown] = useState(0);
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
        setCountdown(0);
        setCaption('');
        inputRef.current?.focus();
      } else {
        setCountdown(remaining);
        setCaption(`Too many attempts — try again in ${remaining}s`);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    const sitePassword = import.meta.env.VITE_SITE_PASSWORD;

    if (password === sitePassword) {
      eventTracker.track('password_success');
      onAuth(password);
      setCaption('Authentication successful! Redirecting...');
      setTimeout(() => setCaption(''), 2000);
    } else {
      eventTracker.track('password_fail');
      const newCount = failCount + 1;
      setFailCount(newCount);

      if (newCount % LOCKOUT_AFTER === 0) {
        const lockoutNum = newCount / LOCKOUT_AFTER;
        if (lockoutNum >= 2) {
          // 2nd lockout — redirect away
          window.location.href = REDIRECT_URL;
          return;
        }
        // 1st lockout — 60s cooldown
        setLockedUntil(Date.now() + LOCKOUT_SECS * 1000);
        setIsError(true);
        setIsSuccess(false);
      } else {
        setCaption('Incorrect password. Please try again.');
        setIsError(true);
        setIsSuccess(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const inputPassword = e.target.value;
    const sitePassword = import.meta.env.VITE_SITE_PASSWORD;

    setPassword(inputPassword);
    setIsError(false);

    if (inputPassword === sitePassword) {
      setCaption('Press Enter');
      setIsSuccess(true); // Set success state
    } else {
      setCaption('Press Enter');
      setIsSuccess(false); // Reset success state
    }
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
            disabled={isLocked}
            className={`password-input ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''} ${isLocked ? 'locked' : ''}`}
          />
        </div>
      </form>
      {caption ? (
        <p className={`password-caption-below ${isLocked ? 'lockout' : ''} ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}>
          {caption}
        </p>
      ) : null}
      <p className="small-text">
        Don’t have a password? <a href="mailto:hello@colt.fyi">Say hello</a>, and I can send you one.
      </p>
    </div>
  );
};

export default PasswordGate;