import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

const Logout = () => {
  const { authTokens, logout } = useAuth();
  useEffect(() => {
    return () => {
      if (authTokens) {
        logout();
      }
    };
  });
  return <Redirect to="/login" />;
};
export default Logout;
