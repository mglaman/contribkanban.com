import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../context/auth";

function GuestRoute({ children }) {
  const { authTokens } = useAuth();
  if (!authTokens) {
    return children;
  }
  return <Navigate to="/me" />
}

export default GuestRoute;
