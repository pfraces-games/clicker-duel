import { createContext, useContext, useState } from 'react';

const AppStateContext = createContext({});

export const AppStateProvider = ({ initialState = null, children }) => {
  const [state, setState] = useState(initialState);

  return (
    <AppStateContext.Provider value={{ state, setState }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => useContext(AppStateContext);
