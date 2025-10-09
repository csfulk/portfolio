import React, { createContext } from 'react';
import { tokens } from '../design-system/tokens';

export const ThemeContext = createContext(tokens);

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={tokens}>
      {children}
    </ThemeContext.Provider>
  );
};
