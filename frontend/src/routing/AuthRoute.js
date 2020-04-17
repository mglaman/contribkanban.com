import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";

function AuthRoute({
  component: Component,
  auth,
  authTokens,
  setCurrentUser,
  ...rest
}) {
  useEffect(() => {
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
  }, [authTokens, setCurrentUser, auth]);
  return (
    <Route
      {...rest}
      render={(props) =>
        authTokens ? (
          <Component auth={auth} {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />
  );
}

export default AuthRoute;
