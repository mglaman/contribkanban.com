import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { AuthContext, fetchAsAuthenticated } from "./context/auth";
import AuthRoute from "./routing/AuthRoute";
import GuestRoute from "./routing/GuestRoute";

import AppBar from "./components/AppBar";
import Home from "./pages/Home";
import Board from "./pages/Board";
import NodeBoard from "./pages/NodeBoard";
import Create from "./pages/Create";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Me from "./pages/Me";
import NodeBoardEditForm from "./pages/NodeBoardEditForm";
import { useOAuthTokens, storeOauthTokens } from "./context/auth";

function App() {
  const [authTokens] = useOAuthTokens();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    console.log(`App authTokens useEffect: entered.`);
    const fetchCurrentUser = async () => {
      try {
        const res = await fetchAsAuthenticated(`/me`, null, authTokens);
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
      console.log(`App authTokens useEffect: fetch user.`);
      fetchCurrentUser();
    }
  }, [authTokens, setCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      <AppBar />
      <Switch>
        <Route exact path={`/board/:machineName`} component={Board} />
        <Route
          exact
          path={`/node-board/:uuid`}
          render={(props) => <NodeBoard {...props} />}
        />
        <Route path={`/create`} component={Create} />

        <GuestRoute path={`/login`} component={Login} />
        <GuestRoute path={`/register`} component={Register} />
        <GuestRoute path={`/forgot-password`} component={ForgotPassword} />
        <Route path="/about">
          <p>About</p>
        </Route>
        <AuthRoute path={`/me`} component={Me} />
        <AuthRoute
          exact
          path={`/node-board/:uuid/edit`}
          component={NodeBoardEditForm}
        />
        <Route
          path={`/logout`}
          render={() => {
            storeOauthTokens(null);
            return <Redirect to="/login" />;
          }}
        />
        <Route exact path={`/boards/:boardType`} component={Home} />
        <Route exact path={`/boards`} component={Home} />
        <Route exact path="/" component={Home} />
      </Switch>
    </AuthContext.Provider>
  );
}

export default App;
