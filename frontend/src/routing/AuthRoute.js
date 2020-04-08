import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { getApiBaseUrl } from "../api";

function AuthRoute({ component: Component, ...rest }) {
  const { auth, authTokens, setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await auth.fetchAsAuthenticated(
          `${getApiBaseUrl()}/jsonapi/me`
        );
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
  }, []);
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
