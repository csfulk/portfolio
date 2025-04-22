import React, { useState, useEffect, useRef } from 'react';
import '../styles/PasswordGate.css';

const PasswordGate = ({ onAuth, onClose }) => {
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [isError, setIsError] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sitePassword = import.meta.env.VITE_SITE_PASSWORD;

    if (password === sitePassword) {
      console.log('Password correct, calling onAuth...');
      onAuth(password); // Trigger authentication logic with entered password
    } else {
      setCaption('Wrong password. Try again.');
      setIsError(true);
    }
  };

  const handleInputChange = (e) => {
    setPassword(e.target.value);
    setCaption('Press Enter');
    setIsError(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        console.log('Escape pressed');
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    inputRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
            placeholder="Enter password"
            value={password}
            onChange={handleInputChange}
            className={`password-input ${isError ? 'error' : ''}`}
          />
          <span className={`password-caption ${isError ? 'error' : ''}`}>
            {caption}
          </span>
        </div>
      </form>
      <p className="small-text">
        Don’t have a password? <a href="mailto:hello@colt.fyi">Say hello</a>, and I can send you one.
      </p>
    </div>
  );
};

export default PasswordGate;