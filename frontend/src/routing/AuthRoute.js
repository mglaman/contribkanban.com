import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
import { getApiBaseUrl } from "../api";

function AuthRoute({ component: Component, ...rest }) {
  const { authTokens, expireTokens, setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/jsonapi/me`, {
          headers: {
            Authorization: `${authTokens.token_type} ${authTokens.access_token}`,
          },
        });
        const json = await res.json();
        if (res.ok) {
          setCurrentUser(json);
        } else {
          setCurrentUser(null);
          expireTokens();
        }
      } catch (err) {
        setCurrentUser(null);
        expireTokens();
        console.log(err);
      }
    };
    if (authTokens && authTokens.token_type) {
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
