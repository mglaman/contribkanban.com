import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./routing/AuthRoute";
import GuestRoute from "./routing/GuestRoute";

import { AppBarProvider } from "./context/appBar";
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
      <AppBarProvider>
        <Routes>
          <Route exact path={`/board/:machineName`} element={<Board />} />
          <Route
            exact
            path={`/node-board/:uuid`}
            element={<NodeBoard/>}
          />
          <Route path={`/create`} element={<Create />} />
          <Route
           path={`/login`}
           element={<GuestRoute><Login/></GuestRoute>}
           />
          <Route
          path={`/register`}
          element={<GuestRoute><Register/></GuestRoute>}
          />
          <Route
          path={`/forgot-password`}
          element={<GuestRoute><ForgotPassword/></GuestRoute>}
          />
          <Route path="/about" element={<p>About</p>}/>
          <Route path={`/me`} element={<AuthRoute><Me/></AuthRoute>} />
          <Route
            exact
            path={`/node-board/:uuid/edit`}
            element={<AuthRoute><NodeBoardEditForm/></AuthRoute>}
          />
          <Route path={`/logout`} element={<Logout />} />
          <Route exact path={`/boards/:boardType`} element={<Home />} />
          <Route exact path={`/boards`} element={<Home />} />
          <Route exact path="/" element={<Home />} />
        </Routes>
      </AppBarProvider>
    </AuthProvider>
  );
}

export default App;
