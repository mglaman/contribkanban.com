import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useOAuthTokens } from "../context/auth";

function AuthRoute({ component: Component, ...rest }) {
  const [authTokens] = useOAuthTokens();
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
