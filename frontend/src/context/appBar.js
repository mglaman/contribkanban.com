import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocation } from "react-router-dom";
import AppBar from "../components/AppBar";

export const AppBarContext = createContext();

export function useAppBar() {
  return useContext(AppBarContext);
}

export const AppBarProvider = ({ children }) => {
  const location = useLocation();
  const [actions, setActions] = useState([]);

  useEffect(() => {
    if (typeof window.fathom === "function") {
      window.fathom("trackPageview");
    }
    setActions([]);
  }, [location]);
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
