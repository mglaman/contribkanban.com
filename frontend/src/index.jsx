import { createRoot } from 'react-dom/client';
import React from "react";
import { ThemeProvider, createMuiTheme } from "@mui/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
const muiTheme = createMuiTheme({
  palette: {
    primary: {
      light: "rgba(145, 202, 237, 1)",
      main: "rgba(6, 120, 190, 1)",
      dark: "rgba(1, 69, 118, 1)",
      contrastText: "#fff",
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
