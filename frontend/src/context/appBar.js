import React, { useState, createContext, useContext } from "react";
import AppBar from "../components/AppBar";

export const AppBarContext = createContext();

export function useAppBar() {
  return useContext(AppBarContext);
}

export const AppBarProvider = ({ children }) => {
  const [actions, setActions] = useState([]);

  return (
    <AppBarContext.Provider
      value={{
        setActions,
      }}
    >
      <AppBar actions={actions} />
      {children}
    </AppBarContext.Provider>
  );
};
