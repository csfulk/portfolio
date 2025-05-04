import React, { useState, useRef, useEffect } from 'react';
import '../styles/PasswordGate.css';

const PasswordGate = ({ onAuth }) => {
  const [password, setPassword] = useState('');
  const [caption, setCaption] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // New state for success
  const inputRef = useRef(null);

  // Focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sitePassword = import.meta.env.VITE_SITE_PASSWORD;

    if (password === sitePassword) {
      onAuth(password); // Trigger authentication logic with entered password
      setCaption('Authentication successful! Redirecting...'); // Add success message
      setTimeout(() => {
        setCaption(''); // Clear caption after a delay
      }, 2000);
    } else {
      setCaption('Incorrect password. Please try again.');
      setIsError(true);
      setIsSuccess(false); // Reset success state
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
            placeholder="Enter password"
            value={password}
            onChange={handleInputChange}
            className={`password-input ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}
          />
          <span className={`password-caption ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}>
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