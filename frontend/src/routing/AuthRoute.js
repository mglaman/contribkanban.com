import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";

function AuthRoute({ component: Component, ...rest }) {
  const { auth, authTokens, setCurrentUser } = useAuth();
  useEffect(() => {
    console.log("AuthRoute useEffect called");
    const fetchCurrentUser = async () => {
      try {
        const res = await auth.fetchAsAuthenticated(`/me`);
        const json = await res.json();
        if (res.ok) {
          setCurrentUser(json);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        setCurrentUser(null);
        console.log(err);
      }
    };
    if (authTokens && authTokens.access_token) {
      fetchCurrentUser();
    }
  }, [authTokens]);
  return (
    <Route
      {...rest}
      render={(props) =>
        authTokens ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default AuthRoute;
