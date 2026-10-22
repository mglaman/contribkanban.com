import React, { useEffect } from "react";
import { Navigate } from "react-router";
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
  return <Navigate to="/login" />;
};
export default Logout;
