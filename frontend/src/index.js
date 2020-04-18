import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import { createMuiTheme } from "@material-ui/core/styles";
const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: "rgba(145, 202, 237, 1)",
      main: "rgba(6, 120, 190, 1)",
      dark: "rgba(3, 88, 140, 1)",
      contrastText: "#fff",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
