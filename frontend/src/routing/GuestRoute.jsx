import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

function GuestRoute({ children }) {
  const { authTokens } = useAuth();
  if (!authTokens) {
    return children;
  }
  return <Navigate to="/me" />
}

export default GuestRoute;
