import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { AuthContext, OAuth } from "./context/auth";
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

function App() {
  const storedTokens = localStorage.getItem("oauth");
  const [authTokens, setAuthTokens] = useState(JSON.parse(storedTokens));
  const [currentUser, setCurrentUser] = useState(null);
  const setTokens = (data) => {
    localStorage.setItem("oauth", JSON.stringify(data));
    setAuthTokens(data);
  };
  const expireTokens = () => {
    localStorage.removeItem("oauth");
    setAuthTokens(null);
  };

  const auth = new OAuth(authTokens, setTokens, expireTokens);

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        currentUser,
        setCurrentUser,
        auth,
      }}
    >
      <Router>
        <AppBar />
        <Switch>
          <Route exact path={`/board/:machineName`} component={Board} />
          <Route exact path={`/node-board/:uuid`} component={NodeBoard} />
          <Route path={`/create`} component={Create} />
          <Route exact path={`/projects`}>
            <p>Coming soon</p>
          </Route>
          <Route exact path={`/sprints`}>
            <p>Coming soon</p>
          </Route>
          <Route exact path={`/core`}>
            <p>Coming soon</p>
          </Route>
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
              expireTokens();
              return <Redirect to="/login" />;
            }}
          />
          <Route exact path="/" component={Home} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
