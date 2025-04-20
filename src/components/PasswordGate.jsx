import React, { useState } from 'react';

const PasswordGate = ({ onAuth }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  console.log(import.meta.env); // Add this log to debug environment variables

  const handleSubmit = (e) => {
    e.preventDefault();

    const expectedPassword = import.meta.env.VITE_SITE_PASSWORD;
    console.log('Expected Password:', expectedPassword); // Add this log
    console.log('Entered Password:', input); // Optional: Log the user input for debugging

    if (input === expectedPassword) {
      onAuth();
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Enter Password</h2>
        <input
          type="password"
          placeholder="Password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Enter</button>
        {error && <p style={styles.error}>Incorrect password.</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'var(--primary)',
    color: 'white',
    border: '2px solid red', // Add this for debugging
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    maxWidth: '300px',
    width: '100%',
  },
  title: {
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    border: 'none',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '4px',
    backgroundColor: 'var(--accent)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: '#ffcccc',
    fontSize: '0.875rem',
  },
};

export default PasswordGate;
