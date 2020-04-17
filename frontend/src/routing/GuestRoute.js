import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useOAuthTokens } from "../context/auth";

function GuestRoute({ component: Component, ...rest }) {
  const [authTokens] = useOAuthTokens();
  return (
    <Route
      {...rest}
      render={(props) =>
        !authTokens ? <Component {...props} /> : <Redirect to="/me" />
      }
    />
  );
}

export default GuestRoute;
