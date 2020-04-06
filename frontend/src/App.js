import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <Router>
      <AppBar position="fixed">
      <Toolbar>
      <Typography variant="h6">ContribKanban</Typography>
      </Toolbar>
      </AppBar>
      <div className={``} style={{
        height: '64px'
      }}/>
      <Switch>
        <Route path="/">
          <p>Home</p>
        </Route>
        <Route path="/about">
          <p>About</p>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
