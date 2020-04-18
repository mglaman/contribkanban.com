import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./routing/AuthRoute";
import GuestRoute from "./routing/GuestRoute";

import AppBar from "./components/AppBar";
import Home from "./pages/Home";
import Board from "./pages/Board";
import NodeBoard from "./pages/NodeBoard";
import Create from "./pages/Create";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Me from "./pages/Me";
import NodeBoardEditForm from "./pages/NodeBoardEditForm";

function App() {
  return (
    <AuthProvider>
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
        <Route path={`/logout`} component={Logout} />
        <Route exact path={`/boards/:boardType`} component={Home} />
        <Route exact path={`/boards`} component={Home} />
        <Route exact path="/" component={Home} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
