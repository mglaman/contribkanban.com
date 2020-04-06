import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import AppBar from './components/AppBar'
import Home from './pages/Home'
import Board from './pages/Board'
import Create from './pages/Create'

const styles = theme => ({
})

function App({ classes }) {
  return (
    <Router>
      <AppBar />
      <Switch>
        <Route path={`/board/:machineName`} component={Board} />
        <Route path={`/create`} component={Create} />
        <Route path="/about">
          <p>About</p>
        </Route>
        <Route path="/" component={Home}/>
      </Switch>
    </Router>
  );
}

export default withStyles(styles)(App);
