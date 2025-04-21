// src/App.jsx
import React, { Suspense, useState } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import { Navigation } from './components/layout/Navigation'; // Named export
import Footer from './components/layout/Footer'; // Default export
import Hero from './components/Hero'; // Default export
import PasswordGate from './components/PasswordGate'; // Default export\


// Lazy-loaded sections
const SectionOne = React.lazy(() => import('./components/sections/SectionOne'));
const SectionTwo = React.lazy(() => import('./components/sections/SectionTwo'));
const SectionThree = React.lazy(() => import('./components/sections/SectionThree'));
const SectionFour = React.lazy(() => import('./components/sections/SectionFour'));

const App = () => {
  const [authenticated, setAuthenticated] = useState(true);

  console.log('Rendering PasswordGate');

  return (
    <ThemeProvider>
      {authenticated ? (
        <>
          <Navigation />
          <Hero />
          <Suspense fallback={<div>Loading sections...</div>}>
            <SectionOne />
            <SectionTwo />
            <SectionThree />
            <SectionFour />
          </Suspense>
          <Footer />
        </>
      ) : (
        <PasswordGate onAuth={() => setAuthenticated(true)} />
      )}
    </ThemeProvider>
  );
};

export default App;
