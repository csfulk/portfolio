/**
 * Simple Icon Browser - Debug Version
 */

import React from 'react';

const IconoirBrowser = () => {
  return (
    <div style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      minHeight: '100vh',
      color: 'black'
    }}>
      <h1 style={{ color: 'red' }}>ICONOIR BROWSER LOADING</h1>
      <p>This is a test to see if the component renders at all.</p>
      <div style={{ 
        backgroundColor: 'yellow', 
        padding: '20px',
        border: '2px solid red'
      }}>
        If you see this yellow box, the component is working!
      </div>
    </div>
  );
};

export default IconoirBrowser;
