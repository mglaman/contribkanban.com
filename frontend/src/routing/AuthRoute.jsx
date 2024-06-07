import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

function AuthRoute({ children }) {
  const { authTokens } = useAuth();
  if (authTokens) {
    return children;
  }
  return <Navigate to="/login" />
}

export default AuthRoute;
